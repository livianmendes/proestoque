import { Link } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { LogoProEstoque } from '../../src/components/LogoProEstoque';
import { Colors, Spacing, Typography } from '../../src/constants/theme';

export default function RecuperarSenhaScreen() {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  function handleRecover() {
    if (!email.trim()) {
      Alert.alert('E-mail obrigatorio', 'Informe o e-mail cadastrado.');
      return;
    }

    setSuccess(true);
  }

  return (
    <View style={styles.container}>
      <LogoProEstoque size="sm" />
      <Text style={styles.title}>Recuperar senha</Text>
      <Text style={styles.subtitle}>Informe seu e-mail e enviaremos um link de recuperacao</Text>

      {success ? (
        <View style={styles.successBox}>
          <Text style={styles.successIcon}>OK</Text>
          <Text style={styles.successTitle}>E-mail enviado!</Text>
          <Text style={styles.successText}>Verifique sua caixa de entrada.</Text>
        </View>
      ) : (
        <View style={styles.form}>
          <Input
            label="E-mail"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="seu@email.com"
          />
          <Button title="Enviar" onPress={handleRecover} fullWidth />
        </View>
      )}

      <Link href="/login" asChild>
        <Text style={styles.link}>Voltar ao Login</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.background,
  },
  title: {
    color: Colors.text,
    fontSize: Typography.title,
    fontWeight: '800',
  },
  subtitle: {
    color: Colors.muted,
    fontSize: Typography.body,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  form: {
    gap: Spacing.md,
  },
  successBox: {
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
  },
  successIcon: {
    color: Colors.success,
    fontSize: Typography.subtitle,
    fontWeight: '900',
  },
  successTitle: {
    color: Colors.text,
    fontSize: Typography.subtitle,
    fontWeight: '800',
  },
  successText: {
    color: Colors.muted,
    fontSize: Typography.body,
  },
  link: {
    alignSelf: 'center',
    color: Colors.primary,
    fontSize: Typography.body,
    fontWeight: '700',
    marginTop: Spacing.lg,
  },
});

