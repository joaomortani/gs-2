# 🚂 Guia de Configuração do Railway

## 📋 Variáveis de Ambiente Necessárias

No Railway, você precisa configurar as seguintes variáveis de ambiente:

### 1. **DATABASE_URL** (Obrigatória)
Formato esperado:
```
postgres://usuario:senha@host:porta/banco?schema=public
```

**Como obter no Railway:**
1. Vá até o serviço PostgreSQL no Railway
2. Clique em "Variables"
3. Copie o valor de `DATABASE_URL` ou `POSTGRES_URL`
4. Cole no serviço do backend

**Exemplo:**
```
postgresql://postgres:senha123@containers-us-west-123.railway.app:5432/railway?sslmode=require
```

⚠️ **Importante:** Se a URL do Railway não tiver `?schema=public`, adicione manualmente:
```
postgresql://postgres:senha123@host:5432/railway?schema=public&sslmode=require
```

### 2. **JWT_ACCESS_SECRET** (Obrigatória)
Secret para tokens de acesso. Use uma string aleatória segura.

**Gerar:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Exemplo:**
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

### 3. **JWT_REFRESH_SECRET** (Obrigatória)
Secret para tokens de refresh. Use uma string aleatória diferente do ACCESS_SECRET.

**Gerar:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. **JWT_ACCESS_EXPIRES** (Obrigatória)
Tempo de expiração do token de acesso.

**Valor recomendado:**
```
15m
```

### 5. **JWT_REFRESH_EXPIRES** (Obrigatória)
Tempo de expiração do token de refresh.

**Valor recomendado:**
```
7d
```

### 6. **NODE_ENV** (Opcional)
Ambiente de execução.

**Valor:**
```
production
```

### 7. **PORT** (Opcional)
Porta do servidor. O Railway define automaticamente via `PORT`.

## 🔧 Como Configurar no Railway

### Passo 1: Criar Serviço PostgreSQL
1. No Railway, clique em "New Project"
2. Selecione "Database" → "Add PostgreSQL"
3. Aguarde o banco ser criado

### Passo 2: Criar Serviço Backend
1. Clique em "New" → "GitHub Repo"
2. Selecione seu repositório
3. Configure o root path como `./backend`

### Passo 3: Conectar Banco ao Backend
1. No serviço do backend, vá em "Variables"
2. Clique em "Reference Variable"
3. Selecione o serviço PostgreSQL
4. Selecione `DATABASE_URL` ou `POSTGRES_URL`
5. Adicione como `DATABASE_URL`

### Passo 4: Adicionar Outras Variáveis
1. No serviço do backend, vá em "Variables"
2. Clique em "New Variable"
3. Adicione cada variável:
   - `JWT_ACCESS_SECRET` (gere um valor aleatório)
   - `JWT_REFRESH_SECRET` (gere um valor aleatório diferente)
   - `JWT_ACCESS_EXPIRES` = `15m`
   - `JWT_REFRESH_EXPIRES` = `7d`
   - `NODE_ENV` = `production`

## 🧪 Testar Conexão

Após configurar, você pode testar a conexão verificando os logs do Railway. O entrypoint vai mostrar:

```
🔍 Verificando conexão com o banco de dados...
   DATABASE_URL: postgresql://postgres:****@host:5432/railway?schema=public
🔄 Testando conexão...
🔄 Aplicando migrations do Prisma...
✅ Entrypoint concluído. Iniciando aplicação...
```

## ❌ Problemas Comuns

### Erro: "DATABASE_URL is required"
**Causa:** Variável não está configurada no Railway

**Solução:**
1. Vá em Variables do serviço backend
2. Adicione `DATABASE_URL` com o valor do PostgreSQL

### Erro: "authentication failed"
**Causa:** Credenciais incorretas na DATABASE_URL

**Solução:**
1. Verifique se copiou a URL completa do PostgreSQL
2. Certifique-se de que a senha está correta
3. Se necessário, gere uma nova senha no PostgreSQL

### Erro: "does not exist"
**Causa:** Banco de dados não existe ou nome incorreto

**Solução:**
1. Verifique o nome do banco na DATABASE_URL
2. O Railway geralmente cria um banco chamado `railway`

### Erro: "ECONNREFUSED" ou "timeout"
**Causa:** Host ou porta incorretos, ou banco não está acessível

**Solução:**
1. Verifique se o serviço PostgreSQL está rodando
2. Confirme que a URL está no formato correto
3. Verifique se não há firewall bloqueando

### Erro: "@prisma/client did not initialize yet"
**Causa:** Prisma Client não foi gerado

**Solução:**
- Isso já está resolvido com o `postinstall` script
- Se persistir, verifique os logs de build

## 📝 Checklist de Configuração

- [ ] Serviço PostgreSQL criado no Railway
- [ ] Serviço Backend criado e conectado ao repositório
- [ ] `DATABASE_URL` configurada (referenciando o PostgreSQL)
- [ ] `JWT_ACCESS_SECRET` configurada (valor aleatório)
- [ ] `JWT_REFRESH_SECRET` configurada (valor aleatório diferente)
- [ ] `JWT_ACCESS_EXPIRES` configurada (`15m`)
- [ ] `JWT_REFRESH_EXPIRES` configurada (`7d`)
- [ ] `NODE_ENV` configurada (`production`)
- [ ] Deploy executado com sucesso
- [ ] Logs mostram conexão bem-sucedida

## 🚀 Executar Comandos no Railway

### Criar Usuário Admin

Para criar um usuário admin no Railway, você precisa executar o comando no contexto do serviço backend:

**Pré-requisitos:**
1. Tenha o Railway CLI instalado: `npm i -g @railway/cli`
2. Esteja logado: `railway login`
3. O serviço backend esteja linkado: `railway link` (selecione o serviço backend)
4. A variável `DATABASE_URL` esteja configurada no serviço backend

**Executar o comando:**
```bash
railway run npm run create:admin "Nome" email@example.com senha123
```

**Se der erro de conexão:**
1. Verifique se você está no serviço correto: `railway service`
2. Verifique se `DATABASE_URL` está configurada: `railway variables`
3. Se não estiver, configure via Railway Dashboard (veja "Passo 3" acima)
4. Ou configure via CLI:
   ```bash
   railway variables set DATABASE_URL="<url-do-postgresql>"
   ```

**Troubleshooting:**
- Se o erro for "Can't reach database server", verifique:
  1. O serviço PostgreSQL está rodando?
  2. A `DATABASE_URL` está correta?
  3. Você está no serviço backend (não no PostgreSQL)?
- O script agora mostra qual `DATABASE_URL` está sendo usada (com senha mascarada)
- Verifique os logs para mais detalhes sobre o erro

## 🔍 Verificar Logs

No Railway, vá em:
1. Seu serviço backend
2. Aba "Deployments"
3. Clique no deployment mais recente
4. Aba "Logs"

Procure por:
- ✅ `Prisma Client gerado com sucesso`
- ✅ `Entrypoint concluído. Iniciando aplicação...`
- ✅ `HTTP server running on port X`

Se ver erros, verifique a mensagem e consulte a seção "Problemas Comuns" acima.

