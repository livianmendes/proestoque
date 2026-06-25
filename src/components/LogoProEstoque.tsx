import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, Radii, Spacing, Typography } from '../constants/theme';

type LogoProEstoqueProps = {
  size?: 'sm' | 'md' | 'lg';
};

const sizes = {
  sm: { iconBox: 40, icon: 20, title: Typography.subtitle },
  md: { iconBox: 56, icon: 28, title: Typography.title },
  lg: { iconBox: 72, icon: 36, title: Typography.hero },
};

export function LogoProEstoque({ size = 'lg' }: LogoProEstoqueProps) {
  const current = sizes[size];

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.iconBox,
          {
            width: current.iconBox,
            height: current.iconBox,
            borderRadius: Math.min(current.iconBox / 3, Radii.extraLarge),
          },
        ]}>
        <Ionicons color={Colors.white} name="cube-outline" size={current.icon} />
      </View>
      <Text style={[styles.title, { fontSize: current.title }]}>ProEstoque</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
  },
  title: {
    color: Colors.text,
    fontWeight: '800',
  },
});
