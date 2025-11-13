'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import AppLayout from '../../layout';

const MAX_SCORE = 50;

export default function AssessmentResultPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [skillScores, setSkillScores] = useState<Record<string, number>>({});
  const [skillLevels, setSkillLevels] = useState<Record<string, 'fraco' | 'medio' | 'forte'>>({});
  const [recommendedSkill, setRecommendedSkill] = useState<string>('');

  useEffect(() => {
    const skillScoresParam = searchParams.get('skillScores');
    const skillLevelsParam = searchParams.get('skillLevels');
    const recommendedSkillParam = searchParams.get('recommendedSkill');

    if (skillScoresParam) {
      try {
        setSkillScores(JSON.parse(decodeURIComponent(skillScoresParam)));
      } catch (e) {
        console.error('Erro ao parsear skillScores:', e);
      }
    }

    if (skillLevelsParam) {
      try {
        setSkillLevels(JSON.parse(decodeURIComponent(skillLevelsParam)));
      } catch (e) {
        console.error('Erro ao parsear skillLevels:', e);
      }
    }

    if (recommendedSkillParam) {
      setRecommendedSkill(decodeURIComponent(recommendedSkillParam));
    }
  }, [searchParams]);

  const getLevelColor = (level: 'fraco' | 'medio' | 'forte') => {
    switch (level) {
      case 'fraco':
        return 'bg-red-500';
      case 'medio':
        return 'bg-yellow-500';
      case 'forte':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getLevelLabel = (level: 'fraco' | 'medio' | 'forte') => {
    switch (level) {
      case 'fraco':
        return 'Fraco';
      case 'medio':
        return 'Médio';
      case 'forte':
        return 'Forte';
      default:
        return '';
    }
  };

  const handleContinue = () => {
    router.push('/app/home');
  };

  const skills = Object.keys(skillScores);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-text-strong mb-2">Seu Perfil de Habilidades</h1>
          <p className="text-text-secondary">
            Baseado na sua autoavaliação, aqui está seu radar de habilidades
          </p>
        </div>

        {/* Radar simplificado */}
        <div className="bg-white rounded-lg border border-border p-8 shadow-sm mb-8">
          <div className="flex justify-center items-center mb-8">
            <div className="relative w-80 h-80">
              {/* Círculos de referência */}
              {[0.25, 0.5, 0.75, 1].map((scale) => (
                <div
                  key={scale}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border border-border opacity-30 rounded-full"
                  style={{
                    width: `${320 * scale}px`,
                    height: `${320 * scale}px`,
                  }}
                />
              ))}

              {/* Labels das skills */}
              {skills.map((skill, index) => {
                const angle = (index * (2 * Math.PI) / skills.length) - Math.PI / 2;
                const labelRadius = 160;
                const labelX = labelRadius * Math.cos(angle);
                const labelY = labelRadius * Math.sin(angle);
                const level = skillLevels[skill];

                return (
                  <div
                    key={index}
                    className="absolute top-1/2 left-1/2 flex flex-col items-center"
                    style={{
                      transform: `translate(calc(-50% + ${labelX}px), calc(-50% + ${labelY}px))`,
                    }}
                  >
                    <span className="text-xs font-medium text-text-primary mb-1 text-center">
                      {skill.substring(0, 10)}
                    </span>
                    <div
                      className={`w-2 h-2 rounded-full ${getLevelColor(level)}`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Lista de skills */}
        <div className="space-y-4 mb-8">
          {skills.map((skill) => {
            const score = skillScores[skill];
            const level = skillLevels[skill];
            const percentage = Math.min((score / MAX_SCORE) * 100, 100);

            return (
              <div key={skill} className="bg-white rounded-lg border border-border p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-text-strong">{skill}</h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getLevelColor(level)}`}
                  >
                    {getLevelLabel(level)}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-border rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${getLevelColor(level)}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="text-sm text-text-secondary">{score} pontos</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recomendação */}
        {recommendedSkill && (
          <div className="bg-primary rounded-lg p-6 text-white mb-8">
            <h2 className="text-xl font-semibold mb-2">Skill Recomendada</h2>
            <h3 className="text-3xl font-bold mb-4">{recommendedSkill}</h3>
            <p className="opacity-90">
              Com base na sua autoavaliação, recomendamos focar no desenvolvimento de{' '}
              <strong>{recommendedSkill}</strong>. Esta é a área onde você demonstrou maior
              potencial!
            </p>
          </div>
        )}

        <div className="text-center">
          <button
            onClick={handleContinue}
            className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold"
          >
            Continuar para o App
          </button>
        </div>
      </div>
    </AppLayout>
  );
}

