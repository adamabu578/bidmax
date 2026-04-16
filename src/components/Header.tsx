"use client";

import { useState } from "react";
import { Search, Gavel, Menu, User, Bell, LogOut, LayoutDashboard, ChevronDown, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { categories } from "../data/products";
import { useAuth } from "../context/AuthContext";

export function Header() {
  const { user, logout } = useAuth();
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  const getMobileLinkClass = (path: string) => {
    const isActive = pathname === path;
    return `text-2xl font-medium tracking-wide transition-all active:scale-95 active:bg-slate-100 px-6 py-3 rounded-2xl w-full text-center ${
      isActive 
        ? 'text-slate-900 bg-slate-100 font-semibold' 
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
    }`;
  };

  const isAuthPage = pathname === "/login" || pathname === "/register";
  if (isAuthPage) {
    return null;
  }

  return (
    <header className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-2 md:py-5">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="p-2 bg-slate-900 rounded-lg">
                <Gavel className="size-6 text-accent" />
              </div>
              <div>
                <span className="font-bold text-xl tracking-tight text-slate-900">BidMax</span>
                <span className="hidden sm:block text-xs text-muted-foreground tracking-wide">PREMIUM AUCTIONS</span>
              </div>
            </Link>
            
            <nav className="hidden lg:flex items-center gap-6">
              <Link href="/" className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors">Home</Link>
              <Link href="/products" className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors">Products</Link>
              <div 
                className="relative"
                onMouseEnter={() => setIsCategoriesOpen(true)}
                onMouseLeave={() => setIsCategoriesOpen(false)}
              >
                <DropdownMenu open={isCategoriesOpen} onOpenChange={setIsCategoriesOpen}>
                  <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors focus:outline-none">
                    Categories <ChevronDown className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[340px] grid grid-cols-2 gap-1 p-2">
                    {categories.map((cat) => (
                      <Link key={cat.id} href={`/category/${cat.id}`}>
                        <DropdownMenuItem className="cursor-pointer font-medium p-2">
                          {cat.name} <span className="text-muted-foreground ml-auto">({cat.count})</span>
                        </DropdownMenuItem>
                      </Link>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Link href="/#features" className="text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors">Features</Link>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search premium items..."
                className="pl-12 h-12 bg-slate-50 border-slate-200"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="hidden md:inline-flex">
              <Bell className="size-5" />
            </Button>
            
            {user ? (
              <div className="hidden md:flex items-center gap-3">
                {user.role === "seller" && (
                  <Link href="/seller">
                    <Button variant="outline" className="gap-2 border-2">
                      <LayoutDashboard className="size-4" />
                      Dashboard
                    </Button>
                  </Link>
                )}
                {user.role === "admin" && (
                  <Link href="/admin">
                    <Button variant="outline" className="gap-2 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                      <Shield className="size-4" />
                      Admin Panel
                    </Button>
                  </Link>
                )}
                <div className="text-sm border-l pl-4 ml-2">
                  <p className="font-medium text-slate-900">{user.name}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={logout} className="ml-2 text-slate-500 hover:text-red-600 hover:bg-red-50">
                  <LogOut className="size-4" />
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button className="hidden md:inline-flex bg-slate-900 hover:bg-slate-800">
                  <User className="size-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}

            <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="size-6" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-white border-0 text-slate-900 !max-w-full w-full h-full flex flex-col pt-16 [&>button>svg]:text-slate-900 [&>button]:right-6 [&>button]:top-6 [&>button]:opacity-100 overflow-y-auto z-[100]">
                <div className="flex flex-col items-center justify-start mt-4 gap-4 w-full px-6">
                  <div className="flex flex-col items-center w-full gap-2">
                    <Link href="/" onClick={() => setIsMobileOpen(false)} className={getMobileLinkClass("/")}>Home</Link>
                    <Link href="/products" onClick={() => setIsMobileOpen(false)} className={getMobileLinkClass("/products")}>Products</Link>
                    <Link href="/#features" onClick={() => setIsMobileOpen(false)} className={getMobileLinkClass("/#features")}>Features</Link>
                  </div>
                  
                  <div className="w-12 h-px bg-slate-200 my-4"></div>
                  
                  <div className="flex flex-col items-center w-full gap-2 pb-4">
                    {categories.map((cat) => {
                      const catPath = `/category/${cat.id}`;
                      const isCatActive = pathname === catPath;
                      return (
                        <Link 
                          key={cat.id} 
                          href={catPath} 
                          onClick={() => setIsMobileOpen(false)}
                          className={`text-xl font-medium tracking-wide transition-all active:scale-95 active:bg-slate-100 px-6 py-3 rounded-2xl w-full text-center ${
                            isCatActive 
                              ? 'text-slate-900 bg-slate-100 font-semibold' 
                              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                          }`}
                        >
                          {cat.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-4 pb-8 w-full max-w-xs mx-auto">
                  {user ? (
                    <>
                      <div className="text-center mb-2">
                        <p className="font-semibold text-lg text-slate-900">{user.name}</p>
                        <p className="text-sm text-slate-500 capitalize">{user.role}</p>
                      </div>
                      {user.role === "seller" && (
                        <Link href="/seller" className="w-full" onClick={() => setIsMobileOpen(false)}>
                          <Button className="w-full h-14 text-lg bg-slate-900 hover:bg-slate-800 text-white border-0 active:scale-95 transition-transform">
                            Dashboard
                          </Button>
                        </Link>
                      )}
                      {user.role === "admin" && (
                        <Link href="/admin" className="w-full" onClick={() => setIsMobileOpen(false)}>
                          <Button className="w-full h-14 text-lg bg-red-600 hover:bg-red-700 text-white border-0 active:scale-95 transition-transform">
                            Admin Panel
                          </Button>
                        </Link>
                      )}
                      <Button variant="outline" className="w-full h-14 text-lg bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-red-600 active:scale-95 transition-transform" onClick={() => { logout(); setIsMobileOpen(false); }}>
                        Log Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" className="w-full" onClick={() => setIsMobileOpen(false)}>
                        <Button className="w-full h-14 text-lg font-medium bg-slate-900 hover:bg-slate-800 text-white border-0 active:scale-95 transition-transform">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/register" className="w-full" onClick={() => setIsMobileOpen(false)}>
                        <Button variant="outline" className="w-full h-14 text-lg font-medium bg-white border-slate-200 text-slate-900 hover:bg-slate-50 active:scale-95 transition-transform">
                          Register
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="block md:hidden pb-2">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search premium items..."
              className="pl-10 h-10 bg-slate-50 border-slate-200 w-full"
            />
          </div>
        </div>

      </div>
    </header>
  );
}
