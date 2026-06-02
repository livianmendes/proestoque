import { ActivityIndicator, Pressable, StyleProp, StyleSheet, Text, ViewStyle } from 'react-native';

import { Colors, Radii, Spacing, Typography } from '../constants/theme';

type ButtonProps = {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  style?: StyleProp<ViewStyle>;
};

export function Button({
  title,
  onPress,
  disabled = false,
  loading = false,
  fullWidth = false,
  variant = 'primary',
  style,
}: ButtonProps) {
  const isSecondary = variant === 'secondary';
  const isDanger = variant === 'danger';
  const backgroundColor = isSecondary ? Colors.card : isDanger ? '#fef2f2' : Colors.primary;
  const textColor = isSecondary ? Colors.primary : isDanger ? Colors.danger : Colors.white;
  const borderColor = isSecondary ? Colors.primary : isDanger ? '#fecaca' : Colors.primary;

  return (
    <Pressable
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        fullWidth && styles.fullWidth,
        {
          backgroundColor,
          borderColor,
          opacity: pressed || disabled ? 0.74 : 1,
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <Text style={[styles.text, { color: textColor }]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radii.medium,
    borderWidth: 1,
  },
  fullWidth: {
    width: '100%',
  },
  text: {
    fontSize: Typography.body,
    fontWeight: '800',
  },
});
