import { AxiosApi } from '@/lib/api';

export const renalTrackerApi = new AxiosApi({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
});
