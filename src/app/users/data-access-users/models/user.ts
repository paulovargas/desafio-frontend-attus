export interface User {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  phoneType: 'celular' | 'fixo';
}

export type CreateUser = Omit<User, 'id'>;
