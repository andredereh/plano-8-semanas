import { eq, and, sql } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "../db";
import { foods, mealEntries } from "../../drizzle/schema";
import { publicProcedure, router } from "../_core/trpc";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const OWNER_USER_ID = 1; // André é o único usuário; simplifica sem auth completo

async function getOwnerId() {
  // Retorna o ID do primeiro usuário (owner) do banco
  const db = await getDb();
  if (!db) return OWNER_USER_ID;
  try {
    const result = await db.execute(sql`SELECT id FROM users LIMIT 1`);
    const rows = result[0] as unknown as Array<{ id: number }>;
    return rows?.[0]?.id ?? OWNER_USER_ID;
  } catch {
    return OWNER_USER_ID;
  }
}

// ─── Router ───────────────────────────────────────────────────────────────────
export const nutritionRouter = router({

  // ── Alimentos: listar todos do usuário ──────────────────────
  listFoods: publicProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    const userId = await getOwnerId();
    return db.select().from(foods).where(eq(foods.userId, userId));
  }),

  // ── Alimentos: cadastrar novo ────────────────────────────────
  createFood: publicProcedure
    .input(z.object({
      name: z.string().min(1).max(128),
      brand: z.string().max(64).optional(),
      unit: z.enum(["g", "ml", "unidade"]).default("g"),
      servingSize: z.number().positive().default(100),
      calories: z.number().min(0),
      protein: z.number().min(0),
      carbs: z.number().min(0).default(0),
      fat: z.number().min(0).default(0),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const userId = await getOwnerId();
      await db.insert(foods).values({ ...input, userId });
      return { ok: true };
    }),

  // ── Alimentos: editar ────────────────────────────────────────
  updateFood: publicProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).max(128).optional(),
      brand: z.string().max(64).optional(),
      unit: z.enum(["g", "ml", "unidade"]).optional(),
      servingSize: z.number().positive().optional(),
      calories: z.number().min(0).optional(),
      protein: z.number().min(0).optional(),
      carbs: z.number().min(0).optional(),
      fat: z.number().min(0).optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const userId = await getOwnerId();
      const { id, ...data } = input;
      await db.update(foods).set(data).where(and(eq(foods.id, id), eq(foods.userId, userId)));
      return { ok: true };
    }),

  // ── Alimentos: excluir ───────────────────────────────────────
  deleteFood: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const userId = await getOwnerId();
      await db.delete(foods).where(and(eq(foods.id, input.id), eq(foods.userId, userId)));
      return { ok: true };
    }),

  // ── Consumo: listar entradas do dia ─────────────────────────
  listMealEntries: publicProcedure
    .input(z.object({ date: z.string() })) // YYYY-MM-DD
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const userId = await getOwnerId();
      const rows = await db
        .select({
          id: mealEntries.id,
          meal: mealEntries.meal,
          quantity: mealEntries.quantity,
          foodId: mealEntries.foodId,
          foodName: foods.name,
          foodBrand: foods.brand,
          unit: foods.unit,
          servingSize: foods.servingSize,
          calories: foods.calories,
          protein: foods.protein,
          carbs: foods.carbs,
          fat: foods.fat,
        })
        .from(mealEntries)
        .innerJoin(foods, eq(mealEntries.foodId, foods.id))
        .where(and(eq(mealEntries.userId, userId), sql`DATE(meal_entries.date) = ${input.date}`));
      return rows;
    }),

  // ── Consumo: adicionar entrada ───────────────────────────────
  addMealEntry: publicProcedure
    .input(z.object({
      date: z.string(),
      meal: z.enum(["cafe", "almoco", "lanche", "jantar", "ceia"]),
      foodId: z.number(),
      quantity: z.number().positive(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const userId = await getOwnerId();
      await db.insert(mealEntries).values({
        userId,
        date: new Date(input.date + "T12:00:00Z"),
        meal: input.meal,
        foodId: input.foodId,
        quantity: input.quantity,
      });
      return { ok: true };
    }),

  // ── Consumo: remover entrada ─────────────────────────────────
  deleteMealEntry: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("DB unavailable");
      const userId = await getOwnerId();
      await db.delete(mealEntries).where(and(eq(mealEntries.id, input.id), eq(mealEntries.userId, userId)));
      return { ok: true };
    }),
});
