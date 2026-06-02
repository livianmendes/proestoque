import { Ionicons } from '@expo/vector-icons';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Colors, Radii, Spacing, Typography } from '../../src/constants/theme';
import { produtos } from '../../src/data/mockData';

export default function ProdutosScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Produtos</Text>
      <Text style={styles.subtitle}>Lista usada no dashboard da Aula 6.</Text>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={styles.icon}>
              <Ionicons color={Colors.primary} name="cube-outline" size={22} />
            </View>
            <View style={styles.content}>
              <Text style={styles.name}>{item.nome}</Text>
              <Text style={styles.meta}>
                {item.categoria} - estoque minimo {item.estoqueMinimo}
              </Text>
            </View>
            <View style={styles.stockPill}>
              <Text style={styles.stockText}>{item.estoque}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.background,
  },
  title: {
    color: Colors.text,
    fontSize: Typography.title,
    fontWeight: '800',
  },
  subtitle: {
    color: Colors.muted,
    fontSize: Typography.body,
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  list: {
    gap: Spacing.sm,
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
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primarySoft,
  },
  content: {
    flex: 1,
  },
  name: {
    color: Colors.text,
    fontSize: Typography.body,
    fontWeight: '700',
  },
  meta: {
    color: Colors.muted,
    fontSize: Typography.small,
    marginTop: 2,
  },
  stockPill: {
    minWidth: 40,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: Radii.medium,
    alignItems: 'center',
    backgroundColor: Colors.primarySoft,
  },
  stockText: {
    color: Colors.primary,
    fontWeight: '800',
  },
});

