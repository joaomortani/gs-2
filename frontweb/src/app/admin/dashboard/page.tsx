'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminApi, type AdminOverview } from '@/lib/api-client';
import { Users, BookOpen, Target, TrendingUp } from 'lucide-react';

export default function AdminDashboardPage() {
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOverview();
  }, []);

  const loadOverview = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getOverview();
      setOverview(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      icon: Users,
      label: 'Total de usuários',
      value: overview?.users || 0,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: BookOpen,
      label: 'Skills ativas',
      value: overview?.skills || 0,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      icon: Target,
      label: 'Desafios cadastrados',
      value: overview?.challenges || 0,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      icon: TrendingUp,
      label: 'Conclusões (30 dias)',
      value: overview?.completionsLast30d || 0,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
  ];

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-text-strong mb-8">Dashboard</h1>

        {loading ? (
          <div className="text-text-secondary">Carregando...</div>
        ) : error ? (
          <div className="p-4 bg-error/10 border border-error/20 rounded-lg text-error">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 shadow-sm border border-border"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-text-strong mb-1">{stat.value}</div>
                  <div className="text-sm text-text-secondary">{stat.label}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

