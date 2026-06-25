# Materiais da Play Store

Materiais preparados para a Aula 14.

## Assets

- Icone do app: `assets/icon.png` (1024x1024)
- Adaptive icon Android: `assets/adaptive-icon.png` (1024x1024)
- Splash screen: `assets/splash.png` (1284x2778)
- Feature graphic: `assets/store/feature-graphic.png` (1024x500)
- Screenshots: `assets/store/screenshots/`
  - `01-dashboard.png`
  - `02-lista-produtos.png`
  - `03-formulario-produto.png`

## Build de producao

```bash
npm run build:android:production
```

O perfil `production` gera AAB com `buildType: app-bundle` e `autoIncrement: true`.

## Envio para teste interno

```bash
npm run submit:android:production
```

Esse comando depende da conta Google Play configurada no EAS Submit.

## Pendencias externas

- Criar conta no Google Play Console
- Criar o app no Console
- Publicar a politica de privacidade em URL publica
- Preencher Data Safety e classificacao de conteudo
- Enviar o AAB para teste interno
