import type { SEX_VALUES } from '@/components/input/sex';
import type { AuthorizedUser } from '@/models';

export type UserForm = {
  id: string;
  name?: string;
  surname?: string;
  patronymic?: string;
  email: string;
  birthdate?: Date;
  sex?: (typeof SEX_VALUES)[keyof typeof SEX_VALUES];
  weight?: number;
  height?: number;
};

export type FetcherData =
  | {
      user: AuthorizedUser;
    }
  | { error: Error };
