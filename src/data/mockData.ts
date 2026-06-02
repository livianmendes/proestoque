export type Produto = {
  id: string;
  nome: string;
  categoria: string;
  estoque: number;
  estoqueMinimo: number;
  preco: string;
};

export const produtos: Produto[] = [
  {
    id: '1',
    nome: 'Mouse sem fio',
    categoria: 'Informatica',
    estoque: 12,
    estoqueMinimo: 5,
    preco: 'R$ 59,90',
  },
  {
    id: '2',
    nome: 'Teclado mecanico',
    categoria: 'Informatica',
    estoque: 4,
    estoqueMinimo: 6,
    preco: 'R$ 189,90',
  },
  {
    id: '3',
    nome: 'Caderno universitario',
    categoria: 'Papelaria',
    estoque: 28,
    estoqueMinimo: 10,
    preco: 'R$ 24,90',
  },
  {
    id: '4',
    nome: 'Caneta azul',
    categoria: 'Papelaria',
    estoque: 52,
    estoqueMinimo: 20,
    preco: 'R$ 2,50',
  },
  {
    id: '5',
    nome: 'Garrafa termica',
    categoria: 'Utilidades',
    estoque: 7,
    estoqueMinimo: 8,
    preco: 'R$ 42,90',
  },
  {
    id: '6',
    nome: 'Fone bluetooth',
    categoria: 'Eletronicos',
    estoque: 5,
    estoqueMinimo: 5,
    preco: 'R$ 119,90',
  },
  {
    id: '7',
    nome: 'Carregador USB-C',
    categoria: 'Eletronicos',
    estoque: 18,
    estoqueMinimo: 8,
    preco: 'R$ 39,90',
  },
  {
    id: '8',
    nome: 'Mochila executiva',
    categoria: 'Acessorios',
    estoque: 3,
    estoqueMinimo: 4,
    preco: 'R$ 149,90',
  },
  {
    id: '9',
    nome: 'Agenda 2026',
    categoria: 'Papelaria',
    estoque: 14,
    estoqueMinimo: 6,
    preco: 'R$ 34,90',
  },
  {
    id: '10',
    nome: 'Suporte notebook',
    categoria: 'Acessorios',
    estoque: 9,
    estoqueMinimo: 5,
    preco: 'R$ 79,90',
  },
];

const categorias = new Set(produtos.map((produto) => produto.categoria));
const valorTotal = produtos.reduce((total, produto) => {
  const preco = Number(produto.preco.replace('R$ ', '').replace(',', '.'));
  return total + preco * produto.estoque;
}, 0);

export const resumoEstoque = {
  totalProdutos: produtos.length,
  baixoEstoque: produtos.filter((produto) => produto.estoque <= produto.estoqueMinimo).length,
  categorias: categorias.size,
  valorTotal: valorTotal.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  }),
};

