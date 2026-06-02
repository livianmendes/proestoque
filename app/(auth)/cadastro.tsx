import { Link } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { Colors, Spacing, Typography } from '../../src/constants/theme';
import { useAuth } from '../../src/contexts/AuthContext';

export default function CadastroScreen() {
  const { login, isLoading } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  async function handleCadastro() {
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      Alert.alert('Cadastro incompleto', 'Preencha nome, e-mail e senha.');
      return;
    }

    await login(email.trim(), senha, nome.trim());
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar conta</Text>
      <Text style={styles.subtitle}>Comece a organizar seu estoque em poucos segundos.</Text>

      <View style={styles.form}>
        <Input label="Nome" value={nome} onChangeText={setNome} placeholder="Seu nome" />
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
          value={senha}
          onChangeText={setSenha}
          placeholder="Crie uma senha"
          secureTextEntry
        />
        <Button
          title="Cadastrar"
          onPress={handleCadastro}
          loading={isLoading}
          disabled={isLoading}
          fullWidth
        />
      </View>

      <Link href="/login" asChild>
        <Text style={styles.link}>Ja tenho uma conta</Text>
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

