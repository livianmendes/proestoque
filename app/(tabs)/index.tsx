import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { ErrorView } from '../../src/components/ErrorView';
import { ProductCard } from '../../src/components/ProductCard';
import { ProdutoSkeletonList } from '../../src/components/ProdutoSkeleton';
import { Skeleton } from '../../src/components/Skeleton';
import { Colors, Radii, Spacing, Typography } from '../../src/constants/theme';
import { useAuth } from '../../src/contexts/AuthContext';
import { useProducts } from '../../src/contexts/ProductsContext';

export default function DashboardScreen() {
  const { user } = useAuth();
  const { produtos, resumo, isLoading, error, carregarProdutos } = useProducts();
  const [refreshing, setRefreshing] = useState(false);
  const primeiroNome = user?.nome.split(' ')[0] ?? 'Usuario';
  const inicial = primeiroNome.charAt(0).toUpperCase();
  const produtosCriticos = produtos.filter(
    (produto) => produto.quantidade === 0 || produto.quantidade <= produto.quantidadeMinima
  );
  const summaryCards = [
    { icon: 'cube' as const, label: 'Produtos', value: resumo.totalProdutos, tone: 'primary' as const },
    {
      icon: 'warning' as const,
      label: 'Alertas',
      value: resumo.baixoEstoque + resumo.semEstoque,
      tone: 'danger' as const,
    },
    { icon: 'pricetags' as const, label: 'Categorias', value: resumo.categorias, tone: 'info' as const },
    { icon: 'cash' as const, label: 'Valor', value: resumo.valorTotal, tone: 'success' as const },
  ];
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await carregarProdutos();
    setRefreshing(false);
  }, [carregarProdutos]);

  if (isLoading && produtos.length === 0) {
    return <DashboardSkeleton />;
  }

  if (error && produtos.length === 0) {
    return <ErrorView mensagem={error} onRetry={carregarProdutos} />;
  }

  return (
    <FlatList
      data={produtos.slice(0, 5)}
      keyExtractor={(item) => item.id}
      style={styles.container}
      contentContainerStyle={styles.list}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
      }
      ListHeaderComponent={
        <View style={styles.headerContent}>
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>
                {getGreeting()}, {primeiroNome}
              </Text>
              <Text style={styles.subtitle}>Visao geral do estoque</Text>
              <Text style={styles.date}>{formatToday()}</Text>
            </View>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{inicial}</Text>
            </View>
          </View>

          <View style={styles.grid}>
            {summaryCards.map((card) => (
              <SummaryCard key={card.label} {...card} />
            ))}
          </View>

          {produtosCriticos.length > 0 ? (
            <View style={styles.criticalSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Estoque critico ({produtosCriticos.length})</Text>
                <Text style={styles.viewAll} onPress={() => router.push('/produtos')}>
                  Ver todos
                </Text>
              </View>
              {produtosCriticos.slice(0, 3).map((produto) => (
                <View key={produto.id} style={styles.criticalRow}>
                  <Text style={styles.criticalName}>{produto.nome}</Text>
                  <Text style={styles.criticalQty}>
                    {produto.quantidade}/{produto.quantidadeMinima}
                  </Text>
                </View>
              ))}
            </View>
          ) : null}

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Produtos recentes</Text>
          </View>
        </View>
      }
      ListEmptyComponent={<Text style={styles.empty}>Nenhum produto cadastrado.</Text>}
      renderItem={({ item }) => (
        <ProductCard produto={item} onEditar={(id) => router.push({ pathname: '/produtos/[id]', params: { id } })} />
      )}
    />
  );
}

function SummaryCard({
  icon,
  label,
  value,
  tone,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | number;
  tone: 'primary' | 'danger' | 'info' | 'success';
}) {
  const toneColor = {
    primary: Colors.primary,
    danger: Colors.danger,
    info: Colors.info,
    success: Colors.success,
  }[tone];

  return (
    <View style={styles.card}>
      <View style={[styles.cardIcon, { backgroundColor: `${toneColor}18` }]}>
        <Ionicons color={toneColor} name={icon} size={20} />
      </View>
      <Text style={styles.cardValue}>{value}</Text>
      <Text style={styles.cardLabel}>{label}</Text>
    </View>
  );
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Bom dia';
  }

  if (hour < 18) {
    return 'Boa tarde';
  }

  return 'Boa noite';
}

function formatToday() {
  return new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });
}

function DashboardSkeleton() {
  return (
    <View style={styles.skeletonContainer}>
      <View style={styles.header}>
        <View style={styles.skeletonTextGroup}>
          <Skeleton width={180} height={28} />
          <Skeleton width={150} height={16} />
          <Skeleton width={120} height={14} />
        </View>
        <Skeleton width={48} height={48} radius={24} />
      </View>
      <View style={styles.grid}>
        {Array.from({ length: 4 }).map((_, index) => (
          <View key={index} style={styles.card}>
            <Skeleton width={36} height={36} radius={18} />
            <Skeleton width={72} height={20} />
            <Skeleton width={86} height={14} />
          </View>
        ))}
      </View>
      <Skeleton width={160} height={24} style={styles.skeletonTitle} />
      <ProdutoSkeletonList count={5} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContent: {
    gap: Spacing.lg,
  },
  skeletonContainer: {
    flex: 1,
    gap: Spacing.lg,
    paddingTop: 64,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.background,
  },
  skeletonTextGroup: {
    gap: Spacing.sm,
  },
  skeletonTitle: {
    marginTop: Spacing.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  greeting: {
    color: Colors.text,
    fontSize: Typography.title,
    fontWeight: '800',
  },
  subtitle: {
    color: Colors.muted,
    fontSize: Typography.body,
    marginTop: 2,
  },
  date: {
    color: Colors.muted,
    fontSize: Typography.small,
    marginTop: Spacing.xs,
    textTransform: 'capitalize',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
  },
  avatarText: {
    color: Colors.white,
    fontSize: Typography.subtitle,
    fontWeight: '800',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  card: {
    width: '47.5%',
    padding: Spacing.md,
    borderRadius: Radii.large,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  cardIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  cardValue: {
    color: Colors.text,
    fontSize: Typography.subtitle,
    fontWeight: '800',
  },
  cardLabel: {
    color: Colors.muted,
    fontSize: Typography.small,
    marginTop: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: Typography.subtitle,
    fontWeight: '800',
  },
  viewAll: {
    color: Colors.primary,
    fontSize: Typography.small,
    fontWeight: '800',
  },
  list: {
    gap: Spacing.sm,
    paddingTop: 64,
    paddingHorizontal: Spacing.lg,
    paddingBottom: 96,
  },
  criticalSection: {
    gap: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radii.large,
    borderWidth: 1,
    borderColor: Colors.dangerBorder,
    backgroundColor: Colors.warningSoft,
  },
  criticalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  criticalName: {
    color: Colors.text,
    fontSize: Typography.body,
    fontWeight: '700',
  },
  criticalQty: {
    color: Colors.danger,
    fontSize: Typography.small,
    fontWeight: '900',
  },
  empty: {
    color: Colors.muted,
    textAlign: 'center',
    paddingVertical: Spacing.xl,
  },
});
