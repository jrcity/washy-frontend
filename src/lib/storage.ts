const TOKEN_KEY = 'washy_token';
const USER_KEY = 'washy_user';

// Token Management
export const getToken = (): string | null => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};

export const setToken = (token: string): void => {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {
    console.error('Failed to save token to localStorage');
  }
};

export const removeToken = (): void => {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {
    console.error('Failed to remove token from localStorage');
  }
};

// User Data Management
export const getStoredUser = <T>(): T | null => {
  try {
    const data = localStorage.getItem(USER_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const setStoredUser = <T>(user: T): void => {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    console.error('Failed to save user to localStorage');
  }
};

export const removeStoredUser = (): void => {
  try {
    localStorage.removeItem(USER_KEY);
  } catch {
    console.error('Failed to remove user from localStorage');
  }
};

// Clear all auth data
export const clearAuthData = (): void => {
  removeToken();
  removeStoredUser();
};

// Generic storage utilities
export const storageGet = <T>(key: string): T | null => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
};

export const storageSet = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error(`Failed to save ${key} to localStorage`);
  }
};

export const storageRemove = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch {
    console.error(`Failed to remove ${key} from localStorage`);
  }
};
