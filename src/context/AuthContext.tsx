import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken, getStoredUser, clearAuthData, setToken as storageSetToken, setStoredUser as storageSetUser } from '@/lib/storage';
import { useProfile } from '@/hooks/useAuth';
import type { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialize state directly from storage to avoid "flash of unauthenticated content"
  const [user, setUser] = useState<User | null>(getStoredUser<User>());
  const [token, setToken] = useState<string | null>(getToken());
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const { data: profileData, isLoading: profileLoading } = useProfile();

  // Update user if profile data is fetched successfully
  useEffect(() => {
    if (profileData) {
      setUser(profileData);
      storageSetUser(profileData);
    }
  }, [profileData]);

  // Global loading state
  useEffect(() => {
    // We are only loading if we have a token but are waiting for profile
    if (token && profileLoading) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [token, profileLoading]);

  const login = (userData: User, authToken: string) => {
    // 1. Update Storage
    storageSetToken(authToken);
    storageSetUser(userData);
    
    // 2. Update State
    setToken(authToken);
    setUser(userData);
    setIsLoading(false);
  };

  const logout = () => {
    clearAuthData();
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!token,
    isLoading,
    login,
    logout,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
