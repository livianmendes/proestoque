import { renderHook } from '@testing-library/react-native';

import type { Produto } from '../src/contexts/ProductsContext';
import { useEstoque } from '../src/hooks/useEstoque';

function produto(overrides: Partial<Produto> = {}): Produto {
  return {
    id: 'prod-1',
    nome: 'Cafe Especial',
    categoriaId: 'cat-1',
    unidade: 'un',
    quantidade: 4,
    quantidadeMinima: 10,
    preco: 32.9,
    ultimaMovimentacao: '2026-06-25T00:00:00.000Z',
    criadoEm: '2026-06-25T00:00:00.000Z',
    ...overrides,
  };
}

describe('useEstoque', () => {
  it('calcula valor total', async () => {
    const { result } = await renderHook(() =>
      useEstoque([
        produto({ preco: 10, quantidade: 2 }),
        produto({ id: 'prod-2', preco: 5, quantidade: 3 }),
      ])
    );

    expect(result.current.valorTotal).toBe(35);
  });

  it('retorna produtos com baixo estoque', async () => {
    const { result } = await renderHook(() =>
      useEstoque([
        produto({ quantidade: 2, quantidadeMinima: 10 }),
        produto({ id: 'prod-2', quantidade: 20 }),
      ])
    );

    expect(result.current.produtosBaixoEstoque).toHaveLength(1);
  });

  it('calcula total de itens', async () => {
    const { result } = await renderHook(() =>
      useEstoque([produto({ quantidade: 2 }), produto({ id: 'prod-2', quantidade: 5 })])
    );

    expect(result.current.totalItens).toBe(7);
  });

  it('lida com lista vazia', async () => {
    const { result } = await renderHook(() => useEstoque([]));

    expect(result.current.valorTotal).toBe(0);
    expect(result.current.produtosBaixoEstoque).toHaveLength(0);
    expect(result.current.totalItens).toBe(0);
  });
});
