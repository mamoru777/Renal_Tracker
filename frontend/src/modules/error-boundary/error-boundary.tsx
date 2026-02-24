import { isRouteErrorResponse, useRouteError } from 'react-router';
import { PageSection } from '@/components/page-section';

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <PageSection>
        <h1>
          {error.status} {error.statusText}
        </h1>
        <p>{error.data.message}</p>
      </PageSection>
    );
  } else if (error instanceof Error) {
    return (
      <PageSection>
        <h1>Error</h1>
        <p>{error.message}</p>
        <p>The stack trace is:</p>
        <pre>{error.stack}</pre>
      </PageSection>
    );
  } else {
    return (
      <PageSection>
        <h1>Unknown Error</h1>;
      </PageSection>
    );
  }
}
