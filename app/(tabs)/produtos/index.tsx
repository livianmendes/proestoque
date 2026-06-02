import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Colors, Radii, Spacing, Typography } from '../../../src/constants/theme';
import { formatCurrency, Produto, useProducts } from '../../../src/contexts/ProductsContext';

type Status = {
  label: string;
  color: string;
  backgroundColor: string;
};

export default function ProdutosScreen() {
  const { produtos, categorias } = useProducts();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const filteredProducts = useMemo(() => {
    return produtos.filter((produto) => {
      const matchesSearch = produto.nome.toLowerCase().includes(search.trim().toLowerCase());
      const matchesCategory =
        selectedCategory === 'Todos' || produto.categoria === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [produtos, search, selectedCategory]);

  const filters = ['Todos', ...categorias];

  return (
    <View style={styles.container}>
      <TextInput
        value={search}
        onChangeText={setSearch}
        placeholder="Buscar produto..."
        placeholderTextColor={Colors.muted}
        selectionColor={Colors.primary}
        style={styles.searchInput}
      />

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <FlatList
            data={filters}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filters}
            renderItem={({ item }) => {
              const active = item === selectedCategory;

              return (
                <Pressable
                  onPress={() => setSelectedCategory(item)}
                  style={[styles.filterChip, active && styles.filterChipActive]}>
                  <Text style={[styles.filterText, active && styles.filterTextActive]}>{item}</Text>
                </Pressable>
              );
            }}
          />
        }
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>Nenhum produto encontrado.</Text>}
        renderItem={({ item }) => (
          <ProductItem
            produto={item}
            onPress={() => router.push({ pathname: '/produtos/[id]', params: { id: item.id } })}
          />
        )}
      />

      <Pressable style={styles.fab} onPress={() => router.push('/produtos/novo')}>
        <Ionicons color={Colors.white} name="add" size={28} />
      </Pressable>
    </View>
  );
}

function ProductItem({ produto, onPress }: { produto: Produto; onPress: () => void }) {
  const status = getProductStatus(produto);

  return (
    <Pressable style={({ pressed }) => [styles.row, pressed && styles.rowPressed]} onPress={onPress}>
      {produto.foto ? (
        <Image source={{ uri: produto.foto }} style={styles.thumbnail} />
      ) : (
        <View style={styles.icon}>
          <Ionicons color={Colors.primary} name="cube-outline" size={22} />
        </View>
      )}
      <View style={styles.content}>
        <Text style={styles.name}>{produto.nome}</Text>
        <Text style={styles.meta}>
          {produto.categoria} - {formatCurrency(produto.preco)}
        </Text>
      </View>
      <View style={styles.trailing}>
        <Text style={styles.quantity}>
          {produto.quantidade} {produto.unidade}
        </Text>
        <View style={[styles.badge, { backgroundColor: status.backgroundColor }]}>
          <Text style={[styles.badgeText, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>
    </Pressable>
  );
}

function getProductStatus(produto: Produto): Status {
  if (produto.quantidade === 0) {
    return { label: 'Sem estoque', color: Colors.danger, backgroundColor: '#fef2f2' };
  }

  if (produto.quantidade <= produto.quantidadeMinima) {
    return { label: 'Baixo', color: '#b45309', backgroundColor: '#fffbeb' };
  }

  return { label: 'Normal', color: Colors.success, backgroundColor: '#ecfdf5' };
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radii.large,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
    marginBottom: Spacing.sm,
  },
  rowPressed: {
    opacity: 0.72,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: Radii.medium,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primarySoft,
  },
  thumbnail: {
    width: 48,
    height: 48,
    borderRadius: Radii.medium,
  },
  content: {
    flex: 1,
  },
  name: {
    color: Colors.text,
    fontSize: Typography.body,
    fontWeight: '800',
  },
  meta: {
    color: Colors.muted,
    fontSize: Typography.small,
    marginTop: 2,
  },
  trailing: {
    alignItems: 'flex-end',
    gap: 6,
  },
  quantity: {
    color: Colors.text,
    fontSize: Typography.small,
    fontWeight: '800',
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    fontSize: Typography.caption,
    fontWeight: '900',
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
