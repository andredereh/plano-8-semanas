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

export type DailyChecklist = typeof dailyChecklist.$inferSelect;
export type WeightLog = typeof weightLog.$inferSelect;
export type NutritionLog = typeof nutritionLog.$inferSelect;
export type CompletedWorkout = typeof completedWorkouts.$inferSelect;
export type PlanConfig = typeof planConfig.$inferSelect;
