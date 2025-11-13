# SkillUp - Frontend Web

Frontend web do SkillUp construído com Next.js 14, incluindo landing page e painel administrativo.

## 🚀 Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Framer Motion** - Animações
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones

## 📦 Instalação

```bash
npm install
```

## ⚙️ Configuração

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 🏃 Executando

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm start
```

O aplicativo estará disponível em `http://localhost:3001` (ou outra porta disponível).

## 📁 Estrutura

```
src/
├── app/                    # Rotas do Next.js (App Router)
│   ├── admin/              # Painel administrativo
│   │   ├── login/          # Login admin
│   │   ├── dashboard/      # Dashboard com overview
│   │   ├── skills/         # CRUD de Skills
│   │   └── users/          # Listagem de usuários
│   └── page.tsx            # Landing page
├── components/
│   ├── admin/              # Componentes do admin
│   └── landing/            # Componentes da landing page
├── config/                 # Configurações
│   └── api.ts             # Cliente Axios configurado
├── contexts/               # Contextos React
│   └── AuthContext.tsx     # Contexto de autenticação
└── lib/                    # Utilitários
    └── api-client.ts       # Funções de API
```

## 🔐 Autenticação

O sistema de autenticação usa JWT tokens armazenados em cookies. O contexto `AuthContext` gerencia o estado de autenticação e fornece funções de login/logout.

## 📄 Páginas

### Landing Page (`/`)
Landing page com todas as seções:
- Hero
- Para quem é
- Benefícios
- Como funciona
- Futuro do trabalho
- Destaque do app
- Depoimentos
- CTA final

### Admin Login (`/admin/login`)
Página de login para administradores.

### Admin Dashboard (`/admin/dashboard`)
Dashboard com visão geral:
- Total de usuários
- Skills ativas
- Desafios cadastrados
- Conclusões nos últimos 30 dias

### Admin Skills (`/admin/skills`)
Gerenciamento de Skills:
- Listar todas as skills
- Criar nova skill
- Editar skill
- Ativar/desativar skill
- Deletar skill

### Admin Challenges (`/admin/skills/:skillId/challenges`)
Gerenciamento de Desafios de uma Skill:
- Listar desafios da skill
- Criar novo desafio
- Editar desafio
- Deletar desafio
- Ordenar desafios por `orderIndex`

### Admin Users (`/admin/users`)
Listagem de usuários:
- Busca por nome ou email
- Paginação
- Visualização de dados do usuário

## 🎨 Design System

O projeto usa as mesmas cores e tipografia do mobile app:

- **Primary**: `#2D6CDF` (Azul Tech)
- **Secondary**: `#8458FF` (Roxo SoftSkill)
- **Text**: Variações de cinza para hierarquia
- **Background**: `#F5F7FA`

## 🔌 Integração com Backend

Todas as requisições são feitas através do cliente Axios configurado em `src/config/api.ts`. O cliente:
- Adiciona automaticamente o token de autenticação
- Faz refresh automático do token quando expira
- Redireciona para login em caso de erro 401

## 📝 Notas

- O backend deve estar rodando na porta 3000 (ou configurar `NEXT_PUBLIC_API_URL`)
- Apenas usuários com `role: 'admin'` podem acessar o painel administrativo
- O sistema usa cookies para armazenar tokens (accessToken e refreshToken)

