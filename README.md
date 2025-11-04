# 🔐 API de Autenticação JWT com Arquitetura MVC

Este projeto implementa uma **API completa de autenticação com JWT (JSON Web Token)** seguindo o padrão **MVC (Model–View–Controller)** com **camadas adicionais de Service e Repository**, muito comum em aplicações **Node.js + Express + MongoDB**.

A aplicação oferece:

- ✅ Autenticação com JWT
- ✅ Hash seguro de senhas com bcrypt
- ✅ Autorização baseada em roles (USER/ADMIN)
- ✅ Endpoints protegidos e públicos
- ✅ Middleware de validação de tokens
- ✅ Tratamento centralizado de erros

Essa estrutura facilita a **organização do código**, o **reaproveitamento de lógica** e a **manutenção** a longo prazo.

---

### 🗂️ Responsabilidades por Camada

| Camada                 | Descrição                                                                                                                                                                                                                                                        |
| :--------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`src/models`**       | Define a estrutura dos dados e validações básicas. Cada _model_ representa uma coleção no MongoDB, utilizando o Mongoose. <br>Exemplo: `user_model.js` define os campos `name`, `email`, `password`, `role` e regras de validação.                               |
| **`src/controllers`**  | Recebe as requisições HTTP da rota, interpreta os dados (params, body, query) e envia a resposta ao cliente. Não contém regra de negócio — apenas chama o serviço correto. <br>Exemplo: `user_controllers.js` gerencia create, login, list, get, update, delete. |
| **`src/services`**     | É onde mora a **lógica de negócio**. Os _services_ aplicam regras, validam fluxos, geram tokens JWT e fazem uso dos repositórios para salvar ou buscar dados. <br>Exemplo: `user_service.js` valida credenciais, gera tokens, verifica duplicatas.               |
| **`src/repositories`** | Responsável por interagir com o banco de dados (MongoDB via Mongoose). Abstrai operações CRUD em funções reutilizáveis. <br>Exemplo: `user_repository.js` possui `create`, `findAll`, `findById`, `findByEmail`, `updateById`, `deleteById`.                     |
| **`src/routes`**       | Define os endpoints HTTP da aplicação. Cada rota é associada a um controller e pode ter middlewares específicos de autenticação e autorização. <br>Exemplo: `user_routes.js` define rotas públicas e protegidas.                                                 |
| **`src/middlewares`**  | Executam antes do controller. São usados para validação, autenticação JWT, autorização por role, tratamento de erros, etc. <br>Exemplo: `auth_middleware.js` (valida JWT), `error_middleware.js` (tratamento de erros), `validate_middleware.js` (valida IDs).   |
| **`src/utils`**        | Funções auxiliares reutilizáveis em toda a aplicação. <br>Exemplo: `token_functions.js` (gera e valida JWT), `hash_password.js` (hash e comparação bcrypt), `app_error.js` (cria erros HTTP).                                                                    |
| **`src/config`**       | Contém configurações globais, como conexão com banco (`db.js`) e carregamento de variáveis de ambiente (`dotenv`).                                                                                                                                               |
| **`src/app.js`**       | Cria e configura a aplicação Express. Registra middlewares globais, importa todas as rotas e configura o middleware de erro.                                                                                                                                     |
| **`src/server.js`**    | Ponto de entrada do projeto: conecta ao MongoDB, inicia o servidor HTTP e escuta a porta definida no `.env`.                                                                                                                                                     |

---

## 🌍 Variáveis de Ambiente (`.env`)

O arquivo `.env` armazena configurações sensíveis e específicas do ambiente. **Nunca commite este arquivo no Git!**

| Variável                 | Descrição                                                                                                        | Exemplo                                 |
| :----------------------- | :--------------------------------------------------------------------------------------------------------------- | :-------------------------------------- |
| **`MONGODB_URL`**        | URI de conexão com o banco de dados MongoDB. Pode ser local ou remoto (MongoDB Atlas).                           | `mongodb://localhost:27017/jwt-auth-db` |
| **`JWT_SECRET_KEY`**     | Chave secreta usada para assinar e verificar tokens JWT. **Deve ser complexa e única por ambiente**.             | `your-super-secret-jwt-key-here`        |
| **`JWT_EXPIRATION`**     | Tempo de validade do token JWT. Aceita formatos como `"7d"` (7 dias), `"24h"` (24 horas), `"60m"` (60 minutos).  | `"7d"`                                  |
| **`BCRYPT_SALT_ROUNDS`** | Número de rounds para geração do salt do bcrypt (quanto maior, mais seguro, mas mais lento). Recomendado: 10-12. | `10`                                    |
| **`PORT`**               | Porta na qual o servidor HTTP será executado.                                                                    | `3000`                                  |

### Exemplo de arquivo `.env`:

```env
MONGODB_URL=mongodb://localhost:27017/jwt-auth-db
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRATION=7d
BCRYPT_SALT_ROUNDS=10
PORT=3000
```

> ⚠️ **Importante**: Em produção, use variáveis de ambiente seguras fornecidas pelo seu provedor de hospedagem (Heroku, Vercel, Railway, etc.).

---

## 🔁 Fluxo de Requisição

Abaixo está o passo a passo de como uma requisição percorre o sistema:

1. **Rota (`src/routes`)**
   O Express recebe a requisição (por exemplo, `POST /api/user`) e identifica a rota correspondente.
   → Aplica middlewares definidos na rota (ex: `authMiddleware()`, `requireRole("ADMIN")`, `ensureValidId`).

2. **Middleware de Autenticação (`src/middlewares/auth_middleware.js`)**
   Se a rota é protegida, o `authMiddleware()` valida o token JWT enviado no header `Authorization: Bearer <token>`.
   → Decodifica o token e anexa os dados do usuário em `req.user`.
   → Se inválido, retorna erro 401.

3. **Middleware de Autorização (`requireRole`)**
   Verifica se o usuário tem o role necessário (ex: ADMIN) para acessar o endpoint.
   → Se não tiver permissão, retorna erro 403.

4. **Controller (`src/controllers`)**
   O controller recebe os dados da requisição (body, params, query) e chama o método do serviço adequado.
   → Exemplo: `user_controller.createUser(req, res)` chama `user_service.createUser()`.

5. **Service (`src/services`)**
   O service aplica regras de negócio, validações, gera tokens JWT e chama o repository.
   → Exemplo: verifica se o e-mail já está cadastrado antes de criar o usuário.
   → Gera token JWT após login/cadastro bem-sucedido.

6. **Repository (`src/repositories`)**
   O repository executa a operação real no banco de dados (via Mongoose).
   → Exemplo: `user_repository.create(data)` faz `User.create(data)`.

7. **Model (`src/models`)**
   O Mongoose valida e persiste o dado na coleção correspondente do MongoDB.

8. **Response**
   O controller recebe o retorno e envia uma resposta HTTP adequada ao cliente, com `status` e `payload` (ex: `{ user, token }`).

9. **Middleware de Erro (`src/middlewares/error_middleware.js`)**
   Se ocorrer algum erro em qualquer etapa, o middleware de erro captura, loga (se necessário) e retorna uma resposta de erro padronizada.

---

## ⚙️ Configuração Inicial do Projeto

### 📦 Dependências

```bash
npm init -y
npm install express mongoose dotenv bcryptjs jsonwebtoken
npm install -D nodemon
```

**Dependências principais:**

- `express` - Framework web para Node.js
- `mongoose` - ODM para MongoDB
- `dotenv` - Carrega variáveis de ambiente do arquivo `.env`
- `bcryptjs` - Hash seguro de senhas
- `jsonwebtoken` - Criação e validação de tokens JWT
- `nodemon` - Reinicia automaticamente o servidor durante desenvolvimento

### 🧩 Scripts no `package.json`

```json
{
  "name": "jwt-authentication",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "nodemon src/server.js",
    "start": "node src/server.js"
  }
}
```

### 📁 Estrutura de Pastas

```
jwt-authentication/
├── src/
│   ├── config/
│   │   └── db.js                    # Conexão com MongoDB
│   ├── controllers/
│   │   └── user_controllers.js      # Controladores HTTP
│   ├── middlewares/
│   │   ├── auth_middleware.js       # Autenticação JWT e autorização por role
│   │   ├── error_middleware.js      # Tratamento de erros
│   │   └── validate_middleware.js   # Validação de IDs
│   ├── models/
│   │   └── user_model.js            # Schema Mongoose do usuário
│   ├── repositories/
│   │   └── user_repository.js       # Operações de banco de dados
│   ├── routes/
│   │   └── user_routes.js           # Definição de rotas
│   ├── services/
│   │   └── user_service.js          # Lógica de negócio
│   ├── utils/
│   │   ├── app_error.js             # Criador de erros HTTP
│   │   ├── hash_password.js         # Funções de hash bcrypt
│   │   └── token_functions.js       # Geração e validação de JWT
│   ├── app.js                       # Configuração do Express
│   └── server.js                    # Ponto de entrada da aplicação
├── .env                             # Variáveis de ambiente (não commitar!)
├── .gitignore
├── package.json
└── README.md
```

---

## 📝 Implementação dos Arquivos Principais

### 1) Conexão com o banco — `src/config/db.js`

```js
import mongoose from "mongoose";

export default async function connect(uri) {
  await mongoose.connect(uri);
  console.log("MongoDB conectado!");
}
```

---

### 2) Model — `src/models/user_model.js`

```js
import mongoose from "mongoose";

const user_schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Não retorna por padrão em queries
    },
    role: {
      type: [String],
      enum: ["USER", "ADMIN"],
      default: ["USER"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("user", user_schema);
```

> **Observação**: O campo `password` é hash e tem `select: false` para não vazar em queries padrão.

---

### 3) Repository — `src/repositories/user_repository.js`

```js
import User from "../models/user_model.js";

export default {
  create(data) {
    return User.create(data);
  },
  findAll() {
    return User.find();
  },
  findById(id) {
    return User.findById(id);
  },
  updateById(id, data) {
    return User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  },
  deleteById(id) {
    return User.findByIdAndDelete(id);
  },
  findByEmail(email) {
    return User.findOne({ email }).select("+password");
  },
};
```

---

### 4) Utilities — `src/utils/`

#### `hash_password.js` - Hash e comparação de senhas

```js
import bcrypt from "bcryptjs";

export function hashPassword(password) {
  return bcrypt.hashSync(password, 10);
}

export function compareHashedPassword(password, hashedPassword) {
  return bcrypt.compareSync(password, hashedPassword);
}
```

#### `token_functions.js` - Geração e validação de JWT

```js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export function tokenGenerator(data) {
  const payload = {
    _id: data._id,
    email: data.email,
    role: data.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRATION,
  });
}

export function tokenValidation(token) {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
}
```

#### `app_error.js` - Criador de erros HTTP

```js
export default function createError(message, status = 500) {
  const error = new Error(message);
  error.name = "HttpError";
  error.statusCode = status;
  return error;
}
```

---

### 5) Service — `src/services/user_service.js`

```js
import repo from "../repositories/user_repository.js";
import createError from "../utils/app_error.js";
import { hashPassword, compareHashedPassword } from "../utils/hash_password.js";
import { tokenGenerator } from "../utils/token_functions.js";

function ensureValidInfo({ name, email, password }) {
  if (!name?.trim()) throw createError("Name cannot be blank.", 400);
  if (!email?.trim()) throw createError("Email cannot be blank.", 400);
  if (!email.includes("@")) throw createError("Email must contain `@`.", 400);
  if (!password?.trim()) throw createError("Password cannot be blank.", 400);
}

export default {
  async createUser(data) {
    ensureValidInfo(data);

    const emailExists = await repo.findByEmail(data.email);
    if (emailExists) {
      throw createError("Email already registered.", 409);
    }

    const hashedPassword = hashPassword(data.password);

    const user = await repo.create({
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: hashedPassword,
      role: data.role || ["USER"],
    });

    const token = tokenGenerator(user);

    return { user, token };
  },

  async loginUser(data) {
    if (!data?.email?.trim()) throw createError("Email cannot be blank.", 400);
    if (!data?.password?.trim())
      throw createError("Password cannot be blank.", 400);

    const userDatabase = await repo.findByEmail(data.email);

    if (!userDatabase) {
      throw createError("User not found.", 404);
    }

    const validatePassword = compareHashedPassword(
      data.password,
      userDatabase.password
    );

    if (!validatePassword) {
      throw createError("Invalid password.", 401);
    }

    const token = tokenGenerator(userDatabase);

    return { user: userDatabase, token };
  },

  async listUsers() {
    return repo.findAll();
  },

  async getUser(id) {
    const user = await repo.findById(id);
    if (!user) {
      throw createError("User not found.", 404);
    }
    return user;
  },

  async updateUser(id, data) {
    const payload = { ...data };

    if (payload.email) {
      if (!payload.email.includes("@")) {
        throw createError("Invalid email", 400);
      }
      const existing = await repo.findByEmail(payload.email);
      if (existing && existing.id !== id) {
        throw createError("Email already registered.", 409);
      }
      payload.email = payload.email.toLowerCase();
    }

    if (payload.name) {
      payload.name = payload.name.toLowerCase();
    }

    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined) delete payload[key];
    });

    if (Object.keys(payload).length === 0) {
      throw createError("No field completed for updating.", 400);
    }

    const updated = await repo.updateById(id, payload);
    if (!updated) {
      throw createError("User not found.", 404);
    }
    return updated;
  },

  async deleteUser(id) {
    const user = await repo.deleteById(id);
    if (!user) {
      throw createError("User not found.", 404);
    }
  },
};
```

---

### 6) Middlewares — `src/middlewares/`

#### `auth_middleware.js` - Autenticação JWT e autorização por role

```js
import createError from "../utils/app_error.js";
import { tokenValidation } from "../utils/token_functions.js";

export function authMiddleware() {
  return (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(createError("Token not informed.", 401));
    }

    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7).trim()
      : authHeader.trim();

    try {
      const payload = tokenValidation(token);
      req.user = payload;
      next();
    } catch (_error) {
      next(createError("Token is invalid or expired.", 401));
    }
  };
}

export function requireRole(...allowedRoles) {
  return (req, _res, next) => {
    const roles = req.user?.role;
    if (!roles) {
      return next(createError("Forbidden.", 403));
    }
    const list = Array.isArray(roles) ? roles : [roles];
    const permitted = list.some((r) => allowedRoles.includes(r));
    if (!permitted) {
      return next(createError("Forbidden.", 403));
    }
    next();
  };
}
```

#### `error_middleware.js` - Tratamento centralizado de erros

```js
export default function errorMiddleware(err, req, res, next) {
  const status = err.statusCode || 500;
  const message = status === 500 ? "Erro interno do servidor." : err.message;

  if (status === 500) {
    console.error("[ERROR]", err);
  }

  res.status(status).json({
    error: message,
  });
}
```

#### `validate_middleware.js` - Validação de ObjectId do MongoDB

```js
import mongoose from "mongoose";
import createError from "../utils/app_error.js";

export function ensureValidId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    throw createError("Invalid ID.", 400);
  }
  next();
}
```

---

### 7) Controller — `src/controllers/user_controllers.js`

```js
import user_service from "../services/user_service.js";

export default {
  async create(req, res, next) {
    try {
      const user = await user_service.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const result = await user_service.loginUser(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async list(req, res, next) {
    try {
      const users = await user_service.listUsers();
      res.json(users);
    } catch (error) {
      next(error);
    }
  },

  async get(req, res, next) {
    try {
      const user = await user_service.getUser(req.params.id);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  async update(req, res, next) {
    try {
      const user = await user_service.updateUser(req.params.id, req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  },

  async delete(req, res, next) {
    try {
      await user_service.deleteUser(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
};
```

---

### 8) Routes — `src/routes/user_routes.js`

```js
import { Router } from "express";
import user_controller from "../controllers/user_controllers.js";
import { ensureValidId } from "../middlewares/validate_middleware.js";
import { authMiddleware, requireRole } from "../middlewares/auth_middleware.js";

const router = Router();

// 🔓 Unprotected Routes (no token required)
router.post("/user", user_controller.create); // Sign up
router.post("/user/login", user_controller.login); // Login

// 🔒 Protected Routes (requires valid JWT token)
router.get("/users/:id", authMiddleware(), ensureValidId, user_controller.get);
router.put(
  "/users/:id",
  authMiddleware(),
  ensureValidId,
  user_controller.update
);

// 🛡️ Admin-Only Routes (requires JWT + ADMIN role)
router.get(
  "/users",
  authMiddleware(),
  requireRole("ADMIN"),
  user_controller.list
);
router.delete(
  "/users/:id",
  authMiddleware(),
  requireRole("ADMIN"),
  ensureValidId,
  user_controller.delete
);

export default router;
```

---

### 9) App — `src/app.js`

```js
import express from "express";
import user_routes from "./routes/user_routes.js";
import error_middleware from "./middlewares/error_middleware.js";

const app = express();

app.use(express.json());
app.use("/api", user_routes);
app.use(error_middleware);

export default app;
```

---

### 10) Server — `src/server.js`

```js
import dotenv from "dotenv";
import app from "./app.js";
import connect from "./config/db.js";

dotenv.config();

const port = process.env.PORT || 3000;

(async () => {
  try {
    await connect(
      process.env.MONGODB_URL || "mongodb://localhost:27017/users_api"
    );
    app.listen(port, () => {
      console.log(`API listening on port ${port}`);
    });
  } catch (error) {
    console.error("Error trying to connect to the database", error);
    process.exit(1);
  }
})();
```

---

## 🧪 Testando a API

### Rodando o servidor

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm start
```

### Endpoints Disponíveis

#### 🔓 **Rotas Públicas** (sem autenticação)

##### 1. **Criar Usuário (Sign Up)**

```bash
POST /api/user
Content-Type: application/json

{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "123456"
}
```

**Resposta:**

```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "role": ["USER"],
    "createdAt": "2025-11-04T10:00:00.000Z",
    "updatedAt": "2025-11-04T10:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

##### 2. **Login**

```bash
POST /api/user/login
Content-Type: application/json

{
  "email": "ada@example.com",
  "password": "123456"
}
```

**Resposta:**

```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "role": ["USER"]
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

#### 🔒 **Rotas Protegidas** (requer token JWT)

##### 3. **Buscar Usuário por ID**

```bash
GET /api/users/:id
Authorization: Bearer <seu-token-jwt>
```

##### 4. **Atualizar Usuário**

```bash
PUT /api/users/:id
Authorization: Bearer <seu-token-jwt>
Content-Type: application/json

{
  "name": "Ada L.",
  "email": "ada.new@example.com"
}
```

---

#### 🛡️ **Rotas Admin** (requer token JWT + role ADMIN)

##### 5. **Listar Todos os Usuários**

```bash
GET /api/users
Authorization: Bearer <seu-token-jwt-admin>
```

##### 6. **Deletar Usuário**

```bash
DELETE /api/users/:id
Authorization: Bearer <seu-token-jwt-admin>
```

---

### Exemplos com cURL

```bash
# 1. Criar usuário
curl -X POST http://localhost:3000/api/user \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada Lovelace","email":"ada@example.com","password":"123456"}'

# 2. Login
curl -X POST http://localhost:3000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ada@example.com","password":"123456"}'

# 3. Buscar usuário (substitua <TOKEN> e <ID>)
curl -X GET http://localhost:3000/api/users/<ID> \
  -H "Authorization: Bearer <TOKEN>"

# 4. Atualizar usuário
curl -X PUT http://localhost:3000/api/users/<ID> \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada L."}'

# 5. Listar usuários (requer ADMIN)
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer <TOKEN_ADMIN>"

# 6. Deletar usuário (requer ADMIN)
curl -X DELETE http://localhost:3000/api/users/<ID> \
  -H "Authorization: Bearer <TOKEN_ADMIN>"
```

---

## 🔐 Fluxo de Autenticação

### 1. **Sign Up / Login**

- Usuário envia credenciais
- API valida e gera um JWT
- Token é retornado ao cliente
- Cliente armazena o token (localStorage, sessionStorage, cookie)

### 2. **Acessar Rotas Protegidas**

- Cliente envia token no header: `Authorization: Bearer <token>`
- `authMiddleware()` valida o token
- Se válido, extrai dados do usuário e anexa em `req.user`
- Controller processa a requisição

### 3. **Rotas Admin**

- Além da validação de token, `requireRole("ADMIN")` verifica o role
- Se o usuário não for ADMIN, retorna 403 Forbidden

---

## 🔒 Segurança

### Boas Práticas Implementadas:

✅ **Senhas são hash com bcrypt** - Nunca armazena senhas em texto  
✅ **Tokens JWT com expiração** - Tokens expiram após 7 dias (configurável)  
✅ **Campo password com `select: false`** - Não retorna senha em queries padrão  
✅ **Validação de inputs** - Previne dados inválidos  
✅ **Tratamento centralizado de erros** - Não vaza detalhes de implementação  
✅ **Autorização por roles** - Controle de acesso baseado em permissões  
✅ **Variáveis de ambiente** - Dados sensíveis no `.env`

### Melhorias Recomendadas para Produção:

⚠️ **Rate limiting** - Limitar tentativas de login  
⚠️ **Refresh tokens** - Tokens de longa duração para renovação  
⚠️ **HTTPS obrigatório** - Comunicação criptografada  
⚠️ **Validação de email** - Confirmar email com token  
⚠️ **CORS configurado** - Controlar origens permitidas  
⚠️ **Helmet.js** - Headers de segurança HTTP  
⚠️ **MongoDB indexes** - Adicionar índice único no email

---

## 📚 Conceitos Importantes

### JWT (JSON Web Token)

- Token autocontido que carrega informações do usuário
- Composto por: Header + Payload + Signature
- Não precisa consultar banco para validar (stateless)
- Payload contém: `_id`, `email`, `role`

### Bcrypt

- Algoritmo de hash adaptativo
- Salt rounds = 10 (configurável)
- Mesmo senha = hash diferente (devido ao salt)
- Irreversível (não pode ser descriptografado)

### Middleware Chain

- Funções executadas em sequência antes do controller
- `authMiddleware()` → valida token
- `requireRole("ADMIN")` → valida permissão
- `ensureValidId` → valida formato do ID
- `errorMiddleware` → captura erros de toda aplicação

---

## 🎯 Diferença entre Endpoints Protegidos e Não Protegidos

| Tipo           | Rotas                                        | Autenticação                 | Uso                       |
| :------------- | :------------------------------------------- | :--------------------------- | :------------------------ |
| **Públicas**   | `POST /api/user`<br>`POST /api/user/login`   | ❌ Não requer token          | Sign up e login           |
| **Protegidas** | `GET /api/users/:id`<br>`PUT /api/users/:id` | ✅ Requer token válido       | Operações autenticadas    |
| **Admin**      | `GET /api/users`<br>`DELETE /api/users/:id`  | ✅ Requer token + role ADMIN | Operações administrativas |

---

## 🚀 Próximos Passos

- [ ] Implementar refresh tokens
- [ ] Adicionar validação de email
- [ ] Implementar recuperação de senha
- [ ] Adicionar testes unitários e de integração
- [ ] Configurar CI/CD
- [ ] Documentar API com Swagger/OpenAPI
- [ ] Adicionar logs estruturados
- [ ] Implementar rate limiting

---

## 📄 Licença

MIT

---

## 👨‍💻 Autor

**Vitor Inácio Borges**  
GitHub: [@VitorInacioBorges](https://github.com/VitorInacioBorges)
