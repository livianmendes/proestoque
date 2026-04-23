import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Text,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Input } from '../../src/components/Input';
import { Button } from '../../src/components/Button';
import { LogoProEstoque } from '../../src/components/LogoProEstoque';
import { theme } from '../../src/constants/theme';

export default function RecuperarSenhaScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!email) {
      Alert.alert('Erro', 'Digite seu e-mail');
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <LogoProEstoque size="small" />
          
          <View style={styles.successContainer}>
            <Text style={styles.successTitle}>E-mail enviado!</Text>
            <Text style={styles.successMessage}>
              Enviamos um link de recuperação para {'\n'}
              <Text style={styles.emailText}>{email}</Text>
            </Text>
            <Text style={styles.instructionText}>
              Verifique sua caixa de entrada e siga as instruções.
            </Text>
          </View>

          <Button
            title="Voltar ao Login"
            onPress={() => router.push('/(auth)/login')}
            fullWidth
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          <LogoProEstoque size="small" />

          <Text style={styles.title}>Recuperar senha</Text>
          
          <Text style={styles.description}>
            Informe seu e-mail e enviaremos um link de recuperação
          </Text>

          <Input
            label="E-mail"
            icon="mail-outline"
            placeholder="seu@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Button title="Enviar" onPress={handleSend} fullWidth />

          <Button
            title="Voltar ao Login"
            onPress={() => router.back()}
            variant="outline"
            fullWidth
            style={styles.backButton}
          />
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
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  description: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  backButton: {
    marginTop: theme.spacing.md,
  },
  successContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  successTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.success,
    marginBottom: theme.spacing.md,
  },
  successMessage: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  emailText: {
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
  },
  instructionText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textLight,
    textAlign: 'center',
  },
});