import { Link } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { useAuth } from '../../src/contexts/AuthContext';
import { Colors, Radii, Spacing, Typography } from '../../src/constants/theme';

export default function LoginScreen() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('joao@email.com');
  const [password, setPassword] = useState('123456');

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Campos obrigatorios', 'Informe e-mail e senha para entrar.');
      return;
    }

    await login(email.trim(), password);
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}>
      <View style={styles.brand}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>P</Text>
        </View>
        <Text style={styles.appName}>ProEstoque</Text>
        <Text style={styles.subtitle}>Bem-vindo de volta</Text>
      </View>

      <View style={styles.form}>
        <Input
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="seu@email.com"
        />
        <Input
          label="Senha"
          value={password}
          onChangeText={setPassword}
          placeholder="Digite sua senha"
          secureTextEntry
        />
        <Button
          title="Entrar"
          onPress={handleLogin}
          loading={isLoading}
          disabled={isLoading}
          fullWidth
        />
      </View>

      <View style={styles.links}>
        <Link href="/cadastro" asChild>
          <Text style={styles.linkText}>Criar conta</Text>
        </Link>
        <Link href="/recuperar-senha" asChild>
          <Text style={styles.secondaryLink}>Esqueci minha senha</Text>
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.background,
  },
  brand: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: Radii.extraLarge,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    backgroundColor: Colors.primary,
  },
  logoText: {
    color: Colors.white,
    fontSize: 34,
    fontWeight: '800',
  },
  appName: {
    color: Colors.text,
    fontSize: Typography.hero,
    fontWeight: '800',
  },
  subtitle: {
    color: Colors.muted,
    fontSize: Typography.body,
    marginTop: Spacing.xs,
  },
  form: {
    gap: Spacing.md,
  },
  links: {
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  linkText: {
    color: Colors.primary,
    fontSize: Typography.body,
    fontWeight: '700',
  },
  secondaryLink: {
    color: Colors.muted,
    fontSize: Typography.small,
  },
});

