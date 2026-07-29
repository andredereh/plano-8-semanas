// ============================================================
// NUTRITION PAGE — Acompanhamento alimentar diário
// Athletic Dark Pro: dados em primeiro lugar, mobile-first
// ============================================================
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Droplets, Plus, Minus, ChevronDown, ChevronUp,
  CheckCircle2, Circle, AlertTriangle, TrendingUp, Info, Utensils
} from "lucide-react";
import { MEALS, DAILY_TARGETS, FOODS_TO_AVOID, FOODS_TO_PRIORITIZE } from "@/lib/nutritionData";
import { getTodayNutrition, saveTodayNutrition, getNutritionHistory, DayNutrition, MealLog } from "@/lib/storage";
import { cn } from "@/lib/utils";
import BottomNav from "@/components/BottomNav";

function getMealLog(nutrition: DayNutrition, mealId: string): MealLog | undefined {
  return nutrition.meals.find((m) => m.mealId === mealId);
}

export default function NutritionPage() {
  const [, navigate] = useLocation();
  const [nutrition, setNutrition] = useState<DayNutrition>(() => getTodayNutrition());
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<"evitar" | "priorizar" | null>(null);
  const history = getNutritionHistory(7);

  // Totais do dia
  const totalProtein = nutrition.meals.filter(m => m.done).reduce((s, m) => s + m.protein, 0);
  const totalKcal = nutrition.meals.filter(m => m.done).reduce((s, m) => s + m.kcal, 0);
  const proteinPct = Math.min(100, Math.round((totalProtein / DAILY_TARGETS.protein) * 100));
  const kcalPct = Math.min(100, Math.round((totalKcal / DAILY_TARGETS.kcal) * 100));
  const waterPct = Math.min(100, Math.round((nutrition.water / 10) * 100)); // 10 copos = 2.5L

  function toggleMeal(mealId: string, protein: number, kcal: number) {
    const existing = getMealLog(nutrition, mealId);
    let updatedMeals: MealLog[];
    if (existing) {
      updatedMeals = nutrition.meals.map(m =>
        m.mealId === mealId ? { ...m, done: !m.done } : m
      );
    } else {
      updatedMeals = [...nutrition.meals, { mealId, done: true, protein, kcal }];
    }
    const updated = { ...nutrition, meals: updatedMeals };
    setNutrition(updated);
    saveTodayNutrition(updated);
  }

  function selectOption(mealId: string, protein: number, kcal: number) {
    const existing = getMealLog(nutrition, mealId);
    let updatedMeals: MealLog[];
    if (existing) {
      updatedMeals = nutrition.meals.map(m =>
        m.mealId === mealId ? { ...m, done: true, protein, kcal } : m
      );
    } else {
      updatedMeals = [...nutrition.meals, { mealId, done: true, protein, kcal }];
    }
    const updated = { ...nutrition, meals: updatedMeals };
    setNutrition(updated);
    saveTodayNutrition(updated);
    setExpandedMeal(null);
  }

  function adjustWater(delta: number) {
    const newWater = Math.max(0, Math.min(12, nutrition.water + delta));
    const updated = { ...nutrition, water: newWater };
    setNutrition(updated);
    saveTodayNutrition(updated);
  }

  function toggleBeliscos() {
    const updated = { ...nutrition, beliscos: !nutrition.beliscos };
    setNutrition(updated);
    saveTodayNutrition(updated);
  }

  const proteinStatus = totalProtein >= DAILY_TARGETS.protein
    ? { label: "Meta atingida! ✅", color: "text-emerald-400" }
    : totalProtein >= DAILY_TARGETS.protein * 0.7
    ? { label: "No caminho certo", color: "text-amber-400" }
    : { label: "Abaixo da meta", color: "text-red-400" };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-24">
      {/* Header */}
      <div className="bg-slate-900 border-b border-white/10 px-4 pt-6 pb-4 flex items-center gap-3">
        <button onClick={() => navigate("/")} className="p-2 rounded-xl hover:bg-slate-800 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Alimentação</p>
          <h1 className="text-xl font-black text-white">Controle do Dia</h1>
        </div>
        <div className="text-right">
          <p className={cn("text-sm font-bold", proteinStatus.color)}>{totalProtein}g proteína</p>
          <p className="text-xs text-slate-500">{totalKcal} kcal</p>
        </div>
      </div>

      <div className="px-4 py-5 space-y-4">

        {/* ── Resumo do dia ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 rounded-2xl border border-white/10 p-4"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-4">Resumo de Hoje</p>
          <div className="space-y-3">
            {/* Proteína */}
            <div>
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="text-sm text-slate-300 font-medium">Proteína</span>
                <span className={cn("text-sm font-bold", proteinStatus.color)}>
                  {totalProtein}g <span className="text-slate-500 font-normal">/ {DAILY_TARGETS.protein}g</span>
                </span>
              </div>
              <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className={cn("h-full rounded-full", proteinPct >= 100 ? "bg-emerald-500" : proteinPct >= 70 ? "bg-amber-500" : "bg-blue-500")}
                  initial={{ width: 0 }}
                  animate={{ width: `${proteinPct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </div>
            {/* Calorias */}
            <div>
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="text-sm text-slate-300 font-medium">Calorias</span>
                <span className="text-sm font-bold text-slate-300">
                  {totalKcal} <span className="text-slate-500 font-normal">/ {DAILY_TARGETS.kcal} kcal</span>
                </span>
              </div>
              <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className={cn("h-full rounded-full", kcalPct >= 100 ? "bg-red-500" : "bg-blue-500")}
                  initial={{ width: 0 }}
                  animate={{ width: `${kcalPct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                />
              </div>
            </div>
            {/* Água */}
            <div>
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="text-sm text-slate-300 font-medium flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-cyan-400" /> Água
                </span>
                <span className="text-sm font-bold text-cyan-400">
                  {(nutrition.water * 0.25).toFixed(2)}L <span className="text-slate-500 font-normal">/ 2,5L</span>
                </span>
              </div>
              <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-cyan-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${waterPct}%` }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Controle de água ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-slate-900 rounded-2xl border border-white/10 p-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-0.5">Água</p>
              <p className="text-2xl font-black text-white">{nutrition.water} <span className="text-slate-500 text-base font-normal">copos</span></p>
              <p className="text-xs text-cyan-400 mt-0.5">{(nutrition.water * 0.25).toFixed(2)} L de 2,5 L</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => adjustWater(-1)}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors active:scale-95"
              >
                <Minus className="w-4 h-4" />
              </button>
              {/* Copos visuais */}
              <div className="flex gap-1">
                {Array.from({ length: 10 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { const updated = { ...nutrition, water: i + 1 }; setNutrition(updated); saveTodayNutrition(updated); }}
                    className={cn(
                      "w-3 h-5 rounded-sm transition-all",
                      i < nutrition.water ? "bg-cyan-500" : "bg-slate-700"
                    )}
                  />
                ))}
              </div>
              <button
                onClick={() => adjustWater(1)}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors active:scale-95"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── Refeições ── */}
        <div className="space-y-3">
          {MEALS.map((meal, idx) => {
            const log = getMealLog(nutrition, meal.id);
            const isDone = log?.done ?? false;
            const isExpanded = expandedMeal === meal.id;

            return (
              <motion.div
                key={meal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * idx }}
                className={cn(
                  "rounded-2xl border overflow-hidden transition-all",
                  isDone ? meal.colorBg + " " + meal.colorBorder : "bg-slate-900 border-white/10"
                )}
              >
                {/* Meal header */}
                <div className="flex items-center gap-3 p-4">
                  <button
                    onClick={() => toggleMeal(meal.id, meal.options[0].protein, meal.options[0].kcal)}
                    className="flex-shrink-0"
                  >
                    {isDone
                      ? <CheckCircle2 className={cn("w-6 h-6", meal.color)} />
                      : <Circle className="w-6 h-6 text-slate-600" />
                    }
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{meal.icon}</span>
                      <p className={cn("font-bold text-sm", isDone ? "text-white" : "text-slate-300")}>{meal.label}</p>
                      <span className="text-xs text-slate-500">{meal.time}</span>
                    </div>
                    {isDone && log ? (
                      <p className={cn("text-xs mt-0.5 font-semibold", meal.color)}>
                        {log.protein}g prot · {log.kcal} kcal
                      </p>
                    ) : (
                      <p className="text-xs text-slate-500 mt-0.5">Meta: {meal.proteinTarget}g prot · {meal.kcalTarget} kcal</p>
                    )}
                  </div>
                  <button
                    onClick={() => setExpandedMeal(isExpanded ? null : meal.id)}
                    className="p-1.5 rounded-lg hover:bg-black/20 transition-colors"
                  >
                    {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                </div>

                {/* Expanded options */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-white/10"
                    >
                      {/* Tip */}
                      <div className="flex gap-2 px-4 py-3 bg-black/20">
                        <Info className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-slate-400 leading-relaxed">{meal.tips}</p>
                      </div>
                      {/* Options */}
                      <div className="p-3 space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 px-1 mb-2">Escolha uma opção</p>
                        {meal.options.map((opt, i) => {
                          const isSelected = log?.done && log.protein === opt.protein && log.kcal === opt.kcal;
                          return (
                            <button
                              key={i}
                              onClick={() => selectOption(meal.id, opt.protein, opt.kcal)}
                              className={cn(
                                "w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all",
                                isSelected
                                  ? meal.colorBg + " " + meal.colorBorder
                                  : "bg-slate-800/60 border-white/5 hover:bg-slate-700/60"
                              )}
                            >
                              <div className="flex-1 min-w-0 pr-3">
                                <p className="text-sm text-white font-medium leading-snug">{opt.name}</p>
                                <p className="text-xs text-slate-400 mt-0.5">{opt.portion}</p>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className={cn("text-sm font-bold", meal.color)}>{opt.protein}g</p>
                                <p className="text-xs text-slate-500">{opt.kcal} kcal</p>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* ── Beliscos ── */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          onClick={toggleBeliscos}
          whileTap={{ scale: 0.98 }}
          className={cn(
            "w-full flex items-center gap-3 p-4 rounded-2xl border transition-all text-left",
            nutrition.beliscos
              ? "bg-red-900/30 border-red-700/50"
              : "bg-slate-900 border-white/10 hover:bg-slate-800/60"
          )}
        >
          <AlertTriangle className={cn("w-5 h-5", nutrition.beliscos ? "text-red-400" : "text-slate-500")} />
          <div className="flex-1">
            <p className={cn("font-bold text-sm", nutrition.beliscos ? "text-red-300" : "text-slate-300")}>
              {nutrition.beliscos ? "⚠️ Belisquei fora de hora" : "Sem beliscos hoje"}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">Toque para registrar se beliscou algo fora das refeições</p>
          </div>
          <div className={cn(
            "w-5 h-5 rounded-full border-2 flex items-center justify-center",
            nutrition.beliscos ? "bg-red-500 border-red-500" : "border-slate-600"
          )}>
            {nutrition.beliscos && <span className="text-white text-xs">!</span>}
          </div>
        </motion.button>

        {/* ── Guia: O que priorizar ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-slate-900 rounded-2xl border border-white/10 overflow-hidden"
        >
          <button
            onClick={() => setExpandedSection(expandedSection === "priorizar" ? null : "priorizar")}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-emerald-900/50 border border-emerald-700/50 rounded-lg flex items-center justify-center text-sm">✅</div>
              <p className="font-bold text-white text-sm">O que priorizar</p>
            </div>
            {expandedSection === "priorizar" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          <AnimatePresence>
            {expandedSection === "priorizar" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-white/10 divide-y divide-white/5"
              >
                {FOODS_TO_PRIORITIZE.map((f, i) => (
                  <div key={i} className="flex gap-3 px-4 py-3">
                    <span className="text-emerald-400 text-sm mt-0.5 flex-shrink-0">+</span>
                    <div>
                      <p className="text-sm text-white font-medium">{f.item}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{f.why}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Guia: O que evitar ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-900 rounded-2xl border border-white/10 overflow-hidden"
        >
          <button
            onClick={() => setExpandedSection(expandedSection === "evitar" ? null : "evitar")}
            className="w-full flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-900/50 border border-red-700/50 rounded-lg flex items-center justify-center text-sm">🚫</div>
              <p className="font-bold text-white text-sm">O que evitar</p>
            </div>
            {expandedSection === "evitar" ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>
          <AnimatePresence>
            {expandedSection === "evitar" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="border-t border-white/10 divide-y divide-white/5"
              >
                {FOODS_TO_AVOID.map((f, i) => (
                  <div key={i} className="flex gap-3 px-4 py-3">
                    <span className="text-red-400 text-sm mt-0.5 flex-shrink-0">—</span>
                    <div>
                      <p className="text-sm text-white font-medium">{f.item}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{f.why}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Histórico de aderência ── */}
        {history.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="bg-slate-900 rounded-2xl border border-white/10 p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Aderência (7 dias)</p>
            </div>
            <div className="flex gap-2">
              {history.map((day, i) => {
                const dayProtein = day.meals.filter(m => m.done).reduce((s, m) => s + m.protein, 0);
                const pct = Math.min(100, Math.round((dayProtein / DAILY_TARGETS.protein) * 100));
                const dayName = new Date(day.date + "T12:00:00").toLocaleDateString("pt-BR", { weekday: "short" });
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full h-16 bg-slate-800 rounded-lg overflow-hidden flex flex-col-reverse">
                      <div
                        className={cn("w-full rounded-lg transition-all", pct >= 100 ? "bg-emerald-500" : pct >= 70 ? "bg-amber-500" : "bg-blue-500/50")}
                        style={{ height: `${pct}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 capitalize">{dayName}</span>
                    <span className={cn("text-[10px] font-bold", pct >= 100 ? "text-emerald-400" : "text-slate-500")}>{dayProtein}g</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>

      <BottomNav active="nutricao" />
    </div>
  );
}
