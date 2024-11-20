import { AppState, Auth0Provider } from '@auth0/auth0-react';
import { FC, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { AUTH0_AUDIENCE, AUTH0_CLIENT_ID, AUTH0_DOMAIN, REDIRECT_URL } from './constants';

type AuthProviderProps = { children: ReactNode };

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const navigate = useNavigate();
  const onRedirectCallback = (appState?: AppState) => {
    navigate((appState && appState.returnTo) || window.location.pathname);
  };

  return (
    <Auth0Provider
      onRedirectCallback={onRedirectCallback}
      domain={AUTH0_DOMAIN}
      clientId={AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: REDIRECT_URL,
        audience: AUTH0_AUDIENCE,
        scope: 'openid profile email',
      }}
    >
      {children}
    </Auth0Provider >
  );
};

export default AuthProvider;
