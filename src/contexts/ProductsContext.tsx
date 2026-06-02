import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useContext, useEffect, useMemo, useReducer } from 'react';

import { produtos as produtosMock } from '../data/mockData';
import { ProdutoFormData, toNumber } from '../schemas/produtoSchema';

const STORAGE_KEY = '@proestoque:produtos';

export type Produto = {
  id: string;
  nome: string;
  categoria: string;
  unidade: string;
  quantidade: number;
  quantidadeMinima: number;
  preco: number;
  observacao?: string;
  foto?: string;
  createdAt: string;
  updatedAt: string;
};

type ProductsState = {
  produtos: Produto[];
  isLoading: boolean;
};

type ProductsAction =
  | { type: 'LOAD'; payload: Produto[] }
  | { type: 'ADD'; payload: Produto }
  | { type: 'UPDATE'; payload: Produto }
  | { type: 'DELETE'; payload: string };

type ProductsContextType = {
  produtos: Produto[];
  categorias: string[];
  resumo: {
    totalProdutos: number;
    baixoEstoque: number;
    semEstoque: number;
    categorias: number;
    valorTotal: string;
  };
  isLoading: boolean;
  adicionarProduto: (data: ProdutoFormData) => Promise<void>;
  editarProduto: (id: string, data: ProdutoFormData) => Promise<void>;
  excluirProduto: (id: string) => Promise<void>;
  buscarProdutoPorId: (id: string) => Produto | undefined;
};

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

function productsReducer(state: ProductsState, action: ProductsAction): ProductsState {
  switch (action.type) {
    case 'LOAD':
      return { produtos: action.payload, isLoading: false };
    case 'ADD':
      return { ...state, produtos: [action.payload, ...state.produtos] };
    case 'UPDATE':
      return {
        ...state,
        produtos: state.produtos.map((produto) =>
          produto.id === action.payload.id ? action.payload : produto
        ),
      };
    case 'DELETE':
      return {
        ...state,
        produtos: state.produtos.filter((produto) => produto.id !== action.payload),
      };
    default:
      return state;
  }
}

export function ProductsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(productsReducer, {
    produtos: [],
    isLoading: true,
  });

  useEffect(() => {
    async function loadProducts() {
      try {
        const storedProducts = await AsyncStorage.getItem(STORAGE_KEY);

        if (storedProducts) {
          dispatch({ type: 'LOAD', payload: JSON.parse(storedProducts) as Produto[] });
          return;
        }

        await persistProducts(initialProducts);
        dispatch({ type: 'LOAD', payload: initialProducts });
      } catch {
        dispatch({ type: 'LOAD', payload: initialProducts });
      }
    }

    loadProducts();
  }, []);

  async function adicionarProduto(data: ProdutoFormData) {
    const now = new Date().toISOString();
    const produto = formDataToProduct(data, {
      id: createId(),
      createdAt: now,
      updatedAt: now,
    });
    const nextProducts = [produto, ...state.produtos];

    dispatch({ type: 'ADD', payload: produto });
    await persistProducts(nextProducts);
  }

  async function editarProduto(id: string, data: ProdutoFormData) {
    const currentProduct = state.produtos.find((produto) => produto.id === id);

    if (!currentProduct) {
      return;
    }

    const updatedProduct = formDataToProduct(data, {
      id,
      createdAt: currentProduct.createdAt,
      updatedAt: new Date().toISOString(),
    });
    const nextProducts = state.produtos.map((produto) =>
      produto.id === id ? updatedProduct : produto
    );

    dispatch({ type: 'UPDATE', payload: updatedProduct });
    await persistProducts(nextProducts);
  }

  async function excluirProduto(id: string) {
    const nextProducts = state.produtos.filter((produto) => produto.id !== id);

    dispatch({ type: 'DELETE', payload: id });
    await persistProducts(nextProducts);
  }

  function buscarProdutoPorId(id: string) {
    return state.produtos.find((produto) => produto.id === id);
  }

  const categorias = useMemo(
    () => Array.from(new Set(state.produtos.map((produto) => produto.categoria))).sort(),
    [state.produtos]
  );

  const resumo = useMemo(() => {
    const valorTotal = state.produtos.reduce(
      (total, produto) => total + produto.preco * produto.quantidade,
      0
    );

    return {
      totalProdutos: state.produtos.length,
      baixoEstoque: state.produtos.filter(
        (produto) => produto.quantidade > 0 && produto.quantidade <= produto.quantidadeMinima
      ).length,
      semEstoque: state.produtos.filter((produto) => produto.quantidade === 0).length,
      categorias: categorias.length,
      valorTotal: formatCurrency(valorTotal),
    };
  }, [categorias.length, state.produtos]);

  const value: ProductsContextType = {
    produtos: state.produtos,
    categorias,
    resumo,
    isLoading: state.isLoading,
    adicionarProduto,
    editarProduto,
    excluirProduto,
    buscarProdutoPorId,
  };

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductsContext);

  if (!context) {
    throw new Error('useProducts deve ser usado dentro de ProductsProvider');
  }

  return context;
}

export function productToFormData(produto: Produto): ProdutoFormData {
  return {
    nome: produto.nome,
    categoria: produto.categoria,
    unidade: produto.unidade,
    quantidade: String(produto.quantidade),
    quantidadeMinima: String(produto.quantidadeMinima),
    preco: String(produto.preco).replace('.', ','),
    observacao: produto.observacao ?? '',
    foto: produto.foto ?? '',
  };
}

export function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function formDataToProduct(
  data: ProdutoFormData,
  meta: Pick<Produto, 'id' | 'createdAt' | 'updatedAt'>
): Produto {
  return {
    ...meta,
    nome: data.nome.trim(),
    categoria: data.categoria.trim(),
    unidade: data.unidade.trim(),
    quantidade: toNumber(data.quantidade),
    quantidadeMinima: toNumber(data.quantidadeMinima),
    preco: toNumber(data.preco),
    observacao: data.observacao?.trim(),
    foto: data.foto,
  };
}

async function persistProducts(produtos: Produto[]) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(produtos));
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const initialProducts: Produto[] = produtosMock.map((produto) => ({
  id: produto.id,
  nome: produto.nome,
  categoria: produto.categoria,
  unidade: 'un',
  quantidade: produto.estoque,
  quantidadeMinima: produto.estoqueMinimo,
  preco: Number(produto.preco.replace('R$ ', '').replace(',', '.')),
  observacao: '',
  foto: '',
  createdAt: new Date(2026, 5, 2).toISOString(),
  updatedAt: new Date(2026, 5, 2).toISOString(),
}));
