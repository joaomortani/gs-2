import { prisma } from '../config/prisma';

async function main() {
  console.log('🌱 Starting seed...');

  // Limpar dados existentes (opcional - comentar em produção)
  await prisma.userChallengeProgress.deleteMany();
  await prisma.challenge.deleteMany();
  await prisma.skill.deleteMany();

  // Criar 3 skills
  const skill1 = await prisma.skill.create({
    data: {
      name: 'Comunicação',
      description: 'Desenvolver habilidades de comunicação eficaz, incluindo expressão clara de ideias, escuta ativa e apresentações impactantes.',
      isActive: true,
    },
  });

  const skill2 = await prisma.skill.create({
    data: {
      name: 'Trabalho em Equipe',
      description: 'Colaborar efetivamente em grupos, gerenciar conflitos e contribuir para objetivos comuns.',
      isActive: true,
    },
  });

  const skill3 = await prisma.skill.create({
    data: {
      name: 'Liderança',
      description: 'Inspirar e guiar equipes, tomar decisões estratégicas e desenvolver outros profissionais.',
      isActive: true,
    },
  });

  console.log('✅ Created 3 skills');

  // Criar challenges para cada skill
  const challenges = [
    // Skill 1: Comunicação
    {
      skillId: skill1.id,
      title: 'Explique seu projeto em 3 minutos',
      description: 'Resuma um projeto técnico complexo para um público não técnico em no máximo 3 minutos. Pratique a clareza e simplicidade.',
      orderIndex: 1,
    },
    {
      skillId: skill1.id,
      title: 'Apresentação sem slides',
      description: 'Faça uma apresentação de 10 minutos sem usar slides. Desenvolva sua capacidade de comunicação verbal e gestual.',
      orderIndex: 2,
    },
    {
      skillId: skill1.id,
      title: 'Feedback construtivo',
      description: 'Dê feedback construtivo a um colega sobre um trabalho recente. Foque em ser específico, objetivo e respeitoso.',
      orderIndex: 3,
    },
    {
      skillId: skill1.id,
      title: 'Escuta ativa em reunião',
      description: 'Durante uma reunião, pratique escuta ativa fazendo perguntas clarificadoras e resumindo pontos-chave.',
      orderIndex: 4,
    },
    {
      skillId: skill1.id,
      title: 'Documentação clara',
      description: 'Escreva documentação técnica que seja compreensível tanto para iniciantes quanto para especialistas.',
      orderIndex: 5,
    },
    // Skill 2: Trabalho em Equipe
    {
      skillId: skill2.id,
      title: 'Mediar um conflito',
      description: 'Identifique e medie um conflito entre membros da equipe, focando em encontrar soluções colaborativas.',
      orderIndex: 1,
    },
    {
      skillId: skill2.id,
      title: 'Distribuir tarefas equitativamente',
      description: 'Organize e distribua tarefas de um projeto considerando as habilidades e disponibilidade de cada membro.',
      orderIndex: 2,
    },
    {
      skillId: skill2.id,
      title: 'Pair programming',
      description: 'Pratique programação em par com um colega, alternando entre driver e navigator por pelo menos 2 horas.',
      orderIndex: 3,
    },
    {
      skillId: skill2.id,
      title: 'Code review colaborativo',
      description: 'Participe de uma revisão de código focando em melhorias construtivas e aprendizado mútuo.',
      orderIndex: 4,
    },
    // Skill 3: Liderança
    {
      skillId: skill3.id,
      title: 'Mentoria de iniciante',
      description: 'Mentore um desenvolvedor júnior por uma semana, ajudando-o a resolver problemas e desenvolver habilidades.',
      orderIndex: 1,
    },
    {
      skillId: skill3.id,
      title: 'Tomar decisão sob pressão',
      description: 'Enfrente uma situação que exige decisão rápida, documente seu processo de raciocínio e resultados.',
      orderIndex: 2,
    },
    {
      skillId: skill3.id,
      title: 'Definir objetivos SMART',
      description: 'Defina objetivos SMART (Specific, Measurable, Achievable, Relevant, Time-bound) para sua equipe.',
      orderIndex: 3,
    },
    {
      skillId: skill3.id,
      title: 'Delegar responsabilidades',
      description: 'Identifique tarefas que podem ser delegadas e delegue-as, fornecendo contexto e suporte adequados.',
      orderIndex: 4,
    },
    {
      skillId: skill3.id,
      title: 'Reunião de retrospectiva',
      description: 'Conduza uma retrospectiva de sprint/projeto, facilitando discussões produtivas e ações de melhoria.',
      orderIndex: 5,
    },
  ];

  for (const challenge of challenges) {
    await prisma.challenge.create({
      data: challenge,
    });
  }

  console.log(`✅ Created ${challenges.length} challenges`);
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

