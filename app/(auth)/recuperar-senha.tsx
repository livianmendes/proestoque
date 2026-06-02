import { Link } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { Colors, Spacing, Typography } from '../../src/constants/theme';

export default function RecuperarSenhaScreen() {
  const [email, setEmail] = useState('');

  function handleRecover() {
    if (!email.trim()) {
      Alert.alert('E-mail obrigatorio', 'Informe o e-mail cadastrado.');
      return;
    }

    Alert.alert('Recuperacao enviada', 'Confira sua caixa de entrada para continuar.');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recuperar senha</Text>
      <Text style={styles.subtitle}>Enviaremos instrucoes para o e-mail cadastrado.</Text>

      <View style={styles.form}>
        <Input
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="seu@email.com"
        />
        <Button title="Enviar instrucoes" onPress={handleRecover} fullWidth />
      </View>

      <Link href="/login" asChild>
        <Text style={styles.link}>Voltar para o login</Text>
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
  link: {
    alignSelf: 'center',
    color: Colors.primary,
    fontSize: Typography.body,
    fontWeight: '700',
    marginTop: Spacing.lg,
  },
});

