/**
 * Script para garantir que as migrations foram aplicadas
 * Executado antes do servidor iniciar
 */

import { execSync } from 'child_process';

console.log('🔄 Verificando se as migrations foram aplicadas...');

try {
  // Tentar aplicar migrations
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: process.env,
  });
  console.log('✅ Migrations verificadas/aplicadas com sucesso!');
} catch (error: any) {
  console.error('❌ ERRO ao aplicar migrations:', error.message);
  console.error('\n💡 Verifique:');
  console.error('   1. Se DATABASE_URL está configurada corretamente');
  console.error('   2. Se o banco de dados está acessível');
  console.error('   3. Se as credenciais estão corretas');
  process.exit(1);
}

