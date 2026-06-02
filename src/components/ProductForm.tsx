import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';

import { Colors, Spacing, Typography } from '../constants/theme';
import { produtoDefaultValues, ProdutoFormData, produtoSchema } from '../schemas/produtoSchema';
import { Button } from './Button';
import { ImagePickerField } from './ImagePickerField';
import { Input } from './Input';

type ProductFormProps = {
  initialValues?: ProdutoFormData;
  submitLabel: string;
  onSubmit: (data: ProdutoFormData) => Promise<void>;
};

export function ProductForm({ initialValues, submitLabel, onSubmit }: ProductFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProdutoFormData>({
    resolver: zodResolver(produtoSchema),
    defaultValues: initialValues ?? produtoDefaultValues,
  });

  return (
    <View style={styles.form}>
      <Controller
        control={control}
        name="foto"
        render={({ field: { value, onChange } }) => (
          <ImagePickerField value={value} onChange={onChange} />
        )}
      />

      <FormField error={errors.nome?.message}>
        <Controller
          control={control}
          name="nome"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              label="Nome do produto *"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Feijao Carioca 1kg"
            />
          )}
        />
      </FormField>

      <FormField error={errors.categoria?.message}>
        <Controller
          control={control}
          name="categoria"
          render={({ field: { value, onChange, onBlur } }) => (
            <Input
              label="Categoria *"
              value={value}
              onBlur={onBlur}
              onChangeText={onChange}
              placeholder="Alimentos"
            />
          )}
        />
      </FormField>

      <View style={styles.row}>
        <FormField error={errors.quantidade?.message} style={styles.flex}>
          <Controller
            control={control}
            name="quantidade"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                label="Quantidade *"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                keyboardType="numeric"
                placeholder="12"
              />
            )}
          />
        </FormField>

        <FormField error={errors.unidade?.message} style={styles.unitField}>
          <Controller
            control={control}
            name="unidade"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                label="Unidade *"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="un"
              />
            )}
          />
        </FormField>
      </View>

      <View style={styles.row}>
        <FormField error={errors.quantidadeMinima?.message} style={styles.flex}>
          <Controller
            control={control}
            name="quantidadeMinima"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                label="Quantidade minima *"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                keyboardType="numeric"
                placeholder="5"
              />
            )}
          />
        </FormField>

        <FormField error={errors.preco?.message} style={styles.flex}>
          <Controller
            control={control}
            name="preco"
            render={({ field: { value, onChange, onBlur } }) => (
              <Input
                label="Preco (R$) *"
                value={value}
                onBlur={onBlur}
                onChangeText={onChange}
                keyboardType="decimal-pad"
                placeholder="32,90"
              />
            )}
          />
        </FormField>
      </View>

      <Controller
        control={control}
        name="observacao"
        render={({ field: { value, onChange, onBlur } }) => (
          <Input
            label="Observacao"
            value={value}
            onBlur={onBlur}
            onChangeText={onChange}
            placeholder="Opcional"
            multiline
            style={styles.textArea}
          />
        )}
      />

      <Button
        title={submitLabel}
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        disabled={isSubmitting}
        fullWidth
      />
    </View>
  );
}

function FormField({
  children,
  error,
  style,
}: {
  children: React.ReactNode;
  error?: string;
  style?: object;
}) {
  return (
    <View style={[styles.field, style]}>
      {children}
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: Spacing.md,
  },
  field: {
    gap: Spacing.xs,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  flex: {
    flex: 1,
  },
  unitField: {
    width: 96,
  },
  textArea: {
    minHeight: 96,
    paddingTop: Spacing.md,
    textAlignVertical: 'top',
  },
  error: {
    color: Colors.danger,
    fontSize: Typography.small,
    fontWeight: '700',
  },
});

