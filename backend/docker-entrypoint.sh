#!/bin/sh
set -e

echo "🚀 Iniciando entrypoint..."
echo "📂 Diretório atual: $(pwd)"
echo "📄 Verificando package.json..."

# Aguardar volumes estarem montados
sleep 3

# Verificar se estamos no diretório correto
if [ ! -f "package.json" ]; then
  echo "❌ Erro: package.json não encontrado em $(pwd)"
  ls -la
  exit 1
fi

echo "📦 Verificando node_modules..."

# Verificar se node_modules existe e é um diretório válido
if [ ! -d "node_modules" ]; then
  echo "   ⚠️  node_modules não existe - será criado"
  mkdir -p node_modules
fi

# Listar o que tem em node_modules para debug
echo "📋 Conteúdo de node_modules (primeiros 10 itens):"
ls -la node_modules 2>/dev/null | head -10 || echo "   (vazio ou inacessível)"

# Verificar dependências críticas
MISSING_DEPS=""

if [ ! -d "node_modules/zod" ]; then
  MISSING_DEPS="$MISSING_DEPS zod"
fi

if [ ! -d "node_modules/ts-node-dev" ]; then
  MISSING_DEPS="$MISSING_DEPS ts-node-dev"
fi

if [ ! -d "node_modules/@prisma/client" ]; then
  MISSING_DEPS="$MISSING_DEPS @prisma/client"
fi

if [ ! -d "node_modules/express" ]; then
  MISSING_DEPS="$MISSING_DEPS express"
fi

if [ -n "$MISSING_DEPS" ]; then
  echo "📦 Dependências faltando:$MISSING_DEPS"
  echo "📦 Instalando todas as dependências..."
  
  # Limpar cache do npm para evitar problemas
  npm cache clean --force 2>/dev/null || true
  
  # Instalar dependências
  echo "   Executando: npm install --no-audit"
  npm install --no-audit
  
  # Verificar novamente
  if [ ! -d "node_modules/zod" ]; then
    echo "   ⚠️  Zod ainda não encontrado. Instalando forçadamente..."
    npm install zod@^4.1.12 --save --no-audit --force
  fi
  
  if [ ! -d "node_modules/ts-node-dev" ]; then
    echo "   ⚠️  ts-node-dev ainda não encontrado. Instalando forçadamente..."
    npm install ts-node-dev --save-dev --no-audit --force
  fi
  
  echo "✅ Instalação concluída"
else
  echo "✅ Todas as dependências críticas estão presentes"
fi

# Verificação final
echo "🔍 Verificação final das dependências críticas:"
for dep in zod ts-node-dev @prisma/client express; do
  if [ -d "node_modules/$dep" ] || [ -d "node_modules/$(echo $dep | cut -d'/' -f2)" ]; then
    echo "   ✅ $dep encontrado"
  else
    echo "   ❌ $dep NÃO encontrado!"
    echo "   🔧 Tentando instalar $dep..."
    if [ "$dep" = "@prisma/client" ]; then
      npm install @prisma/client --save --no-audit --force
    else
      npm install "$dep" --save --no-audit --force
    fi
  fi
done

# Gerar Prisma Client - CRÍTICO: deve ser executado antes de iniciar
echo "🔧 Gerando Prisma Client..."
if ! npx prisma generate; then
  echo "❌ ERRO: Falha ao gerar Prisma Client. Abortando..."
  exit 1
fi

# Verificar se o Prisma Client foi gerado corretamente
if [ ! -d "node_modules/.prisma/client" ] && [ ! -f "node_modules/@prisma/client/index.js" ]; then
  echo "⚠️  Prisma Client não encontrado após generate. Tentando novamente..."
  npx prisma generate || {
    echo "❌ ERRO: Falha ao gerar Prisma Client na segunda tentativa. Abortando..."
    exit 1
  }
fi
echo "✅ Prisma Client gerado com sucesso"

# Fazer build do TypeScript se dist não existir
if [ ! -d "dist" ] || [ ! -f "dist/server.js" ]; then
  echo "🔨 Fazendo build do TypeScript..."
  npm run build || {
    echo "⚠️  Aviso: Erro ao fazer build do TypeScript"
  }
fi

# Verificar conexão com o banco antes de aplicar migrations
echo "🔍 Verificando conexão com o banco de dados..."
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERRO: DATABASE_URL não está definida!"
  echo "   Configure a variável de ambiente DATABASE_URL no Railway"
  exit 1
fi

# Mascarar senha para exibição
MASKED_URL=$(echo "$DATABASE_URL" | sed 's/:\([^:@]*\)@/:****@/')
echo "   DATABASE_URL: $MASKED_URL"

# Tentar conectar (com timeout)
echo "🔄 Testando conexão..."
if ! timeout 10 npx prisma db execute --stdin <<< "SELECT 1;" > /dev/null 2>&1; then
  echo "⚠️  Não foi possível testar a conexão diretamente (pode ser normal)"
  echo "   Continuando com as migrations..."
fi

# Aplicar migrations do Prisma
# O comando 'migrate deploy' aplica apenas migrations pendentes (não cria novas)
# É seguro executar múltiplas vezes e ele tem retry interno
echo "🔄 Aplicando migrations do Prisma..."
echo "   (Aguardando banco estar pronto e aplicando migrations pendentes...)"

# Tentar aplicar migrations com retry (até 3 tentativas)
MAX_RETRIES=3
RETRY_COUNT=0
MIGRATION_SUCCESS=false

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  if npx prisma migrate deploy; then
    echo "✅ Migrations aplicadas com sucesso!"
    MIGRATION_SUCCESS=true
    break
  else
    RETRY_COUNT=$((RETRY_COUNT + 1))
    if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
      echo "⚠️  Tentativa $RETRY_COUNT/$MAX_RETRIES falhou. Tentando novamente em 5 segundos..."
      sleep 5
    fi
  fi
done

if [ "$MIGRATION_SUCCESS" = false ]; then
  echo "❌ ERRO: Falha ao aplicar migrations após $MAX_RETRIES tentativas"
  echo ""
  echo "   Possíveis causas:"
  echo "   1. DATABASE_URL incorreta ou não configurada"
  echo "   2. Banco de dados não está acessível"
  echo "   3. Credenciais incorretas"
  echo "   4. Problema de rede/firewall"
  echo ""
  echo "   Para aplicar manualmente via Railway CLI:"
  echo "   railway run npx prisma migrate deploy"
  echo ""
  echo "   Ou via Railway Dashboard:"
  echo "   1. Vá em Deployments → seu deployment → Settings"
  echo "   2. Execute: npx prisma migrate deploy"
  exit 1
fi

echo "✅ Entrypoint concluído. Iniciando aplicação..."
exec "$@"

