import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { LogoProEstoque } from '../../src/components/LogoProEstoque';
import { theme } from '../../src/constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <LogoProEstoque size="medium" />

          <Text style={styles.welcomeText}>Bem-vindo de volta</Text>

          <Input
            label="E-mail"
            icon="mail-outline"
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Input
            label="Senha"
            icon="lock-closed-outline"
            placeholder="Digite sua senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity
            onPress={() => router.push('/(auth)/recuperar-senha')}
            style={styles.forgotButton}
          >
            <Text style={styles.forgotText}>Esqueci minha senha</Text>
          </TouchableOpacity>

          <Button title="Entrar" onPress={handleLogin} fullWidth />

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Não tem conta? </Text>
            <TouchableOpacity onPress={() => router.push('/(auth)/cadastro')}>
              <Text style={styles.registerLink}>Cadastrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  welcomeText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: theme.spacing.lg,
  },
  forgotText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
  },
  registerText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },
  registerLink: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});