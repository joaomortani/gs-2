/**
 * Script de teste do backend - Valida fluxos e regras
 * 
 * Executar: npm run test:backend
 * ou: ts-node src/scripts/test-backend.ts
 * 
 * IMPORTANTE:
 * - O servidor deve estar rodando antes de executar os testes
 * - O script detecta automaticamente se está rodando via docker-compose (porta 3333) 
 *   ou localmente (porta 3000)
 * - Você pode forçar uma URL específica: API_URL=http://localhost:3333 npm run test:backend
 * 
 * O script testa:
 * - Auth: Register, Login, Profile
 * - Skills: CRUD, paginação, validações, soft delete
 * - Challenges: CRUD, validações, orderIndex único
 * - Progress: Complete, Reopen, agregação, histórico
 * - Admin: Overview (requer usuário admin)
 * - Users: Listagem, busca, autorização
 * - Validações: Campos obrigatórios, limites, tipos
 */

import { PrismaClient } from '@prisma/client';

// Portas possíveis: docker-compose (3333) ou local (3000)
const POSSIBLE_PORTS = [3333, 3000];
const DEFAULT_PORT = 3000;

let BASE_URL = process.env.API_URL;
let API_BASE = '';

// Prisma client para atualizar roles de usuários nos testes
// Usa a mesma DATABASE_URL do ambiente (já configurada no docker-compose)
const prisma = new PrismaClient();

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
  details?: any;
}

const results: TestResult[] = [];

// Helper para fazer requisições
async function request(
  method: string,
  path: string,
  body?: any,
  token?: string,
): Promise<{ status: number; data: any }> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();
  return { status: response.status, data };
}

// Helper para testar - agora retorna uma Promise
async function test(name: string, fn: () => Promise<void>): Promise<void> {
  results.push({ name, passed: false });
  const result = results[results.length - 1];

  try {
    await fn();
    result.passed = true;
    console.log(`✅ ${name}`);
  } catch (error: any) {
    result.passed = false;
    result.error = error.message;
    result.details = error;
    console.error(`❌ ${name}: ${error.message}`);
  }
}

// Variáveis globais para armazenar dados entre testes
let adminToken = '';
let userToken = '';
let adminId = '';
let userId = '';
let skillId1 = '';
let skillId2 = '';
let challengeId1 = '';
let challengeId2 = '';

async function checkServer(url: string): Promise<boolean> {
  try {
    const response = await fetch(`${url}/api/health`);
    return response.ok;
  } catch (error) {
    return false;
  }
}

async function detectServerUrl(): Promise<string> {
  // Se API_URL foi definido, usar diretamente
  if (BASE_URL) {
    const isRunning = await checkServer(BASE_URL);
    if (isRunning) {
      return BASE_URL;
    }
    console.warn(`⚠️  API_URL definido (${BASE_URL}) mas servidor não está respondendo`);
  }

  // Tentar detectar automaticamente testando portas comuns
  console.log('🔍 Detectando servidor...');
  
  for (const port of POSSIBLE_PORTS) {
    const url = `http://localhost:${port}`;
    const isRunning = await checkServer(url);
    
    if (isRunning) {
      console.log(`✅ Servidor encontrado em ${url}`);
      return url;
    }
  }

  // Se nenhuma porta funcionou, usar padrão
  return `http://localhost:${DEFAULT_PORT}`;
}

async function runTests() {
  console.log('🧪 Iniciando testes do backend...\n');

  // Detectar URL do servidor
  BASE_URL = await detectServerUrl();
  API_BASE = `${BASE_URL}/api`;
  
  console.log(`📍 Base URL: ${API_BASE}\n`);

  // Verificar se o servidor está rodando
  console.log('🔍 Verificando se o servidor está respondendo...');
  const serverRunning = await checkServer(BASE_URL);
  if (!serverRunning) {
    console.error('❌ Servidor não está respondendo!');
    console.error('');
    console.error('   Possíveis soluções:');
    console.error('   1. Inicie o servidor localmente: npm run dev');
    console.error('   2. Ou via docker-compose: docker-compose up');
    console.error('   3. Ou defina API_URL manualmente: API_URL=http://localhost:3333 npm run test:backend');
    console.error('');
    console.error(`   Tentou as seguintes URLs:`);
    for (const port of POSSIBLE_PORTS) {
      console.error(`     - http://localhost:${port}/api/health`);
    }
    process.exit(1);
  }
  console.log('✅ Servidor está respondendo\n');

  // ============================================
  // 1. AUTH - Register e Login
  // ============================================
  console.log('📋 1. Testando Auth (Register/Login)...\n');

  await test('Register admin user', async () => {
    const { status, data } = await request('POST', '/auth/register', {
      name: 'Admin Test',
      email: `admin-${Date.now()}@test.com`,
      password: 'admin123',
    });

    if (status !== 200 && status !== 201) {
      throw new Error(`Expected 200/201, got ${status}: ${JSON.stringify(data)}`);
    }

    adminId = data.data.id;
  });

  await test('Register regular user', async () => {
    const { status, data } = await request('POST', '/auth/register', {
      name: 'User Test',
      email: `user-${Date.now()}@test.com`,
      password: 'user123',
    });

    if (status !== 200 && status !== 201) {
      throw new Error(`Expected 200/201, got ${status}: ${JSON.stringify(data)}`);
    }

    userId = data.data.id;
  });

  await test('Login admin user', async () => {
    // Criar admin primeiro (precisa atualizar role manualmente no banco ou criar endpoint)
    // Por enquanto, vamos criar um usuário e fazer login
    const registerRes = await request('POST', '/auth/register', {
      name: 'Admin Login',
      email: `admin-login-${Date.now()}@test.com`,
      password: 'admin123',
    });

    if (registerRes.status !== 200 && registerRes.status !== 201) {
      throw new Error(`Failed to register admin: ${registerRes.status}`);
    }

    const loginRes = await request('POST', '/auth/login', {
      email: registerRes.data.data.email,
      password: 'admin123',
    });

    if (loginRes.status !== 200) {
      throw new Error(`Expected 200, got ${loginRes.status}: ${JSON.stringify(loginRes.data)}`);
    }

    if (!loginRes.data.data.accessToken) {
      throw new Error('Missing accessToken in response');
    }

    adminToken = loginRes.data.data.accessToken;
    adminId = loginRes.data.data.user.id;
    
    // Promover usuário a admin diretamente no banco
    // O Prisma usa a DATABASE_URL do ambiente automaticamente
    await prisma.user.update({
      where: { id: adminId },
      data: { role: 'admin' },
    });
  });

  await test('Login regular user', async () => {
    const registerRes = await request('POST', '/auth/register', {
      name: 'User Login',
      email: `user-login-${Date.now()}@test.com`,
      password: 'user123',
    });

    const loginRes = await request('POST', '/auth/login', {
      email: registerRes.data.data.email,
      password: 'user123',
    });

    if (loginRes.status !== 200) {
      throw new Error(`Expected 200, got ${loginRes.status}: ${JSON.stringify(loginRes.data)}`);
    }

    if (!loginRes.data.data.accessToken) {
      throw new Error('Missing accessToken in response');
    }

    userToken = loginRes.data.data.accessToken;
    userId = loginRes.data.data.user.id;
  });

  await test('Get user profile (me)', async () => {
    if (!userToken) throw new Error('User token not available');

    const { status, data } = await request('GET', '/auth/me', undefined, userToken);

    if (status !== 200) {
      throw new Error(`Expected 200, got ${status}: ${JSON.stringify(data)}`);
    }

    if (!data.data.id || !data.data.email) {
      throw new Error('Invalid user profile data');
    }
  });

  // ============================================
  // 2. SKILLS - CRUD
  // ============================================
  console.log('\n📋 2. Testando Skills (CRUD)...\n');

  await test('List skills (public, sem auth)', async () => {
    const { status, data } = await request('GET', '/skills?isActive=true&page=1&limit=50');

    if (status !== 200) {
      throw new Error(`Expected 200, got ${status}: ${JSON.stringify(data)}`);
    }

    if (!data.data.items || !Array.isArray(data.data.items)) {
      throw new Error('Invalid response structure');
    }

    if (typeof data.data.page !== 'number' || typeof data.data.total !== 'number') {
      throw new Error('Invalid pagination data');
    }
  });

  await test('List skills com paginação', async () => {
    const { status, data } = await request('GET', '/skills?page=1&limit=10');

    if (status !== 200) {
      throw new Error(`Expected 200, got ${status}`);
    }

    if (data.data.items.length > 10) {
      throw new Error('Limit not working');
    }
  });

  await test('Create skill (admin only)', async () => {
    if (!adminToken) throw new Error('Admin token not available');

    const { status, data } = await request(
      'POST',
      '/skills',
      {
        name: `Test Skill ${Date.now()}`,
        description: 'Test description',
        isActive: true,
      },
      adminToken,
    );

    if (status !== 201) {
      throw new Error(`Expected 201, got ${status}: ${JSON.stringify(data)}`);
    }

    if (!data.data.id || !data.data.name) {
      throw new Error('Invalid skill data');
    }

    skillId1 = data.data.id;
  });

  await test('Create skill sem auth (deve falhar)', async () => {
    const { status } = await request('POST', '/skills', {
      name: 'Unauthorized Skill',
      description: 'Test',
    });

    if (status !== 401) {
      throw new Error(`Expected 401, got ${status}`);
    }
  });

  await test('Create skill como user (deve falhar)', async () => {
    if (!userToken) throw new Error('User token not available');

    const { status } = await request(
      'POST',
      '/skills',
      {
        name: 'User Skill',
        description: 'Test',
      },
      userToken,
    );

    if (status !== 403) {
      throw new Error(`Expected 403, got ${status}`);
    }
  });

  await test('Get skill by id', async () => {
    if (!skillId1) throw new Error('Skill ID not available');

    const { status, data } = await request('GET', `/skills/${skillId1}`);

    if (status !== 200) {
      throw new Error(`Expected 200, got ${status}: ${JSON.stringify(data)}`);
    }

    if (data.data.id !== skillId1) {
      throw new Error('Skill ID mismatch');
    }
  });

  await test('Update skill (admin only)', async () => {
    if (!adminToken || !skillId1) throw new Error('Admin token or skill ID not available');

    // Usar nome único para evitar conflito com skills de execuções anteriores
    const uniqueName = `Updated Skill ${Date.now()}`;
    
    const { status, data } = await request(
      'PUT',
      `/skills/${skillId1}`,
      {
        name: uniqueName,
        description: 'Updated description',
      },
      adminToken,
    );

    if (status !== 200) {
      throw new Error(`Expected 200, got ${status}: ${JSON.stringify(data)}`);
    }

    if (data.data.name !== uniqueName) {
      throw new Error('Skill not updated');
    }
  });

  await test('Create skill com nome duplicado (deve falhar)', async () => {
    if (!adminToken) throw new Error('Admin token not available');

    // Criar primeira skill
    const create1 = await request(
      'POST',
      '/skills',
      {
        name: `Duplicate Test ${Date.now()}`,
        description: 'Test',
      },
      adminToken,
    );

    if (create1.status !== 201) {
      throw new Error('Failed to create first skill');
    }

    const skillName = create1.data.data.name;

    // Tentar criar outra com mesmo nome
    const create2 = await request(
      'POST',
      '/skills',
      {
        name: skillName,
        description: 'Test',
      },
      adminToken,
    );

    if (create2.status !== 409) {
      throw new Error(`Expected 409 CONFLICT, got ${create2.status}`);
    }
  });

  await test('Soft delete skill (admin only)', async () => {
    if (!adminToken) throw new Error('Admin token not available');

    // Criar skill para deletar
    const create = await request(
      'POST',
      '/skills',
      {
        name: `To Delete ${Date.now()}`,
        description: 'Test',
      },
      adminToken,
    );

    if (create.status !== 201) {
      throw new Error('Failed to create skill for deletion');
    }

    const deleteId = create.data.data.id;

    // Soft delete
    const { status } = await request('DELETE', `/skills/${deleteId}`, undefined, adminToken);

    if (status !== 200) {
      throw new Error(`Expected 200, got ${status}`);
    }

    // Verificar que ainda existe mas está inativa
    const get = await request('GET', `/skills/${deleteId}`);
    if (get.status !== 200) {
      throw new Error('Skill should still exist after soft delete');
    }

    if (get.data.data.isActive !== false) {
      throw new Error('Skill should be inactive after soft delete');
    }
  });

  // ============================================
  // 3. CHALLENGES - CRUD
  // ============================================
  console.log('\n📋 3. Testando Challenges (CRUD)...\n');

  await test('Create challenge (admin only)', async () => {
    if (!adminToken || !skillId1) throw new Error('Admin token or skill ID not available');

    const { status, data } = await request(
      'POST',
      `/skills/${skillId1}/challenges`,
      {
        title: 'Test Challenge',
        description: 'Test description',
        orderIndex: 1,
      },
      adminToken,
    );

    if (status !== 201) {
      throw new Error(`Expected 201, got ${status}: ${JSON.stringify(data)}`);
    }

    if (!data.data.id || !data.data.title) {
      throw new Error('Invalid challenge data');
    }

    challengeId1 = data.data.id;
  });

  await test('Create challenge com orderIndex duplicado (deve falhar)', async () => {
    if (!adminToken || !skillId1) throw new Error('Admin token or skill ID not available');

    // Tentar criar outro challenge com mesmo orderIndex
    const { status } = await request(
      'POST',
      `/skills/${skillId1}/challenges`,
      {
        title: 'Duplicate Order Challenge',
        description: 'Test',
        orderIndex: 1, // Mesmo orderIndex
      },
      adminToken,
    );

    if (status !== 409) {
      throw new Error(`Expected 409 CONFLICT, got ${status}`);
    }
  });

  await test('List challenges by skill', async () => {
    if (!skillId1) throw new Error('Skill ID not available');

    const { status, data } = await request('GET', `/skills/${skillId1}/challenges?page=1&limit=50`);

    if (status !== 200) {
      throw new Error(`Expected 200, got ${status}: ${JSON.stringify(data)}`);
    }

    if (!data.data.items || !Array.isArray(data.data.items)) {
      throw new Error('Invalid response structure');
    }

    // Verificar ordenação por orderIndex
    if (data.data.items.length > 1) {
      for (let i = 1; i < data.data.items.length; i++) {
        if (data.data.items[i].orderIndex < data.data.items[i - 1].orderIndex) {
          throw new Error('Challenges not sorted by orderIndex');
        }
      }
    }
  });

  await test('Get challenge by id', async () => {
    if (!challengeId1) throw new Error('Challenge ID not available');

    const { status, data } = await request('GET', `/challenges/${challengeId1}`);

    if (status !== 200) {
      throw new Error(`Expected 200, got ${status}: ${JSON.stringify(data)}`);
    }

    if (data.data.id !== challengeId1) {
      throw new Error('Challenge ID mismatch');
    }
  });

  await test('Update challenge (admin only)', async () => {
    if (!adminToken || !challengeId1) throw new Error('Admin token or challenge ID not available');

    const { status, data } = await request(
      'PUT',
      `/challenges/${challengeId1}`,
      {
        title: 'Updated Challenge Title',
        description: 'Updated description',
      },
      adminToken,
    );

    if (status !== 200) {
      throw new Error(`Expected 200, got ${status}: ${JSON.stringify(data)}`);
    }

    if (data.data.title !== 'Updated Challenge Title') {
      throw new Error('Challenge not updated');
    }
  });

  await test('Create challenge em skill inativa (deve falhar)', async () => {
    if (!adminToken) throw new Error('Admin token not available');

    // Criar skill inativa
    const createSkill = await request(
      'POST',
      '/skills',
      {
        name: `Inactive Skill ${Date.now()}`,
        description: 'Test',
        isActive: false,
      },
      adminToken,
    );

    if (createSkill.status !== 201) {
      throw new Error('Failed to create inactive skill');
    }

    const inactiveSkillId = createSkill.data.data.id;

    // Tentar criar challenge
    const { status } = await request(
      'POST',
      `/skills/${inactiveSkillId}/challenges`,
      {
        title: 'Challenge in Inactive Skill',
        description: 'Test',
        orderIndex: 1,
      },
      adminToken,
    );

    if (status !== 404) {
      throw new Error(`Expected 404, got ${status}`);
    }
  });

  // ============================================
  // 4. PROGRESS - User Progress
  // ============================================
  console.log('\n📋 4. Testando Progress...\n');

  await test('Complete challenge (user)', async () => {
    if (!userToken || !challengeId1) throw new Error('User token or challenge ID not available');

    const { status, data } = await request(
      'POST',
      `/challenges/${challengeId1}/complete`,
      { status: 'done' },
      userToken,
    );

    if (status !== 200) {
      throw new Error(`Expected 200, got ${status}: ${JSON.stringify(data)}`);
    }

    if (data.data.status !== 'done') {
      throw new Error('Challenge not marked as done');
    }

    if (!data.data.doneAt) {
      throw new Error('doneAt not set');
    }
  });

  await test('Complete challenge idempotente (deve retornar existente)', async () => {
    if (!userToken || !challengeId1) throw new Error('User token or challenge ID not available');

    // Completar novamente
    const { status, data } = await request(
      'POST',
      `/challenges/${challengeId1}/complete`,
      { status: 'done' },
      userToken,
    );

    if (status !== 200) {
      throw new Error(`Expected 200, got ${status}: ${JSON.stringify(data)}`);
    }

    // Deve retornar o mesmo registro
    if (data.data.status !== 'done') {
      throw new Error('Challenge should remain done');
    }
  });

  await test('Get user progress', async () => {
    if (!userToken) throw new Error('User token not available');

    const { status, data } = await request('GET', '/me/progress', undefined, userToken);

    if (status !== 200) {
      throw new Error(`Expected 200, got ${status}: ${JSON.stringify(data)}`);
    }

    if (!data.data.skills || !Array.isArray(data.data.skills)) {
      throw new Error('Invalid progress structure');
    }

    // Verificar estrutura de cada skill
    for (const skill of data.data.skills) {
      if (
        !skill.skillId ||
        !skill.skillName ||
        typeof skill.totalChallenges !== 'number' ||
        typeof skill.completedChallenges !== 'number' ||
        typeof skill.progressPercent !== 'number'
      ) {
        throw new Error('Invalid skill progress structure');
      }

      if (skill.progressPercent < 0 || skill.progressPercent > 100) {
        throw new Error('Invalid progress percent');
      }
    }
  });

  await test('Reopen challenge (user)', async () => {
    if (!userToken || !challengeId1) throw new Error('User token or challenge ID not available');

    const { status } = await request(
      'DELETE',
      `/challenges/${challengeId1}/complete`,
      undefined,
      userToken,
    );

    if (status !== 200) {
      throw new Error(`Expected 200, got ${status}`);
    }
  });

  await test('Get history', async () => {
    if (!userToken) throw new Error('User token not available');

    const { status, data } = await request('GET', '/me/history?limit=20', undefined, userToken);

    if (status !== 200) {
      throw new Error(`Expected 200, got ${status}: ${JSON.stringify(data)}`);
    }

    if (!data.data.items || !Array.isArray(data.data.items)) {
      throw new Error('Invalid history structure');
    }
  });

  // ============================================
  // 5. ADMIN - Overview
  // ============================================
  console.log('\n📋 5. Testando Admin...\n');

  await test('Get admin overview (admin only)', async () => {
    if (!adminToken) throw new Error('Admin token not available');

    const { status, data } = await request('GET', '/admin/overview', undefined, adminToken);

    if (status !== 200) {
      throw new Error(`Expected 200, got ${status}: ${JSON.stringify(data)}`);
    }

    if (
      typeof data.data.users !== 'number' ||
      typeof data.data.skills !== 'number' ||
      typeof data.data.challenges !== 'number' ||
      typeof data.data.completionsLast30d !== 'number'
    ) {
      throw new Error('Invalid overview structure');
    }
  });

  await test('Get admin overview como user (deve falhar)', async () => {
    if (!userToken) throw new Error('User token not available');

    const { status } = await request('GET', '/admin/overview', undefined, userToken);

    if (status !== 403) {
      throw new Error(`Expected 403 FORBIDDEN, got ${status}`);
    }
  });

  // ============================================
  // 6. USERS - Listagem
  // ============================================
  console.log('\n📋 6. Testando Users...\n');

  await test('List users (admin only)', async () => {
    if (!adminToken) throw new Error('Admin token not available');

    const { status, data } = await request('GET', '/users?page=1&limit=20', undefined, adminToken);

    if (status !== 200) {
      throw new Error(`Expected 200, got ${status}: ${JSON.stringify(data)}`);
    }

    if (!data.data.items || !Array.isArray(data.data.items)) {
      throw new Error('Invalid users list structure');
    }
  });

  await test('List users com busca', async () => {
    if (!adminToken) throw new Error('Admin token not available');

    const { status, data } = await request(
      'GET',
      '/users?search=test&page=1&limit=20',
      undefined,
      adminToken,
    );

    if (status !== 200) {
      throw new Error(`Expected 200, got ${status}: ${JSON.stringify(data)}`);
    }
  });

  await test('Get user by id (próprio usuário)', async () => {
    if (!userToken || !userId) throw new Error('User token or user ID not available');

    const { status, data } = await request('GET', `/users/${userId}`, undefined, userToken);

    if (status !== 200) {
      throw new Error(`Expected 200, got ${status}: ${JSON.stringify(data)}`);
    }

    if (data.data.id !== userId) {
      throw new Error('User ID mismatch');
    }
  });

  await test('Get user by id como outro user (deve falhar)', async () => {
    if (!userToken || !adminId) throw new Error('Tokens not available');

    // Criar outro user
    const registerRes = await request('POST', '/auth/register', {
      name: 'Other User',
      email: `other-${Date.now()}@test.com`,
      password: 'other123',
    });

    const otherUserId = registerRes.data.data.id;

    // Tentar acessar outro user
    const { status } = await request('GET', `/users/${otherUserId}`, undefined, userToken);

    if (status !== 403) {
      throw new Error(`Expected 403 FORBIDDEN, got ${status}`);
    }
  });

  // ============================================
  // 7. VALIDAÇÕES
  // ============================================
  console.log('\n📋 7. Testando Validações...\n');

  await test('Create skill com nome muito curto (deve falhar)', async () => {
    if (!adminToken) throw new Error('Admin token not available');

    const { status } = await request(
      'POST',
      '/skills',
      {
        name: 'A', // Muito curto (< 2)
        description: 'Test',
      },
      adminToken,
    );

    if (status !== 400) {
      throw new Error(`Expected 400 VALIDATION_ERROR, got ${status}`);
    }
  });

  await test('Create skill com descrição muito longa (deve falhar)', async () => {
    if (!adminToken) throw new Error('Admin token not available');

    const { status } = await request(
      'POST',
      '/skills',
      {
        name: 'Valid Name',
        description: 'A'.repeat(1001), // Muito longo (> 1000)
      },
      adminToken,
    );

    if (status !== 400) {
      throw new Error(`Expected 400 VALIDATION_ERROR, got ${status}`);
    }
  });

  await test('Create challenge com orderIndex inválido (deve falhar)', async () => {
    if (!adminToken || !skillId1) throw new Error('Admin token or skill ID not available');

    const { status } = await request(
      'POST',
      `/skills/${skillId1}/challenges`,
      {
        title: 'Test',
        description: 'Test',
        orderIndex: 0, // Inválido (< 1)
      },
      adminToken,
    );

    if (status !== 400) {
      throw new Error(`Expected 400 VALIDATION_ERROR, got ${status}`);
    }
  });

  await test('Get skill inexistente (deve retornar 404)', async () => {
    const { status } = await request('GET', '/skills/invalid-id-12345');

    if (status !== 404) {
      throw new Error(`Expected 404 NOT_FOUND, got ${status}`);
    }
  });

  // ============================================
  // Resumo
  // ============================================
  console.log('\n📊 Resumo dos Testes:\n');

  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  const total = results.length;

  console.log(`✅ Passou: ${passed}`);
  console.log(`❌ Falhou: ${failed}`);
  console.log(`📝 Total: ${total}\n`);

  if (failed > 0) {
    console.log('❌ Testes que falharam:\n');
    results
      .filter((r) => !r.passed)
      .forEach((r) => {
        console.log(`  - ${r.name}`);
        if (r.error) {
          console.log(`    Erro: ${r.error}`);
        }
      });
    console.log('');
    process.exit(1);
  } else {
    console.log('🎉 Todos os testes passaram!\n');
    process.exit(0);
  }
}

// Executar testes
runTests()
  .catch((error) => {
    console.error('💥 Erro fatal nos testes:', error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });

