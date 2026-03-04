import { AxiosApi, type HttpApi } from '@/lib/api';

export const renalTrackerApi: HttpApi = new AxiosApi({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
});
