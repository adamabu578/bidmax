"use client";

import { AuthProvider } from "../context/AuthContext";
import { ProductProvider } from "../context/ProductContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ProductProvider>
        {children}
      </ProductProvider>
    </AuthProvider>
  );
}
