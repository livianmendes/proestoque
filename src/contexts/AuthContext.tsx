import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

const TOKEN_KEY = '@proestoque:token';
const USER_KEY = '@proestoque:user';
const MIN_SPLASH_TIME = 1500;

export type User = {
  id: string;
  nome: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, nome?: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    restoreSession();
  }, []);

  async function restoreSession() {
    const startedAt = Date.now();

    try {
      const [[, storedToken], [, storedUser]] = await AsyncStorage.multiGet([TOKEN_KEY, USER_KEY]);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser) as User);
      }
    } catch {
      await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
      setToken(null);
      setUser(null);
    } finally {
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(MIN_SPLASH_TIME - elapsed, 0);

      setTimeout(() => {
        setIsLoading(false);
      }, remaining);
    }
  }

  async function login(email: string, _password: string, nome?: string) {
    setIsLoading(true);

    await delay(500);

    const loggedUser: User = {
      id: '1',
      nome: nome ?? getNameFromEmail(email),
      email,
    };
    const loggedToken = `proestoque-token-${Date.now()}`;

    await AsyncStorage.multiSet([
      [TOKEN_KEY, loggedToken],
      [USER_KEY, JSON.stringify(loggedUser)],
    ]);

    setUser(loggedUser);
    setToken(loggedToken);
    setIsLoading(false);
  }

  async function logout() {
    setIsLoading(true);
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
    setUser(null);
    setToken(null);
    setIsLoading(false);
  }

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(token && user),
      login,
      logout,
    }),
    [isLoading, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }

  return context;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getNameFromEmail(email: string) {
  if (email.toLowerCase().startsWith('joao')) {
    return 'Joao Silva';
  }

  const localPart = email.split('@')[0] || 'Usuario';

  return localPart
    .split(/[._-]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

