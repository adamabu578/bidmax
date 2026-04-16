"use client";

import { useState } from "react";
import { useAuth, UserRole } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Gavel, Store, ShoppingBag } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { toast } from "sonner";
import { clsx } from "clsx";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("buyer");
  const { register } = useAuth();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !email.includes("@")) {
      toast.error("Invalid Details", { description: "Please enter a valid name and email address." });
      return;
    }
    if (!password || password.length < 6) {
      toast.error("Invalid Password", { description: "Password must be at least 6 characters long." });
      return;
    }
    
    try {
      await register(name, email, password, role);
      toast.success("Account created successfully!", { description: `Welcome to BidMax, ${name}.` });
      
      if (role === "seller") {
        router.push("/seller");
      } else {
        router.push("/");
      }
    } catch (error: any) {
      toast.error("Registration Failed", { description: error.message || "An error occurred during registration." });
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <Card className="w-full max-w-lg shadow-xl border-accent/20">
        <CardHeader className="space-y-2 text-center pb-6">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-slate-900 rounded-xl">
              <Gavel className="size-8 text-accent" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">Create an Account</CardTitle>
          <CardDescription className="text-base text-slate-500">
            Join the premier destination for luxury auctions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid grid-cols-2 gap-3 mb-6">
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
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-slate-700">
                  Full Name {role === "seller" && "or Business Name"}
                </label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 border-slate-200"
                  required
                />
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
                  minLength={6}
                />
              </div>
            </div>
            
            <Button type="submit" className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-lg font-semibold transition-all">
              Complete Registration
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 pt-4 border-t border-slate-100">
          <div className="text-sm text-center text-slate-600">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-accent hover:underline">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
