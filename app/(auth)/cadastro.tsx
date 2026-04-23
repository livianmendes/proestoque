import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
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

export default function CadastroScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setPasswordError('As senhas não coincidem');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleRegister = () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (!validatePasswords()) {
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Sucesso', 'Conta criada com sucesso!', [
        { text: 'OK', onPress: () => router.push('/(auth)/login') },
      ]);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <LogoProEstoque size="small" showSubtitle={false} />

            <Text style={styles.title}>Criar conta</Text>

            <Input
              label="Nome completo"
              icon="person-outline"
              placeholder="Digite seu nome"
              value={name}
              onChangeText={setName}
            />

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
              onChangeText={(text) => {
                setPassword(text);
                if (confirmPassword) validatePasswords();
              }}
            />

            <Input
              label="Confirmar senha"
              icon="lock-closed-outline"
              placeholder="Confirme sua senha"
              secureTextEntry
              error={passwordError}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (password) validatePasswords();
              }}
            />

            <Button
              title="Criar Conta"
              onPress={handleRegister}
              fullWidth
              loading={loading}
            />

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Já tenho conta? </Text>
              <TouchableOpacity onPress={() => router.back()}>
                <Text style={styles.loginLink}>Fazer login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.xl,
    textAlign: 'center',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
  },
  loginText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
  },
  loginLink: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});