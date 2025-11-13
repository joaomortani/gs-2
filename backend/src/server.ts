import { app } from "./app";
import env from "./config/env";

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