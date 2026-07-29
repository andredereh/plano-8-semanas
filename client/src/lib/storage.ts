// ============================================================
// LOCAL STORAGE — persiste checklist e peso no browser
// ============================================================

const CHECKLIST_KEY = "p8s_checklist";
const WEIGHT_KEY = "p8s_weight";
const START_DATE_KEY = "p8s_start_date";

export interface ChecklistEntry {
  date: string; // YYYY-MM-DD
  items: Record<string, boolean>;
}

export interface WeightEntry {
  date: string; // YYYY-MM-DD
  weight: number;
}

// ── Start date ──────────────────────────────────────────────
export function getStartDate(): Date {
  const stored = localStorage.getItem(START_DATE_KEY);
  if (stored) return new Date(stored);
  // Default: today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function setStartDate(date: Date): void {
  localStorage.setItem(START_DATE_KEY, date.toISOString());
}

// ── Checklist ───────────────────────────────────────────────
export function getTodayChecklist(): Record<string, boolean> {
  const today = toDateStr(new Date());
  const raw = localStorage.getItem(CHECKLIST_KEY);
  if (!raw) return {};
  const entries: ChecklistEntry[] = JSON.parse(raw);
  return entries.find((e) => e.date === today)?.items ?? {};
}

export function saveTodayChecklist(items: Record<string, boolean>): void {
  const today = toDateStr(new Date());
  const raw = localStorage.getItem(CHECKLIST_KEY);
  const entries: ChecklistEntry[] = raw ? JSON.parse(raw) : [];
  const idx = entries.findIndex((e) => e.date === today);
  if (idx >= 0) entries[idx].items = items;
  else entries.push({ date: today, items });
  localStorage.setItem(CHECKLIST_KEY, JSON.stringify(entries));
}

// ── Weight ──────────────────────────────────────────────────
export function getWeightEntries(): WeightEntry[] {
  const raw = localStorage.getItem(WEIGHT_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function saveWeightEntry(weight: number): void {
  const today = toDateStr(new Date());
  const entries = getWeightEntries();
  const idx = entries.findIndex((e) => e.date === today);
  if (idx >= 0) entries[idx].weight = weight;
  else entries.push({ date: today, weight });
  localStorage.setItem(WEIGHT_KEY, JSON.stringify(entries));
}

export function getLatestWeight(): WeightEntry | null {
  const entries = getWeightEntries();
  if (entries.length === 0) return null;
  return entries[entries.length - 1];
}

// ── Completed workouts ──────────────────────────────────────
const COMPLETED_KEY = "p8s_completed";

export function getCompletedWorkouts(): string[] {
  const raw = localStorage.getItem(COMPLETED_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function markWorkoutComplete(date: string): void {
  const completed = getCompletedWorkouts();
  if (!completed.includes(date)) {
    completed.push(date);
    localStorage.setItem(COMPLETED_KEY, JSON.stringify(completed));
  }
}

export function isWorkoutCompleted(date: string): boolean {
  return getCompletedWorkouts().includes(date);
}

// ── Utils ────────────────────────────────────────────────────
export function toDateStr(date: Date): string {
  return date.toISOString().split("T")[0];
}

// ── Nutrition log ────────────────────────────────────────────
const NUTRITION_KEY = "p8s_nutrition";

export interface MealLog {
  mealId: string;
  done: boolean;
  protein: number;
  kcal: number;
  note?: string;
}

export interface DayNutrition {
  date: string;
  meals: MealLog[];
  water: number; // copos de 250ml
  beliscos: boolean;
}

export function getTodayNutrition(): DayNutrition {
  const today = toDateStr(new Date());
  const raw = localStorage.getItem(NUTRITION_KEY);
  const entries: DayNutrition[] = raw ? JSON.parse(raw) : [];
  return entries.find((e) => e.date === today) ?? {
    date: today,
    meals: [],
    water: 0,
    beliscos: false,
  };
}

export function saveTodayNutrition(data: DayNutrition): void {
  const today = toDateStr(new Date());
  const raw = localStorage.getItem(NUTRITION_KEY);
  const entries: DayNutrition[] = raw ? JSON.parse(raw) : [];
  const idx = entries.findIndex((e) => e.date === today);
  if (idx >= 0) entries[idx] = data;
  else entries.push(data);
  localStorage.setItem(NUTRITION_KEY, JSON.stringify(entries));
}

export function getNutritionHistory(days = 14): DayNutrition[] {
  const raw = localStorage.getItem(NUTRITION_KEY);
  const entries: DayNutrition[] = raw ? JSON.parse(raw) : [];
  return entries.slice(-days);
}
