import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { AuthUser } from '../lib/mockUsers';

interface AuthContextType {
  user: AuthUser | null;
  profile: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar se há usuário salvo no localStorage
    const savedUser = localStorage.getItem('raizes_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setProfile(userData);
      } catch (error) {
        console.error('Erro ao carregar usuário salvo:', error);
        localStorage.removeItem('raizes_user');
      }
    }
    setLoading(false);
  }, []);

  async function signIn(email: string, password: string) {
    try {
      const response = await fetch('/api/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.user) {
        return { error: new Error(data.error || 'Email ou senha inválidos') };
      }

      const loggedUser: AuthUser = data.user;
      setUser(loggedUser);
      setProfile(loggedUser);
      localStorage.setItem('raizes_user', JSON.stringify(loggedUser));

      return { error: null };
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      return { error: new Error('Erro ao conectar ao servidor') };
    }
  }

  async function signOut() {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('raizes_user');
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
