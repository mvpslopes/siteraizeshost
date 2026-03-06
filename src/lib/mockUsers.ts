export type UserRole = 'root' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
}

interface StoredData {
  users: AuthUser[];
  passwords: Record<string, string>;
}

const STORAGE_KEY = 'raizes_users_store';

function loadStore(): StoredData {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as StoredData;
      if (Array.isArray(parsed.users) && parsed.passwords) {
        return parsed;
      }
    } catch {
      // Ignorar e recriar store padrão
    }
  }

  // Usuários padrão para demonstração
  const defaultUsers: AuthUser[] = [
    {
      id: '1',
      email: 'root@raizeseventos.com.br',
      full_name: 'Usuário Root',
      role: 'root',
    },
    {
      id: '2',
      email: 'admin@raizeseventos.com.br',
      full_name: 'Administrador',
      role: 'admin',
    },
  ];

  const defaultPasswords: Record<string, string> = {
    'root@raizeseventos.com.br': 'root123',
    'admin@raizeseventos.com.br': 'admin123',
  };

  const initial: StoredData = {
    users: defaultUsers,
    passwords: defaultPasswords,
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  return initial;
}

let store: StoredData | null = null;

function getStore(): StoredData {
  if (!store) {
    store = loadStore();
  }
  return store;
}

function persist() {
  if (store) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }
}

export const mockAuthApi = {
  async getUsers(): Promise<AuthUser[]> {
    const { users } = getStore();
    return [...users];
  },

  async createUser(
    data: Omit<AuthUser, 'id'> & { password: string }
  ): Promise<AuthUser> {
    const current = getStore();

    if (current.users.some(u => u.email === data.email)) {
      throw new Error('Já existe um usuário com este e-mail');
    }

    const newUser: AuthUser = {
      id: Date.now().toString(),
      email: data.email,
      full_name: data.full_name,
      role: data.role,
    };

    current.users.push(newUser);
    current.passwords[newUser.email] = data.password;
    persist();

    return newUser;
  },

  async updateUser(
    id: string,
    data: Partial<Omit<AuthUser, 'id'>> & { password?: string }
  ): Promise<AuthUser> {
    const current = getStore();
    const index = current.users.findIndex(u => u.id === id);
    if (index === -1) {
      throw new Error('Usuário não encontrado');
    }

    const existing = current.users[index];
    const updated: AuthUser = {
      ...existing,
      ...data,
      id: existing.id,
    };

    // Se e-mail mudar, precisamos mover a senha
    if (data.email && data.email !== existing.email) {
      const existingPassword = current.passwords[existing.email];
      delete current.passwords[existing.email];
      if (existingPassword) {
        current.passwords[data.email] = existingPassword;
      }
    }

    if (data.password !== undefined) {
      current.passwords[updated.email] = data.password;
    }

    current.users[index] = updated;
    persist();

    return updated;
  },

  async deleteUser(id: string): Promise<void> {
    const current = getStore();
    const index = current.users.findIndex(u => u.id === id);
    if (index === -1) return;

    const [removed] = current.users.splice(index, 1);
    delete current.passwords[removed.email];
    persist();
  },

  async signIn(
    email: string,
    password: string
  ): Promise<{ user: AuthUser | null; error: Error | null }> {
    const current = getStore();
    const user = current.users.find(u => u.email === email) || null;
    const expectedPassword = current.passwords[email];

    if (user && expectedPassword && expectedPassword === password) {
      return { user, error: null };
    }

    return { user: null, error: new Error('Email ou senha inválidos') };
  },
};

