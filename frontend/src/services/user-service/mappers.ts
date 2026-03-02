import type { AuthorizedUser, User } from '@/models';
import type {
  GetUserProfileResponseData,
  RegisterRequestData,
  UpdateUserProfileRequestData,
} from './types';

export function mapUserProfileResponseToUser(
  userResponse: GetUserProfileResponseData,
): AuthorizedUser {
  const {
    email,
    dateBirth,
    name,
    patronymic,
    surname,
    id,
    sex,
    height,
    weight,
  } = userResponse;

  return {
    isAuthorized: true,
    id: id ?? '',
    birthdate: dateBirth,
    email: email ?? '',
    name: name ?? '',
    patronymic: patronymic ?? '',
    surname: surname ?? '',
    sex,
    height,
    weight,
  };
}

export function mapUserToCreateUserRequest(
  user: Omit<User, 'id'>,
): RegisterRequestData {
  const {
    birthdate,
    name,
    patronymic,
    surname,
    sex,
    height,
    weight,
    email,
    password,
  } = user;

  return {
    dateBirth: birthdate,
    name,
    patronymic,
    surname,
    sex,
    height,
    weight,
    email,
    password,
  };
}

export function mapUserToUpdateUserRequest(
  user: AuthorizedUser,
): UpdateUserProfileRequestData {
  const { birthdate, name, patronymic, surname, sex, height, weight } = user;

  return {
    dateBirth: birthdate,
    name,
    patronymic,
    surname,
    sex,
    height,
    weight,
  };
}
