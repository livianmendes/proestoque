import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native';

import { ErrorView } from '../../../src/components/ErrorView';
import { ProductCard } from '../../../src/components/ProductCard';
import { ProdutoSkeletonList } from '../../../src/components/ProdutoSkeleton';
import { Skeleton } from '../../../src/components/Skeleton';
import { Colors, Radii, Spacing, Typography } from '../../../src/constants/theme';
import { useProducts } from '../../../src/contexts/ProductsContext';
import { useCategorias } from '../../../src/hooks/useCategorias';

export default function ProdutosScreen() {
  const { produtos, isLoading, error, carregarProdutos } = useProducts();
  const { categorias } = useCategorias();
  const [search, setSearch] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const filteredProducts = useMemo(() => {
    return produtos.filter((produto) => {
      const matchesSearch = produto.nome.toLowerCase().includes(search.trim().toLowerCase());
      const matchesCategory = !selectedCategoryId || produto.categoriaId === selectedCategoryId;

      return matchesSearch && matchesCategory;
    });
  }, [produtos, search, selectedCategoryId]);

  const filters = [
    { id: null, nome: 'Todos' },
    ...categorias.map((categoria) => ({
      id: categoria.id,
      nome: categoria.nome,
    })),
  ];

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await carregarProdutos();
    setRefreshing(false);
  }, [carregarProdutos]);

  if (isLoading && produtos.length === 0) {
    return (
      <View style={styles.container}>
        <Skeleton width="100%" height={48} radius={Radii.medium} />
        <ProdutoSkeletonList count={6} />
      </View>
    );
  }

  if (error && produtos.length === 0) {
    return <ErrorView mensagem={error} onRetry={carregarProdutos} />;
  }

  return (
    <View style={styles.container}>
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Buscar produto..."
        placeholderTextColor={Colors.muted}
        selectionColor={Colors.primary}
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.searchInput}
      />

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <FlatList
            data={filters}
            keyExtractor={(item) => item.id ?? 'todos'}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filters}
            renderItem={({ item }) => {
              const active = item.id === selectedCategoryId;

              return (
                <Pressable
                  onPress={() => setSelectedCategoryId(item.id)}
                  style={[styles.filterChip, active && styles.filterChipActive]}>
                  <Text style={[styles.filterText, active && styles.filterTextActive]}>
                    {item.nome}
                  </Text>
                </Pressable>
              );
            }}
          />
        }
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={<Text style={styles.empty}>Nenhum produto encontrado.</Text>}
        renderItem={({ item }) => (
          <ProductCard
            produto={item}
            onEditar={(id) => router.push({ pathname: '/produtos/[id]', params: { id } })}
          />
        )}
      />

      <Pressable style={styles.fab} onPress={() => router.push('/produtos/novo')}>
        <Ionicons color={Colors.white} name="add" size={28} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    backgroundColor: Colors.background,
  },
  searchInput: {
    minHeight: 48,
    paddingHorizontal: Spacing.md,
    borderRadius: Radii.medium,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.text,
    fontSize: Typography.body,
    backgroundColor: Colors.card,
  },
  filters: {
    gap: Spacing.sm,
    paddingVertical: Spacing.md,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  filterChipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  filterText: {
    color: Colors.muted,
    fontSize: Typography.small,
    fontWeight: '800',
  },
  filterTextActive: {
    color: Colors.white,
  },
  list: {
    paddingBottom: 96,
  },
  empty: {
    color: Colors.muted,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  fab: {
    position: 'absolute',
    right: Spacing.lg,
    bottom: Spacing.lg,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.24,
    shadowRadius: 18,
    elevation: 8,
  },
});
