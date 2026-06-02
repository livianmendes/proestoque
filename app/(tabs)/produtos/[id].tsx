import { router, useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../../src/components/Button';
import { ProductForm } from '../../../src/components/ProductForm';
import { Colors, Spacing, Typography } from '../../../src/constants/theme';
import { productToFormData, useProducts } from '../../../src/contexts/ProductsContext';
import { ProdutoFormData } from '../../../src/schemas/produtoSchema';

export default function EditarProdutoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { buscarProdutoPorId, editarProduto, excluirProduto } = useProducts();
  const produto = id ? buscarProdutoPorId(id) : undefined;

  async function handleSubmit(data: ProdutoFormData) {
    if (!produto) {
      return;
    }

    await editarProduto(produto.id, data);
    router.back();
  }

  function handleDelete() {
    if (!produto) {
      return;
    }

    Alert.alert('Excluir produto', `Deseja excluir "${produto.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          await excluirProduto(produto.id);
          router.replace('/produtos');
        },
      },
    ]);
  }

  if (!produto) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>Produto nao encontrado</Text>
        <Button title="Voltar para lista" onPress={() => router.replace('/produtos')} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled">
      <ProductForm
        initialValues={productToFormData(produto)}
        submitLabel="Salvar alteracoes"
        onSubmit={handleSubmit}
      />
      <Button title="Excluir produto" onPress={handleDelete} variant="danger" fullWidth />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    gap: Spacing.md,
    padding: Spacing.lg,
    paddingBottom: 96,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    padding: Spacing.lg,
    backgroundColor: Colors.background,
  },
  emptyTitle: {
    color: Colors.text,
    fontSize: Typography.subtitle,
    fontWeight: '800',
  },
});

