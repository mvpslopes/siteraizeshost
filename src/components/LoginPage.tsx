import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';
import SplashScreen from './SplashScreen';

interface LoginPageProps {
  onBack: () => void;
}

export default function LoginPage({ onBack }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error: signInError } = await signIn(email, password);

    if (signInError) {
      setError('Email ou senha inválidos');
      setLoading(false);
    }
  };

  if (loading) {
    return <SplashScreen subtitle="Entrando..." />;
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4 pt-20">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Logo size="md" />
            </div>
            <h2 className="text-3xl font-bold text-primary-800">Acesso ao Sistema</h2>
            <p className="text-earth-600 mt-2">Faça login para acessar o painel administrativo</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-primary-700 font-medium mb-2">
                E-mail ou usuário
              </label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-700"
                placeholder="seu@email.com ou marcus.lopes"
              />
            </div>

            <div>
              <label className="block text-primary-700 font-medium mb-2">Senha</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-earth-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-700"
                placeholder="Sua senha"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-700 text-white px-6 py-3 rounded-lg hover:bg-primary-800 transition font-medium disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <button
            onClick={onBack}
            className="w-full mt-4 text-earth-600 hover:text-primary-800 transition"
          >
            Voltar ao site
          </button>
        </div>
      </div>
    </div>
  );
}
