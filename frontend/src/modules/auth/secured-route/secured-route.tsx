import { Outlet } from 'react-router';

function SecuredRouteComponent() {
  return <Outlet />;
}

export const SecuredRoute = SecuredRouteComponent;
