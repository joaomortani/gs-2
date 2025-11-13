# 🚀 Como Aplicar Migrations no Railway

Se você está vendo o erro `relation "public.User" does not exist`, significa que as migrations do Prisma não foram aplicadas no banco de dados.

## 🔧 Solução Rápida: Via Railway CLI

### 1. Instalar Railway CLI

```bash
npm install -g @railway/cli
```

### 2. Fazer Login

```bash
railway login
```

### 3. Conectar ao Projeto

```bash
railway link
```

Ou selecione o projeto quando solicitado.

### 4. Aplicar Migrations

```bash
railway run npx prisma migrate deploy
```

Isso vai executar o comando dentro do container do Railway com todas as variáveis de ambiente configuradas.

## 🖥️ Solução Alternativa: Via Railway Dashboard (RECOMENDADO)

### Método 1: Via Terminal do Serviço

1. Vá no Railway Dashboard
2. Selecione seu serviço **backend**
3. Vá em **"Deployments"** → clique no deployment mais recente
4. Procure por **"Shell"** ou **"Terminal"** (geralmente na parte inferior)
5. Execute:
   ```bash
   cd /usr/src/app
   npx prisma migrate deploy
   ```

### Método 2: Via Script

1. No Railway Dashboard, vá no serviço backend
2. Abra o Terminal/Shell
3. Execute:
   ```bash
   cd /usr/src/app
   sh apply-migrations.sh
   ```

### Método 3: Via Settings → Run Command

Alguns projetos Railway têm uma opção "Run Command":
1. Vá em **Settings** do serviço backend
2. Procure por **"Run Command"** ou **"Execute Command"**
3. Execute:
   ```bash
   npx prisma migrate deploy
   ```

## 🔍 Verificar se Funcionou

Após aplicar as migrations, você pode verificar se as tabelas foram criadas:

```bash
railway run npx prisma db execute --stdin <<< "SELECT tablename FROM pg_tables WHERE schemaname = 'public';"
```

Ou via Railway Dashboard, execute:
```sql
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

Você deve ver as tabelas:
- User
- Skill
- Challenge
- UserChallengeProgress
- UserSkillAssessment
- RefreshToken

## 🐛 Troubleshooting

### Erro: "DATABASE_URL not found"
**Solução:** Certifique-se de que a variável `DATABASE_URL` está configurada no Railway.

### Erro: "connection refused" ou "timeout"
**Solução:** 
1. Verifique se o serviço PostgreSQL está rodando
2. Verifique se a `DATABASE_URL` está correta
3. Tente novamente após alguns segundos

### Erro: "migration already applied"
**Solução:** Isso é normal! Significa que as migrations já foram aplicadas. Pode continuar.

## ✅ Após Aplicar Migrations

Depois de aplicar as migrations com sucesso, você pode:

1. **Popular o banco com dados iniciais (opcional):**
   ```bash
   railway run npm run seed
   ```

2. **Criar um usuário admin (opcional):**
   ```bash
   railway run npm run create:admin
   ```

3. **Testar a API:**
   ```bash
   curl -X POST https://seu-backend.railway.app/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Teste","email":"teste@teste.com","password":"123456"}'
   ```

## 🔄 Automatizar no Deploy

As migrations já estão configuradas para serem aplicadas automaticamente no entrypoint (`docker-entrypoint.sh`). Se não estiverem sendo aplicadas:

1. Verifique os logs do deployment
2. Procure por mensagens de erro relacionadas a migrations
3. Se necessário, aplique manualmente usando os métodos acima

