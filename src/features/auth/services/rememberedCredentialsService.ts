type RememberedLoginCredentials = {
  email: string;
  password: string;
};

const LOGIN_REMEMBER_STORAGE_KEY = 'comercio-adaptativo-login-credentials';

const isValidRememberedCredentials = (
  value: unknown,
): value is RememberedLoginCredentials => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return typeof candidate.email === 'string' && typeof candidate.password === 'string';
};

export const loadRememberedLoginCredentials = (): RememberedLoginCredentials | null => {
  try {
    const storedValue = window.localStorage.getItem(LOGIN_REMEMBER_STORAGE_KEY);
    if (!storedValue) {
      return null;
    }

    const parsedValue = JSON.parse(storedValue) as unknown;
    return isValidRememberedCredentials(parsedValue) ? parsedValue : null;
  } catch {
    return null;
  }
};

export const saveRememberedLoginCredentials = (credentials: RememberedLoginCredentials): void => {
  window.localStorage.setItem(LOGIN_REMEMBER_STORAGE_KEY, JSON.stringify(credentials));
};

export const clearRememberedLoginCredentials = (): void => {
  window.localStorage.removeItem(LOGIN_REMEMBER_STORAGE_KEY);
};
