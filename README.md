# Página de Login Helpdesk

Desafio: criar a página de login e receber o `access_token` da API

## Como funciona

1. `src/pages/Login.tsx` envia `POST /auth` com `email` e `password`
   (e `admin: true` quando "Entrar como administrador" está marcado).
2. A API devolve `{ "access_token": "..." }` (JWT).
3. O token é salvo no `localStorage`; a tela `Home` o exibe e chama `GET /me`
   com `Authorization: Bearer <token>` para mostrar o nome do usuário.
4. "Sair" apaga o token e volta ao login. Token expirado volta ao login sozinho.

Toda a comunicação com a API está em `src/services/auth.ts`.

## Como rodar

### 1. API (terminal 1)

```bash
dart pub global activate json_rest_server
cd helpdesk-jrs
json_rest_server run
```

A porta vem do `config.yaml

### 2. Front-end (terminal 2)

```bash
cd helpdesk-login
npm install
cp .env.example .env
npm run dev
```

Abra http://localhost:5173

## Contas de teste

| Perfil  | E-mail                 | Senha       | Admin |
|---------|------------------------|-------------|-------|
| Usuário | usuario@helpdesk.local | Usuario@123 | não   |
| Admin   | admin@helpdesk.local   | Admin@123   | sim   |

## Segurança

Token no `localStorage` e senhas em texto puro no `database.json` só são aceitáveis
nesta simulação didática local.
