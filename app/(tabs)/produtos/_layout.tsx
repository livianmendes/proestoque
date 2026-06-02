import { Stack } from 'expo-router';

import { Colors } from '../../../src/constants/theme';

export default function ProdutosLayout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: Colors.primary,
        headerTitleStyle: { color: Colors.text },
        headerShadowVisible: false,
      }}>
      <Stack.Screen name="index" options={{ title: 'Produtos' }} />
      <Stack.Screen name="novo" options={{ title: 'Novo Produto' }} />
      <Stack.Screen name="[id]" options={{ title: 'Editar Produto' }} />
    </Stack>
  );
}

