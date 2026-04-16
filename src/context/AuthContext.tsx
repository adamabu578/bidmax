"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "../utils/supabase/client";

export type UserRole = "buyer" | "seller" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  demoAdminLogin: () => void;
  demoBuyerLogin: () => void;
  demoSellerLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    // Check active sessions and sets the user
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Fetch user profile from DB to get name and role
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profile) {
          setUser({
            id: session.user.id,
            name: profile.name,
            email: session.user.email || '',
            role: profile.role,
          });
        }
      }
    };
    getSession();

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          setUser({
            id: session.user.id,
            name: profile.name,
            email: session.user.email || '',
            role: profile.role,
          });
        }
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    // Sign up user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (authError) throw authError;

    // Create profile
    if (authData.user) {
      const { error: profileError } = await supabase.from('profiles').insert([
        {
          id: authData.user.id,
          name,
          role,
        }
      ]);
      if (profileError) throw profileError;
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setUser(null);
  };

  const demoAdminLogin = () => {
    setUser({
      id: "demo-admin-id-mocked",
      name: "Demo Admin",
      email: "admin@demo.com",
      role: "admin",
    });
  };

  const demoBuyerLogin = () => {
    setUser({
      id: "demo-buyer-id-mocked",
      name: "Demo Buyer",
      email: "buyer@demo.com",
      role: "buyer",
    });
  };

  const demoSellerLogin = () => {
    setUser({
      id: "demo-seller-id-mocked",
      name: "Demo Seller",
      email: "seller@demo.com",
      role: "seller",
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, demoAdminLogin, demoBuyerLogin, demoSellerLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
