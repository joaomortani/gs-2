import dotenv from 'dotenv';
import * as path from 'path';
import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma';

// Carregar variáveis de ambiente apenas se não estiverem definidas (para desenvolvimento local)
// No Railway, as variáveis vêm diretamente do ambiente
if (!process.env.DATABASE_URL) {
  dotenv.config({ path: path.resolve(__dirname, '../../.env') });
}

async function createAdmin() {
  console.log('👤 Criando usuário admin...\n');

  // Verificar se DATABASE_URL está definida
  if (!process.env.DATABASE_URL) {
    console.error('❌ Erro: DATABASE_URL não está definida!');
    console.error('   Configure esta variável no Railway (Variables → New Variable)');
    console.error('   Ou crie um arquivo .env no diretório backend com DATABASE_URL');
    process.exit(1);
  }

  // Log da DATABASE_URL (mascarando a senha) para debug
  const dbUrl = process.env.DATABASE_URL;
  const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ':***@');
  console.log(`🔗 Conectando ao banco: ${maskedUrl}\n`);

  // Obter dados do admin via argumentos de linha de comando ou variáveis de ambiente
  const name = process.argv[2] || process.env.ADMIN_NAME || 'Admin';
  const email = process.argv[3] || process.env.ADMIN_EMAIL;
  const password = process.argv[4] || process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error('❌ Erro: Email e senha são obrigatórios!');
    console.log('\nUso:');
    console.log('  npm run create:admin [nome] [email] [senha]');
    console.log('\nOu defina as variáveis de ambiente:');
    console.log('  ADMIN_NAME=nome ADMIN_EMAIL=email ADMIN_PASSWORD=senha npm run create:admin');
    console.log('\nExemplo:');
    console.log('  npm run create:admin "Administrador" admin@example.com senha123');
    process.exit(1);
  }

  try {
    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      if (existingUser.role === 'admin') {
        console.log('⚠️  Usuário com este email já existe e já é admin!');
        console.log(`   Email: ${existingUser.email}`);
        console.log(`   ID: ${existingUser.id}`);
        process.exit(0);
      } else {
        // Atualizar para admin
        console.log('🔄 Usuário encontrado. Promovendo para admin...');
        const updatedUser = await prisma.user.update({
          where: { email },
          data: { role: 'admin' },
        });
        console.log('✅ Usuário promovido para admin com sucesso!');
        console.log(`   Nome: ${updatedUser.name}`);
        console.log(`   Email: ${updatedUser.email}`);
        console.log(`   ID: ${updatedUser.id}`);
        console.log(`   Role: ${updatedUser.role}`);
        process.exit(0);
      }
    }

    // Criar hash da senha
    const passwordHash = await bcrypt.hash(password, 10);

    // Criar usuário admin
    const admin = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'admin',
      },
    });

    console.log('✅ Usuário admin criado com sucesso!');
    console.log(`   Nome: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   ID: ${admin.id}`);
    console.log(`   Role: ${admin.role}`);
    console.log('\n📝 Você pode usar essas credenciais para fazer login como admin.');
  } catch (error: any) {
    console.error('❌ Erro ao criar usuário admin:\n');
    
    // Erro de conexão com o banco
    if (error.message?.includes('Can\'t reach database server') || 
        error.message?.includes('ECONNREFUSED') ||
        error.code === 'P1001') {
      console.error('   🔴 Erro de conexão com o banco de dados!');
      console.error('   \n   Possíveis causas:');
      console.error('   1. DATABASE_URL não está configurada no Railway');
      console.error('   2. O serviço backend não está linkado ao serviço PostgreSQL');
      console.error('   3. O serviço PostgreSQL não está rodando');
      console.error('   \n   Solução:');
      console.error('   1. No Railway, vá até o serviço backend');
      console.error('   2. Clique em "Variables" → "Reference Variable"');
      console.error('   3. Selecione o serviço PostgreSQL');
      console.error('   4. Selecione DATABASE_URL ou POSTGRES_URL');
      console.error('   5. Adicione como DATABASE_URL');
      console.error('   \n   Ou execute: railway variables set DATABASE_URL="<url-do-postgresql>"');
    } 
    // Erro de email duplicado
    else if (error.code === 'P2002') {
      console.error('   O email já está em uso por outro usuário.');
    }
    // Outros erros
    else {
      console.error(`   ${error.message}`);
      if (error.code) {
        console.error(`   Código: ${error.code}`);
      }
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

