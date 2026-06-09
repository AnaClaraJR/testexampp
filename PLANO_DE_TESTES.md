# Plano de Testes - Acervo Rondoniense

## Objetivo

Validar as funcionalidades principais do sistema Acervo Rondoniense, incluindo autenticação, envio de sugestões de patrimônios, controle de acesso administrativo, segurança básica, busca avançada e fluxo de publicação de patrimônios.

---

# Ambiente de Execução

**Frontend:** Next.js + React + TypeScript

**Banco de Dados:** MariaDB 10.4 (XAMPP)

**Gerenciador do Banco:** phpMyAdmin

**URL da Aplicação:**

http://localhost:3000

**Banco de Dados:**

acervo_rondoniense

**Ferramenta de Teste Automatizado:**

Playwright

---

# Plano de Testes

| ID   | Funcionalidade           | Tipo            | Objetivo                                                 | Dados de Entrada                                        | Resultado Esperado                                                         | Prioridade | Status    |
| ---- | ------------------------ | --------------- | -------------------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------------------------------- | ---------- | --------- |
| CT01 | Login                    | Funcional / E2E | Validar autenticação com credenciais válidas             | E-mail e senha válidos                                  | Usuário acessa o sistema com sucesso                                       | Alta       | Planejado |
| CT02 | Login                    | Negativo        | Validar bloqueio de acesso com senha incorreta           | E-mail válido e senha incorreta                         | Sistema exibe mensagem de erro e permanece na tela de login                | Alta       | Planejado |
| CT03 | Formulário de Sugestão   | Validação       | Verificar obrigatoriedade dos campos da sugestão         | Nome, descrição, cidade e foto vazios                   | Sistema bloqueia envio e informa campos obrigatórios                       | Alta       | Planejado |
| CT04 | Formulário de Sugestão   | Fluxo / E2E     | Validar envio completo de sugestão de patrimônio         | Dados válidos preenchidos                               | Sugestão enviada com sucesso                                               | Alta       | Planejado |
| CT05 | Área Administrativa      | Segurança       | Impedir acesso sem autenticação                          | Acessar /admin/solicitacoes sem login                   | Redirecionamento para login ou mensagem de acesso negado                   | Alta       | Planejado |
| CT06 | Área Administrativa      | Segurança       | Impedir acesso de usuário comum ao painel administrativo | Login com usuário comum e acesso à rota administrativa  | Sistema bloqueia acesso administrativo                                     | Alta       | Planejado |
| CT07 | Segurança XSS            | Segurança       | Verificar proteção contra execução de scripts maliciosos | Inserção de <script>alert(1)</script> em campo de texto | Script não é executado e conteúdo é tratado com segurança                  | Alta       | Planejado |
| CT08 | Busca Avançada           | Funcional       | Validar funcionamento dos filtros de busca               | Cidade, categoria ou conservação                        | Sistema retorna apenas patrimônios compatíveis com os filtros selecionados | Média      | Planejado |
| CT09 | SQL Injection            | Segurança       | Validar proteção contra manipulação de consultas         | ' OR '1'='1 em campo de login ou busca                  | Sistema não permite acesso indevido nem compromete os dados                | Alta       | Planejado |
| CT10 | Curadoria Administrativa | Fluxo / E2E     | Validar publicação de patrimônio após aprovação          | Administradora aprova solicitação pendente              | Patrimônio passa a aparecer no catálogo público                            | Alta       | Planejado |

---

# Casos de Teste Automatizados (Playwright)

Os seguintes casos serão automatizados utilizando Playwright:

### login.spec.js

* CT01 – Login válido
* CT02 – Login inválido

### sugestoes.spec.js

* CT03 – Campos obrigatórios vazios
* CT04 – Envio de sugestão válido

### admin.spec.js

* CT05 – Acesso administrativo sem login
* CT06 – Usuário comum acessando área administrativa
* CT10 – Aprovação de patrimônio

### seguranca.spec.js

* CT07 – Teste de XSS
* CT09 – Teste de SQL Injection

### busca.spec.js

* CT08 – Busca avançada

---

# Requisitos Validados

## Autenticação

* Login com credenciais válidas.
* Bloqueio de login inválido.

## Sugestões de Patrimônio

* Campos obrigatórios.
* Envio correto de solicitações.

## Controle de Acesso

* Bloqueio de acesso administrativo sem login.
* Bloqueio de acesso administrativo para usuários comuns.

## Segurança

* Proteção contra XSS.
* Proteção contra SQL Injection.

## Busca

* Funcionamento dos filtros da busca avançada.

## Curadoria

* Aprovação administrativa.
* Publicação automática do patrimônio aprovado.
