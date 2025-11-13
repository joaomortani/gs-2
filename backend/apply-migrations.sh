#!/bin/sh
# Script para aplicar migrations no Railway
# Execute via Railway Dashboard: sh apply-migrations.sh

echo "🔄 Aplicando migrations do Prisma..."
npx prisma migrate deploy

if [ $? -eq 0 ]; then
  echo "✅ Migrations aplicadas com sucesso!"
  echo ""
  echo "📊 Verificando tabelas criadas..."
  npx prisma db execute --stdin <<< "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;" || echo "⚠️  Não foi possível listar tabelas"
else
  echo "❌ Erro ao aplicar migrations"
  exit 1
fi

