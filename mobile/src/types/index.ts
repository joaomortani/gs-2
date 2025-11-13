export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Challenge {
  id: string;
  skillId: string;
  title: string;
  description: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface ChallengeProgress {
  id: string;
  userId: string;
  challengeId: string;
  status: 'pending' | 'done';
  doneAt: string | null;
  createdAt: string;
}

export interface SkillWithProgress extends Skill {
  progress?: {
    completed: number;
    total: number;
    percentage: number;
  };
}

export interface ChallengeWithProgress extends Challenge {
  progress?: ChallengeProgress;
}


