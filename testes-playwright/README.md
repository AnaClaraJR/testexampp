# Testes Playwright - Instruções

Ambiente esperado:
- Servidor web: XAMPP (Apache) rodando na porta `80`.
- URL local do sistema: http://localhost/sistema-web
- Banco de dados: MySQL/MariaDB
- Nome do banco: `acervo_rondoniense`
- Arquivo SQL a ser importado: `setup/banco.sql` (coloque este arquivo na pasta do sistema)

Passos para preparar o ambiente:
1. Abra o XAMPP e inicie o Apache e o MySQL.
2. Configure o Apache para usar a porta 80 (padrão) — geralmente não é necessário alterar.
3. Coloque os arquivos PHP do sistema em `htdocs/sistema-web` (ou equivalente) do XAMPP.
4. Importe o arquivo `setup/banco.sql` para criar o banco `sistema_web`.
5. Ajuste o arquivo de conexão do sistema (ex.: `config.php`) com usuário/senha do MySQL.

Executando os testes Playwright:
1. Instale dependências (no workspace):

```bash
npm install
npx playwright install
```

2. Executar todos os testes:

```bash
npx playwright test
```

3. Executar um arquivo específico (ex):

```bash
npx playwright test tests/auth.spec.ts
```

4. Abrir relatório HTML gerado:

```bash
npx playwright show-report
```

Notas importantes:
- O arquivo `playwright.config.ts` foi atualizado para usar `baseURL: http://localhost/sistema-web` (porta 80).
- Os testes usam seletores com `data-testid` compatíveis com a aplicação; ajuste se necessário.
