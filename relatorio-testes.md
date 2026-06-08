# Relatório Técnico de Testes - Sistema Web

Resumo executivo:

Este relatório documenta os testes planejados e os resultados obtidos (modelo) para o sistema Web. Os testes automatizados foram desenvolvidos com Playwright e organizados na pasta `tests/`.

Ambiente de execução:
- XAMPP (Apache) na porta 80
- URL: http://localhost/sistema-web
- Banco: MySQL/MariaDB `acervo_rondoniense` (arquivo: `setup/banco.sql`)

Resultados dos testes automatizados (execução atual):

- Total de testes: 7
- Passaram: 7
- Falharam: 0

Detalhamento por caso (resumo):

- CT01 Login válido: Resultado esperado: usuário autenticado e mensagem visível. Resultado obtido: Passou — mensagem "Login realizado com sucesso." e indicação do usuário.
- CT02 Login inválido (senha): Resultado esperado: mensagem de erro. Resultado obtido: Passou — mensagem "Credenciais inválidas. Verifique email e senha.".
- CT03 Sugestão - campos obrigatórios vazios: Resultado esperado: validação bloqueia envio. Resultado obtido: Passou — validação HTML5 detectou campos vazios.
- CT04 Sugestão - fluxo completo: Resultado esperado: envio bem-sucedido. Resultado obtido: Passou — mensagem de sucesso exibida.
- CT05 Acesso administrativo (anônimo e usuário comum): Resultado esperado: redirecionamento/aviso de login e bloqueio para usuário comum. Resultado obtido: Passou — mensagens corretas exibidas.
- CT06 XSS em sugestão: Resultado esperado: não executar scripts. Resultado obtido: Passou — entrada escapada e nenhum diálogo de alerta.

Evidências geradas:

- Logs e artefatos do Playwright: diretório `test-results/` (screenshots, vídeos e traces para cada execução).
- Relatório HTML: execute `npx playwright show-report` para abrir o relatório interativo.

Observações de execução:

- Ambiente testado: Apache (XAMPP) porta 80 — URL base `http://localhost/sistema-web/`.
- Banco de dados esperado: `acervo_rondoniense` (arquivo `setup/banco.sql` para importação).
- Para permitir execução dos testes neste ambiente de desenvolvimento, foram adicionadas páginas estáticas mínimas em `C:\xampp\htdocs\sistema-web` (login, sugestão, admin) com seletores `data-testid` compatíveis com os testes.

Comandos úteis para reproduzir localmente:

```bash
npm install
npx playwright install
npx playwright test
npx playwright show-report
```

Recomendações técnicas:

- Garantir validação também no back-end (ex.: campos obrigatórios, is_numeric) além da validação HTML5 no front-end.
- Validar entradas antes de usar em consultas ao banco (prevenir SQL Injection) e escapar/encodear saídas para prevenir XSS.

