import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { BarChart2, TrendingDown, TrendingUp, CheckCircle2, Droplets, Beef, Dumbbell, Calendar } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import BottomNav from "@/components/BottomNav";

function getWeekBounds(weeksAgo: number) {
  const end = new Date();
  end.setDate(end.getDate() - weeksAgo * 7);
  const start = new Date(end);
  start.setDate(start.getDate() - 6);
  return {
    weekStart: start.toISOString().split("T")[0],
    weekEnd: end.toISOString().split("T")[0],
  };
}

function MetricCard({ icon, label, value, sub, color }: {
  icon: React.ReactNode; label: string; value: string | number; sub?: string; color: string;
}) {
  return (
    <div className="bg-slate-800/60 rounded-xl p-4 flex flex-col gap-1">
      <div className={cn("flex items-center gap-2 text-xs font-semibold uppercase tracking-widest", color)}>
        {icon} {label}
      </div>
      <p className="text-2xl font-black text-white">{value}</p>
      {sub && <p className="text-xs text-slate-500">{sub}</p>}
    </div>
  );
}

export default function WeeklyReportPage() {
  const [weekOffset, setWeekOffset] = useState(0);
  const { weekStart, weekEnd } = useMemo(() => getWeekBounds(weekOffset), [weekOffset]);

  const { data: report, isLoading } = trpc.plan.getWeeklyReport.useQuery(
    { weekStart, weekEnd },
    { staleTime: 2 * 60 * 1000 }
  );

  const { data: allReports } = trpc.plan.getAllWeeklyReports.useQuery(
    { weeks: 8 },
    { staleTime: 5 * 60 * 1000 }
  );

  const formatDate = (d: string) => {
    const [y, m, day] = d.split("-");
    return `${day}/${m}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* Header */}
      <div className="bg-slate-900 border-b border-white/10 px-4 pt-6 pb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Relatório</p>
        <h1 className="text-xl font-black text-white mt-0.5">Evolução Semanal</h1>
      </div>

      <div className="px-4 py-5 space-y-4">
        {/* Seletor de semana */}
        <div className="flex items-center justify-between bg-slate-900 rounded-2xl border border-white/10 p-3">
          <button
            onClick={() => setWeekOffset(w => w + 1)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition-colors"
          >← Anterior</button>
          <div className="text-center">
            <p className="text-sm font-bold text-white">
              {weekOffset === 0 ? "Esta semana" : `${weekOffset} semana${weekOffset > 1 ? "s" : ""} atrás`}
            </p>
            <p className="text-xs text-slate-500">{formatDate(weekStart)} – {formatDate(weekEnd)}</p>
          </div>
          <button
            onClick={() => setWeekOffset(w => Math.max(0, w - 1))}
            disabled={weekOffset === 0}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm transition-colors disabled:opacity-30"
          >Próxima →</button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-slate-800/60 rounded-xl p-4 h-24 animate-pulse" />
            ))}
          </div>
        ) : !report ? (
          <div className="bg-slate-900 rounded-2xl border border-white/10 p-8 text-center">
            <Calendar className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-semibold">Sem dados para esta semana</p>
            <p className="text-slate-600 text-sm mt-1">Comece a registrar treinos, peso e checklist para ver o relatório.</p>
          </div>
        ) : (
          <>
            {/* Métricas principais */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 gap-3">
              <MetricCard
                icon={<Dumbbell className="w-3.5 h-3.5" />}
                label="Treinos"
                value={`${report.workoutsCompleted}/4`}
                sub={report.workoutsCompleted >= 4 ? "✅ Meta atingida!" : `Faltou ${4 - report.workoutsCompleted}`}
                color="text-blue-400"
              />
              <MetricCard
                icon={<CheckCircle2 className="w-3.5 h-3.5" />}
                label="Checklist"
                value={`${report.checklistAdherence}%`}
                sub={`${report.daysLogged} dias registrados`}
                color={report.checklistAdherence >= 80 ? "text-emerald-400" : "text-amber-400"}
              />
              <MetricCard
                icon={<Beef className="w-3.5 h-3.5" />}
                label="Proteína"
                value={`${report.avgProtein}g`}
                sub={`Meta: 190g/dia`}
                color={report.avgProtein >= 190 ? "text-emerald-400" : "text-amber-400"}
              />
              <MetricCard
                icon={<Droplets className="w-3.5 h-3.5" />}
                label="Água"
                value={`${report.avgWater} copos`}
                sub="Média diária"
                color={report.avgWater >= 10 ? "text-emerald-400" : "text-blue-400"}
              />
            </motion.div>

            {/* Peso */}
            {(report.weightStart || report.weightEnd) && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-slate-900 rounded-2xl border border-white/10 p-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Variação de Peso</p>
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-xs text-slate-500 mb-1">Início</p>
                    <p className="text-2xl font-black text-white">{report.weightStart ?? "—"}<span className="text-sm text-slate-400"> kg</span></p>
                  </div>
                  <div className="text-center">
                    {report.weightDelta !== null && (
                      <div className={cn("flex items-center gap-1 text-lg font-black",
                        report.weightDelta < 0 ? "text-emerald-400" : "text-red-400")}>
                        {report.weightDelta < 0 ? <TrendingDown className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                        {report.weightDelta > 0 ? "+" : ""}{report.weightDelta} kg
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-slate-500 mb-1">Fim</p>
                    <p className="text-2xl font-black text-white">{report.weightEnd ?? "—"}<span className="text-sm text-slate-400"> kg</span></p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Veredito da semana */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className={cn("rounded-2xl border p-4", 
                report.workoutsCompleted >= 4 && report.checklistAdherence >= 80
                  ? "bg-emerald-950/40 border-emerald-800/50"
                  : "bg-amber-950/40 border-amber-800/50")}>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Veredito da Semana</p>
              {report.workoutsCompleted >= 4 && report.checklistAdherence >= 80 ? (
                <p className="text-emerald-400 font-bold">✅ Semana excelente! Treinos completos e boa aderência ao checklist.</p>
              ) : report.workoutsCompleted >= 3 || report.checklistAdherence >= 60 ? (
                <p className="text-amber-400 font-bold">⚠️ Semana razoável. Há espaço para melhorar a consistência.</p>
              ) : (
                <p className="text-red-400 font-bold">🔴 Semana abaixo do esperado. Foque na consistência na próxima semana.</p>
              )}
            </motion.div>
          </>
        )}

        {/* Histórico de 8 semanas */}
        {allReports && allReports.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-slate-900 rounded-2xl border border-white/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Histórico das 8 Semanas</p>
            <div className="space-y-2">
              {allReports.map((r, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 w-14">{formatDate(r.weekStart)}</span>
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all",
                        r.checklistAdherence >= 80 ? "bg-emerald-500" :
                        r.checklistAdherence >= 50 ? "bg-amber-500" : "bg-red-500")}
                      style={{ width: `${r.checklistAdherence}%` }}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-300 w-10 text-right">{r.checklistAdherence}%</span>
                  <span className="text-xs text-slate-500 w-8">{r.workoutsCompleted}/4</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      <BottomNav active="report" />
    </div>
  );
}

