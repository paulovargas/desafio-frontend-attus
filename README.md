# Desafio Frontend Attus

Aplicacao Angular para cadastro e listagem de usuarios usando Firebase Firestore.

## Stack

- Angular 19
- Angular Material
- Angular Fire
- Firebase Firestore
- RxJS
- Jest
- ngx-toastr

## Requisitos

- Node.js 18.19 ou superior
- npm
- Projeto Firebase com Firestore habilitado

## Instalacao do projeto

Clone o repositorio e acesse a pasta do projeto:

```bash
git clone <URL_DO_REPOSITORIO>
cd desafio-frontend-attus
```

Instale as dependencias:

```bash
npm install
```

## Configuracao do Firebase

O projeto usa Firebase Web App e Firestore. Antes de rodar a aplicacao, crie o arquivo local:

```text
src/environments/firebase-config.ts
```

Se a pasta ainda nao existir, crie tambem `src/environments`.

No console do Firebase:

1. Crie ou selecione um projeto.
2. Adicione um app Web.
3. Copie o objeto `firebaseConfig` gerado pelo Firebase.
4. Crie `src/environments/firebase-config.ts` com este formato:

```ts
export const firebaseConfig = {
  apiKey: 'SUA_API_KEY',
  authDomain: 'SEU_PROJECT_ID.firebaseapp.com',
  projectId: 'SEU_PROJECT_ID',
  storageBucket: 'SEU_PROJECT_ID.firebasestorage.app',
  messagingSenderId: 'SEU_MESSAGING_SENDER_ID',
  appId: 'SEU_APP_ID',
};
```

Esse arquivo esta no `.gitignore` para evitar versionar configuracoes locais.

## Firestore

No console do Firebase:

1. Ative o Firestore Database.
2. Crie a colecao `users`.
3. Configure regras de acesso adequadas ao ambiente.

Os documentos da colecao `users` usam estes campos:

```ts
{
  name: string;
  email: string;
  cpf: string;
  phone: string;
  phoneType: 'celular' | 'fixo';
}
```

Para desenvolvimento local, regras abertas podem ajudar em testes iniciais, mas nao devem ser usadas em producao:

```text
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

## Rodar localmente

```bash
npm start
```

Acesse:

```text
http://localhost:4200/
```

Se o arquivo `src/environments/firebase-config.ts` nao existir ou estiver incompleto, o build/serve falhara porque a aplicacao importa essa configuracao em `src/app/app.config.ts`.

## Build

```bash
npm run build
```

Os arquivos gerados ficam em `dist/desafio-frontend-attus`.

## Testes

Rodar a suite:

```bash
npm test -- --runInBand
```

Rodar cobertura:

```bash
npx jest --coverage --runInBand
```

No PowerShell, caso `npx jest` seja bloqueado pela execution policy, use:

```powershell
npx.cmd jest --coverage --runInBand
```

O relatorio HTML de cobertura fica em:

```text
coverage/lcov-report/index.html
```

## Checklist de execucao

Antes de avaliar ou publicar, rode:

```bash
npm install
npm run build
npm test -- --runInBand
npx jest --coverage --runInBand
```

No PowerShell, use `npx.cmd jest --coverage --runInBand` para o comando de coverage se necessario.

## Funcionalidades

- Listagem de usuarios cadastrados no Firestore.
- Busca por nome com debounce.
- Estado de carregamento e mensagem de erro na listagem.
- Cadastro, edicao e exclusao de usuarios por modal.
- Validacoes de e-mail, nome, CPF, telefone e tipo de telefone.
- Feedback visual com toast em acoes de sucesso e erro.
