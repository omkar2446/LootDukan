// Admin Authentication Utilities
// Uses sessionStorage for demo purposes

const AUTH_KEY = "admin_session";

interface AdminCredentials {
  email: string;
  password: string;
}

// Demo admin credentials - In production, use proper backend auth
const ADMIN_CREDENTIALS: AdminCredentials = {
  email: "otambe655@gmail.com",
  password: "Sai@9191",
};

const ADMIN_NAME = "Omkar";

export interface AdminSession {
  email: string;
  name: string;
  loginTime: number;
}

export const login = (email: string, password: string): { success: boolean; error?: string } => {
  if (email !== ADMIN_CREDENTIALS.email) {
    return { success: false, error: "Invalid email address" };
  }
  
  if (password !== ADMIN_CREDENTIALS.password) {
    return { success: false, error: "Incorrect password" };
  }
  
  const session: AdminSession = {
    email: ADMIN_CREDENTIALS.email,
    name: ADMIN_NAME,
    loginTime: Date.now(),
  };
  
  sessionStorage.setItem(AUTH_KEY, JSON.stringify(session));
  return { success: true };
};

export const logout = (): void => {
  sessionStorage.removeItem(AUTH_KEY);
};

export const getSession = (): AdminSession | null => {
  const stored = sessionStorage.getItem(AUTH_KEY);
  if (!stored) return null;
  
  try {
    return JSON.parse(stored) as AdminSession;
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return getSession() !== null;
};
