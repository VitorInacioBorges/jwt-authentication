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

## 🧪 Testando a API

### Rodando o servidor

```bash
# Build e instalação de dependências com base no package.json
npm run build

# Iniciar servidor e aplicação (deploy único)
npm start

# Iniciar servidor e aplicação (teste de desenvolvimento)
npm run dev
```

### Endpoints Disponíveis

#### 🔓 **Rotas Públicas** (sem autenticação)

##### 1. **Criar Usuário (Sign Up)**

```bash
POST /api/users
Content-Type: application/json

{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "supersecretpassword"
}
```

**Resposta:**

```json
{
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "password": "supersecretpassword",
    "role": ["USER"],
    "createdAt": "2025-11-04T10:00:00.000Z",
    "updatedAt": "2025-11-04T10:00:00.000Z",
    "_v": "0"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

##### 2. **Login**

```bash
POST /api/users/login
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
    "password": "supersecretpassword",
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

**Resposta:**

```json
{
  "user": {
    (...)
  },
  "token": "eyJhbGciOiJIUzI..."
}
{
  "user": {
    (...)
  },
  "token": "2dWdsjkdsWDDOsSs..."
}
(...)
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

## 📄 Licença

MIT

---

## 👨‍💻 Autor

**Vitor Inácio Borges**

GitHub: [@VitorInacioBorges](https://github.com/VitorInacioBorges) <br>
Instagram: [@vitor.inaciob](https://github.com/VitorInacioBorges)
