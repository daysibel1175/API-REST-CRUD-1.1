# API-REST-CRUD-1.1

<img src="https://github.com/daysibel1175/API-REST-CRUD-1.1/blob/main/icono%20da%20API.png" alt="My cool logo"/>

## Bem-vindo ao repository oficial de API TRILHASBRASIL!

TRILHASBRASIL é uma API REST implementada com operações CRUD completas para gerenciar trilhas, guias, usuários e grupos.

TRILHASBRASIL foi criada com a finalidade de conectar a beleza da natureza com as pessoas, para todos que queiram conhecer as belezas naturais que o Brasil oferece, em família ou individualmente.

<hr>

Esta API foi desenvolvida utilizando Node.js, uma plataforma de servidor eficiente e escalável que permite a execução de código JavaScript no lado do servidor. Com o uso do Express, um framework minimalista e flexível para Node.js, a API oferece uma estrutura RESTful, facilitando a criação e o gerenciamento de rotas HTTP de maneira simples e intuitiva.

Para a persistência de dados, utilizamos o MongoDB Atlas, um serviço de banco de dados em nuvem que oferece alta disponibilidade e escalabilidade. O acesso e a manipulação dos dados são feitos através do Mongoose, uma biblioteca do MongoDB que proporciona uma solução baseada em esquemas para modelar os dados da aplicação.

A API é escrita em JavaScript, uma linguagem de programação dinâmica e poderosa, e utiliza o Nodemon, uma ferramenta que ajuda no desenvolvimento de aplicações em Node.js ao reiniciar automaticamente o servidor quando são detectadas alterações nos arquivos do projeto.

Com essa configuração, a API está pronta para oferecer uma interface de programação de aplicações robusta, eficiente e fácil de usar, permitindo a integração com outras aplicações e sistemas.

<hr>

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- Node.js (versão 14 ou superior)
- npm ou yarn
- Conta no MongoDB Atlas (para conexão com o banco de dados)

## 🚀 Instalação e Execução

### 1. Clone o repositório

```bash
git clone https://github.com/daysibel1175/API-REST-CRUD-1.1.git
cd API-REST-CRUD-1.1
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na pasta `Backend` com:

```env
KEY_URI=sua_connection_string_do_mongodb_atlas
PORT=9000
```

> **Nota**: Obtenha sua Connection String no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### 3. Instale as dependências

```bash
npm install
```

Este comando instalará todas as dependências do monorepo (Backend e Frontend).

### 4. Execute a aplicação

#### Opção 1: Rodar Backend e Frontend juntos

```bash
npm run dev
```

ou

```bash
npm run:all
```

#### Opção 2: Rodar separadamente

**Backend:**

```bash
npm run backend
```

**Frontend:**

```bash
npm run frontend
```

### 5. Acesse a aplicação

- **Backend API**: http://localhost:9000
- **Frontend**: http://localhost:5173

### 6. Popular o banco de dados (opcional)

Para adicionar dados de exemplo ao banco:

```bash
npm run seed
```

## 📦 Scripts Disponíveis

| Comando            | Descrição                                    |
| ------------------ | -------------------------------------------- |
| `npm run dev`      | Inicia Backend e Frontend simultaneamente    |
| `npm run:all`      | Alias para `npm run dev`                     |
| `npm run backend`  | Inicia apenas o Backend                      |
| `npm run frontend` | Inicia apenas o Frontend                     |
| `npm run seed`     | Popula o banco de dados com dados de exemplo |

## 📁 Estrutura do Projeto

```
API-REST-CRUD-1.1/
├── Backend/
│   ├── src/
│   │   ├── models/      # Modelos do MongoDB
│   │   ├── routes/      # Rotas da API
│   │   ├── index.js     # Servidor principal
│   │   └── seed.js      # Script de população do banco
│   └── package.json
├── Frontend/
│   └── react-app/
│       ├── src/
│       │   ├── components/  # Componentes reutilizáveis
│       │   ├── pages/       # Páginas da aplicação
│       │   ├── context/     # Contextos (AuthContext)
│       │   ├── services/    # Serviços de API
│       │   └── App.jsx
│       └── package.json
└── package.json         # Configuração do monorepo
```

<hr>

## ✔️ Técnicas e Tecnologias utilizadas

### Backend

- **Node.js** - Plataforma de execução JavaScript
- **Express** - Framework web minimalista
- **MongoDB Atlas** - Banco de dados NoSQL em nuvem
- **Mongoose** - ODM para MongoDB
- **Nodemon** - Ferramenta de desenvolvimento

### Frontend

- **React** - Biblioteca JavaScript para interfaces
- **Vite** - Ferramenta de build rápida
- **React Router** - Navegação entre páginas
- **Axios** - Cliente HTTP

### Arquitetura

- **REST API** - Padrão arquitetural
- **Monorepo** - Estrutura de projeto unificada
- **CRUD Operations** - Create, Read, Update, Delete

## 🔗 Endpoints da API

### Trilhas

- `GET /trilhas` - Listar todas as trilhas
- `GET /trilhas/:id` - Obter trilha específica
- `POST /trilhas` - Criar nova trilha
- `PUT /trilhas/:id` - Atualizar trilha
- `DELETE /trilhas/:id` - Deletar trilha

### Guias

- `GET /guias` - Listar todos os guias
- `GET /guias/:id` - Obter guia específico
- `POST /guias` - Criar novo guia
- `PUT /guias/:id` - Atualizar guia
- `DELETE /guias/:id` - Deletar guia

### Usuários

- `GET /usuarios` - Listar todos os usuários
- `GET /usuarios/:id` - Obter usuário específico
- `POST /usuarios` - Criar novo usuário
- `PUT /usuarios/:id` - Atualizar usuário
- `DELETE /usuarios/:id` - Deletar usuário
- `POST /usuarios/login` - Autenticar usuário

### Grupos

- `GET /grupos` - Listar todos os grupos
- `GET /grupos/:id` - Obter grupo específico
- `POST /grupos` - Criar novo grupo
- `PUT /grupos/:id` - Atualizar grupo
- `DELETE /grupos/:id` - Deletar grupo

## 📚 Documentação

A documentação completa da API está disponível em:

- **Postman**: [Documentação da API](https://documenter.getpostman.com/view/22955115/2s83zjt3pH)

<hr>

## 👥 Sobre nós

O desenvolvimento de TRILHASBRASIL é liderado pelo grupo de desenvolvedores de Back-end.

# Autores

| [<img src="https://github.com/daysibel1175/API-REST-CRUD-1.1/blob/main/Desenvolvedores/fotodericardo.jpg" width=115><br><sub>Ricardo Infante</sub>](https://github.com/Ricardo662) | [<img src="https://github.com/daysibel1175/API-REST-CRUD-1.1/blob/main/Desenvolvedores/fotodewilfried.jpg" width=115><br><sub>Wilfried da Silveira</sub>](https://github.com/tete-coder/) | [<img src="https://github.com/daysibel1175/API-REST-CRUD-1.1/blob/main/Desenvolvedores/fotodedaysibel.jpg" width=115><br><sub>Daysibel Cotiz</sub>](https://github.com/daysibel1175) |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
