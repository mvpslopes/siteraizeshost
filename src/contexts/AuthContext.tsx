import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Tipos simplificados para autenticação local
interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'colaborador' | 'avaliador';
}

interface AuthContextType {
  user: User | null;
  profile: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuários pré-definidos para demonstração
const DEMO_USERS: User[] = [
  {
    id: '1',
    email: 'admin@raizeseventos.com.br',
    full_name: 'Administrador',
    role: 'admin'
  },
  {
    id: '2',
    email: 'colaborador@raizeseventos.com.br',
    full_name: 'Colaborador',
    role: 'colaborador'
  },
  {
    id: '3',
    email: 'avaliador@raizeseventos.com.br',
    full_name: 'Avaliador',
    role: 'avaliador'
  },
  {
    id: '4',
    email: 'thaty@raizeseventos.com.br',
    full_name: 'Thaty',
    role: 'admin'
  },
  {
    id: '5',
    email: 'lara@raizeseventos.com.br',
    full_name: 'Lara',
    role: 'admin'
  }
];

const DEMO_PASSWORDS: Record<string, string> = {
  'admin@raizeseventos.com.br': 'admin123',
  'colaborador@raizeseventos.com.br': 'colaborador123',
  'avaliador@raizeseventos.com.br': 'avaliador123',
  'thaty@raizeseventos.com.br': 'thaty123',
  'lara@raizeseventos.com.br': 'lara123'
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
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
    // Simular delay de rede
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = DEMO_USERS.find(u => u.email === email);
    const correctPassword = DEMO_PASSWORDS[email];
    
    if (user && password === correctPassword) {
      setUser(user);
      setProfile(user);
      localStorage.setItem('raizes_user', JSON.stringify(user));
      return { error: null };
    } else {
      return { error: new Error('Email ou senha inválidos') };
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
