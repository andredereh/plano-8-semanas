// ============================================================
// HOME — Dashboard principal diário
// Athletic Dark Pro: dados em primeiro lugar, mobile-first
// ============================================================
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, Circle, Dumbbell, Timer, Flame, ChevronRight,
  TrendingDown, Activity, Moon, Zap, Heart, BarChart2, Plus, Check
} from "lucide-react";
import { PLAN, getTodayWorkout, getWeekDays, WORKOUT_COLORS, WORKOUT_ICONS, WorkoutType } from "@/lib/planData";
import {
  getTodayChecklist, saveTodayChecklist, getLatestWeight,
  getStartDate, setStartDate, markWorkoutComplete, isWorkoutCompleted, toDateStr
} from "@/lib/storage";
import { cn } from "@/lib/utils";
import BottomNav from "@/components/BottomNav";
import WeightModal from "@/components/WeightModal";

const CHECKLIST_ITEMS = [
  { id: "treino",    label: "Treinei hoje" },
  { id: "proteina",  label: "Meta de proteína (190g+)" },
  { id: "agua",      label: "Bebi 2,5 L de água" },
  { id: "belisco",   label: "Sem beliscos fora de hora" },
  { id: "sono",      label: "Dormi > 7h (ontem)" },
  { id: "peso",      label: "Peso registrado" },
];

const RPE_COLORS = [
  "bg-green-500","bg-green-400","bg-lime-400","bg-lime-300",
  "bg-yellow-400","bg-orange-400","bg-orange-500","bg-red-500","bg-red-600","bg-red-700"
];

function rpeToIndex(rpe: string): number {
  const match = rpe.match(/(\d+)/);
  return match ? parseInt(match[1]) - 1 : 4;
}

export default function Home() {
  const [, navigate] = useLocation();
  const [startDate] = useState<Date>(() => getStartDate());
  const [checklist, setChecklist] = useState<Record<string, boolean>>(() => getTodayChecklist());
  const [weightModalOpen, setWeightModalOpen] = useState(false);
  const [workoutDone, setWorkoutDone] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const { workout, week, dayInCycle } = getTodayWorkout(startDate);
  const weekDays = getWeekDays(startDate, week);
  const latestWeight = getLatestWeight();
  const todayStr = toDateStr(new Date());
  const totalDays = 56;
  const progress = Math.round((dayInCycle / totalDays) * 100);
  const colors = WORKOUT_COLORS[workout.type];
  const icon = WORKOUT_ICONS[workout.type];

  useEffect(() => {
    setWorkoutDone(isWorkoutCompleted(todayStr));
  }, [todayStr]);

  function toggleChecklist(id: string) {
    const updated = { ...checklist, [id]: !checklist[id] };
    setChecklist(updated);
    saveTodayChecklist(updated);
  }

  function handleMarkWorkoutDone() {
    markWorkoutComplete(todayStr);
    setWorkoutDone(true);
    toggleChecklist("treino");
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2000);
  }

  const doneCount = Object.values(checklist).filter(Boolean).length;
  const weekTraining = weekDays.filter(d => d.workout.type !== "descanso" && d.isPast).length;
  const weekTotal = weekDays.filter(d => d.workout.type !== "descanso").length;

  const dayNames = ["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* ── Header ── */}
      <div className="bg-slate-900 border-b border-white/10 px-4 pt-6 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Plano 8 Semanas</p>
            <h1 className="text-xl font-black text-white mt-0.5">
              Semana {week} <span className="text-slate-400 font-normal text-base">· Dia {dayInCycle}</span>
            </h1>
          </div>
          <div className={cn("px-3 py-1.5 rounded-full text-xs font-bold border", colors.bg, colors.text, colors.border)}>
            {icon} {workout.label}
          </div>
        </div>
        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
          <span className="text-xs font-bold text-blue-400 w-10 text-right">{progress}%</span>
        </div>
      </div>

      <div className="px-4 py-5 space-y-4">
        {/* ── Treino do dia ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn("rounded-2xl border p-5", colors.bg, colors.border)}
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Treino de Hoje</p>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-black text-white">{workout.label}</h2>
              <div className="flex gap-4 mt-2">
                <span className="flex items-center gap-1.5 text-sm text-slate-300">
                  <Timer className="w-4 h-4" /> {workout.duration}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-slate-300">
                  <Activity className="w-4 h-4" /> RPE {workout.rpe}
                </span>
                <span className="flex items-center gap-1.5 text-sm text-slate-300">
                  <Flame className="w-4 h-4" /> {workout.kcal} kcal
                </span>
              </div>
            </div>
            <span className="text-4xl">{icon}</span>
          </div>

          {/* RPE Bar */}
          {workout.type !== "descanso" && (
            <div className="mb-4">
              <p className="text-xs text-slate-500 mb-1.5">Nível de esforço alvo</p>
              <div className="flex gap-1">
                {RPE_COLORS.map((color, i) => {
                  const targetIdx = rpeToIndex(workout.rpe);
                  return (
                    <div
                      key={i}
                      className={cn("h-2 flex-1 rounded-sm", color, i > targetIdx && "opacity-20")}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Exercises preview */}
          {workout.exercises.length > 0 && (
            <div className="space-y-1.5 mb-4">
              {workout.exercises.slice(0, 5).map((ex, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-slate-300">{ex.name}</span>
                  <span className={cn("font-semibold", colors.text)}>{ex.detail}</span>
                </div>
              ))}
              {workout.exercises.length > 5 && (
                <button
                  onClick={() => navigate("/plano")}
                  className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1 mt-1"
                >
                  +{workout.exercises.length - 5} exercícios <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {workout.notes && (
            <p className="text-xs text-slate-400 italic border-t border-white/10 pt-3">{workout.notes}</p>
          )}

          {/* Mark done button */}
          {workout.type !== "descanso" && (
            <motion.button
              onClick={handleMarkWorkoutDone}
              disabled={workoutDone}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "w-full mt-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2",
                workoutDone
                  ? "bg-emerald-900/50 text-emerald-400 border border-emerald-700 cursor-default"
                  : "bg-blue-600 hover:bg-blue-500 text-white active:scale-95"
              )}
            >
              {workoutDone ? <><Check className="w-4 h-4" /> Treino Concluído!</> : <><Dumbbell className="w-4 h-4" /> Marcar como Concluído</>}
            </motion.button>
          )}
        </motion.div>

        {/* ── Calendário semanal ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900 rounded-2xl border border-white/10 p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Semana {week}</p>
            <span className="text-xs text-slate-500">{weekTraining}/{weekTotal} treinos</span>
          </div>
          <div className="grid grid-cols-7 gap-1.5">
            {weekDays.map(({ date, workout: w, isToday, isPast }, i) => {
              const c = WORKOUT_COLORS[w.type];
              const completed = isWorkoutCompleted(toDateStr(date));
              return (
                <div
                  key={i}
                  className={cn(
                    "flex flex-col items-center py-2 rounded-xl border text-center transition-all",
                    isToday ? "border-blue-500 bg-blue-900/30" : "border-white/10",
                    completed && w.type !== "descanso" ? "bg-emerald-900/30 border-emerald-700" : "",
                    w.type === "descanso" && !isToday ? "opacity-40" : ""
                  )}
                >
                  <span className="text-[10px] text-slate-500 font-medium">{dayNames[date.getDay()]}</span>
                  <span className={cn("text-sm font-bold mt-0.5", isToday ? "text-blue-300" : "text-white")}>
                    {date.getDate()}
                  </span>
                  <span className="text-[10px] mt-1">
                    {completed && w.type !== "descanso" ? "✅" : WORKOUT_ICONS[w.type]}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Peso + Checklist ── */}
        <div className="grid grid-cols-2 gap-4">
          {/* Peso */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-slate-900 rounded-2xl border border-white/10 p-4"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Peso</p>
            {latestWeight ? (
              <>
                <p className="text-3xl font-black text-white">{latestWeight.weight}</p>
                <p className="text-xs text-slate-500 mt-0.5">kg</p>
                {latestWeight.weight < 119 && (
                  <div className="flex items-center gap-1 mt-2 text-emerald-400 text-xs font-semibold">
                    <TrendingDown className="w-3.5 h-3.5" />
                    -{(119 - latestWeight.weight).toFixed(1)} kg
                  </div>
                )}
              </>
            ) : (
              <p className="text-slate-500 text-sm mt-1">Não registrado</p>
            )}
            <button
              onClick={() => setWeightModalOpen(true)}
              className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> Registrar
            </button>
          </motion.div>

          {/* Checklist resumo */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900 rounded-2xl border border-white/10 p-4"
          >
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-2">Checklist</p>
            <p className="text-3xl font-black text-white">{doneCount}<span className="text-slate-500 text-lg font-normal">/{CHECKLIST_ITEMS.length}</span></p>
            <p className="text-xs text-slate-500 mt-0.5">itens hoje</p>
            <div className="flex gap-1 mt-3 flex-wrap">
              {CHECKLIST_ITEMS.map((item) => (
                <div
                  key={item.id}
                  className={cn("w-4 h-4 rounded-sm", checklist[item.id] ? "bg-blue-500" : "bg-slate-700")}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Checklist completo ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-slate-900 rounded-2xl border border-white/10 p-4"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">Checklist de Hoje</p>
          <div className="space-y-1">
            {CHECKLIST_ITEMS.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => toggleChecklist(item.id)}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "w-full flex items-center gap-3 py-3 px-3 rounded-xl transition-all text-left",
                  checklist[item.id] ? "bg-blue-900/20" : "hover:bg-slate-800/60"
                )}
              >
                <div className={cn(
                  "w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all",
                  checklist[item.id] ? "bg-blue-500 border-blue-500" : "border-slate-600"
                )}>
                  {checklist[item.id] && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
                <span className={cn("text-sm", checklist[item.id] ? "line-through text-slate-500" : "text-slate-200")}>
                  {item.label}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* ── COROS placeholder ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-slate-900 rounded-2xl border border-white/10 p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Dados COROS</p>
            <span className="text-xs text-slate-600 bg-slate-800 px-2 py-0.5 rounded-full">Em breve</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Sono", value: "—", icon: <Moon className="w-4 h-4" />, status: "" },
              { label: "HRV", value: "—", icon: <Activity className="w-4 h-4" />, status: "" },
              { label: "Recuperação", value: "—", icon: <Zap className="w-4 h-4" />, status: "" },
              { label: "FC Repouso", value: "—", icon: <Heart className="w-4 h-4" />, status: "" },
              { label: "Carga", value: "—", icon: <BarChart2 className="w-4 h-4" />, status: "" },
              { label: "Estresse", value: "—", icon: <Activity className="w-4 h-4" />, status: "" },
            ].map((m, i) => (
              <div key={i} className="bg-slate-800/60 rounded-xl p-3 text-center">
                <div className="flex justify-center text-slate-500 mb-1">{m.icon}</div>
                <p className="text-lg font-bold text-slate-600">{m.value}</p>
                <p className="text-[10px] text-slate-600 uppercase tracking-wide mt-0.5">{m.label}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-600 text-center mt-3">Integração COROS disponível na Fase 3</p>
        </motion.div>

        {/* ── Meta ── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-gradient-to-br from-blue-950 to-slate-900 rounded-2xl border border-blue-800/50 p-4"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-3">Meta das 8 Semanas</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500 mb-1">Peso</p>
              <div className="flex items-baseline gap-2">
                <span className="text-slate-400 text-sm line-through">119 kg</span>
                <span className="text-emerald-400 font-bold">111–113 kg</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Corrida contínua</p>
              <div className="flex items-baseline gap-2">
                <span className="text-slate-400 text-sm line-through">25 min</span>
                <span className="text-emerald-400 font-bold">50 min</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Frequência</p>
              <span className="text-white font-bold">4×/semana</span>
            </div>
            <div>
              <p className="text-xs text-slate-500 mb-1">Treinos totais</p>
              <span className="text-white font-bold">32 treinos</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Celebration overlay ── */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-emerald-500 text-white px-8 py-5 rounded-2xl shadow-2xl text-center">
              <p className="text-4xl mb-2">🎉</p>
              <p className="font-black text-xl">Treino concluído!</p>
              <p className="text-emerald-100 text-sm mt-1">Mais um dia no caminho certo.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <WeightModal open={weightModalOpen} onClose={() => setWeightModalOpen(false)} />
      <BottomNav active="home" />
    </div>
  );
}
