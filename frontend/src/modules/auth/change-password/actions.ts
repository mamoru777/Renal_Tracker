import { renalTrackerAuthService } from '@/services/auth-service';
import type { ChangePasswordForm } from './types';

export async function submitChangePassword(
  data: ChangePasswordForm,
): Promise<void> {
  await performChangePassword(data);
}

async function performChangePassword(data: ChangePasswordForm): Promise<void> {
  await renalTrackerAuthService.changePassword({
    data: {
      newPassword: data.password,
      oldPassword: data.oldPassword,
    },
  });
}
