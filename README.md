SkillUpp – Global Solution 2025 (FIAP)

Plataforma integrada (Mobile + Web) focada no desenvolvimento prático e comportamental de estudantes de tecnologia que estão entrando no mercado de trabalho.
O SkillUpp combina trilhas de estudo, atividades práticas, soft-skills, gamificação e dashboard web, alinhado ao tema O Futuro do Trabalho.

⸻

📌 Sumário
	1.	Visão Geral
	2.	Personas
	3.	Arquitetura da Solução
	4.	Tecnologias Utilizadas
	5.	Funcionalidades
	6.	Acessibilidade
	7.	Execução local (backend, mobile e web)
	8.	Deploys
	9.	Estrutura do Repositório
	10.	Contribuição
	11.	Licença

⸻

1. Visão Geral

O SkillUpp nasce da necessidade real de jovens estudantes de tecnologia que precisam desenvolver competências técnicas e soft-skills para ingressar no mercado de trabalho.
A solução integra um aplicativo mobile para trilhas e atividades práticas com uma plataforma web de acompanhamento, permitindo que o usuário veja seu progresso em tempo real.

⸻

2. Personas

👤 Guilherme – 21 anos

Estudante de Ciências da Computação.
Pouca experiência prática.
Objetivo: criar portfólio, desenvolver skills técnicas e soft-skills para conseguir seu primeiro emprego.

👤 Arthur – 22 anos

Estudante de ADS, último ano.
Objetivo: fortalecer habilidades práticas e comportamentais, preparar-se para processos seletivos e entrevistas.

Essas personas guiaram todas as decisões de design, fluxo, acessibilidade e conteúdo da aplicação.

⸻

3. Arquitetura da Solução
Mobile (React Native)
      ↓
Backend (Node + Express)
      ↓
Banco de Dados (Railway / Postgres)
      ↓
Web Admin (Next.js)

Integração
	•	Mobile consome API REST para trilhas, atividades e perfil.
	•	Web exibe dashboards, skills, progresso e histórico.
	•	Ambas as plataformas compartilham a mesma API.

⸻

4. Tecnologias Utilizadas

Mobile
	•	React Native (Expo)
	•	React Navigation
	•	Context API / Hooks
	•	Fetch API / Axios
	•	Suporte a acessibilidade nativa

Backend
	•	Node.js
	•	Express
	•	Railway deploy
	•	PostgreSQL (via Railway)

Web
	•	Next.js
	•	Server Components
	•	CSS Modules / Tailwind (dependendo da implementação)
	•	Integração via API REST

⸻

5. Funcionalidades

Mobile

✔ Login e cadastro
✔ Lista de trilhas de aprendizado
✔ Módulos (hard + soft-skills)
✔ Envio de atividades práticas
✔ Gamificação (pontos, badges)
✔ Perfil e configurações
✔ Acessibilidade ajustável
✔ Sincronização automática com backend

Web

✔ Dashboard administrativo
✔ Progresso do usuário
✔ Histórico de atividades
✔ Trilhas cadastradas
✔ Visualização em tempo real

⸻

6. Acessibilidade

O SkillUpp foi projetado com base nas recomendações WCAG 2.1:
	•	Alto contraste nas telas
	•	Tamanhos de fonte ajustáveis
	•	Leitores de tela: suporte para VoiceOver (iOS) e TalkBack (Android)
	•	Componentes com labels semânticos
	•	Botões grandes com área de toque ampliada
	•	Fluxos curtos e diretos
	•	Web compatível com navegação por teclado

7. Licença

Este projeto é apenas para fins acadêmicos (FIAP Global Solutions).
Uso comercial não autorizado.
