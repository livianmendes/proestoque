import { renderHook, waitFor } from '@testing-library/react-native';

import { useCategorias } from '../src/hooks/useCategorias';
import { api } from '../src/services/api';

jest.mock('../src/services/api', () => ({
  api: {
    get: jest.fn(),
  },
}));

const mockedGet = api.get as jest.Mock;

describe('useCategorias', () => {
  beforeEach(() => {
    mockedGet.mockReset();
  });

  it('comeca em loading', async () => {
    mockedGet.mockReturnValue(new Promise(() => undefined));

    const { result } = await renderHook(() => useCategorias());

    expect(result.current.isLoading).toBe(true);
  });

  it('carrega dados da API', async () => {
    mockedGet.mockResolvedValue({
      data: [{ id: 'cat-1', nome: 'Bebidas', icone: 'cafe-outline', cor: '#7c3aed' }],
    });

    const { result } = await renderHook(() => useCategorias());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.categorias).toHaveLength(1);
    expect(result.current.error).toBeNull();
  });

  it('exibe estado de erro quando a API falha', async () => {
    mockedGet.mockRejectedValue(new Error('Erro de conexao'));

    const { result } = await renderHook(() => useCategorias());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe('Erro de conexao');
    expect(result.current.categorias).toHaveLength(0);
  });
});
