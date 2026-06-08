import { test, expect } from "@playwright/test";

const usuarioEmail = "usuario@teste.com";
const usuarioSenha = "senha123";

test.describe("Auth - Fluxos de login", () => {
  test("CT01: Login válido de usuário comum", async ({ page }) => {
    await page.goto("login");
    await page.fill("[data-testid=login-email]", usuarioEmail);
    await page.fill("[data-testid=login-password]", usuarioSenha);
    await page.click("[data-testid=login-submit]");

    await expect(page.locator("text=Login realizado com sucesso.")).toBeVisible();
    await expect(page.locator(`text=Logado como: ${usuarioEmail}`)).toBeVisible();
  });

  test("CT02: Bloqueio de login com senha incorreta", async ({ page }) => {
    await page.goto("login");
    await page.fill("[data-testid=login-email]", usuarioEmail);
    await page.fill("[data-testid=login-password]", "senhaerrada");
    await page.click("[data-testid=login-submit]");

    await expect(page.locator("text=Credenciais inválidas. Verifique email e senha.")).toBeVisible();
    await expect(page.locator(`text=Logado como:`)).toHaveCount(0);
  });
});
