import dotenv from 'dotenv';
import * as path from 'path';
import bcrypt from 'bcrypt';
import { prisma } from '../config/prisma';

// Carregar variáveis de ambiente
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function createAdmin() {
  console.log('👤 Criando usuário admin...\n');

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
    console.error('❌ Erro ao criar usuário admin:', error.message);
    
    if (error.code === 'P2002') {
      console.error('   O email já está em uso por outro usuário.');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();

