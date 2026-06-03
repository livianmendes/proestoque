import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { create } from 'axios';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import { Platform } from 'react-native';

export const AUTH_STORAGE_KEYS = {
  TOKEN: '@proestoque:token',
  REFRESH_TOKEN: '@proestoque:refreshToken',
  USER: '@proestoque:user',
} as const;

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  (Platform.OS === 'android' ? 'http://10.0.2.2:3333/api' : 'http://localhost:3333/api');

export const api = create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem(AUTH_STORAGE_KEYS.TOKEN);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as (AxiosRequestConfig & { _retry?: boolean }) | undefined;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      const refreshToken = await AsyncStorage.getItem(AUTH_STORAGE_KEYS.REFRESH_TOKEN);

      if (refreshToken) {
        try {
          originalRequest._retry = true;

          const response = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
          const {
            token,
            refreshToken: novoRefreshToken,
            usuario,
          } = response.data;

          await AsyncStorage.multiSet([
            [AUTH_STORAGE_KEYS.TOKEN, token],
            [AUTH_STORAGE_KEYS.REFRESH_TOKEN, novoRefreshToken],
            [AUTH_STORAGE_KEYS.USER, JSON.stringify(usuario)],
          ]);

          originalRequest.headers = {
            ...originalRequest.headers,
            Authorization: `Bearer ${token}`,
          };

          return api(originalRequest);
        } catch {
          await AsyncStorage.multiRemove([
            AUTH_STORAGE_KEYS.TOKEN,
            AUTH_STORAGE_KEYS.REFRESH_TOKEN,
            AUTH_STORAGE_KEYS.USER,
          ]);
        }
      }
    }

    return Promise.reject(error);
  }
);
