import { type MiddlewareFunction, redirect } from 'react-router';
import { appRoutes } from '@/constants/routes';

export const meMiddleware: MiddlewareFunction = async ({ request }, next) => {
  const urlObject = new URL(request.url);

  if (urlObject.pathname !== appRoutes.ME) {
    return next();
  }

  return redirect(`${appRoutes.ME_PROFILE}${urlObject.search}`);
};
