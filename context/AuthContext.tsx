'use client';

import React, { createContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import authService from '@/services/auth.service';
import { setSessionId } from '@/services/api';
import { User, ApiResponse } from '@/types/auth.types';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<ApiResponse<User>>;
  register: (name: string, email: string, password: string) => Promise<ApiResponse<User>>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  isAuthenticated: false,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isActive = true;

    const initializeAuth = async () => {
      try {
        const response = await authService.getCurrentUser();
        if (isActive) {
          if (response.success && response.data) {
            const newSessionId = `session_${Date.now()}`;
            setSessionId(newSessionId);
            setUser(response.data);
          } else {
            setSessionId(null);
            setUser(null);
          }
        }
      } catch {
        if (isActive) {
          setSessionId(null);
          setUser(null);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    const handleUnauthorized = () => {
      setSessionId(null);
      setUser(null);
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);

    return () => {
      isActive = false;
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authService.login(email, password);
      if (response.success && response.data) {
        const newSessionId = `session_${Date.now()}`;
        setSessionId(newSessionId);
        setUser(response.data);
      }
      return response;
    } catch (error) {
      setSessionId(null);
      setUser(null);
      throw error;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    return await authService.register(name, email, password);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Continue cleanup on client
    } finally {
      setSessionId(null);
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
    }),
    [user, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
