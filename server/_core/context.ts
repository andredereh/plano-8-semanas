import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { upsertUser, getUserByOpenId } from "../db";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

const OWNER_OPEN_ID = process.env.OWNER_OPEN_ID || "local-owner";
const OWNER_NAME = process.env.OWNER_NAME || "André";

// Cache do usuário local para não fazer upsert a cada requisição
let _cachedUser: User | null = null;

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  // Aplicação de uso pessoal — injeta usuário fixo sem necessidade de login
  if (!_cachedUser) {
    try {
      await upsertUser({
        openId: OWNER_OPEN_ID,
        name: OWNER_NAME,
        email: null,
        loginMethod: "local",
        lastSignedIn: new Date(),
      });
      const dbUser = await getUserByOpenId(OWNER_OPEN_ID);
      if (dbUser) {
        _cachedUser = dbUser;
      }
    } catch (error) {
      console.warn("[Context] Could not load local user:", error);
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user: _cachedUser,
  };
}
