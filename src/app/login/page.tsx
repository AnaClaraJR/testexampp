"use client";

import * as React from "react";
import { Eye, EyeOff, Lock, LogOut, ShieldCheck, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CATEGORIAS, CIDADES_RONDONIA } from "@/lib/patrimonios";
import {
  ADMIN_EMAIL,
  autenticarUsuario,
  limparSessao,
  obterUsuarioPorEmail,
  getSessao,
  salvarSessao,
  salvarUsuario,
} from "@/lib/client-db";

export default function LoginPage() {
  const [modo, setModo] = React.useState<"login" | "cadastro">("login");
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");
  const [mostrarSenha, setMostrarSenha] = React.useState(false);
  const [nomeCadastro, setNomeCadastro] = React.useState("");
  const [confirmarSenha, setConfirmarSenha] = React.useState("");
  const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [feedback, setFeedback] = React.useState("");
  const [validationErrors, setValidationErrors] = React.useState<string[]>([]);
  const [sessaoEmail, setSessaoEmail] = React.useState<string | null>(null);
  const [sessaoAdmin, setSessaoAdmin] = React.useState(false);

  const [sugestaoNomeLugar, setSugestaoNomeLugar] = React.useState("");
  const [sugestaoCidade, setSugestaoCidade] = React.useState("");
  const [sugestaoDescricao, setSugestaoDescricao] = React.useState("");
  const [sugestaoFoto, setSugestaoFoto] = React.useState("");
  const [sugestaoCategoria, setSugestaoCategoria] = React.useState("");
  const [sugestaoReferencia, setSugestaoReferencia] = React.useState("");

  React.useEffect(() => {
    const sessao = getSessao();
    setSessaoEmail(sessao?.email ?? null);
    setSessaoAdmin(sessao?.isAdmin ?? false);
  }, []);

  function sanitizarTexto(texto: string) {
    return texto
      .replace(/<script.*?>.*?<\/script>/gi, "")
      .replace(/<[^>]+>/g, "")
      .trim();
  }

  function validarSenha(senha: string) {
    if (senha.length < 7) {
      return "A senha precisa ter pelo menos 7 caracteres.";
    }
    if (!/[A-Z]/.test(senha)) {
      return "A senha deve conter ao menos uma letra maiúscula.";
    }
    if (!/[a-z]/.test(senha)) {
      return "A senha deve conter ao menos uma letra minúscula.";
    }
    if (!/[0-9]/.test(senha)) {
      return "A senha deve conter ao menos um número.";
    }
    if (!/[^A-Za-z0-9]/.test(senha)) {
      return "A senha deve conter ao menos um caractere especial.";
    }
    return null;
  }

  async function onSubmitLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setFeedback("");
    setValidationErrors([]);

    const emailLimpo = email.trim();
    const senhaLimpa = senha.trim();

    if (!emailLimpo || !senhaLimpa) {
      setFeedback("Preencha e-mail e senha.");
      setLoading(false);
      return;
    }

    const usuarioValidado = autenticarUsuario(emailLimpo, senhaLimpa);
    if (!usuarioValidado) {
      setFeedback("Credenciais inválidas. Verifique email e senha.");
      setLoading(false);
      return;
    }

    await new Promise((r) => setTimeout(r, 400));
    salvarSessao(usuarioValidado.email, usuarioValidado.nome);
    setSessaoEmail(usuarioValidado.email);
    setSessaoAdmin(usuarioValidado.isAdmin);
    setFeedback(
      usuarioValidado.isAdmin
        ? "Login realizado como administradora."
        : "Login realizado com sucesso.",
    );
    setLoading(false);
  }

  async function onSubmitCadastro(e: React.FormEvent) {
    e.preventDefault();
    if (senha !== confirmarSenha) {
      setFeedback("As senhas não conferem.");
      return;
    }

    const emailLimpo = email.trim();
    const senhaErro = validarSenha(senha);
    if (senhaErro) {
      setFeedback(senhaErro);
      return;
    }

    if (obterUsuarioPorEmail(emailLimpo)) {
      setFeedback("Este e-mail já foi cadastrado. Faça login ou use outro e-mail.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    salvarUsuario(emailLimpo, senha, nomeCadastro.trim());
    salvarSessao(emailLimpo, nomeCadastro.trim());
    setSessaoEmail(emailLimpo);
    setSessaoAdmin(emailLimpo.toLowerCase() === ADMIN_EMAIL);
    setFeedback("Cadastro realizado e sessão iniciada.");
    setLoading(false);
  }

  async function onSubmitSugestao(e: React.FormEvent) {
    e.preventDefault();
    if (!sessaoEmail) {
      setFeedback("Faça login para enviar sugestões.");
      return;
    }

    const erros: string[] = [];
    if (!sugestaoNomeLugar.trim()) erros.push("Nome do patrimônio é obrigatório.");
    if (!sugestaoCidade.trim()) erros.push("Cidade é obrigatória.");
    if (!sugestaoCategoria.trim()) erros.push("Categoria é obrigatória.");
    if (!sugestaoDescricao.trim()) erros.push("Descrição é obrigatória.");
    if (!sugestaoFoto.trim()) erros.push("URL da foto é obrigatória.");

    if (erros.length > 0) {
      setValidationErrors(erros);
      setFeedback("Existem campos obrigatórios em branco.");
      return;
    }

    setFeedback("");
    setValidationErrors([]);
    setLoading(true);

    const categoriaIndex = CATEGORIAS.findIndex((item) => item === sugestaoCategoria);
    const categoriaId = categoriaIndex >= 0 ? categoriaIndex + 1 : null;
    const corpo = {
      categoria_id: categoriaId,
      categoria: sugestaoCategoria || null,
      nome: sanitizarTexto(sugestaoNomeLugar),
      slug: sanitizarTexto(sugestaoNomeLugar)
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
      descricao: sanitizarTexto(sugestaoDescricao),
      localizacao: sanitizarTexto(sugestaoCidade),
      url_foto_principal: sanitizarTexto(sugestaoFoto),
      referencias: sanitizarTexto(sugestaoReferencia),
      usuario_sugeriu: sessaoEmail,
    };

    try {
      const response = await fetch("/api/solicitacoes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(corpo),
      });

      const resultado = await response.json();
      if (resultado.success) {
        setFeedback("Sugestão enviada com sucesso para curadoria.");
        setSugestaoNomeLugar("");
        setSugestaoCidade("");
        setSugestaoDescricao("");
        setSugestaoFoto("");
        setSugestaoCategoria("");
        setSugestaoReferencia("");
      } else {
        setFeedback("Erro ao salvar no banco: " + resultado.error);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setFeedback("Erro na requisição ao enviar sugestão.");
    } finally {
      setLoading(false);
    }
  }

  function sair() {
    limparSessao();
    setSessaoEmail(null);
    setSessaoAdmin(false);
    setFeedback("Sessão encerrada.");
  }

  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 items-start justify-center px-4 py-10">
      <div className="grid w-full gap-6 lg:grid-cols-3">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-700 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300">
            <ShieldCheck className="h-4 w-4" />
            Acesso e colaboração
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Entrar, cadastrar e sugerir patrimônios
          </h1>
          <p className="text-zinc-700 dark:text-zinc-300">
            A conta administradora é <strong>{ADMIN_EMAIL}</strong>. Somente ela
            poderá aprovar ou rejeitar sugestões.
          </p>
          {feedback ? (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-300">
              {feedback}
              {validationErrors.length > 0 ? (
                <ul className="mt-2 list-disc pl-5 text-rose-700 dark:text-rose-300">
                  {validationErrors.map((erro) => (
                    <li key={erro}>{erro}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ) : null}
          {sessaoEmail ? (
            <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900">
              Logado como: <strong>{sessaoEmail}</strong>
              {sessaoAdmin ? " (administradora)" : ""}
              <Button variant="ghost" className="ml-2 h-7 px-2" onClick={sair}>
                <LogOut className="h-4 w-4" /> Sair
              </Button>
            </div>
          ) : null}
        </div>

        <Card className="h-fit">
          <CardHeader>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={modo === "login" ? "default" : "outline"}
                onClick={() => setModo("login")}
              >
                <Lock className="h-4 w-4" /> Login
              </Button>
              <Button
                type="button"
                variant={modo === "cadastro" ? "default" : "outline"}
                onClick={() => setModo("cadastro")}
              >
                <UserPlus className="h-4 w-4" /> Cadastro
              </Button>
            </div>
            <CardDescription>
              {modo === "login" ? "Acesse sua conta." : "Crie uma conta de colaborador."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {modo === "login" ? (
              <form className="space-y-4" onSubmit={onSubmitLogin}>
                <div className="space-y-2">
                  <div className="text-sm font-medium">E-mail</div>
                  <Input
                    data-testid="login-email"
                    name="loginEmail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="usuario@acervo.ro"
                    type="email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Senha</div>
                  <div className="relative">
                    <Input
                      data-testid="login-password"
                      name="loginPassword"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      placeholder="••••••••"
                      type={mostrarSenha ? "text" : "password"}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarSenha((s) => !s)}
                      className="absolute inset-y-0 right-2 inline-flex items-center text-zinc-500"
                    >
                      {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <Button data-testid="login-submit" className="w-full" disabled={loading}>
                  {loading ? "Entrando..." : "Entrar"}
                </Button>
              </form>
            ) : (
              <form className="space-y-4" onSubmit={onSubmitCadastro} data-testid="cadastro-form">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Nome completo</div>
                  <Input value={nomeCadastro} onChange={(e) => setNomeCadastro(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">E-mail</div>
                  <Input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Senha</div>
                  <div className="relative">
                    <Input
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      type={mostrarSenha ? "text" : "password"}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarSenha((s) => !s)}
                      className="absolute inset-y-0 right-2 inline-flex items-center text-zinc-500"
                    >
                      {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Confirmar senha</div>
                  <div className="relative">
                    <Input
                      value={confirmarSenha}
                      onChange={(e) => setConfirmarSenha(e.target.value)}
                      type={mostrarConfirmarSenha ? "text" : "password"}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarConfirmarSenha((s) => !s)}
                      className="absolute inset-y-0 right-2 inline-flex items-center text-zinc-500"
                    >
                      {mostrarConfirmarSenha ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <Button className="w-full" disabled={loading}>
                  {loading ? "Criando conta..." : "Cadastrar"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Enviar sugestão de lugar</CardTitle>
            <CardDescription>
              Disponível apenas após login. Campos obrigatórios: nome, descrição,
              lugar (cidade) e foto.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!sessaoEmail ? (
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900">
                Faça login para visualizar e enviar sugestões.
              </div>
            ) : (
              <form className="space-y-4" onSubmit={onSubmitSugestao} data-testid="sugestao-form">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Nome do patrimônio *</div>
                  <Input
                    data-testid="sugestao-nome"
                    name="sugestaoNome"
                    value={sugestaoNomeLugar}
                    onChange={(e) => setSugestaoNomeLugar(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Cidade (lugar) *</div>
                  <select
                    data-testid="sugestao-cidade"
                    name="sugestaoCidade"
                    value={sugestaoCidade}
                    onChange={(e) => setSugestaoCidade(e.target.value)}
                    className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
                    required
                  >
                    <option value="">Selecione</option>
                    {CIDADES_RONDONIA.map((cidade) => (
                      <option key={cidade} value={cidade}>
                        {cidade}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Descrição *</div>
                  <Textarea
                    data-testid="sugestao-descricao"
                    name="sugestaoDescricao"
                    value={sugestaoDescricao}
                    onChange={(e) => setSugestaoDescricao(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Foto (URL) *</div>
                  <Input
                    data-testid="sugestao-foto"
                    name="sugestaoFoto"
                    value={sugestaoFoto}
                    onChange={(e) => setSugestaoFoto(e.target.value)}
                    placeholder="https://..."
                    type="url"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Categoria</div>
                  <select
                    value={sugestaoCategoria}
                    onChange={(e) => setSugestaoCategoria(e.target.value)}
                    className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-950"
                  >
                    <option value="">Selecione</option>
                    {CATEGORIAS.map((categoria) => (
                      <option key={categoria} value={categoria}>
                        {categoria}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Referências</div>
                  <Input
                    data-testid="sugestao-referencias"
                    name="sugestaoReferencias"
                    value={sugestaoReferencia}
                    onChange={(e) => setSugestaoReferencia(e.target.value)}
                  />
                </div>
                <Button data-testid="enviar-sugestao" className="w-full" disabled={loading}>
                  {loading ? "Enviando..." : "Enviar sugestão"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

