import { execSync } from "child_process";
import { publicProcedure, router } from "../_core/trpc";

// ─── MCP caller ───────────────────────────────────────────────────────────────
function callCorosMcp(toolName: string, args: Record<string, unknown> = {}): string {
  const argsJson = JSON.stringify(args);
  const cmd = `manus-mcp-cli tool call ${toolName} -s coros -i '${argsJson}'`;
  const output = execSync(cmd, { timeout: 20000, encoding: "utf-8" });
  const match = output.match(/Tool execution result:\s*\n?([\s\S]*)/);
  if (match?.[1]) {
    const raw = match[1].trim();
    if (raw.startsWith('"') && raw.endsWith('"')) {
      try { return JSON.parse(raw); } catch { return raw; }
    }
    return raw;
  }
  return output;
}

// ─── Types ────────────────────────────────────────────────────────────────────
interface LastActivity {
  labelId: string;
  sportType: number;
  date: string;
  sportName: string;
  duration: string;
  distance: string | null;
  avgPace: string | null;
}

interface ActivityDetail {
  avgHr: number | null;
  maxHr: number | null;
  calories: number | null;
  avgCadence: number | null;
  elevation: number | null;
}

interface Validation {
  status: "ok" | "warning" | "info";
  badge: string;
  message: string;
}

// ─── Dashboard parsers ────────────────────────────────────────────────────────
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

// ─── Last activity parsers ────────────────────────────────────────────────────
function parseLastActivity(text: string): LastActivity | null {
  // Cada linha de atividade tem formato:
  // YYYY-MM-DD | Sport Name | Duration | Distance | Pace | labelId | sportType
  const lines = text.split("\n").filter(l => /\d{4}-\d{2}-\d{2}/.test(l));
  if (lines.length === 0) return null;

  // Pega a mais recente (última linha com data)
  const last = lines[lines.length - 1];

  // Extrai labelId e sportType do texto (geralmente no final)
  const labelMatch = text.match(/labelId[:\s]+([a-zA-Z0-9_-]+)/i)
    || last.match(/([a-zA-Z0-9]{16,})/);
  const sportTypeMatch = text.match(/sportType[:\s]+(\d+)/i);

  // Extrai data
  const dateMatch = last.match(/(\d{4}-\d{2}-\d{2})/);
  // Extrai duração (ex: 35:22 ou 1:05:10)
  const durationMatch = last.match(/(\d{1,2}:\d{2}(?::\d{2})?)/);
  // Extrai distância (ex: 4.2 km ou 4200 m)
  const distanceMatch = last.match(/([\d.]+)\s*km/i) || last.match(/([\d.]+)\s*m\b/i);
  // Extrai pace (ex: 7:08/km)
  const paceMatch = last.match(/(\d+:\d{2})\s*\/\s*km/i);
  // Nome do esporte — tudo entre a data e a duração
  const sportNameMatch = last.match(/\d{4}-\d{2}-\d{2}[^\w]*([A-Za-z ]+?)(?:\s*\||\s*\d+:)/);

  return {
    labelId: labelMatch?.[1] ?? "",
    sportType: sportTypeMatch ? parseInt(sportTypeMatch[1]) : 100,
    date: dateMatch?.[1] ?? new Date().toISOString().slice(0, 10),
    sportName: sportNameMatch?.[1]?.trim() ?? "Treino",
    duration: durationMatch?.[1] ?? "—",
    distance: distanceMatch ? `${distanceMatch[1]} km` : null,
    avgPace: paceMatch ? `${paceMatch[1]}/km` : null,
  };
}

function parseActivityDetail(text: string): ActivityDetail {
  const avgHrMatch = text.match(/Avg(?:erage)?\s*(?:Heart Rate|HR)[:\s]+(\d+)/i);
  const maxHrMatch = text.match(/Max(?:imum)?\s*(?:Heart Rate|HR)[:\s]+(\d+)/i);
  const calMatch = text.match(/Calori(?:es|a)[:\s]+(\d+)/i);
  const cadenceMatch = text.match(/Avg(?:erage)?\s*Cadence[:\s]+(\d+)/i);
  const elevMatch = text.match(/Elevation[:\s]+\+?(\d+)/i);

  return {
    avgHr: avgHrMatch ? parseInt(avgHrMatch[1]) : null,
    maxHr: maxHrMatch ? parseInt(maxHrMatch[1]) : null,
    calories: calMatch ? parseInt(calMatch[1]) : null,
    avgCadence: cadenceMatch ? parseInt(cadenceMatch[1]) : null,
    elevation: elevMatch ? parseInt(elevMatch[1]) : null,
  };
}

function validateAgainstPlan(activity: LastActivity, detail: ActivityDetail | null): Validation {
  // Análise simples baseada em FC média (proxy de RPE)
  const avgHr = detail?.avgHr;

  if (!avgHr) {
    return {
      status: "info",
      badge: "✓ Treino Registrado",
      message: "Atividade sincronizada com sucesso. Continue monitorando o RPE subjetivo.",
    };
  }

  // Zonas de FC estimadas para André (FC máx estimada ~201 - 0.7 × idade; assumindo ~40 anos → ~173 bpm)
  // Zona 2: 60–70% = 104–121 bpm | Zona 3: 70–80% = 121–138 | Zona 4: 80–90% = 138–156
  if (avgHr <= 138) {
    return {
      status: "ok",
      badge: "✅ Dentro do Plano",
      message: `FC média ${avgHr} bpm — excelente controle de intensidade. Você ficou na zona aeróbica alvo (Z2–Z3). Continue assim!`,
    };
  } else if (avgHr <= 155) {
    return {
      status: "warning",
      badge: "⚠️ Acima do RPE Alvo",
      message: `FC média ${avgHr} bpm — ligeiramente acima da zona alvo para esta fase. Tente reduzir o pace no próximo treino.`,
    };
  } else {
    return {
      status: "warning",
      badge: "⚠️ Intensidade Alta",
      message: `FC média ${avgHr} bpm — acima do recomendado para a Semana 0–2. Priorize recuperação e reduza o esforço no próximo treino.`,
    };
  }
}

// ─── Router ───────────────────────────────────────────────────────────────────
export const corosRouter = router({
  getLastActivity: publicProcedure.query(async () => {
    try {
      const today = new Date();
      const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const fmt = (d: Date) => d.toISOString().slice(0, 10).replace(/-/g, "");

      const recordsRaw = callCorosMcp("querySportRecords", {
        startDate: fmt(sevenDaysAgo),
        endDate: fmt(today),
      });

      const lastActivity = parseLastActivity(recordsRaw);
      if (!lastActivity) return { ok: true, activity: null, raw: recordsRaw };

      let detail: ActivityDetail | null = null;
      if (lastActivity.labelId) {
        try {
          const detailRaw = callCorosMcp("getActivityDetail", {
            labelId: lastActivity.labelId,
            sportType: lastActivity.sportType,
          });
          detail = parseActivityDetail(detailRaw);
        } catch {
          // detalhe opcional
        }
      }

      const validation = validateAgainstPlan(lastActivity, detail);
      return { ok: true, activity: { ...lastActivity, detail, validation }, raw: null };
    } catch (err) {
      console.error("[COROS] getLastActivity error:", err);
      return { ok: true, activity: null, raw: null };
    }
  }),

  getDashboardData: publicProcedure.query(async () => {
    try {
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
