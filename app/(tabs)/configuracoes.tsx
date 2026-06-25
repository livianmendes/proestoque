import { Ionicons } from '@expo/vector-icons';
import { Alert, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Radii, Spacing, Typography } from '../../src/constants/theme';
import { useAuth } from '../../src/contexts/AuthContext';

const menuItems = [
  { icon: 'notifications-outline', label: 'Notificacoes' },
  { icon: 'color-palette-outline', label: 'Aparencia' },
  { icon: 'help-circle-outline', label: 'Ajuda' },
] as const;

export default function ConfiguracoesScreen() {
  const { user, logout } = useAuth();
  const nome = user?.nome ?? 'Usuario';
  const email = user?.email ?? 'usuario@email.com';
  const inicial = nome.charAt(0).toUpperCase();

  function confirmLogout() {
    if (Platform.OS === 'web') {
      logout();
      return;
    }

    Alert.alert('Sair da conta', 'Tem certeza que deseja encerrar sua sessao?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuracoes</Text>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{inicial}</Text>
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{nome}</Text>
          <Text style={styles.profileEmail}>{email}</Text>
        </View>
      </View>

      <View style={styles.menu}>
        {menuItems.map((item) => (
          <Pressable key={item.label} style={styles.menuRow}>
            <View style={styles.menuIcon}>
              <Ionicons color={Colors.primary} name={item.icon} size={20} />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons color={Colors.muted} name="chevron-forward" size={20} />
          </Pressable>
        ))}
      </View>

      <Pressable style={styles.logoutButton} onPress={confirmLogout}>
        <Ionicons color={Colors.danger} name="log-out-outline" size={20} />
        <Text style={styles.logoutText}>Sair da conta</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.background,
  },
  title: {
    color: Colors.text,
    fontSize: Typography.title,
    fontWeight: '800',
    marginBottom: Spacing.lg,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radii.large,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
  },
  avatarText: {
    color: Colors.white,
    fontSize: Typography.subtitle,
    fontWeight: '800',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: Colors.text,
    fontSize: Typography.body,
    fontWeight: '800',
  },
  profileEmail: {
    color: Colors.muted,
    fontSize: Typography.small,
    marginTop: 2,
  },
  menu: {
    gap: Spacing.sm,
    marginTop: Spacing.xl,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radii.large,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primarySoft,
  },
  menuLabel: {
    flex: 1,
    color: Colors.text,
    fontSize: Typography.body,
    fontWeight: '700',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: 'auto',
    marginBottom: 96,
    paddingVertical: Spacing.md,
    borderRadius: Radii.large,
    borderWidth: 1,
    borderColor: Colors.dangerBorder,
    backgroundColor: Colors.dangerSoft,
  },
  logoutText: {
    color: Colors.danger,
    fontSize: Typography.body,
    fontWeight: '800',
  },
});
