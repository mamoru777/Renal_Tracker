export type User = {
  id: string;
  name?: string;
  surname?: string;
  patronymic?: string;
  password?: string;
  email: string;
  birthdate?: string;
  sex?: 'male' | 'female';
  weight?: number;
  height?: number;
};
