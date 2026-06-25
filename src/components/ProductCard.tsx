import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Radii, Spacing, Typography } from '../constants/theme';
import type { Produto } from '../contexts/ProductsContext';
import { formatCurrency } from '../utils/formatters';

type ProductCardProps = {
  produto: Produto;
  onEditar?: (id: string) => void;
};

export function ProductCard({ produto, onEditar }: ProductCardProps) {
  const status = getProductStatus(produto);

  return (
    <Pressable
      accessibilityRole={onEditar ? 'button' : undefined}
      onPress={() => onEditar?.(produto.id)}
      style={({ pressed }) => [styles.row, pressed && onEditar && styles.rowPressed]}>
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
          {produto.categoria?.nome ?? 'Sem categoria'} - {formatCurrency(produto.preco)}
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

function getProductStatus(produto: Produto) {
  if (produto.quantidade === 0) {
    return { label: 'Sem estoque', color: Colors.danger, backgroundColor: Colors.dangerSoft };
  }

  if (produto.quantidade <= produto.quantidadeMinima) {
    return { label: 'Baixo', color: Colors.warning, backgroundColor: Colors.warningSoft };
  }

  return { label: 'Normal', color: Colors.success, backgroundColor: Colors.successSoft };
}

const styles = StyleSheet.create({
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
});
