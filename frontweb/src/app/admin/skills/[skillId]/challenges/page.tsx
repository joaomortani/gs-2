'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { challengesApi, skillsApi, type Challenge, type Skill } from '@/lib/api-client';
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';

export default function AdminChallengesPage() {
  const params = useParams();
  const router = useRouter();
  const skillId = params.skillId as string;

  const [skill, setSkill] = useState<Skill | null>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [formData, setFormData] = useState({ title: '', description: '', orderIndex: 1 });

  useEffect(() => {
    if (skillId) {
      loadSkill();
      loadChallenges();
    }
  }, [skillId]);

  const loadSkill = async () => {
    try {
      const response = await skillsApi.getById(skillId);
      setSkill(response.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar skill');
    }
  };

  const loadChallenges = async () => {
    try {
      setLoading(true);
      const response = await challengesApi.listBySkill(skillId, { sort: 'orderIndex' });
      setChallenges(response.data.items);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar desafios');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingChallenge(null);
    const nextOrder = challenges.length > 0 ? Math.max(...challenges.map((c) => c.orderIndex)) + 1 : 1;
    setFormData({ title: '', description: '', orderIndex: nextOrder });
    setShowModal(true);
  };

  const handleEdit = (challenge: Challenge) => {
    setEditingChallenge(challenge);
    setFormData({
      title: challenge.title,
      description: challenge.description,
      orderIndex: challenge.orderIndex,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingChallenge) {
        await challengesApi.update(editingChallenge.id, formData);
      } else {
        await challengesApi.create(skillId, formData);
      }
      setShowModal(false);
      loadChallenges();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar desafio');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este desafio?')) return;
    try {
      await challengesApi.delete(id);
      loadChallenges();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao deletar desafio');
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/admin/skills')}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-text-secondary" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-text-strong">
              Desafios - {skill?.name || 'Carregando...'}
            </h1>
            <p className="text-text-secondary mt-1">{skill?.description}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="text-text-secondary">
            {challenges.length} desafio{challenges.length !== 1 ? 's' : ''} cadastrado
            {challenges.length !== 1 ? 's' : ''}
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Plus className="w-5 h-5" />
            Novo Desafio
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-error/10 border border-error/20 rounded-lg text-error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-text-secondary">Carregando...</div>
        ) : challenges.length === 0 ? (
          <div className="bg-white rounded-lg border border-border p-12 text-center">
            <p className="text-text-secondary mb-4">Nenhum desafio cadastrado ainda.</p>
            <button
              onClick={handleCreate}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
              Criar primeiro desafio
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {challenges.map((challenge) => (
              <div
                key={challenge.id}
                className="bg-white rounded-lg border border-border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold">
                        #{challenge.orderIndex}
                      </span>
                      <h3 className="text-xl font-semibold text-text-strong">{challenge.title}</h3>
                    </div>
                    <p className="text-text-secondary mt-2">{challenge.description}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(challenge)}
                      className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(challenge.id)}
                      className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                      title="Deletar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
              <h2 className="text-2xl font-bold text-text-strong mb-4">
                {editingChallenge ? 'Editar Desafio' : 'Novo Desafio'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-strong mb-2">Título</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-strong mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={4}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-strong mb-2">
                    Ordem
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.orderIndex}
                    onChange={(e) =>
                      setFormData({ ...formData, orderIndex: parseInt(e.target.value) || 1 })
                    }
                    required
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="text-xs text-text-secondary mt-1">
                    A ordem determina a sequência em que os desafios aparecem
                  </p>
                </div>
                <div className="flex gap-4 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-border rounded-lg text-text-strong hover:bg-slate-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                  >
                    {editingChallenge ? 'Salvar' : 'Criar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

