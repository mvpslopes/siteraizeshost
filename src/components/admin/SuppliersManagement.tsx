import { useEffect, useState } from 'react';
import { Building2, Plus, Edit, Trash2, XCircle } from 'lucide-react';
import type { Supplier } from '../../lib/supabase';
import { api } from '../../lib/api';

export default function SuppliersManagement() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Supplier | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<{
    name: string;
    category: string;
    document: string;
    legal_name: string;
    address: string;
    responsible_name: string;
    email: string;
    phone: string;
    bank_info: string;
    notes: string;
  }>({
    name: '',
    category: '',
    document: '',
    legal_name: '',
    address: '',
    responsible_name: '',
    email: '',
    phone: '',
    bank_info: '',
    notes: '',
  });

  useEffect(() => {
    api
      .getSuppliers()
      .then(setSuppliers)
      .catch((err) => {
        console.error(err);
        alert('Erro ao carregar fornecedores.');
      })
      .finally(() => setLoading(false));
  }, []);

  const openNew = () => {
    setEditing(null);
    setForm({
      name: '',
      category: '',
      document: '',
      legal_name: '',
      address: '',
      responsible_name: '',
      email: '',
      phone: '',
      bank_info: '',
      notes: '',
    });
    setShowModal(true);
  };

  const openEdit = (s: Supplier) => {
    setEditing(s);
    setForm({
      name: s.name,
      category: s.category ? String(s.category) : '',
      document: s.document || '',
      legal_name: s.legal_name || '',
      address: s.address || '',
      responsible_name: s.responsible_name || '',
      email: s.email || '',
      phone: s.phone || '',
      bank_info: s.bank_info || '',
      notes: s.notes || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (s: Supplier) => {
    if (!confirm(`Remover o fornecedor "${s.name}"?`)) return;
    try {
      await api.deleteSupplier(s.id);
      setSuppliers((prev) => prev.filter((x) => x.id !== s.id));
    } catch (err) {
      console.error(err);
      alert('Erro ao excluir fornecedor.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      if (editing) {
        const updated = await api.updateSupplier(editing.id, {
          name: form.name.trim(),
          category: form.category.trim() || undefined,
          document: form.document.trim() || undefined,
          legal_name: form.legal_name.trim() || undefined,
          address: form.address.trim() || undefined,
          responsible_name: form.responsible_name.trim() || undefined,
          email: form.email.trim() || undefined,
          phone: form.phone.trim() || undefined,
          bank_info: form.bank_info.trim() || undefined,
          notes: form.notes.trim() || undefined,
        });
        setSuppliers((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      } else {
        const created = await api.createSupplier({
          name: form.name.trim(),
          category: form.category.trim() || undefined,
          document: form.document.trim() || undefined,
          legal_name: form.legal_name.trim() || undefined,
          address: form.address.trim() || undefined,
          responsible_name: form.responsible_name.trim() || undefined,
          email: form.email.trim() || undefined,
          phone: form.phone.trim() || undefined,
          bank_info: form.bank_info.trim() || undefined,
          notes: form.notes.trim() || undefined,
        });
        setSuppliers((prev) => [...prev, created]);
      }
      setShowModal(false);
      setEditing(null);
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar fornecedor.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Building2 className="w-8 h-8 text-primary-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Fornecedores</h1>
            <p className="text-sm text-gray-600">
              Cadastro geral de fornecedores (usados nos eventos e no bar).
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={openNew}
          className="bg-primary-700 text-white px-4 py-2 rounded-lg hover:bg-primary-800 flex items-center gap-2 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Novo fornecedor
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Fornecedor</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Categoria</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Documento</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Responsável</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">Telefone</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600">E-mail</th>
                <th className="px-4 py-2 w-24 text-center font-medium text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {suppliers.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2">
                    <div className="font-medium text-gray-900">{s.name}</div>
                    {s.legal_name && (
                      <div className="text-xs text-gray-500 truncate max-w-xs">
                        {s.legal_name}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2 text-gray-700">{s.category || '–'}</td>
                  <td className="px-4 py-2 text-gray-700">{s.document || '–'}</td>
                  <td className="px-4 py-2 text-gray-700">
                    {s.responsible_name || '–'}
                  </td>
                  <td className="px-4 py-2 text-gray-700">{s.phone || '–'}</td>
                  <td className="px-4 py-2 text-gray-700">{s.email || '–'}</td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => openEdit(s)}
                        className="p-1.5 rounded text-primary-600 hover:bg-primary-50"
                        title="Editar"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(s)}
                        className="p-1.5 rounded text-red-600 hover:bg-red-50"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {suppliers.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-sm text-gray-500"
                  >
                    Nenhum fornecedor cadastrado ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">
                {editing ? 'Editar fornecedor' : 'Novo fornecedor'}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setShowModal(false);
                  setEditing(null);
                }}
                className="p-1 text-gray-500 hover:text-gray-700"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do fornecedor *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoria (ex.: CREPE, AÇAÍ)
                  </label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, category: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CNPJ / CPF
                  </label>
                  <input
                    type="text"
                    value={form.document}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, document: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Razão Social ou Nome fantasia
                </label>
                <input
                  type="text"
                  value={form.legal_name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, legal_name: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço completo
                </label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, address: e.target.value }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do responsável
                  </label>
                  <input
                    type="text"
                    value={form.responsible_name}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, responsible_name: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, phone: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Conta depósito / transferência / PIX
                  </label>
                  <textarea
                    value={form.bank_info}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, bank_info: e.target.value }))
                    }
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observações
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, notes: e.target.value }))
                  }
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-600"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditing(null);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {saving ? 'Salvando...' : 'Salvar fornecedor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

