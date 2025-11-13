import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Skill, SkillWithProgress } from '../types';
import { skillService } from '../modules/skills/skill.service';

interface SkillsContextType {
  skills: Skill[];
  isLoading: boolean;
  error: string | null;
  refreshSkills: () => Promise<void>;
  getSkillById: (id: string) => Skill | undefined;
}

const SkillsContext = createContext<SkillsContextType | undefined>(undefined);

export const SkillsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshSkills = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await skillService.list(true);
      setSkills(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar skills');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshSkills();
  }, []);

  const getSkillById = (id: string) => {
    return skills.find((skill) => skill.id === id);
  };

  return (
    <SkillsContext.Provider
      value={{
        skills,
        isLoading,
        error,
        refreshSkills,
        getSkillById,
      }}
    >
      {children}
    </SkillsContext.Provider>
  );
};

export const useSkills = () => {
  const context = useContext(SkillsContext);
  if (context === undefined) {
    throw new Error('useSkills must be used within a SkillsProvider');
  }
  return context;
};

