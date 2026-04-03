"use client";

import { useAuth } from "../../../context/AuthContext";
import { useProducts } from "../../../context/ProductContext";
import { PlusCircle, Search, MoreHorizontal, Pencil, Trash2, ArrowUpRight, Gavel } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";

export default function SellerProductsPage() {
  const { user } = useAuth();
  const { products, deleteProduct } = useProducts();

  const myProducts = products.filter(p => p.sellerId === user?.id);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Inventory</h1>
          <p className="text-muted-foreground mt-1">Manage all your active and past auctions in one place.</p>
        </div>
        <div className="flex w-full md:w-auto items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <Input type="text" placeholder="Search items..." className="pl-9 h-10 border-slate-200" />
          </div>
          <div className="flex gap-3 shrink-0">
            {myProducts.some(p => p.status === 'sold') && (
              <Button 
                variant="outline" 
                className="h-10 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 transition-colors"
                onClick={() => {
                  if (confirm("Clear all sold products from your inventory?")) {
                    myProducts.filter(p => p.status === 'sold').forEach(p => deleteProduct(p.id));
                  }
                }}
              >
                <Trash2 className="size-4 mr-2" />
                Clear Sold
              </Button>
            )}
            <Link href="/seller/products/new">
              <Button className="h-10 bg-accent hover:bg-accent/90 text-white font-semibold shadow-md">
                <PlusCircle className="size-4 mr-2" />
                New Product
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Item Name</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Current Price</th>
              <th className="px-6 py-4">Total Bids</th>
              <th className="px-6 py-4">Time Remaining</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80">
            {myProducts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  You haven't added any products yet.
                </td>
              </tr>
            ) : (
              myProducts.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="size-12 rounded-lg bg-slate-100 overflow-hidden border flex-shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="font-semibold text-slate-800 line-clamp-1">{product.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 capitalize text-slate-600">{product.category}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">${product.currentBid.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Start: ${product.startingBid.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="secondary" className="bg-slate-100 text-slate-700 font-semibold border-slate-200">
                      {product.bids.length} bids
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    {product.status === 'sold' ? (
                      <Badge className="bg-emerald-500 hover:bg-emerald-600 shadow-sm text-white border-0 uppercase tracking-widest text-[10px] font-bold">Sold / Won</Badge>
                    ) : new Date(product.endTime).getTime() > Date.now() ? (
                      <span className="text-blue-600 font-medium">Active</span>
                    ) : (
                      <span className="text-slate-400 font-medium">Ended</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-900">
                          <MoreHorizontal className="size-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 border-slate-200 shadow-xl">
                        <Link href={`/product/${product.id}`}>
                          <DropdownMenuItem className="cursor-pointer gap-2 my-1">
                            <ArrowUpRight className="size-4 text-slate-500" />
                            View Public Page
                          </DropdownMenuItem>
                        </Link>
                        <Link href={`/seller/products/${product.id}`}>
                          <DropdownMenuItem className="cursor-pointer gap-2 my-1 font-medium text-emerald-700 focus:text-emerald-800 focus:bg-emerald-50">
                            <Gavel className="size-4" />
                            Manage Bids
                          </DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem className="cursor-pointer gap-2 my-1">
                          <Pencil className="size-4 text-slate-500" />
                          Edit Details
                        </DropdownMenuItem>
                        <div className="h-px bg-slate-100 my-1 mx-2" />
                        <DropdownMenuItem 
                          className="cursor-pointer gap-2 text-red-600 focus:text-red-600 focus:bg-red-50 my-1 font-medium"
                          onClick={() => deleteProduct(product.id)}
                        >
                          <Trash2 className="size-4" />
                          Delete Action
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
