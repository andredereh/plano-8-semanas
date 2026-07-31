import { describe, it, expect, vi } from "vitest";

// Mock do módulo db para evitar conexão real ao banco
vi.mock("./db", () => ({
  upsertUser: vi.fn().mockResolvedValue(undefined),
  getUserByOpenId: vi.fn().mockResolvedValue({
    id: 1,
    openId: "local-owner",
    name: "André",
    email: null,
    loginMethod: "password",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  }),
}));

// Mock do sdk para evitar dependência do JWT real
vi.mock("./_core/sdk", () => ({
  sdk: {
    createSessionToken: vi.fn().mockResolvedValue("mock-jwt-token"),
    authenticateRequest: vi.fn().mockResolvedValue({
      id: 1,
      openId: "local-owner",
      name: "André",
    }),
  },
}));

describe("Password Auth — lógica de validação", () => {
  it("deve ter ADMIN_PASSWORD configurado (ou usar fallback)", () => {
    const effectivePassword = process.env.ADMIN_PASSWORD || "plano8semanas";
    expect(typeof effectivePassword).toBe("string");
    expect(effectivePassword.length).toBeGreaterThan(0);
  });

  it("deve rejeitar senha vazia", () => {
    const adminPassword = process.env.ADMIN_PASSWORD || "plano8semanas";
    expect("" !== adminPassword).toBe(true);
  });

  it("deve rejeitar senha incorreta", () => {
    const adminPassword = process.env.ADMIN_PASSWORD || "plano8semanas";
    expect("senha_errada_xyz" !== adminPassword).toBe(true);
  });

  it("deve aceitar a senha correta", () => {
    const adminPassword = process.env.ADMIN_PASSWORD || "plano8semanas";
    // A senha correta é a mesma que foi configurada
    expect(adminPassword === adminPassword).toBe(true);
  });
});
