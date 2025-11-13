# SkillUp Mobile

Aplicativo mobile desenvolvido com React Native e Expo para desenvolvimento de habilidades profissionais.

## 🚀 Tecnologias

- **React Native** - Framework mobile
- **Expo** - Plataforma de desenvolvimento
- **TypeScript** - Tipagem estática
- **React Navigation** - Navegação
- **Context API** - Gerenciamento de estado
- **Axios** - Cliente HTTP

## 📋 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Expo CLI (`npm install -g expo-cli`)
- Backend rodando na porta 3333

## 🛠️ Instalação

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` e configure:
```
EXPO_PUBLIC_API_URL=http://localhost:3333/api
```

Para dispositivos físicos, use o IP da sua máquina:
```
EXPO_PUBLIC_API_URL=http://192.168.1.X:3333/api
```

## 🏃 Executando

```bash
# Iniciar o servidor de desenvolvimento
npm start

# Executar no iOS
npm run ios

# Executar no Android
npm run android
```

## 📱 Estrutura do Projeto

```
mobile/
├── src/
│   ├── components/       # Componentes reutilizáveis
│   ├── contexts/         # Context API para estado global
│   ├── modules/          # Módulos de negócio (skills, challenges, progress, auth)
│   │   ├── skills/
│   │   ├── challenges/
│   │   ├── progress/
│   │   └── auth/
│   ├── navigation/       # Configuração de navegação
│   ├── screens/          # Telas do aplicativo
│   ├── theme/            # Tema (cores, tipografia, espaçamentos)
│   ├── types/            # Tipos TypeScript
│   └── config/           # Configurações (API, storage)
├── App.tsx               # Componente raiz
└── index.js              # Ponto de entrada
```

## 🎨 Design System

### Cores

- **Primária**: `#2D6CDF` (Azul Tech)
- **Secundária**: `#8458FF` (Roxo SoftSkill)
- **Neutros**: Branco, cinzas para textos e bordas
- **Estados**: Verde (sucesso), Laranja (atenção)

### Tipografia

- **Fonte**: Inter (já incluída no React Native)
- **Hierarquia**: H1 (32px), H2 (24px), H3 (20px), Body (16px), Small (14px), Caption (12px)

### Espaçamento

Grid de 8px: 4, 8, 12, 16, 24, 32

## 📱 Telas

### Home
Lista todas as skills disponíveis com progresso.

### Skill Detail
Mostra os desafios de uma skill específica com opção de marcar como concluído.

### Progresso
Visualização geral do progresso em todas as skills.

### Perfil
Informações do usuário e opção de logout.

## 🔐 Autenticação

O app utiliza SecureStore do Expo para armazenar tokens de forma segura. A autenticação é gerenciada através do `AuthContext`.

## 📦 Módulos

Cada módulo segue o padrão do backend:
- **Repository**: Chamadas à API
- **Service**: Lógica de negócio
- **Context**: Estado global (quando necessário)

## 🧪 Desenvolvimento

Para desenvolvimento, certifique-se de que:
1. O backend está rodando
2. A URL da API está configurada corretamente
3. Você tem um usuário cadastrado no backend

## 📝 Notas

- O app utiliza Context API para gerenciamento de estado, ideal para mobile React Native
- SafeAreaView é usado em todas as telas para respeitar áreas seguras do dispositivo
- Componentes são reutilizáveis e seguem o design system definido

