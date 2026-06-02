import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors, Radii, Spacing, Typography } from '../constants/theme';

type ImagePickerFieldProps = {
  value?: string;
  onChange: (uri: string) => void;
};

export function ImagePickerField({ value, onChange }: ImagePickerFieldProps) {
  async function handlePickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('Permissao necessaria', 'Permita o acesso as fotos para escolher uma imagem.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.75,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      onChange(result.assets[0].uri);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Foto do produto</Text>
      <Pressable style={styles.field} onPress={handlePickImage}>
        {value ? (
          <Image source={{ uri: value }} style={styles.preview} />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons color={Colors.primary} name="image-outline" size={26} />
          </View>
        )}
        <View style={styles.textContent}>
          <Text style={styles.title}>{value ? 'Trocar foto' : 'Selecionar foto'}</Text>
          <Text style={styles.subtitle}>Opcional</Text>
        </View>
        <Ionicons color={Colors.muted} name="chevron-forward" size={20} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.xs,
  },
  label: {
    color: Colors.text,
    fontSize: Typography.small,
    fontWeight: '800',
  },
  field: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.sm,
    borderRadius: Radii.medium,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.card,
  },
  placeholder: {
    width: 52,
    height: 52,
    borderRadius: Radii.medium,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primarySoft,
  },
  preview: {
    width: 52,
    height: 52,
    borderRadius: Radii.medium,
  },
  textContent: {
    flex: 1,
  },
  title: {
    color: Colors.text,
    fontSize: Typography.body,
    fontWeight: '800',
  },
  subtitle: {
    color: Colors.muted,
    fontSize: Typography.small,
    marginTop: 2,
  },
});

