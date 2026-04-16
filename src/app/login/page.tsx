"use client";

import { useState } from "react";
import { useAuth, UserRole } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Gavel, Store, ShoppingBag, Shield } from "lucide-react";
import { clsx } from "clsx";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("buyer");
  const { login, demoAdminLogin, demoBuyerLogin, demoSellerLogin } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      toast.error("Invalid Email", { description: "Please enter a valid email address." });
      return;
    }
    if (!password) {
      toast.error("Required Field", { description: "Please enter your password." });
      return;
    }

    try {
      await login(email, password);
      toast.success("Welcome back!", { description: "You have successfully signed in." });
      
      // Need to re-route based on role fetching if needed, but for now we push based on selected role toggle on login if applicable. 
      // Ideally the role is tied to user context post-login. Let's just push to / first or /seller based on role state for backward compatibility.
      if (role === "seller") {
        router.push("/seller");
      } else if (role === "admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      toast.error("Login Failed", { description: error.message || "An error occurred during login." });
    }
  };

  const handleDemoAdmin = () => {
    demoAdminLogin();
    router.push("/admin");
    toast.success("Demo Admin Activated", { description: "You are logged in via the instant demo API." });
  };

  const handleDemoBuyer = () => {
    demoBuyerLogin();
    router.push("/");
    toast.success("Demo Buyer Activated", { description: "You are logged in via the instant demo API." });
  };

  const handleDemoSeller = () => {
    demoSellerLogin();
    router.push("/seller");
    toast.success("Demo Seller Activated", { description: "You are logged in via the instant demo API." });
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <Card className="w-full max-w-md shadow-xl border-accent/20">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-slate-900 rounded-xl">
              <Gavel className="size-8 text-accent" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Sign In</CardTitle>
          <CardDescription className="text-base text-slate-500">
            Enter your email to access your BidMax account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="grid grid-cols-3 gap-3 mb-2">
              <div 
                onClick={() => setRole("buyer")}
                className={clsx(
                  "cursor-pointer border-2 rounded-lg p-3 flex items-center justify-center gap-2 transition-all",
                  role === "buyer" ? "border-slate-900 bg-slate-50 shadow-sm" : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
                )}
              >
                <ShoppingBag className={clsx("size-5", role === "buyer" ? "text-slate-900" : "text-slate-400")} />
                <span className="font-semibold text-sm text-slate-900">Buyer</span>
              </div>
              
              <div 
                onClick={() => setRole("seller")}
                className={clsx(
                  "cursor-pointer border-2 rounded-lg p-3 flex items-center justify-center gap-2 transition-all",
                  role === "seller" ? "border-accent bg-accent/5 shadow-sm" : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
                )}
              >
                <Store className={clsx("size-5", role === "seller" ? "text-accent" : "text-slate-400")} />
                <span className="font-semibold text-sm text-slate-900">Seller</span>
              </div>

              <div 
                onClick={() => setRole("admin")}
                className={clsx(
                  "cursor-pointer border-2 rounded-lg p-3 flex items-center justify-center gap-2 transition-all",
                  role === "admin" ? "border-red-500 bg-red-50 shadow-sm" : "border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-100"
                )}
              >
                <Shield className={clsx("size-5", role === "admin" ? "text-red-500" : "text-slate-400")} />
                <span className="font-semibold text-sm text-slate-900">Admin</span>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-slate-700">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 border-slate-200"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 border-slate-200"
                required
              />
            </div>
            <Button type="submit" className="w-full h-12 bg-slate-900 hover:bg-slate-800 text-base font-semibold transition-all">
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-4 border-t border-slate-100">
          <div className="text-sm text-center text-slate-600">
            Don't have an account?{" "}
            <Link href="/register" className="font-semibold text-accent hover:underline">
              Sign up here
            </Link>
          </div>
          
          <div className="w-full pt-2">
            <p className="text-xs text-center text-slate-400 mb-3 font-medium uppercase tracking-wider">Instant Demo Profiles</p>
            <div className="grid grid-cols-3 gap-2 w-full">
              <Button 
                variant="outline" 
                type="button"
                onClick={handleDemoBuyer}
                className="w-full px-0 text-xs border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold h-10"
              >
                <ShoppingBag className="size-3 lg:mr-1.5" />
                <span className="hidden sm:inline">Buyer</span>
              </Button>
              
              <Button 
                variant="outline" 
                type="button"
                onClick={handleDemoSeller}
                className="w-full px-0 text-xs border-accent/30 text-accent hover:bg-accent/5 font-semibold h-10"
              >
                <Store className="size-3 lg:mr-1.5" />
                <span className="hidden sm:inline">Seller</span>
              </Button>
              
              <Button 
                variant="outline" 
                type="button"
                onClick={handleDemoAdmin}
                className="w-full px-0 text-xs border-red-200 text-red-600 hover:bg-red-50 font-semibold h-10"
              >
                <Shield className="size-3 lg:mr-1.5" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
