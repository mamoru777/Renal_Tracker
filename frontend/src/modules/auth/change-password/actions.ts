import { AuthService } from '@/services/auth-service';
import type { ChangePasswordForm } from './types';

const authService = new AuthService();

export async function submitChangePassword(
  data: ChangePasswordForm,
): Promise<void> {
  await performChangePassword(data);
}

async function performChangePassword(data: ChangePasswordForm): Promise<void> {
  await authService.changePassword({
    newPassword: data.password,
    oldPassword: data.oldPassword,
  });
}
