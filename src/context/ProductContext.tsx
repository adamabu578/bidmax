"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Product, products as initialProducts } from "../data/products";

export interface NewProductDraft {
  name: string;
  category: string;
  image: string;
  startingBid: number;
  description: string;
  condition: string;
  durationDays: number;
}

interface ProductContextType {
  products: Product[];
  addProduct: (product: NewProductDraft, sellerId: string) => void;
  deleteProduct: (productId: string) => void;
  placeBid: (productId: string, amount: number, bidderName: string) => boolean;
  acceptBid: (productId: string, bidId: string) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Load from local storage or use initial data
    const savedProducts = localStorage.getItem("bidmax_products");
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts));
      } catch (e) {
        console.error("Failed to parse products", e);
        setProducts(initialProducts);
      }
    } else {
      setProducts(initialProducts);
      // Let's seed the mock data into local storage as well
      localStorage.setItem("bidmax_products", JSON.stringify(initialProducts));
    }

    // Real-time synchronization across tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "bidmax_products" && e.newValue) {
        try {
          setProducts(JSON.parse(e.newValue));
        } catch (err) {
          console.error("Failed to parse synced products", err);
        }
      }
    };
    
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const addProduct = (draft: NewProductDraft, sellerId: string) => {
    const newProduct: Product = {
      id: "prod-" + Math.random().toString(36).substr(2, 9),
      name: draft.name,
      category: draft.category,
      image: draft.image,
      startingBid: draft.startingBid,
      currentBid: draft.startingBid,
      description: draft.description,
      condition: draft.condition,
      endTime: new Date(Date.now() + draft.durationDays * 24 * 60 * 60 * 1000), // Dynamic end time based on input
      bids: [],
      status: 'active',
      // Storing sellerId uniquely to associate the product creator
      ...({ sellerId }) 
    };

    setProducts(prev => {
      const updated = [newProduct, ...prev];
      localStorage.setItem("bidmax_products", JSON.stringify(updated));
      return updated;
    });
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== productId);
      localStorage.setItem("bidmax_products", JSON.stringify(updated));
      return updated;
    });
  };

  const acceptBid = (productId: string, bidId: string) => {
    setProducts(prev => {
      const updated = prev.map(p => {
        if (p.id === productId) {
          return { ...p, status: 'sold' as const, acceptedBidId: bidId };
        }
        return p;
      });
      localStorage.setItem("bidmax_products", JSON.stringify(updated));
      return updated;
    });
  };

  const placeBid = (productId: string, amount: number, bidderName: string) => {
    let success = false;
    setProducts(prev => {
      const updated = prev.map(p => {
        if (p.id === productId) {
          if (amount <= p.currentBid) {
            return p; // Bid is too low
          }
          success = true;
          return {
            ...p,
            currentBid: amount,
            bids: [
              {
                id: "bid-" + Math.random().toString(36).substr(2, 9),
                amount,
                bidder: bidderName,
                timestamp: new Date()
              },
              ...p.bids
            ]
          };
        }
        return p;
      });
      
      if (success) {
        localStorage.setItem("bidmax_products", JSON.stringify(updated));
      }
      return updated;
    });
    return success;
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, deleteProduct, placeBid, acceptBid }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider");
  }
  return context;
}
