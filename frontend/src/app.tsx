import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { PrimeReactProvider } from 'primereact/api';
import { createBrowserRouter, RouterProvider } from 'react-router';
import { appRoutes } from '@/constants/routes';
import { authMiddleware, AuthProvider, SecuredRoute } from '@/modules/auth';
import { ErrorBoundary as DefaultErrorBoundary } from '@/modules/error-boundary';
import { GlobalSpinner } from '@/modules/global-spinner';
import { PageLayout } from '@/modules/page-layout';
import { Toast } from '@/modules/toast';
import { About } from '@/pages/about';
import { Auth } from '@/pages/auth';
import { Join } from '@/pages/join';
import { Main } from '@/pages/main';
import {
  createLoadPageData as createMeLoadPageData,
  createPageActions as createMePageActions,
  Me,
  MeSkeleton,
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
    ErrorBoundary: DefaultErrorBoundary,
    children: [
      {
        Component: Auth,
        path: appRoutes.AUTH,
      },
      {
        Component: Join,
        path: appRoutes.JOIN,
      },
      {
        Component: PageLayout,
        ErrorBoundary: DefaultErrorBoundary,
        children: [
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
                Component: Me,
                loader: createMeLoadPageData(queryClient),
                action: createMePageActions(queryClient),
                path: appRoutes.ME,
                HydrateFallback: MeSkeleton,
              },
            ],
          },
        ],
      },
    ],
  },
]);

const primeConfig = {
  inputStyle: 'filled',
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
