'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { CheckCircle2, User, Shield } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginType, setLoginType] = useState<'user' | 'admin' | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // O backend valida o role, então redirecionamos baseado no tipo escolhido
      if (loginType === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/app/home');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  if (loginType === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-white to-secondary/10 px-4">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center gap-2 mb-8">
            <CheckCircle2 className="w-10 h-10 text-primary" />
            <span className="text-3xl font-bold text-primary-dark">SkillUp</span>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-2xl font-bold text-text-strong mb-2 text-center">
              Como você deseja entrar?
            </h1>
            <p className="text-text-secondary mb-6 text-center">
              Escolha o tipo de acesso
            </p>

            <div className="space-y-4">
              <button
                onClick={() => setLoginType('user')}
                className="w-full p-6 border-2 border-border rounded-lg hover:border-primary hover:bg-primary/5 transition-all duration-200 text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-strong mb-1">Aluno</h3>
                    <p className="text-sm text-text-secondary">
                      Acesse suas trilhas e desafios
                    </p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setLoginType('admin')}
                className="w-full p-6 border-2 border-border rounded-lg hover:border-secondary hover:bg-secondary/5 transition-all duration-200 text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                    <Shield className="w-6 h-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-strong mb-1">Administrador</h3>
                    <p className="text-sm text-text-secondary">
                      Gerencie skills e desafios
                    </p>
                  </div>
                </div>
              </button>
            </div>

            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-sm text-text-secondary hover:text-primary transition-colors"
              >
                ← Voltar para a landing page
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-white to-secondary/10 px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <CheckCircle2 className="w-10 h-10 text-primary" />
          <span className="text-3xl font-bold text-primary-dark">SkillUp</span>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-text-strong">
              {loginType === 'admin' ? 'Acesso Admin' : 'Acesso Aluno'}
            </h1>
            <button
              onClick={() => setLoginType(null)}
              className="text-text-secondary hover:text-text-strong transition-colors"
            >
              ← Voltar
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-strong mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-strong mb-2">
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-text-secondary hover:text-primary transition-colors"
            >
              ← Voltar para a landing page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

