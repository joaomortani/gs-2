import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SkillWithProgress, ChallengeProgress } from '../types';
import { progressService } from '../modules/progress/progress.service';

interface ProgressContextType {
  skillsWithProgress: SkillWithProgress[];
  history: ChallengeProgress[];
  isLoading: boolean;
  error: string | null;
  refreshProgress: () => Promise<void>;
  refreshHistory: () => Promise<void>;
  completeChallenge: (challengeId: string, notes?: string) => Promise<void>;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [skillsWithProgress, setSkillsWithProgress] = useState<SkillWithProgress[]>([]);
  const [history, setHistory] = useState<ChallengeProgress[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshProgress = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await progressService.getUserProgress();
      setSkillsWithProgress(data.skills);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar progresso');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshHistory = async () => {
    try {
      const data = await progressService.getHistory(10);
      setHistory(Array.isArray(data) ? data : []);
    } catch (err: any) {
      console.error('Erro ao carregar histórico:', err);
      setHistory([]); // Garantir que seja array mesmo em caso de erro
    }
  };

  const completeChallenge = async (challengeId: string, notes?: string) => {
    try {
      await progressService.completeChallenge(challengeId, { notes });
      await refreshProgress();
      await refreshHistory();
    } catch (err: any) {
      throw new Error(err.message || 'Erro ao completar desafio');
    }
  };

  useEffect(() => {
    refreshProgress();
    refreshHistory();
  }, []);

  return (
    <ProgressContext.Provider
      value={{
        skillsWithProgress,
        history,
        isLoading,
        error,
        refreshProgress,
        refreshHistory,
        completeChallenge,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

