"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, User, Trophy, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { useAuth } from "../../../../context/AuthContext";
import { useProducts } from "../../../../context/ProductContext";

export default function ManageProductPage() {
  const { user } = useAuth();
  const { products, acceptBid } = useProducts();
  const params = useParams();
  const router = useRouter();
  
  const productId = params?.productId as string;
  const product = products.find(p => p.id === productId);

  // Authentication and ownership check (simplified for demo)
  if (!user || user.role !== "seller") {
    return null;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Link href="/seller/products">
          <Button>Back to Inventory</Button>
        </Link>
      </div>
    );
  }

  const handleAcceptBid = (bidId: string) => {
    if (confirm("Are you sure you want to accept this bid? This will close the auction and mark the item as sold.")) {
      acceptBid(product.id, bidId);
      toast.success("Bid Accepted!", { description: "The auction has been successfully closed." });
    }
  };

  const isSold = product.status === "sold";
  const winningBid = product.bids.find(b => b.id === product.acceptedBidId);

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/seller/products">
          <Button variant="outline" size="icon" className="h-10 w-10 border-2">
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
            Manage Listing
            {isSold ? (
              <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white border-0 font-bold uppercase tracking-wide">Sold / Won</Badge>
            ) : (
              <Badge className="bg-blue-500 hover:bg-blue-600 text-white border-0 font-bold uppercase tracking-wide">Active</Badge>
            )}
          </h1>
          <p className="text-muted-foreground text-sm flex gap-2">
            ID: {product.id}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Product Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-2 shadow-sm overflow-hidden border-slate-200">
            <div className="aspect-square bg-slate-100 relative">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover" 
              />
              {isSold && (
                <div className="absolute inset-0 bg-emerald-900/40 flex items-center justify-center backdrop-blur-[2px]">
                  <div className="bg-emerald-500 text-white px-6 py-2 rounded-full font-bold text-xl tracking-widest uppercase shadow-2xl flex items-center gap-2">
                    <Trophy className="size-5" />
                    Sold / Won
                  </div>
                </div>
              )}
            </div>
            <CardContent className="p-5">
              <h3 className="font-bold text-lg mb-2 leading-tight">{product.name}</h3>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground text-sm">Category</span>
                <span className="font-medium capitalize text-sm">{product.category}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground text-sm">Starting Bid</span>
                <span className="font-medium text-sm">${product.startingBid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center py-2 pt-3">
                <span className="text-muted-foreground text-sm font-semibold text-slate-900">Highest Bid</span>
                <span className="font-bold text-lg text-emerald-600">${product.currentBid.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Bids */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-2 shadow-sm">
            <div className="border-b px-6 py-4 flex justify-between items-center bg-slate-50">
              <h2 className="font-semibold text-lg text-slate-800">Bid History</h2>
              <Badge variant="outline" className="text-slate-500 font-medium">
                {product.bids.length} Bids
              </Badge>
            </div>
            
            <CardContent className="p-0">
              {product.bids.length === 0 ? (
                <div className="p-10 text-center flex flex-col items-center">
                  <div className="p-4 bg-slate-100 rounded-full mb-4">
                    <AlertCircle className="size-8 text-slate-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">No Bids Yet</h3>
                  <p className="text-muted-foreground text-sm">Waiting for buyers to place the first bid.</p>
                </div>
              ) : (
                <div className="divide-y">
                  {product.bids.map((bid, index) => {
                    const isWinningBid = product.acceptedBidId === bid.id;
                    const isHighest = index === 0 && !isSold; // Assuming bids are sorted descending

                    return (
                      <div 
                        key={bid.id} 
                        className={`p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${isWinningBid ? 'bg-emerald-50/50' : 'hover:bg-slate-50'}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`size-12 rounded-full flex items-center justify-center border-2 shrink-0 ${isWinningBid ? 'bg-emerald-100 border-emerald-200 text-emerald-600' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                            {isWinningBid ? <Trophy className="size-6 shadow-sm" /> : <User className="size-6" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-bold text-lg">{bid.bidder}</p>
                              {isHighest && !isSold && (
                                <Badge className="bg-blue-50 text-blue-700 border-blue-200 text-[10px] tracking-wider uppercase font-bold px-2">Top Bid</Badge>
                              )}
                              {isWinningBid && (
                                <Badge className="bg-emerald-500 text-white border-transparent text-[10px] tracking-wider uppercase font-bold px-2 flex gap-1">
                                  <CheckCircle2 className="size-3" /> Winner
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-500">
                              Placed {new Date(bid.timestamp).toLocaleDateString()} at {new Date(bid.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                          <div className="text-right">
                            <p className="font-bold text-2xl text-slate-900">${bid.amount.toLocaleString()}</p>
                          </div>
                          
                          {!isSold && (
                            <Button 
                              onClick={() => handleAcceptBid(bid.id)}
                              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold shrink-0"
                            >
                              Accept Bid
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
