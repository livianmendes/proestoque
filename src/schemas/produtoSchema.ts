import { z } from 'zod';

const numericString = (message: string) =>
  z
    .string()
    .trim()
    .min(1, message)
    .refine((value) => Number.isFinite(toNumber(value)), message);

export const produtoSchema = z.object({
  nome: z.string().trim().min(3, 'Informe um nome com pelo menos 3 caracteres'),
  categoriaId: z.string().trim().min(1, 'Selecione a categoria'),
  unidade: z.string().trim().min(1, 'Informe a unidade'),
  quantidade: numericString('Informe uma quantidade valida').refine(
    (value) => toNumber(value) >= 0,
    'A quantidade nao pode ser negativa'
  ),
  quantidadeMinima: numericString('Informe a quantidade minima').refine(
    (value) => toNumber(value) >= 0,
    'A quantidade minima nao pode ser negativa'
  ),
  preco: numericString('Informe o preco').refine((value) => toNumber(value) > 0, 'O preco deve ser maior que zero'),
  observacao: z.string().optional(),
  foto: z.string().optional(),
});

export type ProdutoFormData = z.infer<typeof produtoSchema>;

export function toNumber(value: string) {
  return Number(value.replace(',', '.'));
}

export const produtoDefaultValues: ProdutoFormData = {
  nome: '',
  categoriaId: '',
  unidade: 'un',
  quantidade: '',
  quantidadeMinima: '',
  preco: '',
  observacao: '',
  foto: '',
};

