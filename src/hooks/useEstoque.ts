import { useMemo } from 'react';

import type { Produto } from '../contexts/ProductsContext';
import { calcularValorTotal, estoqueBaixo } from '../utils/formatters';

export function useEstoque(produtos: Produto[]) {
  return useMemo(() => {
    const produtosBaixoEstoque = produtos.filter(estoqueBaixo);

    return {
      valorTotal: calcularValorTotal(produtos),
      produtosBaixoEstoque,
      totalItens: produtos.reduce((total, produto) => total + produto.quantidade, 0),
    };
  }, [produtos]);
}
