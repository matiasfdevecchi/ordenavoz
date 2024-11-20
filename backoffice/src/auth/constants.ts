const { VITE_AUTH0_DOMAIN, VITE_AUTH0_AUDIENCE, VITE_AUTH0_CLIENT_ID, VITE_BASE_PREFIX_PATH, VITE_AUTH0_NAMESPACE } = import.meta.env;

export const AUTH0_DOMAIN = VITE_AUTH0_DOMAIN || '';
export const AUTH0_AUDIENCE = VITE_AUTH0_AUDIENCE || '';
export const AUTH0_CLIENT_ID = VITE_AUTH0_CLIENT_ID || '';
export const REDIRECT_URL = `${window.location.origin}${VITE_BASE_PREFIX_PATH || ''}/LoginCallback`;
export const ROLE_KEY = `${VITE_AUTH0_NAMESPACE}/role`;
