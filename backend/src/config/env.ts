import dotenv from 'dotenv';
import { z } from 'zod';
import * as path from 'path';

// Carregar .env do diretório backend
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_ACCESS_SECRET: z.string().min(1, 'JWT_ACCESS_SECRET is required'),
  JWT_REFRESH_SECRET: z.string().min(1, 'JWT_REFRESH_SECRET is required'),
  JWT_ACCESS_EXPIRES: z.string().min(1, 'JWT_ACCESS_EXPIRES is required'),
  JWT_REFRESH_EXPIRES: z.string().min(1, 'JWT_REFRESH_EXPIRES is required'),
});

const parsedEnv = envSchema.safeParse({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES,
  JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES,
});

if (!parsedEnv.success) {
  const formattedErrors = parsedEnv.error.issues
    .map((error) => {
      const path = error.path.join('.');
      const message = error.message;
      
      // Mensagens mais amigáveis para variáveis faltando
      if (message.includes('required')) {
        return `${path}: ${message}\n   Configure esta variável no Railway (Variables → New Variable)`;
      }
      
      return `${path}: ${message}`;
    })
    .join('\n');

  console.error('\n❌ Erro de configuração de ambiente:\n');
  console.error(formattedErrors);
  console.error('\n📝 Variáveis necessárias:');
  console.error('   - DATABASE_URL (obtenha do serviço PostgreSQL no Railway)');
  console.error('   - JWT_ACCESS_SECRET (gere: node -e "console.log(require(\'crypto\').randomBytes(32).toString(\'hex\'))")');
  console.error('   - JWT_REFRESH_SECRET (gere um valor diferente)');
  console.error('   - JWT_ACCESS_EXPIRES (ex: 15m)');
  console.error('   - JWT_REFRESH_EXPIRES (ex: 7d)');
  console.error('\n📖 Veja RAILWAY_SETUP.md para mais detalhes\n');

  throw new Error(`Invalid environment configuration:\n${formattedErrors}`);
}

const env = {
  nodeEnv: parsedEnv.data.NODE_ENV,
  port: parsedEnv.data.PORT,
  databaseUrl: parsedEnv.data.DATABASE_URL,
  jwtAccessSecret: parsedEnv.data.JWT_ACCESS_SECRET,
  jwtRefreshSecret: parsedEnv.data.JWT_REFRESH_SECRET,
  jwtAccessExpiresIn: parsedEnv.data.JWT_ACCESS_EXPIRES,
  jwtRefreshExpiresIn: parsedEnv.data.JWT_REFRESH_EXPIRES,
};

export default env;
