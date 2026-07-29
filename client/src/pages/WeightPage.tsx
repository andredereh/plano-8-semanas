// ============================================================
// WEIGHT PAGE — Histórico de peso e gráfico
// ============================================================
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, TrendingDown, Target } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { getWeightEntries, saveWeightEntry, WeightEntry } from "@/lib/storage";
import { useWeightSync } from "@/hooks/useDbSync";
import { cn } from "@/lib/utils";
import BottomNav from "@/components/BottomNav";
import WeightModal from "@/components/WeightModal";

export default function WeightPage() {
  const [, navigate] = useLocation();
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    setEntries(getWeightEntries());
  }, []);

  function handleSave() {
    setEntries(getWeightEntries());
    setModalOpen(false);
  }
  const { weightHistory } = useWeightSync();

  // Mesclar dados do banco com localStorage (banco tem prioridade)
  const mergedEntries: WeightEntry[] = weightHistory.length > 0
    ? weightHistory.map(w => ({
        date: w.date instanceof Date ? w.date.toISOString().split("T")[0] : String(w.date),
        weight: w.weight,
      })).reverse()
    : entries;

  const latest = entries[entries.length - 1];
  const first = entries[0];
  const delta = latest && first ? (latest.weight - first.weight).toFixed(1) : null;
  const toGoal = latest ? (latest.weight - 112).toFixed(1) : null;

  const displayEntries = mergedEntries.length > 0 ? mergedEntries : entries;
  const latestEntry = displayEntries[displayEntries.length - 1];
  const firstEntry = displayEntries[0];
  const chartData = displayEntries.map((e) => ({
    date: e.date.slice(5), // MM-DD
    peso: e.weight,
  }));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* Header */}
      <div className="bg-slate-900 border-b border-white/10 px-4 pt-6 pb-4 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="p-2 rounded-xl hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Acompanhamento</p>
          <h1 className="text-xl font-black text-white">Evolução do Peso</h1>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-3 py-2 rounded-xl transition-colors"
        >
          <Plus className="w-4 h-4" /> Registrar
        </button>
      </div>

      <div className="px-4 py-5 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-900 rounded-2xl border border-white/10 p-4 text-center">
            <p className="text-2xl font-black text-white">{latest?.weight ?? "—"}</p>
            <p className="text-xs text-slate-500 mt-0.5">kg atual</p>
          </div>
          <div className="bg-slate-900 rounded-2xl border border-white/10 p-4 text-center">
            {delta !== null ? (
              <>
                <p className={cn("text-2xl font-black", parseFloat(delta) < 0 ? "text-emerald-400" : "text-red-400")}>
                  {parseFloat(delta) < 0 ? delta : `+${delta}`}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">kg total</p>
              </>
            ) : (
              <>
                <p className="text-2xl font-black text-slate-600">—</p>
                <p className="text-xs text-slate-500 mt-0.5">variação</p>
              </>
            )}
          </div>
          <div className="bg-slate-900 rounded-2xl border border-white/10 p-4 text-center">
            {toGoal !== null ? (
              <>
                <p className={cn("text-2xl font-black", parseFloat(toGoal) <= 0 ? "text-emerald-400" : "text-amber-400")}>
                  {parseFloat(toGoal) <= 0 ? "✅" : `${toGoal}`}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{parseFloat(toGoal) <= 0 ? "Meta!" : "kg p/ meta"}</p>
              </>
            ) : (
              <>
                <p className="text-2xl font-black text-slate-600">—</p>
                <p className="text-xs text-slate-500 mt-0.5">p/ meta</p>
              </>
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="bg-slate-900 rounded-2xl border border-white/10 p-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Gráfico de Evolução</p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <Target className="w-3.5 h-3.5" /> Meta: 111–113 kg
            </div>
          </div>
          {chartData.length > 1 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10 }} />
                <YAxis domain={["auto", 120]} tick={{ fill: "#64748b", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
                  labelStyle={{ color: "#94a3b8" }}
                  itemStyle={{ color: "#3b82f6" }}
                />
                <ReferenceLine y={112} stroke="#10b981" strokeDasharray="4 4" label={{ value: "Meta", fill: "#10b981", fontSize: 10 }} />
                <Line
                  type="monotone"
                  dataKey="peso"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ fill: "#3b82f6", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[200px] flex flex-col items-center justify-center text-slate-600">
              <TrendingDown className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm">Registre pelo menos 2 pesagens</p>
              <p className="text-xs mt-1">para ver o gráfico de evolução</p>
            </div>
          )}
        </div>

        {/* History */}
        <div className="bg-slate-900 rounded-2xl border border-white/10 p-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Histórico</p>
          {entries.length === 0 ? (
            <p className="text-slate-600 text-sm text-center py-4">Nenhum registro ainda</p>
          ) : (
            <div className="space-y-2">
              {[...entries].reverse().map((e, i) => {
                const prev = entries[entries.length - 1 - i - 1];
                const diff = prev ? (e.weight - prev.weight).toFixed(1) : null;
                return (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <div>
                      <p className="text-sm font-semibold text-white">{e.weight} kg</p>
                      <p className="text-xs text-slate-500">{e.date}</p>
                    </div>
                    {diff !== null && (
                      <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full",
                        parseFloat(diff) < 0 ? "bg-emerald-900/40 text-emerald-400" : "bg-red-900/40 text-red-400"
                      )}>
                        {parseFloat(diff) < 0 ? diff : `+${diff}`} kg
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <WeightModal open={modalOpen} onClose={handleSave} />
      <BottomNav active="peso" />
    </div>
  );
}
