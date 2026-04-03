"use client";

import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";
import { Package, TrendingUp, Users, DollarSign, PlusCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import Link from "next/link";
import { ProductCard } from "../../components/ProductCard";

export default function SellerDashboardPage() {
  const { user } = useAuth();
  const { products } = useProducts();

  // Filter products by this seller
  const myProducts = products.filter(p => p.sellerId === user?.id);

  const totalActiveListings = myProducts.length;
  const totalBidsReceived = myProducts.reduce((acc, p) => acc + p.bids.length, 0);
  const totalPotentialRevenue = myProducts.reduce((acc, p) => acc + p.currentBid, 0);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground mt-1">Here's an overview of your store's performance.</p>
        </div>
        <Link href="/seller/products/new">
          <Button className="gap-2 bg-accent hover:bg-accent/90 text-white font-semibold shadow-md">
            <PlusCircle className="size-4" />
            Add New Product
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
        <Card className="border-2 lg:border-l-4 lg:border-l-accent shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Listings</CardTitle>
            <Package className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{totalActiveListings}</div>
          </CardContent>
        </Card>
        <Card className="border-2 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Bids</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{totalBidsReceived}</div>
          </CardContent>
        </Card>
        <Card className="border-2 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Potential Rev.</CardTitle>
            <DollarSign className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">${totalPotentialRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card className="border-2 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Viewers</CardTitle>
            <Users className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-800">{totalActiveListings > 0 ? (totalActiveListings * 14) : 0}</div>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-6">Recent Additions</h2>
      {myProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {myProducts.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="p-12 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center text-center bg-white">
          <Package className="size-16 text-slate-300 mb-4" />
          <h3 className="text-xl font-semibold text-slate-700 mb-2">No products yet</h3>
          <p className="text-slate-500 max-w-sm mb-6">You haven't listed any items for auction. Create your first listing to start selling.</p>
          <Link href="/seller/products/new">
            <Button className="bg-slate-900 border border-slate-900 hover:bg-slate-800">
              Create First Listing
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
