import { Link } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '../../src/components/Button';
import { Input } from '../../src/components/Input';
import { LogoProEstoque } from '../../src/components/LogoProEstoque';
import { Colors, Spacing, Typography } from '../../src/constants/theme';
import { useAuth } from '../../src/contexts/AuthContext';

export default function CadastroScreen() {
  const { registrar, isLoading } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [senhaError, setSenhaError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCadastro() {
    setSenhaError('');

    if (!nome.trim() || !email.trim() || !senha.trim() || !confirmarSenha.trim()) {
      Alert.alert('Cadastro incompleto', 'Preencha nome, e-mail, senha e confirmar senha.');
      return;
    }

    if (senha !== confirmarSenha) {
      setSenhaError('As senhas nao coincidem');
      return;
    }

    setIsSubmitting(true);

    try {
      await Promise.all([registrar(nome.trim(), email.trim(), senha), wait(2000)]);
    } catch (error) {
      Alert.alert('Nao foi possivel cadastrar', error instanceof Error ? error.message : 'Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled">
      <LogoProEstoque size="md" />
      <View>
        <Text style={styles.title}>Criar conta</Text>
        <Text style={styles.subtitle}>Comece a organizar seu estoque em poucos segundos.</Text>
      </View>

      <View style={styles.form}>
        <Input label="Nome completo" value={nome} onChangeText={setNome} placeholder="Joao Silva" />
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
        <Input
          label="Confirmar senha"
          value={confirmarSenha}
          onChangeText={setConfirmarSenha}
          placeholder="Confirme sua senha"
          secureTextEntry
          error={senhaError}
        />
        <Button
          title="Criar Conta"
          onPress={handleCadastro}
          loading={isLoading || isSubmitting}
          disabled={isLoading || isSubmitting}
          fullWidth
        />
      </View>

      <Link href="/login" asChild>
        <Text style={styles.link}>Ja tenho uma conta</Text>
      </Link>
    </ScrollView>
  );
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: Spacing.lg,
    padding: Spacing.xl,
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
