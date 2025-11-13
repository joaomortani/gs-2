'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { CheckCircle2, Home, BookOpen, TrendingUp, LogOut, User } from 'lucide-react';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || isAdmin)) {
      router.push('/login');
    }
  }, [user, loading, isAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Carregando...</div>
      </div>
    );
  }

  if (!user || isAdmin) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/app/home" className="flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-primary" />
              <span className="text-xl font-bold text-primary-dark">SkillUp</span>
            </Link>

            <nav className="flex items-center gap-6">
              <Link
                href="/app/home"
                className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
              >
                <Home className="w-5 h-5" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <Link
                href="/app/skills"
                className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                <span className="hidden sm:inline">Skills</span>
              </Link>
              <Link
                href="/app/progress"
                className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors"
              >
                <TrendingUp className="w-5 h-5" />
                <span className="hidden sm:inline">Progresso</span>
              </Link>
              <div className="flex items-center gap-3 pl-6 border-l border-border">
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-medium text-text-strong">{user.name}</div>
                  <div className="text-xs text-text-secondary">{user.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-text-secondary hover:text-error transition-colors"
                  title="Sair"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
    </div>
  );
}

