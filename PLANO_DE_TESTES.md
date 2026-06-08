# Plano de Testes - Sistema Web (Qualidade e Teste de Software)

| ID | Funcionalidade | Tipo | Objetivo | Dados de Entrada | Resultado Esperado | Prioridade | Status |
|-----|----------------|------|----------|------------------|--------------------|-----------:|--------|
| CT01 | Login | Funcional / E2E | Verificar login válido | email e senha válidos | Acesso ao sistema (Dashboard) | Alta | Pendente |
| CT02 | Login | Negativo | Verificar mensagem para senha incorreta | email válido + senha incorreta | Mensagem de erro e permanece na tela de login | Alta | Pendente |
| CT03 | Sugestão - Validação | Validação | Campos obrigatórios vazios | formulário vazio | Bloqueio do envio e mensagem de campos obrigatórios | Média | Pendente |
| CT04 | Sugestão - Fluxo completo | Funcional / E2E | Enviar sugestão completa | nome, cidade, descrição, foto válidos | Mensagem de sucesso e registro enviado | Alta | Pendente |
| CT05 | Acesso administrativo | Segurança | Acesso sem autenticação à área admin | abrir rota /admin/solicitacoes sem login | Redireciona/avisa que é necessário login | Alta | Pendente |
| CT06 | Acesso administrativo (perfil insuficiente) | Segurança | Usuário comum tenta acessar área admin | login usuário comum + acessar rota admin | Mensagem de acesso restrito | Alta | Pendente |
| CT07 | XSS (injeção de script) | Segurança | Validar que campos de texto não executam scripts | inserir `<script>alert(1)</script>` em campo texto | Não executar script; mensagem ou sanitização | Alta | Pendente |
| CT08 | Validação de tipo (preço numérico) | Validação | Verificar bloqueio de entradas não-numéricas | preço = "banana" | Rejeita e mostra mensagem de validação | Média | Pendente |
| CT09 | SQL Injection (básico) | Segurança | Verificar tratamento de entradas maliciosas | inserir `' OR '1'='1` em campo de busca/login | Não comprometer consulta; erro controlado | Alta | Pendente |
| CT10 | Acesso indevido (rota interna) | Segurança / E2E | Verificar proteção de páginas internas sem sessão | navegar diretamente para rota interna | Redireciona para login e não mostra conteúdo | Alta | Pendente |

- Cada caso deve ter um teste automatizado quando aplicável.
- Para testes de validação e segurança, validar tanto front-end quanto back-end quando possível.
Observações:
- Cada caso deve ter um teste automatizado quando aplicável.
- Para testes de validação e segurança, validar tanto front-end quanto back-end quando possível.

Ambiente padrão para execução: Apache na porta 80, URL base `http://localhost/sistema-web`, banco `acervo_rondoniense`.
- Cada caso deve ter um teste automatizado quando aplicável.
- Para testes de validação e segurança, validar tanto front-end quanto back-end quando possível.
# Plano de Testes Automatizados

| ID   | Funcionalidade                            | Objetivo                                                                 | Tipo de Teste         | Dados de Entrada                                                                                      | Resultado Esperado                                                                                  | Prioridade | Status     |
|------|-------------------------------------------|--------------------------------------------------------------------------|-----------------------|--------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|------------|------------|
| CT01 | Login                                     | Validar acesso de usuário comum com credenciais válidas                  | Funcional / E2E       | Email: usuario@teste.com, Senha: senha123                                                              | Usuário é autenticado e vê mensagem de sucesso em tela                                               | Alta       | Planejado  |
| CT02 | Login                                     | Validar bloqueio quando a senha está incorreta                            | Funcional / Segurança | Email: usuario@teste.com, Senha: senhaerrada                                                           | Exibe mensagem de erro e não autentica o usuário                                                      | Alta       | Planejado  |
| CT03 | Formulário de Sugestão                     | Validar envio com campos obrigatórios vazios                              | Validação de Dados    | Nome: vazio, Cidade: vazio, Descrição: vazio, Foto: vazio                                             | Sistema impede envio, exibe aviso de campos obrigatórios e não chama API                              | Alta       | Planejado  |
| CT04 | Formulário de Sugestão                     | Validar fluxo completo do usuário sugerindo um patrimônio                 | Fluxo / E2E           | Nome: Forte Histórico, Cidade: Porto Velho, Descrição: Teste, Foto: https://example.com/foto.jpg     | Sugestão enviada com sucesso e mensagem de confirmação aparece                                          | Alta       | Planejado  |
| CT05 | Acesso restrito ao painel administrativo    | Impedir acesso anônimo à rota /admin/solicitacoes                         | Segurança / Acesso    | Navegar para /admin/solicitacoes sem login                                                             | Redireciona ou exibe mensagem de login obrigatório                                                      | Alta       | Planejado  |
| CT06 | Acesso restrito ao painel administrativo    | Impedir acesso de usuário comum à rota administrativa                      | Segurança / Acesso    | Login como usuário comum e acessar /admin/solicitacoes                                                | Exibe mensagem de acesso restrito e mantém usuário sem acesso administrativo                            | Alta       | Planejado  |
| CT07 | Segurança XSS                              | Validar que tags de script não são executadas em sugestão de patrimônio   | Segurança / Injeção   | Nome: <script>alert('xss')</script>, outros campos válidos                                            | Nenhum diálogo de alerta é exibido e entrada é tratada sem execução de script                         | Alta       | Planejado  |
| CT08 | Integração API de Sugestões                 | Validar que o envio do formulário usa a API `/api/solicitacoes`           | Integração / E2E      | Dados de sugestão completos e usuário autenticado                                                      | Requisição POST é enviada, resposta é `success: true` e a UI confirma o envio                         | Média      | Planejado  |
| CT09 | Listagem de solicitações no Admin           | Validar que painel administrativo lê dados do banco via API               | Integração / E2E      | Login como administradora, acessar /admin/solicitacoes                                                | Painel carrega solicitações diretamente da API e exibe cards com status                               | Média      | Planejado  |
| CT10 | Segurança de sessão                         | Validar que o sistema exige login para enviar sugestões                   | Segurança / Fluxo     | Navegar para /login, não autenticar, tentar submeter sugestão                                          | Sistema bloqueia envio e exibe mensagem de login requerida                                            | Alta       | Planejado  |
