import { fireEvent, render, screen } from '@testing-library/react-native';

import { ProductCard } from '../src/components/ProductCard';
import type { Produto } from '../src/contexts/ProductsContext';

function produto(overrides: Partial<Produto> = {}): Produto {
  return {
    id: 'prod-1',
    nome: 'Cafe Especial 250g',
    categoriaId: 'cat-1',
    categoria: {
      id: 'cat-1',
      nome: 'Bebidas',
      icone: 'cafe-outline',
      cor: '#7c3aed',
    },
    unidade: 'un',
    quantidade: 4,
    quantidadeMinima: 10,
    preco: 32.9,
    ultimaMovimentacao: '2026-06-25T00:00:00.000Z',
    criadoEm: '2026-06-25T00:00:00.000Z',
    ...overrides,
  };
}

describe('ProductCard', () => {
  it('renderiza o nome do produto', async () => {
    await render(<ProductCard produto={produto()} />);

    expect(screen.getByText('Cafe Especial 250g')).toBeTruthy();
  });

  it('exibe quantidade com unidade', async () => {
    await render(<ProductCard produto={produto({ quantidade: 4, unidade: 'un' })} />);

    expect(screen.getByText('4 un')).toBeTruthy();
  });

  it('exibe alerta de estoque baixo', async () => {
    await render(<ProductCard produto={produto({ quantidade: 2, quantidadeMinima: 10 })} />);

    expect(screen.getByText('Baixo')).toBeTruthy();
  });

  it('exibe status normal quando estoque esta acima do minimo', async () => {
    await render(<ProductCard produto={produto({ quantidade: 20, quantidadeMinima: 10 })} />);

    expect(screen.getByText('Normal')).toBeTruthy();
  });

  it('chama onEditar com o id correto', async () => {
    const onEditar = jest.fn();

    await render(<ProductCard produto={produto({ id: 'prod-abc' })} onEditar={onEditar} />);
    await fireEvent.press(screen.getByRole('button'));

    expect(onEditar).toHaveBeenCalledWith('prod-abc');
  });

  it('exibe sem estoque quando quantidade e zero', async () => {
    await render(<ProductCard produto={produto({ quantidade: 0, quantidadeMinima: 10 })} />);

    expect(screen.getByText('Sem estoque')).toBeTruthy();
  });
});
