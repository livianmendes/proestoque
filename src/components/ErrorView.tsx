import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Radii, Spacing, Typography } from '../constants/theme';

type ErrorViewProps = {
  mensagem: string;
  onRetry?: () => void;
};

export function ErrorView({ mensagem, onRetry }: ErrorViewProps) {
  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Ionicons color={Colors.danger} name="cloud-offline-outline" size={34} />
      </View>
      <Text style={styles.title}>Algo deu errado</Text>
      <Text style={styles.message}>{mensagem}</Text>
      {onRetry ? (
        <Pressable style={({ pressed }) => [styles.button, pressed && styles.pressed]} onPress={onRetry}>
          <Text style={styles.buttonText}>Tentar novamente</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    padding: Spacing.xl,
    backgroundColor: Colors.background,
  },
  icon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.dangerSoft,
  },
  title: {
    color: Colors.text,
    fontSize: Typography.subtitle,
    fontWeight: '800',
  },
  message: {
    color: Colors.muted,
    fontSize: Typography.body,
    textAlign: 'center',
  },
  button: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radii.medium,
    backgroundColor: Colors.primary,
  },
  pressed: {
    opacity: 0.72,
  },
  buttonText: {
    color: Colors.white,
    fontSize: Typography.body,
    fontWeight: '800',
  },
});
