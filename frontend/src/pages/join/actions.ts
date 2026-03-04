import { InvalidResponseException } from '@/lib/exception';
import { UserService } from '@/services/user-service';
import { mapFormToUser } from './mappers';
import type { JoinForm } from './types';

const userService = new UserService();

export async function submitJoin(formData: JoinForm): Promise<void> {
  return await createUser(formData);
}

async function createUser(formData: JoinForm): Promise<void> {
  const { id } = await userService.register({ data: mapFormToUser(formData) });

  if (!id) {
    throw new InvalidResponseException('No user id in response');
  }
}
