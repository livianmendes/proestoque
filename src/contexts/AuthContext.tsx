import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { api, AUTH_STORAGE_KEYS, setUnauthorizedHandler } from '../services/api';

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
  login: (email: string, password: string) => Promise<void>;
  registrar: (nome: string, email: string, password: string) => Promise<void>;
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

  useEffect(() => {
    return setUnauthorizedHandler(() => {
      setToken(null);
      setUser(null);
    });
  }, []);

  async function restoreSession() {
    const startedAt = Date.now();

    try {
      const [[, storedToken], [, storedUser]] = await AsyncStorage.multiGet([
        AUTH_STORAGE_KEYS.TOKEN,
        AUTH_STORAGE_KEYS.USER,
      ]);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser) as User);
      }
    } catch {
      await clearSession();
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

  const saveSession = useCallback(async (usuario: User, tokenValue: string, refreshToken?: string) => {
    const items: [string, string][] = [
      [AUTH_STORAGE_KEYS.TOKEN, tokenValue],
      [AUTH_STORAGE_KEYS.USER, JSON.stringify(usuario)],
    ];

    if (refreshToken) {
      items.push([AUTH_STORAGE_KEYS.REFRESH_TOKEN, refreshToken]);
    }

    await AsyncStorage.multiSet(items);
    setUser(usuario);
    setToken(tokenValue);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', { email, senha: password });
      const { usuario, token: tokenValue, refreshToken } = response.data;

      await saveSession(usuario, tokenValue, refreshToken);
    } catch (error: any) {
      const message = error instanceof Error ? error.message : 'Erro ao fazer login';

      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, [saveSession]);

  const registrar = useCallback(async (nome: string, email: string, password: string) => {
    setIsLoading(true);

    try {
      const response = await api.post('/auth/registro', { nome, email, senha: password });
      const { usuario, token: tokenValue, refreshToken } = response.data;

      await saveSession(usuario, tokenValue, refreshToken);
    } catch (error: any) {
      const message = error instanceof Error ? error.message : 'Erro ao criar conta';

      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, [saveSession]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    await clearSession();
    setUser(null);
    setToken(null);
    setIsLoading(false);
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(token && user),
      login,
      registrar,
      logout,
    }),
    [isLoading, login, logout, registrar, token, user]
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

async function clearSession() {
  await AsyncStorage.multiRemove([
    AUTH_STORAGE_KEYS.TOKEN,
    AUTH_STORAGE_KEYS.REFRESH_TOKEN,
    AUTH_STORAGE_KEYS.USER,
  ]);
}
