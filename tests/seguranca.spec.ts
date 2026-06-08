import { test, expect } from "@playwright/test";

const usuarioEmail = "usuario@teste.com";
const usuarioSenha = "senha123";
const adminEmail = "administrador@email.com";
const adminSenha = "admin123";

test.describe("Segurança e acesso", () => {
  test("CT05: bloqueio de acesso anônimo à rota administrativa", async ({ page }) => {
    await page.goto("admin/solicitacoes");
    await expect(page.locator("text=Faça login para acessar esta área.")).toBeVisible();
  });

  test("CT05: bloqueio de acesso de usuário comum à rota administrativa", async ({ page }) => {
    await page.goto("login");
    await page.fill("[data-testid=login-email]", usuarioEmail);
    await page.fill("[data-testid=login-password]", usuarioSenha);
    await page.click("[data-testid=login-submit]");

    await page.goto("admin/solicitacoes");
    await expect(page.locator("text=Acesso restrito. Apenas")).toBeVisible();
  });

  test("CT06: test de XSS em sugestão de patrimônio", async ({ page }) => {
    let dialogOpen = false;
    page.on("dialog", () => {
      dialogOpen = true;
    });

    await page.goto("login");
    await page.fill("[data-testid=login-email]", usuarioEmail);
    await page.fill("[data-testid=login-password]", usuarioSenha);
    await page.click("[data-testid=login-submit]");

    await page.fill("[data-testid=sugestao-nome]", "<script>alert('xss')</script>");
    await page.selectOption("[data-testid=sugestao-cidade]", "Porto Velho");
    await page.fill("[data-testid=sugestao-descricao]", "Teste de XSS no campo nome.");
    await page.fill("[data-testid=sugestao-foto]", "https://example.com/foto-xss.jpg");
    await page.click("[data-testid=enviar-sugestao]");

    await expect(page.locator("text=Sugestão enviada com sucesso para curadoria.")).toBeVisible();
    expect(dialogOpen).toBeFalsy();
  });
});
