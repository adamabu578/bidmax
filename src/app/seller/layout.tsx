"use client";

import { useAuth } from "../../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, PlusCircle, Settings, Store } from "lucide-react";
import { useEffect, useState } from "react";
import { clsx } from "clsx";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (!user) {
      router.push("/login");
    } else if (user.role !== "seller") {
      router.push("/");
    }
  }, [user, router]);

  if (!isClient || !user || user.role !== "seller") {
    return null; // Or a loading spinner
  }

  const navItems = [
    { label: "Dashboard", href: "/seller", icon: LayoutDashboard },
    { label: "Add Product", href: "/seller/products/new", icon: PlusCircle },
    { label: "Inventory", href: "/seller/products", icon: Package },
    { label: "Store Settings", href: "/seller/settings", icon: Settings },
  ];

  return (
    <div className="flex min-h-[calc(100vh-80px)] bg-slate-50">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-white px-4 py-8">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="p-2 bg-accent/10 rounded-lg text-accent">
            <Store className="size-6" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-slate-800">Seller Hub</h2>
            <p className="text-xs text-muted-foreground">{user.name}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-colors duration-200",
                  isActive 
                    ? "bg-slate-900 text-white shadow-md shadow-slate-900/10" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )}
              >
                <Icon className={clsx("size-5", isActive ? "text-accent" : "")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
