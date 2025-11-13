'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { skillsApi, type Skill } from '@/lib/api-client';
import { Plus, Edit, Trash2, Eye, EyeOff, Target } from 'lucide-react';
import Link from 'next/link';

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '', isActive: true });

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const response = await skillsApi.list({ isActive: undefined });
      setSkills(response.data.items);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar skills');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingSkill(null);
    setFormData({ name: '', description: '', isActive: true });
    setShowModal(true);
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      description: skill.description,
      isActive: skill.isActive,
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingSkill) {
        await skillsApi.update(editingSkill.id, formData);
      } else {
        await skillsApi.create(formData);
      }
      setShowModal(false);
      loadSkills();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar skill');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja desativar esta skill?')) return;
    try {
      await skillsApi.delete(id);
      loadSkills();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao deletar skill');
    }
  };

  const handleToggleActive = async (skill: Skill) => {
    try {
      await skillsApi.update(skill.id, { isActive: !skill.isActive });
      loadSkills();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao atualizar skill');
    }
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-text-strong">Gerenciar Skills</h1>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nova Skill
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-error/10 border border-error/20 rounded-lg text-error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-text-secondary">Carregando...</div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {skills.map((skill) => (
                  <tr key={skill.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-text-strong">{skill.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-text-secondary max-w-md truncate">
                        {skill.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          skill.isActive
                            ? 'bg-success/10 text-success'
                            : 'bg-text-secondary/10 text-text-secondary'
                        }`}
                      >
                        {skill.isActive ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/skills/${skill.id}/challenges`}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Ver desafios"
                        >
                          <Target className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleToggleActive(skill)}
                          className="p-2 text-text-secondary hover:bg-slate-100 rounded-lg transition-colors"
                          title={skill.isActive ? 'Desativar' : 'Ativar'}
                        >
                          {skill.isActive ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEdit(skill)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                          title="Deletar"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
              <h2 className="text-2xl font-bold text-text-strong mb-4">
                {editingSkill ? 'Editar Skill' : 'Nova Skill'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-strong mb-2">Nome</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <label htmlFor="isActive" className="text-sm text-text-strong">
                    Skill ativa
                  </label>
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
                    {editingSkill ? 'Salvar' : 'Criar'}
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

