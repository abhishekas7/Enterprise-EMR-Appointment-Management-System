import { axiosInstance, tokenStore } from '../utils/axiosInstance';

// ---------------------------------------------------------------------------
// Client-side input validation
// Performed before hitting the network — saves a round-trip for obvious errors.
// ---------------------------------------------------------------------------
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

function validateCredentials(email, password) {
  if (!email.trim()) return 'Email is required.';
  if (!EMAIL_REGEX.test(email)) return 'Please enter a valid email address.';
  if (!password) return 'Password is required.';
  if (password.length < MIN_PASSWORD_LENGTH)
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  return null;
}

// ---------------------------------------------------------------------------
// Auth service
// ---------------------------------------------------------------------------
export const authService = {
  login: async (email, password) => {
    // Client-side validation gate
    const validationError = validateCredentials(email, password);
    if (validationError) {
      throw new Error(validationError);
    }

    const response = await axiosInstance.post('/api/v1/auth/login', { email, password });

    // Persist the access token in memory (never in localStorage)
    if (response.data?.data?.accessToken) {
      tokenStore.set(response.data.data.accessToken);
    }

    return response.data;
  },

  logout: async () => {
    try {
      await axiosInstance.post('/api/v1/auth/logout');
    } finally {
      // Always clear local state, even if the server call fails
      tokenStore.clear();
    }
  },

  getCurrentUser: async () => {
    const response = await axiosInstance.get('/api/v1/auth/me');
    return response.data;
  },

  /**
   * Silently refresh the access token using the HttpOnly refresh-token cookie.
   * Call this once on app boot to re-hydrate the in-memory token after a page
   * refresh, since memory is cleared on reload.
   */
  refreshToken: async () => {
    try {
      const response = await axiosInstance.post('/api/v1/auth/refresh');
      const newToken = response.data?.data?.accessToken;
      if (newToken) {
        tokenStore.set(newToken);
      }
      return newToken ?? null;
    } catch {
      // Refresh token is expired or missing — user must log in again
      return null;
    }
  },
};
