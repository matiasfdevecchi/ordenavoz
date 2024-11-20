import { useAuth0, User } from '@auth0/auth0-react';
import { Auth0ContextInterface } from '@auth0/auth0-react/src/auth0-context';
import { LoggedUser } from './types';
import { REDIRECT_URL, ROLE_KEY } from './constants';
import { useMemo } from 'react';

type AuthorizationResponse = {
  authenticated: boolean;
  loading: boolean;
  user?: LoggedUser;
  logout: () => void;
  getAccessToken: Auth0ContextInterface['getAccessTokenSilently'];
};

const mapAuth0UserToLoggedUser = (auth0User: User | undefined): LoggedUser | undefined => {
  if (!auth0User) return undefined;
  
  return {
    id: auth0User.sub,
    email: auth0User.email,
    name: auth0User.name,
    picture: auth0User.picture,
  };
};

const useAuth = (): AuthorizationResponse => {
  const { isAuthenticated, isLoading, user, logout, getAccessTokenSilently } = useAuth0();

  return useMemo(
    () => ({
      authenticated: isAuthenticated,
      loading: isLoading,
      user: user && mapAuth0UserToLoggedUser(user),
      logout: () => logout({ logoutParams: { returnTo: REDIRECT_URL } }),
      getAccessToken: getAccessTokenSilently,
    }),
    [getAccessTokenSilently, isAuthenticated, isLoading, logout, user]
  );
};

export default useAuth;
