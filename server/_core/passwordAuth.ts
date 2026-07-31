import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";

// ID fixo do usuário único do sistema (uso pessoal)
const OWNER_OPEN_ID = process.env.OWNER_OPEN_ID || "local-owner";
const OWNER_NAME = process.env.OWNER_NAME || "André";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "plano8semanas";

export function registerPasswordAuthRoutes(app: Express) {
  // POST /api/auth/login — recebe { password } e cria sessão JWT
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const { password } = req.body as { password?: string };

    if (!password || password !== ADMIN_PASSWORD) {
      res.status(401).json({ error: "Senha incorreta" });
      return;
    }

    try {
      // Garante que o usuário existe no banco
      await db.upsertUser({
        openId: OWNER_OPEN_ID,
        name: OWNER_NAME,
        email: null,
        loginMethod: "password",
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(OWNER_OPEN_ID, {
        name: OWNER_NAME,
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.json({ success: true, name: OWNER_NAME });
    } catch (error) {
      console.error("[Auth] Login failed", error);
      res.status(500).json({ error: "Erro interno ao criar sessão" });
    }
  });

  // GET /api/auth/check — verifica se a sessão atual é válida (usado pelo frontend)
  app.get("/api/auth/check", async (req: Request, res: Response) => {
    try {
      const user = await sdk.authenticateRequest(req);
      res.json({ authenticated: true, name: user.name });
    } catch {
      res.json({ authenticated: false });
    }
  });
}
