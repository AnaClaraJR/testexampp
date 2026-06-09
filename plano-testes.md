# Plano de Testes Automatizados - Sistema Web de Sugestões de Patrimônio

**Projeto:** Sistema de Sugestões de Patrimônio Histórico  
**Data de Criação:** 2026-06-09  
**Versão:** 1.0  
**Responsável:** Equipe de QA  
**Ferramenta de Teste:** Playwright  
**Ambiente:** Desenvolvimento Local

---

## 1. Escopo do Plano de Testes

Este plano de testes define a estratégia de validação automatizada para o sistema web de sugestões de patrimônio histórico. O plano abrange testes funcionais, de validação de dados, de segurança e de fluxo de usuário.

### Objetivos:
- Validar funcionalidades críticas do sistema
- Garantir integridade dos dados de entrada
- Verificar mecanismos de segurança básica
- Assegurar fluxos de usuário corretos
- Documentar comportamento esperado vs. observado

---

## 2. Ambiente de Teste

### Configuração do Servidor
- **Servidor Utilizado:** XAMPP
- **Servidor Web:** Apache
- **Porta:** 80 (ou conforme configuração local)
- **URL Local:** `http://localhost/sistema-web/`

### Banco de Dados
- **SGBD:** MySQL/MariaDB
- **Nome do Banco:** `sistema_web`
- **Arquivo SQL:** `setup/banco.sql`

### Navegadores Testados
- Google Chrome / Chromium (versão 130+)
- Resolução de Tela: 1280x720

### Dependências
- Node.js 18+
- Playwright 1.44.0
- TypeScript 5+

---

## 3. Casos de Teste Documentados

### 3.1 Testes de Autenticação (Login)

| ID | Funcionalidade | Tipo de Teste | Dados de Entrada | Resultado Esperado | Prioridade | Status | Arquivo Teste |
|---|---|---|---|---|---|---|---|
| **CT01** | Login com credenciais válidas | Funcional / E2E | Email: `usuario@teste.com` Senha: `senha123` | Usuário logado com sucesso; mensagem "Login realizado com sucesso" exibida; nome do usuário mostrado no header | **ALTA** | Implementado | `auth.spec.ts` |
| **CT02** | Bloqueio de login com senha incorreta | Negativo / Validação | Email: `usuario@teste.com` Senha: `senhaerrada` | Sistema exibe mensagem de erro "Credenciais inválidas. Verifique email e senha."; usuário não é autenticado | **ALTA** | Implementado | `auth.spec.ts` |

---

### 3.2 Testes de Validação de Dados

| ID | Funcionalidade | Tipo de Teste | Dados de Entrada | Resultado Esperado | Prioridade | Status | Arquivo Teste |
|---|---|---|---|---|---|---|---|
| **CT03** | Validação de campos obrigatórios vazios | Validação / Negativo | Tentar enviar sugestão sem preencher nenhum campo | Sistema detecta formulário inválido; mensagem "Existem campos obrigatórios em branco" é exibida; sugestão não é enviada | **ALTA** | Implementado | `sugestao.spec.ts` |
| **CT04** | Teste de fluxo completo de sugestão | Funcional / E2E | Nome: "Forte Histórico Teste" Cidade: "Porto Velho" Descrição: "Sugestão válida de patrimônio" URL Foto: "https://example.com/foto.jpg" | Sugestão é enviada com sucesso; mensagem "Sugestão enviada com sucesso para curadoria" é exibida; dados são armazenados no banco | **ALTA** | Implementado | `sugestao.spec.ts` |
| **CT05** | Email inválido em formulário | Validação / Negativo | Email: "emailinvalido" ou "email@" ou "email.com" | Validação HTML5 ou backend rejeita o formato; mensagem de erro apropriada é exibida | **MÉDIA** | Pendente | `validacao.spec.ts` |
| **CT06** | Campo numérico com texto não permitido | Validação / Negativo | Campo que aceita apenas números recebe: "abc123" ou "texto" | Sistema rejeita entrada não numérica; mensagem de erro é exibida; formulário não é enviado | **MÉDIA** | Pendente | `validacao.spec.ts` |
| **CT07** | Senha fraca em cadastro | Validação / Negativo | Senha: "123" ou "senha" | Sistema valida força da senha e rejeita senhas fracas; mensagem "Senha deve conter maiúsculas, minúsculas, números e caracteres especiais" é exibida | **ALTA** | Pendente | `validacao.spec.ts` |
| **CT08** | Confirmação de senha divergente | Validação / Negativo | Senha: "Senha@123" Confirmação: "Senha@124" | Sistema detecta discrepância; mensagem "Senhas não conferem" é exibida; cadastro não é realizado | **ALTA** | Pendente | `validacao.spec.ts` |

---

### 3.3 Testes de Segurança

| ID | Funcionalidade | Tipo de Teste | Dados de Entrada | Resultado Esperado | Prioridade | Status | Arquivo Teste |
|---|---|---|---|---|---|---|---|
| **CT09** | Prevenção de XSS (Cross-Site Scripting) | Segurança | Campo de nome: `<script>alert('xss')</script>` | Sugestão é enviada com sucesso; código malicioso não é executado; script é tratado como texto puro | **ALTA** | Implementado | `seguranca.spec.ts` |
| **CT10** | Bloqueio de acesso anônimo a rota administrativa | Segurança / Acesso | Navegação direta para: `/admin/solicitacoes` sem autenticação | Sistema redireciona para login; mensagem "Faça login para acessar esta área" é exibida; acesso à rota é negado | **ALTA** | Implementado | `seguranca.spec.ts` |
| **CT11** | Bloqueio de acesso de usuário comum à área administrativa | Segurança / Acesso | Usuário comum tenta acessar `/admin/solicitacoes` após login | Sistema exibe mensagem "Acesso restrito. Apenas administradores podem acessar"; acesso é negado | **ALTA** | Implementado | `seguranca.spec.ts` |
| **CT12** | Prevenção de SQL Injection | Segurança | Campo de entrada: `' OR '1'='1` ou `"; DROP TABLE users; --` | Sistema trata entrada como string literal; nenhuma execução de comando SQL ocorre; dados são protegidos | **ALTA** | Pendente | `seguranca.spec.ts` |

---

### 3.4 Testes de Acesso e Sessão

| ID | Funcionalidade | Tipo de Teste | Dados de Entrada | Resultado Esperado | Prioridade | Status | Arquivo Teste |
|---|---|---|---|---|---|---|---|
| **CT13** | Logout e invalidação de sessão | Funcional | Usuário autenticado clica em logout | Sessão é encerrada; redirecionamento para página de login; acesso a áreas protegidas é bloqueado | **MÉDIA** | Pendente | `sessao.spec.ts` |
| **CT14** | Acesso a área protegida após logout | Segurança | URL direta para `/dashboard` após logout | Sistema redireciona para login; sessão anterior é invalidada | **MÉDIA** | Pendente | `sessao.spec.ts` |

---

## 4. Matriz de Rastreabilidade

### Requisitos do Sistema vs. Casos de Teste

| Requisito | CT Relacionados | Cobertura |
|---|---|---|
| Autenticação de usuários | CT01, CT02 | ✅ Completa |
| Validação de formulários | CT03, CT04, CT05, CT06, CT07, CT08 | ⚠️ Parcial (pendente CT05-CT08) |
| Sugestão de patrimônio | CT03, CT04, CT09 | ✅ Completa |
| Controle de acesso baseado em função | CT10, CT11 | ✅ Completa |
| Segurança contra XSS | CT09 | ✅ Implementada |
| Segurança contra SQL Injection | CT12 | ⏳ Pendente |
| Gerenciamento de sessão | CT13, CT14 | ⏳ Pendente |

---

## 5. Critérios de Execução

### Pré-requisitos
- ✅ XAMPP iniciado e Apache em execução (porta 80 ou 82)
- ✅ MySQL/MariaDB rodando
- ✅ Banco de dados `sistema_web` criado e carregado com `setup/banco.sql`
- ✅ Aplicação acessível em `http://localhost/sistema-web/`
- ✅ Dependências Node.js instaladas (`npm install`)
- ✅ Dados de teste válidos no banco

### Execução dos Testes

```bash
# Instalar dependências
npm install

# Executar todos os testes
npm run test:e2e

# Executar teste específico
npm run test:e2e -- auth.spec.ts

# Executar com modo headless desativado (visualizar navegador)
npx playwright test --headed

# Gerar relatório em HTML
npx playwright show-report
```

### Critérios de Aceitação
- ✅ Todos os testes passam (status PASSED)
- ✅ Sem erros de timeout (timeout máximo 30s por teste)
- ✅ Todos os `expect()` são validados corretamente
- ✅ Relatório HTML gerado com sucesso
- ✅ Screenshots capturados para testes falhados
- ✅ Nenhuma exceção não tratada

---

## 6. Padrões de Teste

### Estrutura de Cada Teste

```typescript
import { test, expect } from "@playwright/test";

test.describe("Descrição da funcionalidade testada", () => {
  test("CT##: descrição clara do que é testado", async ({ page }) => {
    // 1. Navegação/Setup
    await page.goto("rota-destino");
    
    // 2. Ação (fill/click)
    await page.fill("[data-testid=campo-id]", "valor");
    await page.click("[data-testid=botao-id]");
    
    // 3. Validação (expect)
    await expect(page.locator("text=Mensagem esperada")).toBeVisible();
  });
});
```

### Boas Práticas Implementadas
- ✅ Uso de `data-testid` para seletores estáveis
- ✅ IDs descritivos para testes (CT##)
- ✅ Descrições em português claro
- ✅ Validações com `expect()`
- ✅ Organização por funcionalidade em `test.describe()`
- ✅ Sem código gerado automaticamente (Codegen limpo)
- ✅ Timeouts configurados (30s teste, 5s expect)

---

## 7. Dados de Teste

### Usuários de Teste

| Email | Senha | Tipo | Status |
|---|---|---|---|
| `usuario@teste.com` | `senha123` | Usuário Comum | Ativo |
| `administrador@email.com` | `admin123` | Administrador | Ativo |
| `teste@invalido` | `` | Inválido | Para testes negativos |

### Cidades Disponíveis
- Porto Velho
- Rio de Janeiro
- São Paulo
- Salvador
- Brasília

### URLs para Testes
- Login: `http://localhost/sistema-web/`
- Dashboard: `http://localhost/sistema-web/dashboard`
- Admin: `http://localhost/sistema-web/admin/solicitacoes`

---

## 8. Cobertura de Testes

### Estatísticas Atuais

| Categoria | Total | Implementados | Taxa |
|---|---|---|---|
| **Autenticação** | 2 | 2 | 100% |
| **Validação de Dados** | 6 | 2 | 33% |
| **Segurança** | 4 | 3 | 75% |
| **Sessão/Acesso** | 2 | 0 | 0% |
| **TOTAL** | **14** | **7** | **50%** |

### Próximas Etapas
1. Implementar testes pendentes de validação (CT05-CT08)
2. Implementar teste de SQL Injection (CT12)
3. Implementar testes de sessão (CT13-CT14)
4. Adicionar testes de API (se aplicável)
5. Adicionar testes de responsividade mobile
6. Aumentar cobertura para 90%+

---

## 9. Relatório de Resultados

### Execução de Teste
- **Data/Hora:** Será preenchida na execução
- **Ambiente:** Desenvolvimento Local
- **Total de Testes:** 7 implementados / 14 planejados
- **Testes Passando:** ✅ Aguardando execução
- **Testes Falhando:** ⏳ Aguardando execução
- **Taxa de Sucesso:** ⏳ Aguardando execução

### Artefatos Gerados
- `playwright-report/` - Relatório HTML interativo
- `test-results/` - Arquivos de resultado brutos
- Screenshots de falhas: `test-results/[test-name]-actual.png`
- Vídeos de falhas: `test-results/[test-name].webm`

---

## 10. Riscos e Mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|---|---|---|---|
| Ambiente local não configurado | ALTO | MÉDIA | Documentação clara, script de setup |
| Dados de teste inconsistentes | MÉDIO | MÉDIA | Banco de dados limpo antes de cada execução |
| Seletores quebram com mudanças UI | MÉDIO | ALTA | Usar `data-testid` em vez de classes CSS |
| Testes flaky (intermitentes) | MÉDIO | BAIXA | Timeouts adequados, waits explícitos |
| Falta de permissões no banco | ALTO | BAIXA | Verificar credenciais do MySQL/MariaDB |

---

## 11. Aprovação

| Papel | Nome | Assinatura | Data |
|---|---|---|---|
| Responsável QA | - | _____ | _____ |
| Desenvolvedor Lead | - | _____ | _____ |
| Product Owner | - | _____ | _____ |

---

## 12. Histórico de Revisões

| Versão | Data | Autor | Alterações |
|---|---|---|---|
| 1.0 | 2026-06-09 | Equipe QA | Criação inicial do plano com 14 casos de teste |
| | | | 7 testes implementados em Playwright |
| | | | Definição de ambiente, critérios e padrões |

---

## Referências

- [Documentação Playwright](https://playwright.dev)
- [Best Practices de Testes E2E](https://playwright.dev/docs/best-practices)
- [Guia OWASP de Segurança Web](https://owasp.org)
- Requisitos do Projeto: Documento de especificação do sistema

---

**Nota:** Este plano deve ser atualizado conforme novas funcionalidades são adicionadas ao sistema. Revisar e atualizar a cada sprint ou mudança significativa de requisitos.
