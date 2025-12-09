import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types/claims';

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: Record<UserRole, User> = {
  customer: {
    id: '1',
    name: 'John Customer',
    email: 'customer@example.com',
    role: 'customer',
  },
  adjuster: {
    id: '2',
    name: 'Sarah Adjuster',
    email: 'adjuster@example.com',
    role: 'adjuster',
  },
  admin: {
    id: '3',
    name: 'Mike Admin',
    email: 'admin@example.com',
    role: 'admin',
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: UserRole) => {
    setUser(mockUsers[role]);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
