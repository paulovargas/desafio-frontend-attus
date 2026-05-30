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

- Node.js compativel com Angular 19
- npm
- Projeto Firebase com Firestore habilitado

## Instalacao

Instale as dependencias:

```bash
npm install
```

## Configuracao do Firebase

A aplicacao espera um arquivo local em:

```text
src/environments/firebase-config.ts
```

Crie o arquivo com a configuracao do seu projeto Firebase:

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

Esse arquivo esta no `.gitignore` para evitar versionar credenciais/configuracoes locais.

## Firestore

No console do Firebase:

1. Crie ou selecione um projeto.
2. Ative o Firestore Database.
3. Crie a colecao `users`.
4. Configure regras de acesso adequadas ao ambiente.

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

## Funcionalidades

- Listagem de usuarios cadastrados no Firestore.
- Busca por nome com debounce.
- Estado de carregamento e mensagem de erro na listagem.
- Cadastro e edicao de usuarios por modal.
- Validacoes de e-mail, nome, CPF, telefone e tipo de telefone.
- Feedback visual com toast em acoes de sucesso e erro.
