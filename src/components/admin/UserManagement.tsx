import { useEffect, useState } from 'react';
import { Users, Plus, Edit, Trash2, Shield } from 'lucide-react';
import { AuthUser, UserRole } from '../../lib/mockUsers';
import { useAuth } from '../../contexts/AuthContext';

type FormState = {
  full_name: string;
  email: string;
  role: UserRole;
  password: string;
  confirmPassword: string;
};

export default function UserManagement() {
  const { profile } = useAuth();
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    full_name: '',
    email: '',
    role: 'admin',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    if (profile?.role !== 'root') {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/users.php', {
        headers: {
          'X-User-Role': 'root',
        },
      });
      const data = await response.json();
      if (response.ok && Array.isArray(data.users)) {
        setUsers(data.users);
      } else {
        console.error('Erro ao carregar usuários:', data);
      }
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setEditingUser(null);
    setForm({
      full_name: '',
      email: '',
      role: 'admin',
      password: '',
      confirmPassword: '',
    });
    setError(null);
    setShowForm(false);
  };

  const handleNewUser = () => {
    setEditingUser(null);
    setForm({
      full_name: '',
      email: '',
      role: 'admin',
      password: '',
      confirmPassword: '',
    });
    setError(null);
    setShowForm(true);
  };

  const handleEditUser = (user: AuthUser) => {
    setEditingUser(user);
    setForm({
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      password: '',
      confirmPassword: '',
    });
    setError(null);
    setShowForm(true);
  };

  const handleDeleteUser = async (user: AuthUser) => {
    if (!confirm(`Deseja realmente excluir o usuário "${user.full_name}"?`)) return;

    try {
      await fetch(`/api/users.php?id=${user.id}`, {
        method: 'DELETE',
        headers: {
          'X-User-Role': 'root',
        },
      });
      setUsers(prev => prev.filter(u => u.id !== user.id));
    } catch (err: any) {
      console.error('Erro ao excluir usuário:', err);
      alert(err?.message || 'Erro ao excluir usuário');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.full_name || !form.email) {
      setError('Nome e e-mail são obrigatórios.');
      return;
    }

    // Para novo usuário, senha é obrigatória; para edição é opcional
    if (!editingUser || form.password || form.confirmPassword) {
      if (!form.password || !form.confirmPassword) {
        setError('Informe a senha e a confirmação.');
        return;
      }
      if (form.password !== form.confirmPassword) {
        setError('As senhas não conferem.');
        return;
      }
    }

    try {
      if (editingUser) {
        const response = await fetch(`/api/users.php?id=${editingUser.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Role': 'root',
          },
          body: JSON.stringify({
            full_name: form.full_name,
            email: form.email,
            role: form.role,
            password: form.password || undefined,
          }),
        });
        const data = await response.json();
        if (!response.ok || !data.user) {
          throw new Error(data.error || 'Erro ao atualizar usuário');
        }
        const updated: AuthUser = data.user;
        setUsers(prev => prev.map(u => (u.id === updated.id ? updated : u)));
      } else {
        const response = await fetch('/api/users.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-User-Role': 'root',
          },
          body: JSON.stringify({
            full_name: form.full_name,
            email: form.email,
            role: form.role,
            password: form.password,
          }),
        });
        const data = await response.json();
        if (!response.ok || !data.user) {
          throw new Error(data.error || 'Erro ao criar usuário');
        }
        const created: AuthUser = data.user;
        setUsers(prev => [...prev, created]);
      }
      resetForm();
    } catch (err: any) {
      console.error('Erro ao salvar usuário:', err);
      setError(err?.message || 'Erro ao salvar usuário');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent" />
      </div>
    );
  }

  if (profile?.role !== 'root') {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Acesso restrito</h1>
        <p className="text-gray-600">
          Apenas usuários com perfil <span className="font-semibold">Root</span> podem
          gerenciar usuários do sistema.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-3">
          <Users className="w-8 h-8 text-primary-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Usuários do Sistema</h1>
            <p className="text-sm text-gray-600">
              Gerencie os acessos ao painel interno. Somente perfis <strong>Root</strong>{' '}
              podem acessar esta tela.
            </p>
          </div>
        </div>
        <button
          onClick={handleNewUser}
          className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition flex items-center font-medium"
        >
          <Plus className="w-5 h-5 mr-2" />
          Novo Usuário
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Lista de usuários</h2>
          <span className="text-sm text-gray-500">
            Total: <span className="font-semibold">{users.length}</span>
          </span>
        </div>

        {users.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            Nenhum usuário cadastrado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    E-mail
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Perfil
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{user.full_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === 'root'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-primary-100 text-primary-800'
                        }`}
                      >
                        <Shield className="w-3 h-3 mr-1" />
                        {user.role === 'root' ? 'Root' : 'Administrador'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {/* Evitar que o root delete a si mesmo facilmente */}
                        {user.role !== 'root' && (
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800">
                {editingUser ? 'Editar usuário' : 'Novo usuário'}
              </h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="sr-only">Fechar</span>×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome completo
                </label>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={e =>
                    setForm(prev => ({ ...prev, full_name: e.target.value }))
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  E-mail ou usuário
                </label>
                <input
                  type="text"
                  value={form.email}
                  onChange={e =>
                    setForm(prev => ({ ...prev, email: e.target.value }))
                  }
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  placeholder="email@dominio.com ou marcus.lopes"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Perfil de acesso
                </label>
                <select
                  value={form.role}
                  onChange={e =>
                    setForm(prev => ({ ...prev, role: e.target.value as UserRole }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                >
                  <option value="admin">Administrador</option>
                  <option value="root">Root</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Senha {editingUser && <span className="text-xs text-gray-500">(opcional)</span>}
                  </label>
                  <input
                    type="password"
                    value={form.password}
                    onChange={e =>
                      setForm(prev => ({ ...prev, password: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar senha
                  </label>
                  <input
                    type="password"
                    value={form.confirmPassword}
                    onChange={e =>
                      setForm(prev => ({ ...prev, confirmPassword: e.target.value }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-600"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                >
                  {editingUser ? 'Salvar alterações' : 'Criar usuário'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

