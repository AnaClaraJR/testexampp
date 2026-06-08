import { test, expect } from "@playwright/test";

const usuarioEmail = "usuario@teste.com";
const usuarioSenha = "senha123";

test.describe("Sugestão de patrimônio", () => {
  test("CT03: validação de dados com campos obrigatórios vazios", async ({ page }) => {
    await page.goto("login");
    await page.fill("[data-testid=login-email]", usuarioEmail);
    await page.fill("[data-testid=login-password]", usuarioSenha);
    await page.click("[data-testid=login-submit]");

    await page.click("[data-testid=enviar-sugestao]");

    const formValido = await page.$eval(
      "form[data-testid='sugestao-form']",
      (form) => (form as HTMLFormElement).checkValidity(),
    );

    expect(formValido).toBeFalsy();
    await expect(page.locator("text=Existem campos obrigatórios em branco.")).toBeVisible();
  });

  test("CT04: fluxo completo do usuário sugerindo patrimônio", async ({ page }) => {
    await page.goto("login");
    await page.fill("[data-testid=login-email]", usuarioEmail);
    await page.fill("[data-testid=login-password]", usuarioSenha);
    await page.click("[data-testid=login-submit]");

    await page.fill("[data-testid=sugestao-nome]", "Forte Histórico Teste");
    await page.selectOption("[data-testid=sugestao-cidade]", "Porto Velho");
    await page.fill("[data-testid=sugestao-descricao]", "Sugestão de patrimônio para validação de fluxo.");
    await page.fill("[data-testid=sugestao-foto]", "https://example.com/foto-patrimonio.jpg");
    await page.click("[data-testid=enviar-sugestao]");

    await expect(page.locator("text=Sugestão enviada com sucesso para curadoria.")).toBeVisible();
  });
});
