import React, { createContext, useContext, useState, useEffect } from 'react';
import { IUser } from '../types/index.js';
import { api } from '../services/api.js';

interface AuthContextType {
  user: IUser | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone?: string; role: 'landlord' | 'tenant' }) => Promise<void>;
  loginDemo: (role: 'landlord' | 'tenant') => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('rentease_token'));
  const [loading, setLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    const currentToken = localStorage.getItem('rentease_token');
    if (!currentToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get<{ success: boolean; user: IUser }>('/auth/me');
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        logout();
      }
    } catch (err) {
      console.warn('Session expired or invalid, logging out:', err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post<{ success: boolean; token?: string; user?: IUser; message?: string }>('/auth/login', {
        email,
        password,
      });

      if (res.success && res.token && res.user) {
        localStorage.setItem('rentease_token', res.token);
        setToken(res.token);
        setUser(res.user);
      } else {
        throw new Error(res.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: 'landlord' | 'tenant';
  }) => {
    setLoading(true);
    try {
      const res = await api.post<{ success: boolean; token?: string; user?: IUser; message?: string }>('/auth/register', data);

      if (res.success && res.token && res.user) {
        localStorage.setItem('rentease_token', res.token);
        setToken(res.token);
        setUser(res.user);
      } else {
        throw new Error(res.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const loginDemo = async (role: 'landlord' | 'tenant') => {
    const credentials =
      role === 'landlord'
        ? { email: 'landlord@rentease.com', password: 'password123' }
        : { email: 'tenant@rentease.com', password: 'password123' };

    await login(credentials.email, credentials.password);
  };

  const logout = () => {
    localStorage.removeItem('rentease_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        loginDemo,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
