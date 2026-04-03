"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type UserRole = "buyer" | "seller";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, role?: UserRole) => void;
  register: (name: string, email: string, role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load from local storage on mount
    const savedUser = localStorage.getItem("bidmax_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user", e);
      }
    }
  }, []);

  const login = (email: string, role?: UserRole) => {
    // Mock login that creates a user if they just put in an email 
    // Usually you'd check a DB, but we'll simulate picking an existing user or creating a generic buyer for simplicity if they just login
    const savedUsers = JSON.parse(localStorage.getItem("bidmax_users_db") || "[]");
    const existing = savedUsers.find((u: User) => u.email === email);
    
    if (existing) {
      if (role && existing.role !== role) {
        existing.role = role;
        localStorage.setItem("bidmax_users_db", JSON.stringify(savedUsers));
      }
      setUser(existing);
      localStorage.setItem("bidmax_user", JSON.stringify(existing));
    } else {
      // Create a fallback mock user if no db found
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: email.split("@")[0],
        email,
        role: role || "buyer",
      };
      setUser(mockUser);
      localStorage.setItem("bidmax_user", JSON.stringify(mockUser));
    }
  };

  const register = (name: string, email: string, role: UserRole) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      email,
      role,
    };
    
    // Save to our mock DB
    const savedUsers = JSON.parse(localStorage.getItem("bidmax_users_db") || "[]");
    savedUsers.push(newUser);
    localStorage.setItem("bidmax_users_db", JSON.stringify(savedUsers));

    // Log them in immediately
    setUser(newUser);
    localStorage.setItem("bidmax_user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("bidmax_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
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
