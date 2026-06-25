import { router, useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../../src/components/Button';
import { LoadingView } from '../../../src/components/LoadingView';
import { ProductForm } from '../../../src/components/ProductForm';
import { Colors, Spacing, Typography } from '../../../src/constants/theme';
import { productToFormData, useProducts } from '../../../src/contexts/ProductsContext';
import { ProdutoFormData } from '../../../src/schemas/produtoSchema';

export default function EditarProdutoScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { buscarProdutoPorId, editarProduto, excluirProduto, isLoading } = useProducts();
  const produto = id ? buscarProdutoPorId(id) : undefined;

  async function handleSubmit(data: ProdutoFormData) {
    if (!produto) {
      return;
    }

    try {
      await editarProduto(produto.id, data);
      router.back();
    } catch (error) {
      Alert.alert(
        'Nao foi possivel salvar',
        error instanceof Error ? error.message : 'Verifique sua conexao e tente novamente.'
      );
    }
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
          try {
            await excluirProduto(produto.id);
            router.replace('/produtos');
          } catch (error) {
            Alert.alert(
              'Erro ao excluir',
              error instanceof Error ? error.message : 'Tente novamente.'
            );
          }
        },
      },
    ]);
  }

  if (isLoading && !produto) {
    return <LoadingView mensagem="Carregando produto..." />;
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

