import type { Produto } from '../src/contexts/ProductsContext';
import {
  calcularValorTotal,
  estoqueBaixo,
  formatarData,
  formatarQuantidade,
  formatCurrency,
} from '../src/utils/formatters';

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

describe('formatCurrency', () => {
  it('formata valor positivo em reais', () => {
    expect(formatCurrency(32.9)).toContain('32,90');
  });

  it('formata zero', () => {
    expect(formatCurrency(0)).toContain('0,00');
  });

  it('formata valor negativo', () => {
    expect(formatCurrency(-15)).toContain('15,00');
  });
});

describe('calcularValorTotal', () => {
  it('calcula total de uma lista de produtos', () => {
    const total = calcularValorTotal([
      produto({ preco: 10, quantidade: 2 }),
      produto({ id: 'prod-2', preco: 5, quantidade: 3 }),
    ]);

    expect(total).toBe(35);
  });

  it('retorna zero para lista vazia', () => {
    expect(calcularValorTotal([])).toBe(0);
  });

  it('considera quantidade zero', () => {
    expect(calcularValorTotal([produto({ preco: 99, quantidade: 0 })])).toBe(0);
  });
});

describe('estoqueBaixo', () => {
  it('identifica produto abaixo do minimo', () => {
    expect(estoqueBaixo(produto({ quantidade: 4, quantidadeMinima: 10 }))).toBe(true);
  });

  it('nao marca estoque normal como baixo', () => {
    expect(estoqueBaixo(produto({ quantidade: 12, quantidadeMinima: 10 }))).toBe(false);
  });

  it('nao marca sem estoque como baixo', () => {
    expect(estoqueBaixo(produto({ quantidade: 0, quantidadeMinima: 10 }))).toBe(false);
  });
});

describe('formatarData', () => {
  it('formata data ISO em dia, mes e ano', () => {
    expect(formatarData('2026-06-25T12:00:00.000Z')).toBe('25/06/2026');
  });
});

describe('formatarQuantidade', () => {
  it('concatena quantidade e unidade', () => {
    expect(formatarQuantidade(12, 'un')).toBe('12 un');
  });
});
