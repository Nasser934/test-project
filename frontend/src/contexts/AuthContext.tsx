import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '../services/auth.service';
import { AuthState, LoginCredentials, RegisterData, User } from '../types/auth.types';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('token'),
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const user = await AuthService.getCurrentUser();
          setState(prev => ({ ...prev, user, isLoading: false }));
        } catch (error) {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initAuth();
  }, []);

  useEffect(() => {
    let refreshInterval: NodeJS.Timeout;

    const setupTokenRefresh = () => {
      if (state.token) {
        // تجديد التوكن كل 14 دقيقة (قبل انتهاء صلاحية التوكن بدقيقة)
        refreshInterval = setInterval(async () => {
          try {
            const newToken = await AuthService.refreshToken();
            setState(prev => ({ ...prev, token: newToken }));
          } catch (error) {
            // في حالة فشل تجديد التوكن، نقوم بتسجيل الخروج
            await logout();
          }
        }, 14 * 60 * 1000);
      }
    };

    setupTokenRefresh();

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [state.token]);

  const login = async (credentials: LoginCredentials) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const { user, token } = await AuthService.login(credentials);
      setState(prev => ({ ...prev, user, token, isLoading: false }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message,
        isLoading: false,
      }));
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const { user, token } = await AuthService.register(data);
      setState(prev => ({ ...prev, user, token, isLoading: false }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message,
        isLoading: false,
      }));
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      setState({ user: null, token: null, isLoading: false, error: null });
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message,
      }));
    }
  };

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }));
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 