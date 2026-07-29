// ============================================================
// useDbSync — sincroniza dados com o banco via tRPC
// Mantém localStorage como fallback offline
// ============================================================
import { useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { toDateStr } from "@/lib/storage";

const today = toDateStr(new Date());

// ── Checklist ────────────────────────────────────────────────
export function useChecklistSync(localItems: Record<string, boolean>) {
  const utils = trpc.useUtils();
  const { data: dbData } = trpc.plan.getChecklist.useQuery({ date: today }, {
    staleTime: 60_000,
    retry: false,
  });
  const save = trpc.plan.saveChecklist.useMutation({
    onSuccess: () => utils.plan.getChecklist.invalidate(),
  });

  const syncToDb = useCallback((items: Record<string, boolean>) => {
    save.mutate({ date: today, items });
  }, [save]);

  return { dbData, syncToDb };
}

// ── Peso ─────────────────────────────────────────────────────
export function useWeightSync() {
  const utils = trpc.useUtils();
  const { data: latestWeight } = trpc.plan.getLatestWeight.useQuery(undefined, {
    staleTime: 60_000,
    retry: false,
  });
  const { data: weightHistory } = trpc.plan.getWeightHistory.useQuery({ days: 60 }, {
    staleTime: 60_000,
    retry: false,
  });
  const save = trpc.plan.saveWeight.useMutation({
    onSuccess: () => {
      utils.plan.getLatestWeight.invalidate();
      utils.plan.getWeightHistory.invalidate();
    },
  });

  const saveWeight = useCallback((weight: number) => {
    save.mutate({ date: today, weight });
  }, [save]);

  return { latestWeight, weightHistory: weightHistory ?? [], saveWeight };
}

// ── Nutrição ─────────────────────────────────────────────────
export function useNutritionSync() {
  const utils = trpc.useUtils();
  const { data: todayNutrition } = trpc.plan.getNutrition.useQuery({ date: today }, {
    staleTime: 60_000,
    retry: false,
  });
  const { data: nutritionHistory } = trpc.plan.getNutritionHistory.useQuery({ days: 14 }, {
    staleTime: 60_000,
    retry: false,
  });
  const save = trpc.plan.saveNutrition.useMutation({
    onSuccess: () => {
      utils.plan.getNutrition.invalidate();
      utils.plan.getNutritionHistory.invalidate();
    },
  });

  const saveNutrition = useCallback((data: { meals: unknown[]; water: number; beliscos: boolean }) => {
    save.mutate({ date: today, ...data } as Parameters<typeof save.mutate>[0]);
  }, [save]);

  return { todayNutrition, nutritionHistory: nutritionHistory ?? [], saveNutrition };
}

// ── Treinos ───────────────────────────────────────────────────
export function useWorkoutSync() {
  const utils = trpc.useUtils();
  const { data: completedDates } = trpc.plan.getCompletedDates.useQuery(undefined, {
    staleTime: 60_000,
    retry: false,
  });
  const mark = trpc.plan.markWorkoutDone.useMutation({
    onSuccess: () => utils.plan.getCompletedDates.invalidate(),
  });

  const markDone = useCallback((date: string) => {
    mark.mutate({ date });
  }, [mark]);

  return { completedDates: completedDates ?? [], markDone };
}

// ── Config do plano ───────────────────────────────────────────
export function usePlanConfigSync() {
  const utils = trpc.useUtils();
  const { data: planConfig } = trpc.plan.getPlanConfig.useQuery(undefined, {
    staleTime: 5 * 60_000,
    retry: false,
  });
  const save = trpc.plan.savePlanConfig.useMutation({
    onSuccess: () => utils.plan.getPlanConfig.invalidate(),
  });

  const savePlanConfig = useCallback((startDate: string) => {
    save.mutate({ startDate });
  }, [save]);

  return { planConfig, savePlanConfig };
}
