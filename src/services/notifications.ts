import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { Colors } from '../constants/theme';
import type { Produto } from '../contexts/ProductsContext';

const DAILY_IDENTIFIER = 'proestoque-estoque-critico-diario';
let lastLowStockHash = '';

export async function solicitarPermissao() {
  if (!Device.isDevice) {
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('estoque', {
      name: 'Estoque',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: Colors.primary,
    });
  }

  const current = await Notifications.getPermissionsAsync();
  const finalStatus =
    current.status === 'granted'
      ? current.status
      : (await Notifications.requestPermissionsAsync()).status;

  return finalStatus === 'granted';
}

export async function notificarEstoqueCritico(produtos: Produto[]) {
  const produtosCriticos = produtos.filter(
    (produto) => produto.quantidade === 0 || produto.quantidade <= produto.quantidadeMinima
  );

  if (produtosCriticos.length === 0) {
    lastLowStockHash = '';
    await Notifications.setBadgeCountAsync(0).catch(() => false);
    return;
  }

  const hash = produtosCriticos
    .map((produto) => `${produto.id}:${produto.quantidade}:${produto.quantidadeMinima}`)
    .sort()
    .join('|');

  if (hash === lastLowStockHash) {
    return;
  }

  const permitido = await solicitarPermissao();

  if (!permitido) {
    return;
  }

  const primeiro = produtosCriticos[0];

  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'Estoque critico',
      body:
        produtosCriticos.length === 1
          ? `${primeiro.nome}: ${primeiro.quantidade}/${primeiro.quantidadeMinima} abaixo do minimo`
          : `${produtosCriticos.length} produtos precisam de reposicao.`,
      sound: true,
      badge: produtosCriticos.length,
    },
    trigger: null,
  });

  await Notifications.setBadgeCountAsync(produtosCriticos.length).catch(() => false);
  lastLowStockHash = hash;
}

export async function agendarVerificacaoDiaria() {
  const permitido = await solicitarPermissao();

  if (!permitido) {
    return;
  }

  const agendadas = await Notifications.getAllScheduledNotificationsAsync();
  const jaExiste = agendadas.some((notification) => notification.identifier === DAILY_IDENTIFIER);

  if (jaExiste) {
    return;
  }

  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_IDENTIFIER,
    content: {
      title: 'ProEstoque',
      body: 'Confira os produtos com estoque critico hoje.',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 8,
      minute: 0,
      channelId: 'estoque',
    },
  });
}
