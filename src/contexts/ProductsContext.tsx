import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';

import { api } from '../services/api';
import { notificarEstoqueCritico } from '../services/notifications';
import { ProdutoFormData, toNumber } from '../schemas/produtoSchema';
import { calcularValorTotal, formatCurrency, estoqueBaixo } from '../utils/formatters';
import { useAuth } from './AuthContext';

export type Categoria = {
  id: string;
  nome: string;
  icone: string;
  cor: string;
  _count?: { produtos: number };
};

export type Produto = {
  id: string;
  nome: string;
  categoriaId: string;
  categoria?: Categoria;
  unidade: string;
  quantidade: number;
  quantidadeMinima: number;
  preco: number;
  observacao?: string | null;
  foto?: string | null;
  ultimaMovimentacao: string;
  criadoEm: string;
  atualizadoEm?: string;
};

type ProductsState = {
  produtos: Produto[];
  isLoading: boolean;
  error: string | null;
};

type ProductsAction =
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; payload: Produto[] }
  | { type: 'LOAD_ERROR'; payload: string }
  | { type: 'RESET' }
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
  error: string | null;
  carregarProdutos: () => Promise<void>;
  adicionarProduto: (data: ProdutoFormData) => Promise<void>;
  editarProduto: (id: string, data: ProdutoFormData) => Promise<void>;
  deletarProduto: (id: string) => Promise<void>;
  excluirProduto: (id: string) => Promise<void>;
  buscarProdutoPorId: (id: string) => Produto | undefined;
};

const ProductsContext = createContext<ProductsContextType | undefined>(undefined);

function productsReducer(state: ProductsState, action: ProductsAction): ProductsState {
  switch (action.type) {
    case 'LOAD_START':
      return { ...state, isLoading: true, error: null };
    case 'LOAD_SUCCESS':
      return { produtos: action.payload, isLoading: false, error: null };
    case 'LOAD_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'RESET':
      return { produtos: [], isLoading: false, error: null };
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
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const [state, dispatch] = useReducer(productsReducer, {
    produtos: [],
    isLoading: false,
    error: null,
  });

  const carregarProdutos = useCallback(async () => {
    if (!isAuthenticated) {
      dispatch({ type: 'RESET' });
      return;
    }

    dispatch({ type: 'LOAD_START' });

    try {
      const { data } = await api.get<Produto[]>('/produtos');
      dispatch({ type: 'LOAD_SUCCESS', payload: data });
      notificarEstoqueCritico(data).catch(() => undefined);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Erro ao carregar produtos';
      dispatch({ type: 'LOAD_ERROR', payload: message });
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthLoading) {
      return;
    }

    if (isAuthenticated) {
      carregarProdutos();
      return;
    }

    dispatch({ type: 'RESET' });
  }, [carregarProdutos, isAuthenticated, isAuthLoading]);

  const adicionarProduto = useCallback(async (data: ProdutoFormData) => {
    const { data: produto } = await api.post<Produto>('/produtos', formDataToApi(data));
    dispatch({ type: 'ADD', payload: produto });
  }, []);

  const editarProduto = useCallback(async (id: string, data: ProdutoFormData) => {
    const { data: produto } = await api.put<Produto>(`/produtos/${id}`, formDataToApi(data));
    dispatch({ type: 'UPDATE', payload: produto });
  }, []);

  const deletarProduto = useCallback(async (id: string) => {
    await api.delete(`/produtos/${id}`);
    dispatch({ type: 'DELETE', payload: id });
  }, []);

  const buscarProdutoPorId = useCallback(
    (id: string) => state.produtos.find((produto) => produto.id === id),
    [state.produtos]
  );

  const categorias = useMemo(
    () =>
      Array.from(
        new Set(
          state.produtos.map((produto) => produto.categoria?.nome).filter(Boolean) as string[]
        )
      ).sort(),
    [state.produtos]
  );

  const resumo = useMemo(() => {
    const valorTotal = calcularValorTotal(state.produtos);
    const categoriaIds = new Set(state.produtos.map((produto) => produto.categoriaId));

    return {
      totalProdutos: state.produtos.length,
      baixoEstoque: state.produtos.filter(estoqueBaixo).length,
      semEstoque: state.produtos.filter((produto) => produto.quantidade === 0).length,
      categorias: categoriaIds.size,
      valorTotal: formatCurrency(valorTotal),
    };
  }, [state.produtos]);

  const value: ProductsContextType = {
    produtos: state.produtos,
    categorias,
    resumo,
    isLoading: state.isLoading,
    error: state.error,
    carregarProdutos,
    adicionarProduto,
    editarProduto,
    deletarProduto,
    excluirProduto: deletarProduto,
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
    categoriaId: produto.categoriaId,
    unidade: produto.unidade,
    quantidade: String(produto.quantidade),
    quantidadeMinima: String(produto.quantidadeMinima),
    preco: String(produto.preco).replace('.', ','),
    observacao: produto.observacao ?? '',
    foto: produto.foto ?? '',
  };
}

function formDataToApi(data: ProdutoFormData) {
  return {
    nome: data.nome.trim(),
    categoriaId: data.categoriaId,
    unidade: data.unidade.trim(),
    quantidade: toNumber(data.quantidade),
    quantidadeMinima: toNumber(data.quantidadeMinima),
    preco: toNumber(data.preco),
    observacao: data.observacao?.trim() || null,
    foto: data.foto || null,
  };
}
