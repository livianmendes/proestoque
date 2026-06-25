# ProEstoque

Aplicativo mobile do ProEstoque desenvolvido nas aulas de Desenvolvimento de Aplicacoes Moveis.

## Como rodar

```bash
npm install
npm start
```

Para testar no celular na mesma rede, configure o arquivo `.env` com a URL da API:

```env
EXPO_PUBLIC_API_URL=http://SEU_IP:3333/api
```

## Validacoes

```bash
npm run typecheck
npm run lint
npm test
npm run test:coverage
```

## Cobertura de testes

Relatorio gerado com `npm run test:coverage -- --runInBand`:

| Arquivo | Stmts | Branch | Funcs | Lines |
| --- | ---: | ---: | ---: | ---: |
| All files | 100% | 65.21% | 100% | 100% |
| src/utils/formatters.ts | 100% | 100% | 100% | 100% |
| src/hooks/useCategorias.ts | 100% | 50% | 100% | 100% |
| src/hooks/useEstoque.ts | 100% | 100% | 100% | 100% |
| src/components/ProductCard.tsx | 100% | 69.23% | 100% | 100% |

## Entrega final

- Skeleton loading na lista de produtos e dashboard
- Notificacoes locais para estoque critico
- AuthContext conectado a API real
- ProductsContext consumindo produtos da API
- Testes unitarios e de integracao configurados com Jest

## Aula 14 - Publicacao

- `app.json` com `package`, `version`, `versionCode`, `bundleIdentifier`, icon, splash e adaptive icon
- `eas.json` com perfil `production` em `app-bundle` e `autoIncrement`
- Assets da loja em `assets/store/`
- Politica de privacidade, Data Safety e textos da Play Store em `store/`

Para gerar o AAB de producao:

```bash
npm run build:android:production
```

Para enviar para teste interno via EAS Submit:

```bash
npm run submit:android:production
```
