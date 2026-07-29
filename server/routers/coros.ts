import { execSync } from "child_process";
import { publicProcedure, router } from "../_core/trpc";

// Chama uma ferramenta do MCP COROS via manus-mcp-cli
// O CLI está disponível no sandbox e funciona via execSync
function callCorosMcp(toolName: string, args: Record<string, unknown> = {}): string {
  const argsJson = JSON.stringify(args);
  const cmd = `manus-mcp-cli tool call ${toolName} -s coros -i '${argsJson}'`;
  const output = execSync(cmd, { timeout: 15000, encoding: "utf-8" });
  // O CLI retorna o resultado como texto após "Tool execution result:"
  const match = output.match(/Tool execution result:\s*\n?([\s\S]*)/);
  if (match?.[1]) {
    const raw = match[1].trim();
    // Remove aspas externas se for string JSON
    if (raw.startsWith('"') && raw.endsWith('"')) {
      try { return JSON.parse(raw); } catch { return raw; }
    }
    return raw;
  }
  return output;
}

// Parsers para extrair dados dos textos retornados pelo MCP
function parseSleep(text: string) {
  const blocks = text.split(/\n(?=\d{4}-\d{2}-\d{2})/).reverse();
  for (const block of blocks) {
    const scoreMatch = block.match(/Sleep Score:\s*(\d+)/);
    const mainMatch = block.match(/Main Sleep:\s*([\dh\s]+min)/);
    if (scoreMatch && mainMatch) {
      return { score: parseInt(scoreMatch[1]), duration: mainMatch[1].trim() };
    }
  }
  return null;
}

function parseHrv(text: string) {
  const match = text.match(/HRV Avg:\s*(\d+)\s*ms\s*[—–-]\s*([^\n]+)/);
  if (match) return { avg: parseInt(match[1]), status: match[2].trim() };
  return null;
}

function parseRecovery(text: string) {
  const pctMatch = text.match(/Recovery:\s*(\d+)%/);
  const levelMatch = text.match(/Level:\s*([^\n]+)/);
  if (pctMatch) return { pct: parseInt(pctMatch[1]), level: levelMatch?.[1]?.trim() ?? "" };
  return null;
}

function parseRestingHr(text: string) {
  const lines = text.split("\n");
  for (const line of lines) {
    const match = line.match(/\d{4}-\d{2}-\d{2}:\s*(\d+)\s*bpm/);
    if (match) return parseInt(match[1]);
  }
  return null;
}

function parseTrainingLoad(text: string) {
  const commentMatch = text.match(/Comment:\s*([^\n]+)/);
  const shortMatch = text.match(/Short-Term Load:\s*(\d+)/);
  const ratioMatch = text.match(/Load Ratio:\s*([\d.]+)/);
  if (shortMatch) {
    return {
      comment: commentMatch?.[1]?.trim() ?? "",
      shortTerm: parseInt(shortMatch[1]),
      ratio: ratioMatch ? parseFloat(ratioMatch[1]) : null,
    };
  }
  return null;
}

function parseStress(text: string) {
  const match = text.match(/Average Stress:\s*(\d+)\s*\(([^)]+)\)/);
  if (match) return { value: parseInt(match[1]), label: match[2].trim() };
  return null;
}

export const corosRouter = router({
  getDashboardData: publicProcedure.query(async () => {
    try {
      // Busca todos os dados em paralelo via Promise.allSettled
      const [sleepRes, hrvRes, recoveryRes, restingHrRes, loadRes, stressRes] =
        await Promise.allSettled([
          Promise.resolve().then(() => callCorosMcp("querySleepData", { recentDays: 3 })),
          Promise.resolve().then(() => callCorosMcp("querySleepHrv", { recentDays: 1 })),
          Promise.resolve().then(() => callCorosMcp("queryRecoveryStatus", {})),
          Promise.resolve().then(() => callCorosMcp("queryRestingHeartRate", { recentDays: 3 })),
          Promise.resolve().then(() => callCorosMcp("queryTrainingLoadAssessment", {})),
          Promise.resolve().then(() => callCorosMcp("queryStressLevel", { recentDays: 1 })),
        ]);

      const sleep = sleepRes.status === "fulfilled" ? parseSleep(sleepRes.value) : null;
      const hrv = hrvRes.status === "fulfilled" ? parseHrv(hrvRes.value) : null;
      const recovery = recoveryRes.status === "fulfilled" ? parseRecovery(recoveryRes.value) : null;
      const restingHr = restingHrRes.status === "fulfilled" ? parseRestingHr(restingHrRes.value) : null;
      const load = loadRes.status === "fulfilled" ? parseTrainingLoad(loadRes.value) : null;
      const stress = stressRes.status === "fulfilled" ? parseStress(stressRes.value) : null;

      return { ok: true, sleep, hrv, recovery, restingHr, load, stress, fetchedAt: new Date().toISOString() };
    } catch (err) {
      console.error("[COROS] getDashboardData error:", err);
      return { ok: false, sleep: null, hrv: null, recovery: null, restingHr: null, load: null, stress: null, fetchedAt: new Date().toISOString() };
    }
  }),
});
