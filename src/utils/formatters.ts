import type { Produto } from '../contexts/ProductsContext';

export function formatCurrency(valor: number) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export const formatarPreco = formatCurrency;

export function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatarQuantidade(quantidade: number, unidade: string) {
  return `${quantidade} ${unidade}`;
}

export function calcularValorTotal(produtos: Produto[]) {
  return produtos.reduce((total, produto) => total + produto.preco * produto.quantidade, 0);
}

export function estoqueBaixo(produto: Pick<Produto, 'quantidade' | 'quantidadeMinima'>) {
  return produto.quantidade > 0 && produto.quantidade <= produto.quantidadeMinima;
}
