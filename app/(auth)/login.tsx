import { Link } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { LogoProEstoque } from '../../src/components/LogoProEstoque';
import { Colors, Spacing, Typography } from '../../src/constants/theme';
import { useAuth } from '../../src/contexts/AuthContext';

export default function LoginScreen() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('joao@email.com');
  const [password, setPassword] = useState('123456');

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Campos obrigatorios', 'Informe e-mail e senha para entrar.');
      return;
    }

    try {
      await login(email.trim(), password);
    } catch (error) {
      Alert.alert('Nao foi possivel entrar', error instanceof Error ? error.message : 'Tente novamente.');
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}>
        <View style={styles.brand}>
          <LogoProEstoque size="lg" />
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
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
