import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../constants/theme';

interface LogoProEstoqueProps {
  size?: 'small' | 'medium' | 'large';
  showSubtitle?: boolean;
}

export function LogoProEstoque({ size = 'medium', showSubtitle = true }: LogoProEstoqueProps) {
  const getIconSize = () => {
    switch (size) {
      case 'small': return 32;
      case 'large': return 64;
      default: return 48;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'small': return theme.typography.fontSize.lg;
      case 'large': return theme.typography.fontSize.xxxl;
      default: return theme.typography.fontSize.xxl;
    }
  };

  const getSubtitleSize = () => {
    switch (size) {
      case 'small': return theme.typography.fontSize.xs;
      case 'large': return theme.typography.fontSize.md;
      default: return theme.typography.fontSize.sm;
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, styles[`${size}IconContainer`]]}>
        <Ionicons
          name="cube-outline"
          size={getIconSize()}
          color={theme.colors.primary}
        />
      </View>
      <Text style={[styles.title, { fontSize: getTextSize() }]}>
        ProEstoque
      </Text>
      {showSubtitle && (
        <Text style={[styles.subtitle, { fontSize: getSubtitleSize() }]}>
          Gerencie seu estoque com eficiência
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  iconContainer: {
    marginBottom: theme.spacing.md,
  },
  smallIconContainer: {
    marginBottom: theme.spacing.sm,
  },
  mediumIconContainer: {
    marginBottom: theme.spacing.md,
  },
  largeIconContainer: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    color: theme.colors.textLight,
    textAlign: 'center',
  },
});