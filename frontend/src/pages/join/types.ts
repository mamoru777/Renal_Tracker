import { SEX_VALUES } from '@/components/input/sex';

export type JoinForm = {
  name: string;
  surname: string;
  patronymic: string;
  email: string;
  password: string;
  password2: string;
  birthdate: Date;
  sex: (typeof SEX_VALUES)[keyof typeof SEX_VALUES];
};
