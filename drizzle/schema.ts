import { boolean, date, float, int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ── Checklist diário ─────────────────────────────────────────
export const dailyChecklist = mysqlTable("daily_checklist", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  date: date("date").notNull(),
  items: json("items").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ── Registro de peso ─────────────────────────────────────────
export const weightLog = mysqlTable("weight_log", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  date: date("date").notNull(),
  weight: float("weight").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ── Log de nutrição diária ───────────────────────────────────
export const nutritionLog = mysqlTable("nutrition_log", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  date: date("date").notNull(),
  meals: json("meals").notNull(),
  water: int("water").notNull().default(0),
  beliscos: boolean("beliscos").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ── Treinos concluídos ───────────────────────────────────────
export const completedWorkouts = mysqlTable("completed_workouts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  date: date("date").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// ── Data de início do plano ──────────────────────────────────
export const planConfig = mysqlTable("plan_config", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  startDate: date("startDate").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ── Alimentos cadastrados pelo usuário ──────────────────────
export const foods = mysqlTable("foods", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 128 }).notNull(),
  brand: varchar("brand", { length: 64 }),
  unit: varchar("unit", { length: 16 }).notNull().default("g"),   // g, ml, unidade
  servingSize: float("servingSize").notNull().default(100),        // tamanho da porção padrão
  calories: float("calories").notNull(),                           // kcal por 100g/ml ou por unidade
  protein: float("protein").notNull(),                             // g por 100g/ml ou por unidade
  carbs: float("carbs").notNull().default(0),
  fat: float("fat").notNull().default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ── Registros de consumo por refeição ───────────────────────
export const mealEntries = mysqlTable("meal_entries", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  date: date("date").notNull(),
  meal: varchar("meal", { length: 32 }).notNull(),   // cafe, almoco, lanche, jantar, ceia
  foodId: int("foodId").notNull(),
  quantity: float("quantity").notNull(),              // quantidade em gramas/ml/unidades
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DailyChecklist = typeof dailyChecklist.$inferSelect;
export type WeightLog = typeof weightLog.$inferSelect;
export type NutritionLog = typeof nutritionLog.$inferSelect;
export type CompletedWorkout = typeof completedWorkouts.$inferSelect;
export type PlanConfig = typeof planConfig.$inferSelect;
