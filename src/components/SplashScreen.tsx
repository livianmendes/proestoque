import { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, StyleSheet, Text, View } from 'react-native';

import { Colors, Radii, Spacing, Typography } from '../constants/theme';

export function SplashScreen() {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: 1500,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  const width = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['12%', '100%'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Text style={styles.logoText}>P</Text>
      </View>
      <Text style={styles.name}>ProEstoque</Text>
      <Text style={styles.message}>Verificando sessao...</Text>
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, { width }]} />
      </View>
      <ActivityIndicator color={Colors.primary} style={styles.indicator} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.background,
  },
  logo: {
    width: 84,
    height: 84,
    borderRadius: Radii.extraLarge,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 8,
  },
  logoText: {
    color: Colors.white,
    fontSize: 40,
    fontWeight: '900',
  },
  name: {
    color: Colors.text,
    fontSize: Typography.hero,
    fontWeight: '900',
    marginTop: Spacing.md,
  },
  message: {
    color: Colors.muted,
    fontSize: Typography.body,
    marginTop: Spacing.xs,
  },
  progressTrack: {
    width: '72%',
    height: 8,
    overflow: 'hidden',
    borderRadius: Radii.small,
    marginTop: Spacing.lg,
    backgroundColor: Colors.primarySoft,
  },
  progressFill: {
    height: '100%',
    borderRadius: Radii.small,
    backgroundColor: Colors.primary,
  },
  indicator: {
    marginTop: Spacing.lg,
  },
});

