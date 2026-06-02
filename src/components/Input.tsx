import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { Colors, Radii, Spacing, Typography } from '../constants/theme';

type InputProps = TextInputProps & {
  label: string;
};

export function Input({ label, style, ...props }: InputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor={Colors.muted}
        style={[styles.input, style]}
        selectionColor={Colors.primary}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  label: {
    color: Colors.text,
    fontSize: Typography.small,
    fontWeight: '800',
  },
  input: {
    minHeight: 52,
    paddingHorizontal: Spacing.md,
    borderRadius: Radii.medium,
    borderWidth: 1,
    borderColor: Colors.border,
    color: Colors.text,
    fontSize: Typography.body,
    backgroundColor: Colors.card,
  },
});

