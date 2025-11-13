# Guia de Testes do Backend

## Executar Testes

```bash
# 1. Certifique-se de que o servidor está rodando
# Opção A: Localmente
npm run dev

# Opção B: Via docker-compose
docker-compose up

# 2. Em outro terminal, execute os testes
npm run test:backend
```

**Detecção Automática**: O script detecta automaticamente se o servidor está rodando:
- Via docker-compose na porta **3333**
- Localmente na porta **3000**

Você também pode forçar uma URL específica:
```bash
API_URL=http://localhost:3333 npm run test:backend
```

## Pré-requisitos

1. **Servidor rodando**: O servidor deve estar ativo na porta configurada (padrão: 3000)
2. **Banco de dados**: O banco deve estar configurado e acessível
3. **Usuário Admin** (opcional, para testes completos de admin):
   - Crie um usuário via registro
   - Atualize o role no banco: `UPDATE "User" SET role='admin' WHERE email='seu-email@test.com';`

## O que é testado

### 1. Autenticação (Auth)
- ✅ Registro de usuários
- ✅ Login e obtenção de token
- ✅ Obter perfil do usuário (me)
- ✅ Validação de credenciais

### 2. Skills
- ✅ Listagem pública (sem auth)
- ✅ Paginação
- ✅ Criação (admin only)
- ✅ Autorização (401 sem token, 403 para user)
- ✅ Buscar por ID
- ✅ Atualização (admin only)
- ✅ Soft delete (admin only)
- ✅ Validação de nome único (409 CONFLICT)
- ✅ Validações de entrada (nome 2-80, descrição ≤1000)

### 3. Challenges
- ✅ Criação (admin only)
- ✅ Validação de orderIndex único por skill (409 CONFLICT)
- ✅ Listagem por skill com ordenação
- ✅ Buscar por ID
- ✅ Atualização (admin only)
- ✅ Validação de skill ativa
- ✅ Validações de entrada (title 2-120, orderIndex ≥1)

### 4. Progress
- ✅ Completar challenge (user)
- ✅ Idempotência (completar novamente retorna existente)
- ✅ Agregação de progresso por skill
- ✅ Cálculo de percentuais corretos
- ✅ Reabrir challenge
- ✅ Histórico recente

### 5. Admin
- ✅ Overview com métricas (admin only)
- ✅ Autorização (403 para user)

### 6. Users
- ✅ Listagem (admin only)
- ✅ Busca por nome/email
- ✅ Buscar próprio perfil (user pode ver seu próprio perfil)
- ✅ Autorização (403 para acessar outro usuário)

### 7. Validações
- ✅ Campos obrigatórios
- ✅ Limites de tamanho (nome, title, description)
- ✅ Tipos de dados (orderIndex inteiro)
- ✅ Recursos inexistentes (404)

## Estrutura dos Testes

Os testes são executados sequencialmente e compartilham estado:
- Tokens de autenticação são reutilizados
- IDs criados são usados em testes subsequentes
- Cada teste é independente mas pode depender de dados criados anteriormente

## Interpretando Resultados

```
✅ Passou: X
❌ Falhou: Y
📝 Total: Z
```

- **Passou**: Teste executado com sucesso
- **Falhou**: Teste falhou - verifique a mensagem de erro
- **Total**: Número total de testes executados

## Troubleshooting

### Servidor não está rodando
```
❌ Servidor não está rodando!
   Por favor, inicie o servidor com: npm run dev
```
**Solução**: Inicie o servidor em outro terminal

### Erro 401/403 em testes de admin
**Causa**: Usuário não tem role='admin'
**Solução**: Atualize o role no banco de dados

### Erro de conexão
**Causa**: URL do servidor incorreta ou servidor em porta diferente
**Solução**: 
- O script tenta automaticamente as portas 3333 (docker-compose) e 3000 (local)
- Se necessário, configure `API_URL` manualmente: `API_URL=http://localhost:3333 npm run test:backend`
- Verifique se o servidor está realmente rodando: `curl http://localhost:3333/api/health`

### Testes falhando por dados existentes
**Causa**: Dados de testes anteriores ainda no banco
**Solução**: Limpe o banco ou use emails únicos (o script já usa timestamps)

## Personalização

Você pode configurar a URL base do servidor:

```bash
API_URL=http://localhost:3333 npm run test:backend
```

Ou edite a constante `BASE_URL` no arquivo `src/scripts/test-backend.ts`.

