'use client';

import { useEffect, useState } from 'react';
import AppLayout from '../layout';
import { progressApi, type SkillWithProgress } from '@/lib/api-client';
import { TrendingUp, CheckCircle2 } from 'lucide-react';

export default function ProgressPage() {
  const [skills, setSkills] = useState<SkillWithProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      setLoading(true);
      const response = await progressApi.getUserProgress();
      setSkills(response.data.skills);
    } catch (error) {
      console.error('Erro ao carregar progresso:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="text-text-secondary">Carregando...</div>
      </AppLayout>
    );
  }

  const totalChallenges = skills.reduce((sum, skill) => sum + (skill.progress?.total || 0), 0);
  const completedChallenges = skills.reduce(
    (sum, skill) => sum + (skill.progress?.completed || 0),
    0
  );
  const overallProgress = totalChallenges > 0 ? (completedChallenges / totalChallenges) * 100 : 0;

  return (
    <AppLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-strong mb-2">Meu Progresso</h1>
          <p className="text-text-secondary">Acompanhe sua evolução em cada skill</p>
        </div>

        {/* Overall Progress */}
        <div className="bg-white rounded-lg border border-border p-6 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-text-strong">Progresso Geral</h2>
              <p className="text-sm text-text-secondary">
                {completedChallenges} de {totalChallenges} desafios concluídos
              </p>
            </div>
          </div>
          <div className="h-4 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <div className="mt-2 text-right">
            <span className="text-2xl font-bold text-primary">{Math.round(overallProgress)}%</span>
          </div>
        </div>

        {/* Skills Progress */}
        <div className="grid md:grid-cols-2 gap-6">
          {skills.map((skill) => {
            const progress = skill.progress?.percentage || 0;
            return (
              <div
                key={skill.id}
                className="bg-white rounded-lg border border-border p-6 hover:shadow-lg transition-shadow"
              >
                <h3 className="text-xl font-semibold text-text-strong mb-2">{skill.name}</h3>
                <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                  {skill.description}
                </p>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-text-secondary">Progresso</span>
                    <span className="text-sm font-medium text-text-strong">
                      {skill.progress?.completed || 0} / {skill.progress?.total || 0}
                    </span>
                  </div>
                  <div className="h-2 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-success">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{Math.round(progress)}% concluído</span>
                </div>
              </div>
            );
          })}
        </div>

        {skills.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-border">
            <p className="text-text-secondary">Nenhum progresso registrado ainda.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

