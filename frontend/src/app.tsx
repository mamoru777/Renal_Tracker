import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PrimeReactProvider } from 'primereact/api';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { Spinner } from '@/components/spinner';
import { appRoutes } from '@/constants/routes';
import {
  authMiddleware,
  AuthProvider,
  createAuthAction,
  createAuthProviderLoader,
  createLogoutAction,
  createTokensMiddleware,
  SecuredRoute,
} from '@/modules/auth';
import { ErrorBoundary as DefaultErrorBoundary } from '@/modules/error-boundary';
import {
  createCalcGfrAuthorized,
  createCalcGfrUnauthorized,
  createSaveGfrResult,
} from '@/modules/gfr-calculator';
import { GlobalSpinner } from '@/modules/global-spinner';
import { PageLayout } from '@/modules/page-layout';
import { Toast } from '@/modules/toast';
import { About } from '@/pages/about';
import { Auth } from '@/pages/auth';
import { Join } from '@/pages/join';
import { Main } from '@/pages/main';
import {
  Analyzes,
  createEditProfileAction,
  createLoadAuthenticatedUserGfrResultsData,
  createLoadProfilePageData,
  Me,
  meMiddleware,
  Profile,
  ProfileSkeleton,
} from '@/pages/me';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 2 * 60 * 1000,
    },
  },
});

const routes = createBrowserRouter([
  {
    Component: AuthProvider,
    loader: createAuthProviderLoader(queryClient),
    middleware: [createTokensMiddleware(queryClient)],
    ErrorBoundary: DefaultErrorBoundary,
    hydrateFallbackElement: <Spinner fullScreen active />,
    children: [
      {
        action: createCalcGfrUnauthorized(),
        path: appRoutes.CALC_GFR_UNAUTH,
      },
      {
        Component: PageLayout,
        ErrorBoundary: DefaultErrorBoundary,
        hydrateFallbackElement: <Spinner fullScreen active />,
        children: [
          {
            Component: Auth,
            action: createAuthAction(queryClient),
            path: appRoutes.AUTH,
          },
          {
            Component: Join,
            path: appRoutes.JOIN,
          },
          {
            path: appRoutes.HOME,
            index: true,
            Component: Main,
          },
          {
            path: appRoutes.ABOUT,
            Component: About,
          },
          {
            Component: SecuredRoute,
            middleware: [authMiddleware],
            children: [
              {
                path: appRoutes.LOGOUT,
                action: createLogoutAction(queryClient),
              },
              {
                Component: Me,
                path: appRoutes.ME,
                middleware: [meMiddleware],
                children: [
                  {
                    action: createEditProfileAction(queryClient),
                    loader: createLoadProfilePageData(queryClient),
                    path: appRoutes.ME_PROFILE,
                    Component: Profile,
                    HydrateFallback: ProfileSkeleton,
                  },
                  {
                    loader:
                      createLoadAuthenticatedUserGfrResultsData(queryClient),
                    path: appRoutes.ME_ANALYZES,
                    Component: Analyzes,
                  },
                  {
                    action: createCalcGfrAuthorized(),
                    path: appRoutes.CALC_GFR_AUTH,
                  },
                  {
                    action: createSaveGfrResult(),
                    path: appRoutes.GFR_SAVE,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
]);

const primeConfig = {
  ripple: true,
} as const;

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />

      <PrimeReactProvider value={primeConfig}>
        <RouterProvider router={routes} />
        <Toast />
        <GlobalSpinner />
      </PrimeReactProvider>
    </QueryClientProvider>
  );
}
