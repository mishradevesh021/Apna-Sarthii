'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'CUSTOMER' | 'WORKER' | 'ADMIN';
  avatarUrl?: string | null;
  city: string;
  locality: string;
  workerProfile?: any;
  customerProfile?: any;
}

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  activeCity: string;
  setActiveCity: (city: string) => void;
  activeLocality: string;
  setActiveLocality: (locality: string) => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAsDemo: (role: 'CUSTOMER' | 'WORKER' | 'ADMIN') => Promise<void>;
  register: (formData: any) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeCity, setActiveCity] = useState('Prayagraj');
  const [activeLocality, setActiveLocality] = useState('Civil Lines');
  const router = useRouter();

  const refreshUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
        if (data.user.city) setActiveCity(data.user.city);
        if (data.user.locality) setActiveLocality(data.user.locality);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }

      setUser(data.user);
      if (data.user.city) setActiveCity(data.user.city);
      if (data.user.locality) setActiveLocality(data.user.locality);

      return { success: true };
    } catch (err: any) {
      return { success: false, error: 'Network error occurred' };
    }
  };

  const loginAsDemo = async (role: 'CUSTOMER' | 'WORKER' | 'ADMIN') => {
    let email = 'demo.customer@sarthi.local';
    if (role === 'WORKER') email = 'demo.worker@sarthi.local';
    if (role === 'ADMIN') email = 'demo.admin@sarthi.local';

    const result = await login(email, 'Password@123');
    if (result.success) {
      if (role === 'WORKER') router.push('/worker/dashboard');
      else if (role === 'ADMIN') router.push('/admin');
      else router.push('/');
    }
  };

  const register = async (formData: any) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed' };
      }

      await refreshUser();
      return { success: true };
    } catch {
      return { success: false, error: 'Registration request failed' };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      router.push('/auth/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        activeCity,
        setActiveCity,
        activeLocality,
        setActiveLocality,
        login,
        loginAsDemo,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
