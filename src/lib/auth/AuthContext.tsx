"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { authApi, ILoginPayload, ISignupPayload } from "@/lib/api/auth.api";
import { TokenStore } from "@/lib/auth/TokenStore";
import { IUser } from "@/types/user";

interface IAuthContextValue {
  user: IUser | null;
  isLoading: boolean;
  login: (payload: ILoginPayload) => Promise<IUser>;
  signup: (payload: ISignupPayload) => Promise<IUser>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<IAuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!TokenStore.get()) {
      setUser(null);
      setIsLoading(false);
      return;
    }
    try {
      const profile = await authApi.me();
      setUser(profile);
    } catch {
      TokenStore.clear();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (payload: ILoginPayload) => {
    const result = await authApi.login(payload);
    TokenStore.set(result.token);
    setUser(result.user);
    return result.user;
  }, []);

  const signup = useCallback(async (payload: ISignupPayload) => {
    const result = await authApi.signup(payload);
    TokenStore.set(result.token);
    setUser(result.user);
    return result.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      TokenStore.clear();
      setUser(null);
    }
  }, []);

  const value = useMemo<IAuthContextValue>(
    () => ({ user, isLoading, login, signup, logout, refresh }),
    [user, isLoading, login, signup, logout, refresh]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): IAuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
