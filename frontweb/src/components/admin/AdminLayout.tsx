'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { CheckCircle2, LayoutDashboard, BookOpen, Users, LogOut } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/admin/login');
    }
  }, [user, loading, isAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-text-secondary">Carregando...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-white border-r border-border">
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-primary-dark">SkillUp Admin</span>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 text-text-secondary hover:text-primary transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/admin/skills"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 text-text-secondary hover:text-primary transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            <span>Skills</span>
          </Link>
          <Link
            href="/admin/users"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/10 text-text-secondary hover:text-primary transition-colors"
          >
            <Users className="w-5 h-5" />
            <span>Usuários</span>
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <div className="mb-4 px-4 py-2">
            <div className="text-sm font-medium text-text-strong">{user.name}</div>
            <div className="text-xs text-text-secondary">{user.email}</div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-error/10 text-text-secondary hover:text-error transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}

