import type { AuthorizedUser } from '@/models';
import type { UserForm } from './types';

export function mapFormToUser(form: UserForm): AuthorizedUser {
  const {
    email,
    birthdate,
    name,
    patronymic,
    surname,
    sex,
    height,
    weight,
    id,
  } = form;

  return {
    isAuthorized: true,
    birthdate:
      birthdate &&
      new Date(
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
    height,
    name,
    patronymic,
    sex,
    surname,
    weight,
    id,
    email,
  };
}

export function mapUserToForm(user: AuthorizedUser): UserForm {
  const {
    birthdate,
    email,
    id,
    name,
    patronymic,
    sex,
    surname,
    height,
    weight,
  } = user;

  return {
    birthdate: birthdate ? new Date(birthdate) : undefined,
    email,
    id,
    name,
    patronymic,
    sex,
    surname,
    height,
    weight,
  };
}
