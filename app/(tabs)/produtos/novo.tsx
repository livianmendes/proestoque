import { router } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';

import { ProductForm } from '../../../src/components/ProductForm';
import { Colors, Spacing } from '../../../src/constants/theme';
import { useProducts } from '../../../src/contexts/ProductsContext';
import { ProdutoFormData } from '../../../src/schemas/produtoSchema';

export default function NovoProdutoScreen() {
  const { adicionarProduto } = useProducts();

  async function handleSubmit(data: ProdutoFormData) {
    await adicionarProduto(data);
    router.back();
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled">
      <ProductForm submitLabel="Cadastrar produto" onSubmit={handleSubmit} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: 96,
  },
});

