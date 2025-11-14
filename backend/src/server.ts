import { app } from "./app";
import env from "./config/env";
import { execSync } from "child_process";

// GARANTIR QUE MIGRATIONS FORAM APLICADAS ANTES DE INICIAR
console.log('🔄 Aplicando migrations antes de iniciar servidor...');
try {
  execSync('npx prisma migrate deploy', { 
    stdio: 'inherit',
    env: process.env,
    cwd: process.cwd(),
  });
  console.log('✅ Migrations aplicadas com sucesso!');
} catch (error: any) {
  console.error('❌ ERRO CRÍTICO: Falha ao aplicar migrations!');
  console.error('   O servidor não pode iniciar sem as migrations aplicadas.');
  console.error('   Erro:', error.message);
  process.exit(1);
}

const port = Number(env.port);

// Garantir que os logs apareçam no Docker
process.stdout.write(`🚀 Iniciando servidor na porta ${port}...\n`);

app.listen(port, () => {
  console.log(`✅ HTTP server running on port ${port}`);
  console.log(`🌐 Environment: ${env.nodeEnv}`);
  // Forçar flush do output
  if (process.stdout.isTTY === false) {
    process.stdout.write('');
  }
});