/**
 * Script para verificar e criar variáveis de ambiente faltantes
 * 
 * Executar: ts-node src/scripts/setup-env.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { randomBytes } from 'crypto';

const envPath = path.join(__dirname, '../../.env');
const envExamplePath = path.join(__dirname, '../../.env.example');

interface EnvVar {
  key: string;
  value: string;
  required: boolean;
}

const requiredVars: EnvVar[] = [
  { key: 'NODE_ENV', value: 'development', required: true },
  { key: 'PORT', value: '3000', required: true },
  { key: 'DATABASE_URL', value: 'postgres://gsuser:gspass@localhost:5432/gsdb?schema=public', required: true },
  { key: 'JWT_ACCESS_SECRET', value: randomBytes(32).toString('hex'), required: true },
  { key: 'JWT_REFRESH_SECRET', value: randomBytes(32).toString('hex'), required: true },
  { key: 'JWT_ACCESS_EXPIRES', value: '15m', required: true },
  { key: 'JWT_REFRESH_EXPIRES', value: '7d', required: true },
];

function readEnvFile(): Map<string, string> {
  const env = new Map<string, string>();
  
  if (!fs.existsSync(envPath)) {
    return env;
  }

  const content = fs.readFileSync(envPath, 'utf-8');
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        env.set(key.trim(), value);
      }
    }
  }

  return env;
}

function writeEnvFile(env: Map<string, string>): void {
  const lines: string[] = [];
  
  // Adicionar comentários do exemplo se existir
  if (fs.existsSync(envExamplePath)) {
    const exampleContent = fs.readFileSync(envExamplePath, 'utf-8');
    const exampleLines = exampleContent.split('\n');
    
    for (const line of exampleLines) {
      if (line.trim().startsWith('#')) {
        lines.push(line);
      }
    }
    lines.push('');
  }

  // Adicionar variáveis
  for (const [key, value] of env.entries()) {
    lines.push(`${key}=${value}`);
  }

  fs.writeFileSync(envPath, lines.join('\n') + '\n', 'utf-8');
}

function main() {
  console.log('🔧 Verificando variáveis de ambiente...\n');

  const env = readEnvFile();
  const missing: EnvVar[] = [];
  const updated: string[] = [];

  // Verificar variáveis obrigatórias
  for (const requiredVar of requiredVars) {
    if (!env.has(requiredVar.key) || !env.get(requiredVar.key)) {
      missing.push(requiredVar);
      env.set(requiredVar.key, requiredVar.value);
      updated.push(requiredVar.key);
    }
  }

  if (missing.length === 0) {
    console.log('✅ Todas as variáveis de ambiente estão configuradas!\n');
    return;
  }

  console.log(`⚠️  Encontradas ${missing.length} variável(is) faltante(s):\n`);
  
  for (const var_ of missing) {
    console.log(`   - ${var_.key}`);
    if (var_.key.includes('SECRET')) {
      console.log(`     Valor gerado automaticamente (${var_.value.substring(0, 20)}...)`);
    } else {
      console.log(`     Valor padrão: ${var_.value}`);
    }
  }

  console.log('\n📝 Atualizando arquivo .env...\n');
  writeEnvFile(env);
  
  console.log('✅ Arquivo .env atualizado com sucesso!\n');
  console.log('💡 Variáveis JWT_SECRET foram geradas automaticamente.');
  console.log('   Em produção, use valores seguros e únicos.\n');
}

main();

