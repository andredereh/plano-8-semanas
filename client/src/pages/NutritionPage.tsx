// ============================================================
// NUTRITION PAGE — Acompanhamento alimentar com banco de dados
// ============================================================
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Trash2, ChevronDown, ChevronUp, Droplets,
  Utensils, BookOpen, Search, X, Edit2, Check, AlertTriangle
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import BottomNav from "@/components/BottomNav";
import { DAILY_TARGETS } from "@/lib/nutritionData";

const TODAY = new Date().toISOString().slice(0, 10);

const MEAL_LABELS: Record<string, { label: string; emoji: string; time: string }> = {
  cafe:    { label: "Café da Manhã",  emoji: "☀️",  time: "07:00" },
  almoco:  { label: "Almoço",         emoji: "🍽️",  time: "12:00" },
  lanche:  { label: "Lanche",         emoji: "🥤",  time: "15:30" },
  jantar:  { label: "Jantar",         emoji: "🌙",  time: "19:00" },
  ceia:    { label: "Ceia",           emoji: "🌛",  time: "21:30" },
};

type Food = {
  id: number; name: string; brand?: string | null;
  unit: string; servingSize: number;
  calories: number; protein: number; carbs: number; fat: number;
};

// ── Modal: Cadastrar / Editar Alimento ───────────────────────
function FoodFormModal({
  food, onClose, onSave,
}: {
  food?: Food | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [name, setName] = useState(food?.name ?? "");
  const [brand, setBrand] = useState(food?.brand ?? "");
  const [unit, setUnit] = useState<"g" | "ml" | "unidade">(
    (food?.unit as "g" | "ml" | "unidade") ?? "g"
  );
  const [serving, setServing] = useState(String(food?.servingSize ?? 100));
  const [calories, setCalories] = useState(String(food?.calories ?? ""));
  const [protein, setProtein] = useState(String(food?.protein ?? ""));
  const [carbs, setCarbs] = useState(String(food?.carbs ?? 0));
  const [fat, setFat] = useState(String(food?.fat ?? 0));

  const create = trpc.nutrition.createFood.useMutation({ onSuccess: onSave });
  const update = trpc.nutrition.updateFood.useMutation({ onSuccess: onSave });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      name, brand: brand || undefined, unit,
      servingSize: parseFloat(serving) || 100,
      calories: parseFloat(calories) || 0,
      protein: parseFloat(protein) || 0,
      carbs: parseFloat(carbs) || 0,
      fat: parseFloat(fat) || 0,
    };
    if (food) update.mutate({ id: food.id, ...data });
    else create.mutate(data);
  }

  const loading = create.isPending || update.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-lg">{food ? "Editar Alimento" : "Novo Alimento"}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Nome *</label>
            <input value={name} onChange={e => setName(e.target.value)} required
              placeholder="Ex: Frango grelhado"
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Marca (opcional)</label>
            <input value={brand} onChange={e => setBrand(e.target.value)}
              placeholder="Ex: Sadia, Nestlé..."
              className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Unidade</label>
              <select value={unit} onChange={e => setUnit(e.target.value as "g" | "ml" | "unidade")}
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500">
                <option value="g">gramas (g)</option>
                <option value="ml">mililitros (ml)</option>
                <option value="unidade">unidade</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Porção padrão ({unit})</label>
              <input value={serving} onChange={e => setServing(e.target.value)} type="number" min="1"
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <p className="text-xs text-slate-500">Valores por {serving || "100"}{unit}:</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Calorias (kcal) *</label>
              <input value={calories} onChange={e => setCalories(e.target.value)} type="number" min="0" required
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Proteína (g) *</label>
              <input value={protein} onChange={e => setProtein(e.target.value)} type="number" min="0" required
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Carboidrato (g)</label>
              <input value={carbs} onChange={e => setCarbs(e.target.value)} type="number" min="0"
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Gordura (g)</label>
              <input value={fat} onChange={e => setFat(e.target.value)} type="number" min="0"
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
            </div>
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold rounded-xl py-3 mt-2 transition-colors">
            {loading ? "Salvando..." : food ? "Salvar Alterações" : "Cadastrar Alimento"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// ── Modal: Adicionar consumo a uma refeição ──────────────────
function AddEntryModal({
  meal, foods, onClose, onSave,
}: {
  meal: string;
  foods: Food[];
  onClose: () => void;
  onSave: () => void;
}) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Food | null>(null);
  const [qty, setQty] = useState("");

  const filtered = useMemo(() =>
    foods.filter(f => f.name.toLowerCase().includes(search.toLowerCase()) ||
      (f.brand ?? "").toLowerCase().includes(search.toLowerCase())),
    [foods, search]);

  const add = trpc.nutrition.addMealEntry.useMutation({ onSuccess: onSave });

  function calcMacro(val: number, food: Food, quantity: number) {
    return Math.round((val / food.servingSize) * quantity * 10) / 10;
  }

  const preview = selected && qty ? {
    kcal: calcMacro(selected.calories, selected, parseFloat(qty)),
    protein: calcMacro(selected.protein, selected, parseFloat(qty)),
    carbs: calcMacro(selected.carbs, selected, parseFloat(qty)),
    fat: calcMacro(selected.fat, selected, parseFloat(qty)),
  } : null;

  function handleAdd() {
    if (!selected || !qty) return;
    add.mutate({ date: TODAY, meal: meal as "cafe"|"almoco"|"lanche"|"jantar"|"ceia", foodId: selected.id, quantity: parseFloat(qty) });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md p-5 max-h-[85vh] flex flex-col"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-lg">
            {MEAL_LABELS[meal]?.emoji} Adicionar ao {MEAL_LABELS[meal]?.label}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
        </div>

        {/* Busca */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar alimento..."
            className="w-full bg-slate-800 border border-white/10 rounded-xl pl-9 pr-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
        </div>

        {/* Lista de alimentos */}
        {!selected && (
          <div className="overflow-y-auto flex-1 space-y-1.5 mb-3">
            {filtered.length === 0 && (
              <p className="text-slate-500 text-sm text-center py-6">Nenhum alimento encontrado.<br />Cadastre um na aba "Meus Alimentos".</p>
            )}
            {filtered.map(f => (
              <button key={f.id} onClick={() => { setSelected(f); setQty(String(f.servingSize)); }}
                className="w-full text-left bg-slate-800 hover:bg-slate-700 border border-white/10 rounded-xl px-3 py-2.5 transition-colors">
                <p className="text-white text-sm font-medium">{f.name}</p>
                <p className="text-slate-400 text-xs">{f.brand ? `${f.brand} · ` : ""}{f.calories} kcal · {f.protein}g prot · por {f.servingSize}{f.unit}</p>
              </button>
            ))}
          </div>
        )}

        {/* Quantidade + preview */}
        {selected && (
          <div className="space-y-3 mb-3">
            <div className="flex items-center gap-2">
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white text-xs flex items-center gap-1">
                <X className="w-3 h-3" /> {selected.name}
              </button>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Quantidade ({selected.unit})</label>
              <input value={qty} onChange={e => setQty(e.target.value)} type="number" min="1"
                className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500" />
            </div>
            {preview && (
              <div className="bg-slate-800 rounded-xl p-3 grid grid-cols-4 gap-2 text-center">
                <div><p className="text-white font-bold text-sm">{preview.kcal}</p><p className="text-slate-400 text-[10px]">kcal</p></div>
                <div><p className="text-emerald-400 font-bold text-sm">{preview.protein}g</p><p className="text-slate-400 text-[10px]">prot</p></div>
                <div><p className="text-yellow-400 font-bold text-sm">{preview.carbs}g</p><p className="text-slate-400 text-[10px]">carb</p></div>
                <div><p className="text-orange-400 font-bold text-sm">{preview.fat}g</p><p className="text-slate-400 text-[10px]">gord</p></div>
              </div>
            )}
          </div>
        )}

        <button onClick={handleAdd} disabled={!selected || !qty || add.isPending}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-semibold rounded-xl py-3 transition-colors">
          {add.isPending ? "Adicionando..." : "Adicionar"}
        </button>
      </motion.div>
    </div>
  );
}

// ── Página principal ─────────────────────────────────────────
export default function NutritionPage() {
  const [activeTab, setActiveTab] = useState<"hoje" | "alimentos">("hoje");
  const [expandedMeal, setExpandedMeal] = useState<string | null>(null);
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [editingFood, setEditingFood] = useState<Food | null | "new">(null);
  const [water, setWater] = useState(0);
  const [beliscos, setBeliscos] = useState(false);

  const { data: foods = [], refetch: refetchFoods } = trpc.nutrition.listFoods.useQuery();
  const { data: entries = [], refetch: refetchEntries } = trpc.nutrition.listMealEntries.useQuery({ date: TODAY });
  const deleteEntry = trpc.nutrition.deleteMealEntry.useMutation({ onSuccess: () => refetchEntries() });
  const deleteFood = trpc.nutrition.deleteFood.useMutation({ onSuccess: () => refetchFoods() });

  // Totais do dia
  const totals = useMemo(() => {
    return entries.reduce((acc, e) => {
      const factor = e.quantity / e.servingSize;
      return {
        kcal: acc.kcal + e.calories * factor,
        protein: acc.protein + e.protein * factor,
        carbs: acc.carbs + e.carbs * factor,
        fat: acc.fat + e.fat * factor,
      };
    }, { kcal: 0, protein: 0, carbs: 0, fat: 0 });
  }, [entries]);

  const proteinPct = Math.min(100, Math.round((totals.protein / DAILY_TARGETS.protein) * 100));
  const kcalPct = Math.min(100, Math.round((totals.kcal / DAILY_TARGETS.kcal) * 100));

  // Agrupar entradas por refeição
  const entriesByMeal = useMemo(() => {
    const map: Record<string, typeof entries> = {};
    for (const e of entries) {
      if (!map[e.meal]) map[e.meal] = [];
      map[e.meal].push(e);
    }
    return map;
  }, [entries]);

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-slate-950/95 backdrop-blur border-b border-white/5 px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Nutrição</p>
            <h1 className="text-lg font-black text-white">Hoje</h1>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setActiveTab("hoje")}
              className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                activeTab === "hoje" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400")}>
              Hoje
            </button>
            <button onClick={() => setActiveTab("alimentos")}
              className={cn("px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
                activeTab === "alimentos" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400")}>
              Meus Alimentos
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* ── ABA: HOJE ─────────────────────────────────────── */}
        {activeTab === "hoje" && (
          <>
            {/* Resumo do dia */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 rounded-2xl border border-white/10 p-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Resumo do Dia</p>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <p className="text-white font-black text-xl">{Math.round(totals.kcal)}</p>
                  <p className="text-slate-400 text-[10px]">kcal · meta {DAILY_TARGETS.kcal}</p>
                </div>
                <div>
                  <p className={cn("font-black text-xl", totals.protein >= DAILY_TARGETS.protein ? "text-emerald-400" : "text-white")}>
                    {Math.round(totals.protein)}g
                  </p>
                  <p className="text-slate-400 text-[10px]">prot · meta {DAILY_TARGETS.protein}g</p>
                </div>
                <div>
                  <p className="text-yellow-400 font-black text-xl">{Math.round(totals.carbs)}g</p>
                  <p className="text-slate-400 text-[10px]">carb</p>
                </div>
                <div>
                  <p className="text-orange-400 font-black text-xl">{Math.round(totals.fat)}g</p>
                  <p className="text-slate-400 text-[10px]">gord</p>
                </div>
              </div>
              {/* Barras */}
              <div className="space-y-1.5">
                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                    <span>Proteína</span><span>{proteinPct}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all", proteinPct >= 100 ? "bg-emerald-500" : "bg-blue-500")}
                      style={{ width: `${proteinPct}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                    <span>Calorias</span><span>{kcalPct}%</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all", kcalPct > 110 ? "bg-red-500" : "bg-amber-500")}
                      style={{ width: `${Math.min(kcalPct, 100)}%` }} />
                  </div>
                </div>
              </div>
              {totals.protein < DAILY_TARGETS.protein && (
                <div className="flex items-center gap-2 bg-amber-900/20 border border-amber-700/30 rounded-xl px-3 py-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <p className="text-amber-300 text-xs">Faltam <strong>{Math.round(DAILY_TARGETS.protein - totals.protein)}g</strong> de proteína para bater a meta.</p>
                </div>
              )}
            </motion.div>

            {/* Refeições */}
            {Object.keys(MEAL_LABELS).map((mealId, i) => {
              const mealEntries = entriesByMeal[mealId] ?? [];
              const mealTotals = mealEntries.reduce((acc, e) => {
                const f = e.quantity / e.servingSize;
                return { kcal: acc.kcal + e.calories * f, protein: acc.protein + e.protein * f };
              }, { kcal: 0, protein: 0 });
              const isExpanded = expandedMeal === mealId;

              return (
                <motion.div key={mealId}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-slate-900 rounded-2xl border border-white/10 overflow-hidden">
                  <button onClick={() => setExpandedMeal(isExpanded ? null : mealId)}
                    className="w-full flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{MEAL_LABELS[mealId].emoji}</span>
                      <div className="text-left">
                        <p className="text-white font-semibold text-sm">{MEAL_LABELS[mealId].label}</p>
                        <p className="text-slate-400 text-xs">{MEAL_LABELS[mealId].time} · {mealEntries.length} item{mealEntries.length !== 1 ? "s" : ""}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {mealEntries.length > 0 && (
                        <div className="text-right">
                          <p className="text-white text-sm font-bold">{Math.round(mealTotals.kcal)} kcal</p>
                          <p className="text-emerald-400 text-xs">{Math.round(mealTotals.protein)}g prot</p>
                        </div>
                      )}
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/5 px-4 pb-4 space-y-2 pt-3">
                        {mealEntries.length === 0 && (
                          <p className="text-slate-500 text-xs text-center py-2">Nenhum alimento registrado.</p>
                        )}
                        {mealEntries.map(e => {
                          const factor = e.quantity / e.servingSize;
                          return (
                            <div key={e.id} className="flex items-center justify-between bg-slate-800 rounded-xl px-3 py-2">
                              <div>
                                <p className="text-white text-sm font-medium">{e.foodName}</p>
                                <p className="text-slate-400 text-xs">{e.quantity}{e.unit} · {Math.round(e.calories * factor)} kcal · {Math.round(e.protein * factor)}g prot</p>
                              </div>
                              <button onClick={() => deleteEntry.mutate({ id: e.id })}
                                className="text-slate-500 hover:text-red-400 transition-colors ml-2">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                        <button onClick={() => setAddingTo(mealId)}
                          className="w-full flex items-center justify-center gap-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-400 rounded-xl py-2.5 text-sm font-semibold transition-colors">
                          <Plus className="w-4 h-4" /> Adicionar Alimento
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}

            {/* Água */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 rounded-2xl border border-white/10 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Água</p>
                </div>
                <p className="text-white font-bold text-sm">{water}/10 copos · {(water * 0.25).toFixed(1)}L</p>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {Array.from({ length: 10 }).map((_, i) => (
                  <button key={i} onClick={() => setWater(i < water ? i : i + 1)}
                    className={cn("w-8 h-8 rounded-lg border transition-all text-sm",
                      i < water ? "bg-blue-600 border-blue-500 text-white" : "bg-slate-800 border-white/10 text-slate-500")}>
                    💧
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Beliscos */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className={cn("rounded-2xl border p-4 flex items-center justify-between cursor-pointer transition-colors",
                beliscos ? "bg-red-900/20 border-red-700/30" : "bg-slate-900 border-white/10")}
              onClick={() => setBeliscos(!beliscos)}>
              <div>
                <p className="text-white font-semibold text-sm">Belisquei fora de hora?</p>
                <p className="text-slate-400 text-xs">Honestidade é parte do processo</p>
              </div>
              <div className={cn("w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors",
                beliscos ? "bg-red-600 border-red-500" : "border-slate-600")}>
                {beliscos && <Check className="w-4 h-4 text-white" />}
              </div>
            </motion.div>
          </>
        )}

        {/* ── ABA: MEUS ALIMENTOS ───────────────────────────── */}
        {activeTab === "alimentos" && (
          <>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between">
              <p className="text-slate-400 text-sm">{foods.length} alimento{foods.length !== 1 ? "s" : ""} cadastrado{foods.length !== 1 ? "s" : ""}</p>
              <button onClick={() => setEditingFood("new")}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                <Plus className="w-4 h-4" /> Novo Alimento
              </button>
            </motion.div>

            {foods.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-slate-900 border border-white/10 rounded-2xl p-8 text-center">
                <BookOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">Nenhum alimento cadastrado ainda.</p>
                <p className="text-slate-500 text-xs mt-1">Clique em "Novo Alimento" para começar.</p>
              </motion.div>
            )}

            <div className="space-y-2">
              {foods.map((f, i) => (
                <motion.div key={f.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-slate-900 border border-white/10 rounded-2xl px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold text-sm">{f.name}</p>
                    <p className="text-slate-400 text-xs">
                      {f.brand ? `${f.brand} · ` : ""}
                      {f.calories} kcal · {f.protein}g prot · {f.carbs}g carb · {f.fat}g gord
                    </p>
                    <p className="text-slate-500 text-[10px]">por {f.servingSize}{f.unit}</p>
                  </div>
                  <div className="flex gap-2 ml-3">
                    <button onClick={() => setEditingFood(f)}
                      className="text-slate-400 hover:text-blue-400 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => deleteFood.mutate({ id: f.id })}
                      className="text-slate-400 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modais */}
      <AnimatePresence>
        {addingTo && (
          <AddEntryModal
            meal={addingTo}
            foods={foods as Food[]}
            onClose={() => setAddingTo(null)}
            onSave={() => { refetchEntries(); setAddingTo(null); }}
          />
        )}
        {editingFood && (
          <FoodFormModal
            food={editingFood === "new" ? null : editingFood}
            onClose={() => setEditingFood(null)}
            onSave={() => { refetchFoods(); setEditingFood(null); }}
          />
        )}
      </AnimatePresence>

      <BottomNav active="nutricao" />
    </div>
  );
}
