// ============================================================
// PLAN PAGE — Plano completo das 8 semanas
// ============================================================
import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import { PLAN, WORKOUT_COLORS, WORKOUT_ICONS } from "@/lib/planData";
import { cn } from "@/lib/utils";
import BottomNav from "@/components/BottomNav";

const DAY_NAMES = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

export default function PlanPage() {
  const [, navigate] = useLocation();
  const [expandedWeek, setExpandedWeek] = useState<number | null>(1);
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* Header */}
      <div className="bg-slate-900 border-b border-white/10 px-4 pt-6 pb-4 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="p-2 rounded-xl hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Plano Completo</p>
          <h1 className="text-xl font-black text-white">8 Semanas de Treino</h1>
        </div>
      </div>

      <div className="px-4 py-5 space-y-3">
        {PLAN.map((week) => (
          <motion.div
            key={week.week}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: week.week * 0.05 }}
            className="bg-slate-900 rounded-2xl border border-white/10 overflow-hidden"
          >
            {/* Week header */}
            <button
              onClick={() => setExpandedWeek(expandedWeek === week.week ? null : week.week)}
              className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">
                  {week.week}
                </div>
                <div className="text-left">
                  <p className="font-bold text-white">{week.title}</p>
                  <p className="text-xs text-slate-400">
                    {week.days.filter(d => d.workout.type !== "descanso").length} treinos
                  </p>
                </div>
              </div>
              {expandedWeek === week.week ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>

            {/* Week days */}
            {expandedWeek === week.week && (
              <div className="border-t border-white/10 divide-y divide-white/5">
                {week.days.map((day, i) => {
                  const c = WORKOUT_COLORS[day.workout.type];
                  const icon = WORKOUT_ICONS[day.workout.type];
                  const key = `${week.week}-${i}`;
                  const isExpanded = expandedDay === key;

                  return (
                    <div key={i}>
                      <button
                        onClick={() => day.workout.type !== "descanso" && setExpandedDay(isExpanded ? null : key)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 transition-colors text-left",
                          day.workout.type !== "descanso" ? "hover:bg-slate-800/40" : "cursor-default"
                        )}
                      >
                        <span className="text-lg w-7 text-center">{icon}</span>
                        <div className="flex-1">
                          <p className={cn("font-semibold text-sm", day.workout.type === "descanso" ? "text-slate-500" : "text-white")}>
                            {DAY_NAMES[day.dayOfWeek]} — {day.workout.label}
                          </p>
                          {day.workout.type !== "descanso" && (
                            <p className="text-xs text-slate-500">{day.workout.duration} · RPE {day.workout.rpe}</p>
                          )}
                        </div>
                        {day.workout.type !== "descanso" && (
                          <span className={cn("text-xs px-2 py-0.5 rounded-full border", c.bg, c.text, c.border)}>
                            {day.workout.kcal} kcal
                          </span>
                        )}
                      </button>

                      {/* Expanded exercises */}
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className={cn("px-4 pb-4 pt-1 mx-4 mb-3 rounded-xl border", c.bg, c.border)}
                        >
                          {day.workout.notes && (
                            <p className="text-xs text-slate-400 italic mb-3 pb-2 border-b border-white/10">{day.workout.notes}</p>
                          )}
                          <div className="space-y-2">
                            {day.workout.exercises.map((ex, j) => (
                              <div key={j} className="flex justify-between text-sm">
                                <span className="text-slate-300">{ex.name}</span>
                                <span className={cn("font-semibold", c.text)}>{ex.detail}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <BottomNav active="plano" />
    </div>
  );
}
