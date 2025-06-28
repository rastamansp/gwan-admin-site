# Sistema de Versionamento

Este documento descreve como o sistema de versionamento funciona na aplicação Gwan Admin.

## Como funciona

A versão da aplicação é armazenada no arquivo `package.json` e é automaticamente exibida no header da aplicação ao lado do nome "gwan".

### Estrutura da versão

A versão segue o padrão [Semantic Versioning](https://semver.org/):

- **MAJOR.MINOR.PATCH** (ex: 1.0.0)
  - **MAJOR**: Mudanças incompatíveis com versões anteriores
  - **MINOR**: Novas funcionalidades compatíveis com versões anteriores
  - **PATCH**: Correções de bugs compatíveis com versões anteriores

## Como atualizar a versão

### Método 1: Script automatizado (Recomendado)

```bash
npm run version:update 1.0.1
```

### Método 2: Edição manual

1. Edite o arquivo `package.json`
2. Atualize o campo `version`
3. Execute `npm run build` para aplicar as mudanças

## Arquivos relacionados

- `package.json` - Armazena a versão atual
- `vite.config.ts` - Injeta a versão como variável de ambiente
- `src/utils/version.ts` - Utilitário para acessar a versão
- `src/components/layout/Header.tsx` - Exibe a versão no header
- `src/vite-env.d.ts` - Tipos TypeScript para a variável de ambiente

## Fluxo de desenvolvimento

1. Desenvolva suas funcionalidades
2. Atualize a versão usando `npm run version:update <nova-versão>`
3. Faça commit das alterações
4. Execute `npm run build` para gerar a build de produção
5. A versão será exibida automaticamente no header da aplicação

## Exemplo de uso

```bash
# Atualizar para versão 1.1.0 (nova funcionalidade)
npm run version:update 1.1.0

# Atualizar para versão 1.0.1 (correção de bug)
npm run version:update 1.0.1

# Atualizar para versão 2.0.0 (mudança incompatível)
npm run version:update 2.0.0
```
