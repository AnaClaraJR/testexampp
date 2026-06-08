# Acervo Rondoniense

Plataforma web desenvolvida para catalogação, preservação e difusão do patrimônio histórico, cultural e turístico do estado de Rondônia.

O projeto foi desenvolvido como Trabalho de Conclusão de Curso (TCC), promovendo a participação colaborativa da comunidade na construção do acervo, com curadoria administrativa para garantir a qualidade e a confiabilidade das informações publicadas.

---

## Objetivo

O Acervo Rondoniense tem como finalidade centralizar informações sobre patrimônios e pontos turísticos do estado, permitindo que cidadãos contribuam com sugestões de novos registros ou atualizações, as quais passam por um processo de validação antes da publicação.

A plataforma oferece:

* Consulta pública de patrimônios e pontos turísticos;
* Busca simples e avançada com filtros;
* Cadastro e autenticação de usuários;
* Envio de sugestões colaborativas;
* Curadoria administrativa para aprovação ou rejeição de contribuições;
* Publicação automática de conteúdos aprovados.

---

## Funcionalidades

### Área Pública

* Visualização dos patrimônios cadastrados;
* Busca avançada por filtros;
* Exibição de ficha técnica detalhada;
* Galeria de imagens dos patrimônios.

### Área do Colaborador

Usuários autenticados podem:

* Enviar sugestões de novos patrimônios;
* Solicitar atualizações de registros existentes;
* Acompanhar o processo de análise das contribuições.

### Área Administrativa

A administradora do sistema possui acesso exclusivo ao painel de curadoria:

* Aprovação de solicitações;
* Rejeição de solicitações;
* Controle de publicação do acervo.

Conta administradora:

```text
administrador@email.com
```

---

## Regras de Negócio

### Controle de Acesso

#### Usuário não autenticado

* Pode consultar o acervo;
* Não pode enviar sugestões;
* Visualiza apenas o aviso para realizar login.

#### Usuário autenticado

* Pode enviar sugestões;
* Não possui acesso administrativo;
* Não pode aprovar ou rejeitar solicitações.

#### Administradora

* Possui acesso ao painel administrativo;
* Pode aprovar ou rejeitar contribuições;
* Pode publicar patrimônios no acervo oficial.

### Campos Obrigatórios da Sugestão

Toda sugestão deve conter:

* Nome do patrimônio;
* Descrição;
* Cidade;
* URL da foto.

---

## Estrutura das Telas

| Rota                  | Descrição                   |
| --------------------- | --------------------------- |
| `/`                   | Página inicial              |
| `/busca-avancada`     | Busca com filtros           |
| `/patrimonios/[slug]` | Detalhes do patrimônio      |
| `/login`              | Login, cadastro e sugestões |
| `/admin/solicitacoes` | Painel administrativo       |

---

## Arquitetura da Plataforma

A solução é composta por três módulos principais:

### Módulo Público

Responsável pela consulta dos patrimônios já aprovados e publicados.

### Módulo Colaborativo

Responsável pelo recebimento das sugestões enviadas pelos usuários.

### Módulo Administrativo

Responsável pela análise, aprovação e rejeição das solicitações recebidas.

---

## Fluxo do Sistema

### 1. Envio da Sugestão

1. O usuário realiza login.
2. Preenche o formulário de sugestão.
3. O sistema registra a solicitação com status **pendente**.

### 2. Curadoria

1. A administradora acessa o painel de solicitações.
2. Analisa as informações enviadas.
3. Aprova ou rejeita a proposta.

### 3. Publicação

Quando uma solicitação é aprovada:

1. O sistema sincroniza os dados com o acervo oficial.
2. As imagens são atualizadas.
3. O patrimônio passa a ser exibido para todos os visitantes.

---

## Banco de Dados

### Principais Tabelas

| Tabela                    | Finalidade                           |
| ------------------------- | ------------------------------------ |
| `categorias`              | Classificação dos patrimônios        |
| `pontos_turisticos`       | Acervo oficial publicado             |
| `galeria_fotos`           | Imagens dos patrimônios              |
| `solicitacoes_patrimonio` | Solicitações enviadas pelos usuários |

### Fluxo de Persistência

```text
Usuário
    ↓
Solicitação
    ↓
solicitacoes_patrimonio
    ↓
Curadoria Administrativa
    ↓
Aprovação
    ↓
pontos_turisticos
    ↓
galeria_fotos
```

---

## Tecnologias Utilizadas

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS
* Shadcn UI

### Backend

* Next.js API Routes
* Node.js

### Banco de Dados

* MariaDB 10.4
* XAMPP
* phpMyAdmin

---

## Configuração do Banco de Dados

Crie um arquivo `.env.local`:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=acervo_rondoniense
```

Após configurar o banco:

1. Inicie Apache e MySQL no XAMPP;
2. Crie o banco `acervo_rondoniense`;
3. Execute o script SQL de criação das tabelas;
4. Inicie o projeto.

---

## Execução Local

### Pré-requisitos

* Node.js 18+
* XAMPP
* MariaDB 10.4

### Instalação

```bash
npm install
```

### Execução

```bash
npm run dev
```

Acesse:

```text
http://localhost:3000
```

---

## Segurança

O sistema implementa:

* Controle de acesso por perfil;
* Restrição de páginas administrativas;
* Validação de campos obrigatórios;
* Controle de sessão;
* Separação entre área pública e administrativa;
* Regras de integridade centralizadas no banco de dados.

---

## Roteiro de Demonstração

1. Apresentar a Home e o objetivo da plataforma;
2. Demonstrar a Busca Avançada;
3. Exibir um patrimônio cadastrado;
4. Realizar login;
5. Enviar uma sugestão;
6. Mostrar a solicitação pendente;
7. Acessar o painel administrativo;
8. Aprovar a solicitação;
9. Demonstrar a publicação do patrimônio no acervo.

---

## Autoria

**Projeto:** Acervo Rondoniense
**Autora:** Ana Clara de Jesus Régis
**Ano:** 2026

© Todos os direitos reservados.

Este projeto foi desenvolvido para fins acadêmicos, pesquisa, apresentação de TCC e composição de portfólio profissional.