'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '../layout';
import { skillsApi, assessmentApi, type Skill } from '@/lib/api-client';
import { BookOpen, TrendingUp, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AppHomePage() {
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasAssessment, setHasAssessment] = useState(false);

  useEffect(() => {
    checkAssessment();
    loadSkills();
  }, []);

  const checkAssessment = async () => {
    try {
      const response = await assessmentApi.getUserAssessments();
      setHasAssessment(response.data.assessments.length > 0);
    } catch (error) {
      // Se não tem assessment, redireciona para onboarding
      setHasAssessment(false);
    }
  };

  const loadSkills = async () => {
    try {
      setLoading(true);
      const response = await skillsApi.list({ isActive: true });
      setSkills(response.data.items);
    } catch (error) {
      console.error('Erro ao carregar skills:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading && !hasAssessment) {
      router.push('/app/onboarding');
    }
  }, [loading, hasAssessment, router]);

  if (loading) {
    return (
      <AppLayout>
        <div className="text-text-secondary">Carregando...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-text-strong mb-2">
            Suas trilhas de desenvolvimento
          </h1>
          <p className="text-text-secondary">
            Escolha uma skill e comece a praticar
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => (
            <Link
              key={skill.id}
              href={`/app/skills/${skill.id}`}
              className="bg-white rounded-lg border border-border p-6 hover:shadow-lg hover:border-primary transition-all duration-200 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <ArrowRight className="w-5 h-5 text-text-secondary group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
              <h3 className="text-xl font-semibold text-text-strong mb-2">{skill.name}</h3>
              <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                {skill.description}
              </p>
              <div className="flex items-center gap-2 text-sm text-primary">
                <TrendingUp className="w-4 h-4" />
                <span>Ver desafios</span>
              </div>
            </Link>
          ))}
        </div>

        {skills.length === 0 && (
          <div className="text-center py-12">
            <p className="text-text-secondary">Nenhuma skill disponível no momento.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}

