import { z } from "zod";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import {
  getChecklist, upsertChecklist, getChecklistHistory,
  saveWeight, getWeightHistory, getLatestWeightEntry,
  getNutrition, upsertNutrition, getNutritionHistory,
  markWorkoutDone, getCompletedDates,
  getPlanConfig, upsertPlanConfig,
  getWeeklyReport,
} from "../db-plan";

const MealLogSchema = z.object({
  mealId: z.string(),
  done: z.boolean(),
  protein: z.number(),
  kcal: z.number(),
  note: z.string().optional(),
});

export const planRouter = router({
  // ── Checklist ──────────────────────────────────────────────
  getChecklist: publicProcedure
    .input(z.object({ date: z.string() }))
    .query(async ({ ctx, input }) => {
    if (!ctx.user) return null;
      const row = await getChecklist(ctx.user.id, input.date);
      return row;
    }),

  saveChecklist: publicProcedure
    .input(z.object({ date: z.string(), items: z.record(z.string(), z.boolean()) }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) return { ok: false };
      await upsertChecklist(ctx.user.id, input.date, input.items as Record<string, boolean>);
      return { ok: true };
    }),

  getChecklistHistory: publicProcedure
    .input(z.object({ days: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.user) return [];
      return getChecklistHistory(ctx.user.id, input.days ?? 14);
    }),

  // ── Peso ───────────────────────────────────────────────────
  saveWeight: publicProcedure
    .input(z.object({ date: z.string(), weight: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) return { ok: false };
      await saveWeight(ctx.user.id, input.date, input.weight);
      return { ok: true };
    }),

  getWeightHistory: publicProcedure
    .input(z.object({ days: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.user) return [];
      return getWeightHistory(ctx.user.id, input.days ?? 60);
    }),

  getLatestWeight: publicProcedure
    .query(async ({ ctx }) => {
      if (!ctx.user) return null;
      return getLatestWeightEntry(ctx.user.id);
    }),

  // ── Nutrição ───────────────────────────────────────────────
  getNutrition: publicProcedure
    .input(z.object({ date: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.user) return null;
      return getNutrition(ctx.user.id, input.date);
    }),

  saveNutrition: publicProcedure
    .input(z.object({
      date: z.string(),
      meals: z.array(MealLogSchema),
      water: z.number(),
      beliscos: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) return { ok: false };
      await upsertNutrition(ctx.user.id, input.date, input);
      return { ok: true };
    }),

  getNutritionHistory: publicProcedure
    .input(z.object({ days: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.user) return [];
      return getNutritionHistory(ctx.user.id, input.days ?? 14);
    }),

  // ── Treinos ────────────────────────────────────────────────
  markWorkoutDone: publicProcedure
    .input(z.object({ date: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) return { ok: false };
      await markWorkoutDone(ctx.user.id, input.date);
      return { ok: true };
    }),

  getCompletedDates: publicProcedure
    .query(async ({ ctx }) => {
      if (!ctx.user) return [];
      return getCompletedDates(ctx.user.id);
    }),

  // ── Config do plano ────────────────────────────────────────
  getPlanConfig: publicProcedure
    .query(async ({ ctx }) => {
      if (!ctx.user) return null;
      return getPlanConfig(ctx.user.id);
    }),

  savePlanConfig: publicProcedure
    .input(z.object({ startDate: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) return { ok: false };
      await upsertPlanConfig(ctx.user.id, input.startDate);
      return { ok: true };
    }),

  // ── Relatório semanal ──────────────────────────────────────
  getWeeklyReport: publicProcedure
    .input(z.object({ weekStart: z.string(), weekEnd: z.string() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.user) return null;
      return getWeeklyReport(ctx.user.id, input.weekStart, input.weekEnd);
    }),

  // Retorna relatórios das últimas N semanas
  getAllWeeklyReports: publicProcedure
    .input(z.object({ weeks: z.number().optional() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.user) return [];
      const numWeeks = input.weeks ?? 8;
      const reports = [];
      for (let i = 0; i < numWeeks; i++) {
        const end = new Date();
        end.setDate(end.getDate() - i * 7);
        const start = new Date(end);
        start.setDate(start.getDate() - 6);
        const weekStart = start.toISOString().split("T")[0];
        const weekEnd = end.toISOString().split("T")[0];
        const report = await getWeeklyReport(ctx.user.id, weekStart, weekEnd);
        if (report) reports.push(report);
      }
      return reports;
    }),
});
