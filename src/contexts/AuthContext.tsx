import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import type { AuthUser } from '../lib/mockUsers';

const SPLASH_DELAY_MS = 1200;

interface AuthContextType {
  user: AuthUser | null;
  profile: AuthUser | null;
  loading: boolean;
  loggingIn: boolean;
  loggingOut: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

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
    // Mesmo tempo de splash para visualizar "Carregando..."
    const t = setTimeout(() => setLoading(false), SPLASH_DELAY_MS);
    return () => clearTimeout(t);
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
      setLoggingIn(true);
      await new Promise((resolve) => setTimeout(resolve, SPLASH_DELAY_MS));
      setUser(loggedUser);
      setProfile(loggedUser);
      localStorage.setItem('raizes_user', JSON.stringify(loggedUser));
      setLoggingIn(false);

      return { error: null };
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      return { error: new Error('Erro ao conectar ao servidor') };
    }
  }

  async function signOut() {
    setLoggingOut(true);
    await new Promise((resolve) => setTimeout(resolve, SPLASH_DELAY_MS));
    setUser(null);
    setProfile(null);
    localStorage.removeItem('raizes_user');
    setLoggingOut(false);
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, loggingIn, loggingOut, signIn, signOut }}>
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
