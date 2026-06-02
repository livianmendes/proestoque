import { Ionicons } from '@expo/vector-icons';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Colors, Radii, Spacing, Typography } from '../../src/constants/theme';
import { useAuth } from '../../src/contexts/AuthContext';
import { formatCurrency, useProducts } from '../../src/contexts/ProductsContext';

export default function DashboardScreen() {
  const { user } = useAuth();
  const { produtos, resumo } = useProducts();
  const primeiroNome = user?.nome.split(' ')[0] ?? 'Usuario';
  const inicial = primeiroNome.charAt(0).toUpperCase();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            {getGreeting()}, {primeiroNome}
          </Text>
          <Text style={styles.subtitle}>Visao geral do estoque</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{inicial}</Text>
        </View>
      </View>

      <View style={styles.grid}>
        <SummaryCard icon="cube" label="Produtos" value={resumo.totalProdutos} tone="primary" />
        <SummaryCard
          icon="warning"
          label="Alertas"
          value={resumo.baixoEstoque + resumo.semEstoque}
          tone="danger"
        />
        <SummaryCard
          icon="pricetags"
          label="Categorias"
          value={resumo.categorias}
          tone="info"
        />
        <SummaryCard
          icon="cash"
          label="Valor"
          value={resumo.valorTotal}
          tone="success"
        />
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Produtos recentes</Text>
        <Text style={styles.sectionHint}>ProductsContext</Text>
      </View>

      <FlatList
        data={produtos.slice(0, 5)}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.productRow}>
            <View style={styles.productIcon}>
              <Ionicons color={Colors.primary} name="cube-outline" size={20} />
            </View>
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{item.nome}</Text>
              <Text style={styles.productMeta}>
                {item.categoria} - {item.quantidade} {item.unidade}
              </Text>
            </View>
            <Text style={styles.productPrice}>{formatCurrency(item.preco)}</Text>
          </View>
        )}
      />
    </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
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
    marginTop: Spacing.xl,
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: Typography.subtitle,
    fontWeight: '800',
  },
  sectionHint: {
    color: Colors.muted,
    fontSize: Typography.caption,
  },
  list: {
    gap: Spacing.sm,
    paddingBottom: 96,
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radii.large,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  productIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primarySoft,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    color: Colors.text,
    fontSize: Typography.body,
    fontWeight: '700',
  },
  productMeta: {
    color: Colors.muted,
    fontSize: Typography.small,
    marginTop: 2,
  },
  productPrice: {
    color: Colors.text,
    fontSize: Typography.body,
    fontWeight: '800',
  },
});
