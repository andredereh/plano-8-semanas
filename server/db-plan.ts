import { and, desc, eq, gte, lte, sql } from "drizzle-orm";
import { completedWorkouts, dailyChecklist, nutritionLog, planConfig, weightLog } from "../drizzle/schema";
import { getDb } from "./_core/../db";

// Helper: converte string YYYY-MM-DD para comparação com coluna date do MySQL
const dateStr = (d: string) => sql`${d}`;

// ── Checklist ────────────────────────────────────────────────
export async function getChecklist(userId: number, date: string) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(dailyChecklist)
    .where(and(eq(dailyChecklist.userId, userId), sql`${dailyChecklist.date} = ${date}`))
    .limit(1);
  return rows[0] ?? null;
}

export async function upsertChecklist(userId: number, date: string, items: Record<string, boolean>) {
  const db = await getDb();
  if (!db) return;
  await db.insert(dailyChecklist)
    .values({ userId, date: new Date(date + "T12:00:00Z"), items })
    .onDuplicateKeyUpdate({ set: { items, updatedAt: new Date() } });
}

export async function getChecklistHistory(userId: number, days = 14) {
  const db = await getDb();
  if (!db) return [];
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceStr = since.toISOString().split("T")[0];
  return db.select().from(dailyChecklist)
    .where(and(eq(dailyChecklist.userId, userId), sql`${dailyChecklist.date} >= ${sinceStr}`))
    .orderBy(desc(dailyChecklist.date));
}

// ── Peso ─────────────────────────────────────────────────────
export async function saveWeight(userId: number, date: string, weight: number) {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select().from(weightLog)
    .where(and(eq(weightLog.userId, userId), sql`${weightLog.date} = ${date}`))
    .limit(1);
  if (existing.length > 0) {
    await db.update(weightLog).set({ weight })
      .where(and(eq(weightLog.userId, userId), sql`${weightLog.date} = ${date}`));
  } else {
    await db.insert(weightLog).values({ userId, date: new Date(date + "T12:00:00Z"), weight });
  }
}

export async function getWeightHistory(userId: number, days = 60) {
  const db = await getDb();
  if (!db) return [];
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceStr = since.toISOString().split("T")[0];
  return db.select().from(weightLog)
    .where(and(eq(weightLog.userId, userId), sql`${weightLog.date} >= ${sinceStr}`))
    .orderBy(desc(weightLog.date));
}

export async function getLatestWeightEntry(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(weightLog)
    .where(eq(weightLog.userId, userId))
    .orderBy(desc(weightLog.date))
    .limit(1);
  return rows[0] ?? null;
}

// ── Nutrição ─────────────────────────────────────────────────
export async function getNutrition(userId: number, date: string) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(nutritionLog)
    .where(and(eq(nutritionLog.userId, userId), sql`${nutritionLog.date} = ${date}`))
    .limit(1);
  return rows[0] ?? null;
}

export async function upsertNutrition(userId: number, date: string, data: { meals: unknown[]; water: number; beliscos: boolean }) {
  const db = await getDb();
  if (!db) return;
  await db.insert(nutritionLog)
    .values({ userId, date: new Date(date + "T12:00:00Z"), meals: data.meals, water: data.water, beliscos: data.beliscos })
    .onDuplicateKeyUpdate({ set: { meals: data.meals, water: data.water, beliscos: data.beliscos, updatedAt: new Date() } });
}

export async function getNutritionHistory(userId: number, days = 14) {
  const db = await getDb();
  if (!db) return [];
  const since = new Date();
  since.setDate(since.getDate() - days);
  const sinceStr = since.toISOString().split("T")[0];
  return db.select().from(nutritionLog)
    .where(and(eq(nutritionLog.userId, userId), sql`${nutritionLog.date} >= ${sinceStr}`))
    .orderBy(desc(nutritionLog.date));
}

// ── Treinos concluídos ───────────────────────────────────────
export async function markWorkoutDone(userId: number, date: string) {
  const db = await getDb();
  if (!db) return;
  const existing = await db.select().from(completedWorkouts)
    .where(and(eq(completedWorkouts.userId, userId), sql`${completedWorkouts.date} = ${date}`))
    .limit(1);
  if (existing.length === 0) {
    await db.insert(completedWorkouts).values({ userId, date: new Date(date + "T12:00:00Z") });
  }
}

export async function getCompletedDates(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(completedWorkouts)
    .where(eq(completedWorkouts.userId, userId))
    .orderBy(desc(completedWorkouts.date));
  return rows.map(r => r.date instanceof Date ? r.date.toISOString().split("T")[0] : String(r.date));
}

// ── Config do plano ──────────────────────────────────────────
export async function getPlanConfig(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db.select().from(planConfig)
    .where(eq(planConfig.userId, userId))
    .limit(1);
  return rows[0] ?? null;
}

export async function upsertPlanConfig(userId: number, startDate: string) {
  const db = await getDb();
  if (!db) return;
  await db.insert(planConfig)
    .values({ userId, startDate: new Date(startDate + "T12:00:00Z") })
    .onDuplicateKeyUpdate({ set: { startDate: new Date(startDate + "T12:00:00Z"), updatedAt: new Date() } });
}

// ── Relatório semanal ────────────────────────────────────────
export async function getWeeklyReport(userId: number, weekStart: string, weekEnd: string) {
  const db = await getDb();
  if (!db) return null;

  const [checklists, weights, nutrition, workouts] = await Promise.all([
    db.select().from(dailyChecklist)
      .where(and(eq(dailyChecklist.userId, userId), sql`${dailyChecklist.date} >= ${weekStart} AND ${dailyChecklist.date} <= ${weekEnd}`)),
    db.select().from(weightLog)
      .where(and(eq(weightLog.userId, userId), sql`${weightLog.date} >= ${weekStart} AND ${weightLog.date} <= ${weekEnd}`))
      .orderBy(weightLog.date),
    db.select().from(nutritionLog)
      .where(and(eq(nutritionLog.userId, userId), sql`${nutritionLog.date} >= ${weekStart} AND ${nutritionLog.date} <= ${weekEnd}`)),
    db.select().from(completedWorkouts)
      .where(and(eq(completedWorkouts.userId, userId), sql`${completedWorkouts.date} >= ${weekStart} AND ${completedWorkouts.date} <= ${weekEnd}`)),
  ]);

  const checklistAdherence = checklists.length > 0
    ? Math.round(checklists.reduce((acc, c) => {
        const items = c.items as Record<string, boolean>;
        const done = Object.values(items).filter(Boolean).length;
        const total = Object.keys(items).length || 6;
        return acc + (done / total);
      }, 0) / checklists.length * 100)
    : 0;

  const avgProtein = nutrition.length > 0
    ? Math.round(nutrition.reduce((acc, n) => {
        const meals = n.meals as Array<{ protein: number }>;
        return acc + meals.reduce((s, m) => s + (m.protein || 0), 0);
      }, 0) / nutrition.length)
    : 0;

  const avgWater = nutrition.length > 0
    ? Math.round(nutrition.reduce((acc, n) => acc + n.water, 0) / nutrition.length * 10) / 10
    : 0;

  return {
    weekStart,
    weekEnd,
    workoutsCompleted: workouts.length,
    checklistAdherence,
    avgProtein,
    avgWater,
    weightStart: weights[0]?.weight ?? null,
    weightEnd: weights[weights.length - 1]?.weight ?? null,
    weightDelta: weights.length >= 2
      ? Math.round((weights[weights.length - 1].weight - weights[0].weight) * 10) / 10
      : null,
    daysLogged: checklists.length,
  };
}
