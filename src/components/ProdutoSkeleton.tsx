import { StyleSheet, View } from 'react-native';

import { Colors, Radii, Spacing } from '../constants/theme';
import { Skeleton } from './Skeleton';

export function ProdutoSkeleton() {
  return (
    <View style={styles.row}>
      <Skeleton width={48} height={48} radius={Radii.medium} />
      <View style={styles.content}>
        <Skeleton width="74%" height={16} />
        <Skeleton width="48%" height={12} />
      </View>
      <View style={styles.trailing}>
        <Skeleton width={48} height={14} />
        <Skeleton width={62} height={22} radius={999} />
      </View>
    </View>
  );
}

export function ProdutoSkeletonList({ count = 5 }: { count?: number }) {
  return (
    <View style={styles.list}>
      {Array.from({ length: count }).map((_, index) => (
        <ProdutoSkeleton key={index} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radii.large,
    backgroundColor: Colors.card,
  },
  content: {
    flex: 1,
    gap: Spacing.sm,
  },
  trailing: {
    alignItems: 'flex-end',
    gap: Spacing.sm,
  },
});
