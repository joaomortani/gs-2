'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '../layout';
import { skillsApi, assessmentApi } from '@/lib/api-client';
import selfAssessmentData from '@/data/selfAssessment.json';

interface Answer {
  questionId: number;
  value: number;
  score: number;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = selfAssessmentData.questions;
  const answerOptions = selfAssessmentData.answerOptions;
  const currentQuestionData = questions[currentQuestion];
  const currentAnswer = answers[currentQuestionData.id];

  const handleAnswer = (option: typeof answerOptions[0]) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionData.id]: {
        questionId: currentQuestionData.id,
        value: option.value,
        score: option.score,
      },
    }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateSkillScores = (): Record<string, number> => {
    const skillScores: Record<string, number> = {};

    questions.forEach((question: any) => {
      const answer = answers[question.id];
      if (answer) {
        Object.entries(question.skillMapping).forEach(([skillName, weight]: [string, any]) => {
          if (!skillScores[skillName]) {
            skillScores[skillName] = 0;
          }
          skillScores[skillName] += answer.score * weight;
        });
      }
    });

    return skillScores;
  };

  const getSkillLevel = (score: number): 'fraco' | 'medio' | 'forte' => {
    if (score <= 15) return 'fraco';
    if (score <= 30) return 'medio';
    return 'forte';
  };

  const handleSubmit = async () => {
    const unansweredQuestions = questions.filter((q: any) => !answers[q.id]);
    if (unansweredQuestions.length > 0) {
      alert('Por favor, responda todas as perguntas antes de continuar.');
      return;
    }

    try {
      setIsSubmitting(true);
      const skillScores = calculateSkillScores();
      
      // Buscar skills do backend para obter os IDs
      const skillsResponse = await skillsApi.list({ isActive: true, limit: 100 });
      const skills = skillsResponse.data.items || [];
      
      // Mapear scores para assessments
      const assessments = Object.entries(skillScores)
        .map(([skillName, score]) => {
          const skill = skills.find((s: any) => s.name === skillName);
          if (!skill) return null;
          
          const level = getSkillLevel(score);
          // Converter nível para score de 1-10
          let assessmentScore = 1;
          if (level === 'medio') assessmentScore = 5;
          if (level === 'forte') assessmentScore = 8;
          
          return {
            skillId: skill.id,
            score: assessmentScore,
          };
        })
        .filter(Boolean) as Array<{ skillId: string; score: number }>;

      if (assessments.length === 0) {
        alert('Não foi possível encontrar as skills correspondentes.');
        return;
      }

      // Salvar assessments
      await assessmentApi.submitAssessments({ assessments });

      // Navegar para tela de resultado
      const skillLevels = Object.fromEntries(
        Object.entries(skillScores).map(([skill, score]) => [
          skill,
          getSkillLevel(score),
        ])
      );
      const recommendedSkill = Object.entries(skillScores).sort(([, a], [, b]) => b - a)[0]?.[0];

      router.push(
        `/app/onboarding/result?skillScores=${encodeURIComponent(JSON.stringify(skillScores))}&skillLevels=${encodeURIComponent(JSON.stringify(skillLevels))}&recommendedSkill=${encodeURIComponent(recommendedSkill || '')}`
      );
    } catch (error: any) {
      console.error('Erro ao enviar autoavaliação:', error);
      alert('Não foi possível salvar sua autoavaliação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-strong mb-2">Autoavaliação Inicial</h1>
          <p className="text-text-secondary">
            Responda as perguntas para descobrir suas habilidades
          </p>
          <div className="mt-4">
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-text-secondary mt-2 text-center">
              {currentQuestion + 1} de {questions.length}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-border p-8 shadow-sm">
          <div className="mb-6">
            <span className="text-sm font-semibold text-primary">Pergunta {currentQuestion + 1}</span>
            <h2 className="text-2xl font-semibold text-text-strong mt-2 mb-6">
              {currentQuestionData.text}
            </h2>
          </div>

          <div className="space-y-3">
            {answerOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option)}
                className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  currentAnswer?.value === option.value
                    ? 'bg-primary border-primary text-white'
                    : 'bg-background border-border text-text-primary hover:border-primary hover:bg-primary/5'
                }`}
              >
                <span className="font-medium">{option.label}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-4 justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-3 border border-border rounded-lg text-text-strong hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Anterior
            </button>
            <button
              onClick={handleNext}
              disabled={!currentAnswer || isSubmitting}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {currentQuestion === questions.length - 1
                ? isSubmitting
                  ? 'Salvando...'
                  : 'Finalizar'
                : 'Próxima'}
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
