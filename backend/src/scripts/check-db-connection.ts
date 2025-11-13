/**
 * Script para verificar conexão com o banco de dados
 * Executar: ts-node src/scripts/check-db-connection.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkConnection() {
  console.log('🔍 Verificando conexão com o banco de dados...\n');

  // Mostrar DATABASE_URL (sem senha)
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('❌ DATABASE_URL não está definida!');
    process.exit(1);
  }

  // Mascarar senha na URL para exibição
  const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ':****@');
  console.log(`📋 DATABASE_URL: ${maskedUrl}\n`);

  try {
    console.log('🔄 Tentando conectar...');
    await prisma.$connect();
    console.log('✅ Conexão estabelecida com sucesso!\n');

    // Testar uma query simples
    console.log('🔄 Testando query...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Query executada com sucesso!');
    console.log(`📊 Resultado: ${JSON.stringify(result)}\n`);

    // Verificar se há tabelas
    console.log('🔄 Verificando tabelas...');
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
    `;
    console.log(`✅ Encontradas ${tables.length} tabelas:`);
    tables.forEach((table) => {
      console.log(`   - ${table.tablename}`);
    });

    console.log('\n✅ Tudo funcionando corretamente!');
  } catch (error: any) {
    console.error('\n❌ Erro ao conectar com o banco de dados:');
    console.error(`   Tipo: ${error.constructor.name}`);
    console.error(`   Mensagem: ${error.message}`);
    
    if (error.code) {
      console.error(`   Código: ${error.code}`);
    }

    // Erros comuns e soluções
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\n💡 Possíveis causas:');
      console.error('   - O banco de dados não está rodando');
      console.error('   - Host ou porta incorretos na DATABASE_URL');
    } else if (error.message.includes('authentication failed')) {
      console.error('\n💡 Possíveis causas:');
      console.error('   - Usuário ou senha incorretos');
      console.error('   - Verifique as credenciais na DATABASE_URL');
    } else if (error.message.includes('does not exist')) {
      console.error('\n💡 Possíveis causas:');
      console.error('   - O banco de dados não existe');
      console.error('   - Nome do banco incorreto na DATABASE_URL');
    } else if (error.message.includes('timeout')) {
      console.error('\n💡 Possíveis causas:');
      console.error('   - O banco de dados não está acessível');
      console.error('   - Firewall bloqueando a conexão');
      console.error('   - Host incorreto na DATABASE_URL');
    }

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkConnection();

