'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import AppLayout from '../../layout';
import { challengesApi, skillsApi, progressApi, type Challenge, type Skill } from '@/lib/api-client';
import { CheckCircle2, Clock } from 'lucide-react';

export default function SkillDetailPage() {
  const params = useParams();
  const skillId = params.skillId as string;

  const [skill, setSkill] = useState<Skill | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [completedChallenges, setCompletedChallenges] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (skillId) {
      loadSkill();
      loadChallenges();
      loadProgress();
    }
  }, [skillId]);

  const loadSkill = async () => {
    try {
      const response = await skillsApi.getById(skillId);
      setSkill(response.data);
    } catch (error) {
      console.error('Erro ao carregar skill:', error);
    }
  };

  const loadChallenges = async () => {
    try {
      const response = await challengesApi.listBySkill(skillId, { sort: 'orderIndex' });
      setChallenges(response.data.items);
    } catch (error) {
      console.error('Erro ao carregar desafios:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    try {
      // Buscar histórico de progresso para saber quais desafios foram completados
      const historyResponse = await progressApi.getHistory(100);
      const history = Array.isArray(historyResponse.data) 
        ? historyResponse.data 
        : (historyResponse.data as any)?.items || [];
      
      // Filtrar apenas desafios completados (status 'done') desta skill
      const completedIds = history
        .filter((item: any) => {
          const challengeSkillId = item.challenge?.skillId || item.challengeId;
          return challengeSkillId && 
                 item.challenge?.skillId === skillId && 
                 item.status === 'done';
        })
        .map((item: any) => item.challengeId || item.challenge?.id)
        .filter((id: any): id is string => id && typeof id === 'string'); // Remover undefined/null e garantir que são strings
      
      const completed = new Set<string>(completedIds);
      
      setCompletedChallenges(completed);
    } catch (error) {
      console.error('Erro ao carregar progresso:', error);
    }
  };

  const handleCompleteChallenge = async (challengeId: string) => {
    try {
      await progressApi.completeChallenge(challengeId, {});
      // Atualizar estado local imediatamente
      setCompletedChallenges((prev) => new Set([...prev, challengeId]));
      // Recarregar progresso para garantir sincronização
      await loadProgress();
    } catch (error) {
      console.error('Erro ao completar desafio:', error);
      alert('Erro ao completar desafio. Tente novamente.');
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="text-text-secondary">Carregando...</div>
      </AppLayout>
    );
  }

  if (!skill) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-text-secondary">Skill não encontrada.</p>
        </div>
      </AppLayout>
    );
  }

  const progress = challenges.length > 0
    ? (completedChallenges.size / challenges.length) * 100
    : 0;

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-strong mb-2">{skill.name}</h1>
          <p className="text-text-secondary">{skill.description}</p>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-text-strong">Progresso</span>
              <span className="text-sm text-text-secondary">
                {completedChallenges.size} de {challenges.length} desafios
              </span>
            </div>
            <div className="h-3 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {challenges.map((challenge, index) => {
            const isCompleted = completedChallenges.has(challenge.id);
            return (
              <div
                key={challenge.id}
                className={`bg-white rounded-lg border-2 p-6 ${
                  isCompleted ? 'border-success/30 bg-success/5' : 'border-border'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-primary font-semibold">#{challenge.orderIndex}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-text-strong mb-2">
                        {challenge.title}
                      </h3>
                      <p className="text-text-secondary">{challenge.description}</p>
                    </div>
                  </div>
                  {isCompleted && (
                    <CheckCircle2 className="w-6 h-6 text-success flex-shrink-0" />
                  )}
                </div>
                {!isCompleted && (
                  <button
                    onClick={() => handleCompleteChallenge(challenge.id)}
                    className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    Marcar como concluído
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {challenges.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-border">
            <p className="text-text-secondary">Nenhum desafio disponível para esta skill.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

