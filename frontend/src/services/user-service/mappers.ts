import type { User } from '@/models/user';
import type {
  GetUserProfileResponseData,
  RegisterRequestData,
  UpdateUserProfileRequestData,
} from './types';

export function mapUserProfileResponseToUser(
  userResponse: GetUserProfileResponseData,
): User {
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
  user: User,
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
