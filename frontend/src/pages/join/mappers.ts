import type { User } from '@/models';
import type { JoinForm } from './types';

export function mapFormToUser(form: JoinForm): Omit<User, 'id'> {
  const { birthdate, email, name, surname, patronymic, password, sex } = form;

  return {
    birthdate: new Date(
      Date.UTC(
        birthdate.getFullYear(),
        birthdate.getMonth(),
        birthdate.getDate(),
        0,
        0,
        0,
        0,
      ),
    ).toISOString(),
    email,
    name,
    surname,
    patronymic,
    password,
    sex,
  };
}
