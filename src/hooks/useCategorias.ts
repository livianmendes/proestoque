import { useEffect, useState } from 'react';

import { Categoria } from '../contexts/ProductsContext';
import { api } from '../services/api';

export function useCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function carregarCategorias() {
      try {
        setIsLoading(true);
        setError(null);
        const { data } = await api.get<Categoria[]>('/categorias');

        if (mounted) {
          setCategorias(data);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Erro ao carregar categorias');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    carregarCategorias();

    return () => {
      mounted = false;
    };
  }, []);

  return { categorias, isLoading, error };
}
