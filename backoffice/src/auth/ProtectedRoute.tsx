import { withAuthenticationRequired, WithAuthenticationRequiredOptions } from '@auth0/auth0-react';
import { ComponentType, FC } from 'react';

interface ProtectedRouteProps extends WithAuthenticationRequiredOptions {
  component: ComponentType;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ component, ...props }) => {
  const Component = withAuthenticationRequired(component, props);
  return <Component />;
};

export default ProtectedRoute;
