import type { User } from './user';

export interface AuthorizedUser extends User {
  isAuthorized: true;
  id: string;
  email: string;
  name?: string;
  surname?: string;
  patronymic?: string;
  password?: string;
  birthdate?: string;
  sex?: 'male' | 'female';
  weight?: number;
  height?: number;
}
