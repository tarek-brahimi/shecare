import React, { createContext, useEffect, useMemo, useState } from "react";
import {
  getAccessToken,
  getAuthMe,
  login,
  register,
  setAccessToken,
  type AuthPayload,
  type RegisterPayload,
} from "@/services/api";
import type { User } from "@/types/domain";

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  loginUser: (payload: AuthPayload) => Promise<void>;
  registerUser: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      const token = getAccessToken();
      if (!token) {
        setIsAuthLoading(false);
        return;
      }

      try {
        const profile = await getAuthMe();
        setUser(profile);
      } catch {
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsAuthLoading(false);
      }
    };

    void bootstrap();
  }, []);

  const loginUser = async (payload: AuthPayload) => {
    const response = await login(payload);
    setAccessToken(response.accessToken);
    setUser(response.user);
  };

  const registerUser = async (payload: RegisterPayload) => {
    const response = await register(payload);
    setAccessToken(response.accessToken);
    setUser(response.user);
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAuthLoading,
      loginUser,
      registerUser,
      logout,
    }),
    [isAuthLoading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
