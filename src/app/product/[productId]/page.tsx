"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, TrendingUp, User, Heart, Share2, Shield, Trophy } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs";
import { CountdownTimer } from "../../../components/CountdownTimer";
import { useAuth } from "../../../context/AuthContext";
import { useProducts } from "../../../context/ProductContext";

export default function ProductDetailPage() {
  const { user } = useAuth();
  const { products, placeBid } = useProducts();
  const params = useParams();
  const productId = params?.productId as string;
  const product = products.find(p => p.id === productId);
  const [bidAmount, setBidAmount] = useState("");

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Product not found</h2>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  const minimumBid = product.currentBid + 5;
  const relatedProducts = products.filter(
    p => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const handlePlaceBid = () => {
    if (!user) {
      toast.error("Authentication required", {
        description: "You must be signed in as a buyer to place a bid.",
      });
      return;
    }
    
    if (user.role !== "buyer") {
      toast.error("Action not permitted", {
        description: "Only buyers can participate in auctions.",
      });
      return;
    }

    const amount = parseFloat(bidAmount);
    if (amount >= minimumBid) {
      const success = placeBid(product.id, amount, user.name);
      if (success) {
        setBidAmount("");
        toast.success(`Bid placed successfully!`, {
          description: `Your bid of $${amount.toLocaleString()} has been placed.`,
        });
      } else {
        toast.error("Bid too low", {
          description: "Someone placed a higher bid right before you.",
        });
      }
    } else {
      toast.error("Invalid bid amount", {
        description: `Please enter at least $${minimumBid.toLocaleString()}.`,
      });
    }
  };

  return (
    <div className="min-h-screen">
      {/* Breadcrumb Header */}
      <section className="bg-slate-50 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Link href="/">
              <Button variant="ghost" size="icon" className="hover:bg-slate-200">
                <ArrowLeft className="size-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <span className="text-slate-400">/</span>
              <Link 
                href={`/category/${product.category}`} 
                className="text-muted-foreground hover:text-primary transition-colors capitalize"
              >
                {product.category}
              </Link>
              <span className="text-slate-400">/</span>
              <span className="font-medium">{product.name}</span>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 mb-16">
          {/* Product Image */}
          <div>
            <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100 mb-6 border-2 border-slate-200 shadow-lg">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-4">
              <Button variant="outline" className="flex-1 gap-2 border-2 hover:bg-slate-50">
                <Heart className="size-4" />
                Save to Watchlist
              </Button>
              <Button variant="outline" className="flex-1 gap-2 border-2 hover:bg-slate-50">
                <Share2 className="size-4" />
                Share
              </Button>
            </div>
          </div>

          {/* Product Details and Bidding */}
          <div>
            <div className="mb-6">
              <div className="flex gap-2 mb-3">
                <Badge className="bg-accent text-white">
                  {product.condition}
                </Badge>
                {product.status === 'sold' && (
                  <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex gap-1 tracking-wider uppercase">
                    <Trophy className="size-3" /> Sold / Won
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">
                {product.name}
              </h1>
              <p className="text-lg text-muted-foreground">
                Category: <span className="capitalize font-medium text-slate-700">{product.category}</span>
              </p>
            </div>

            {/* Current Bid Info */}
            <Card className="mb-6 border-2 shadow-lg">
              <CardContent className="p-6 md:p-8">
                <div className="grid grid-cols-2 gap-8 mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wider">Current Bid</p>
                    <p className="text-4xl font-bold text-slate-900">
                      ${product.currentBid.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2 uppercase tracking-wider">Starting Bid</p>
                    <p className="text-2xl font-semibold text-slate-600">
                      ${product.startingBid.toLocaleString()}
                    </p>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg">
                        <Clock className="size-5 text-slate-700" />
                      </div>
                      <span className="font-medium">Time Remaining</span>
                    </div>
                    <CountdownTimer endTime={product.endTime} />
                  </div>

                  <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg">
                        <TrendingUp className="size-5 text-slate-700" />
                      </div>
                      <span className="font-medium">Total Bids</span>
                    </div>
                    <span className="font-semibold text-lg">{product.bids.length}</span>
                  </div>
                </div>

                {/* Bidding Form */}
                {product.status !== 'sold' ? (
                  <div className="space-y-4 bg-slate-900 rounded-xl p-6">
                    <div>
                      <label className="text-sm text-slate-300 mb-3 block font-medium">
                        Place Your Bid (minimum ${minimumBid.toLocaleString()})
                      </label>
                      <div className="flex gap-3">
                        <div className="relative flex-1">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
                            $
                          </span>
                          <Input
                            type="number"
                            placeholder={minimumBid.toString()}
                            value={bidAmount}
                            onChange={(e) => setBidAmount(e.target.value)}
                            className="pl-8 h-12 bg-white border-0 text-lg text-slate-900"
                          />
                        </div>
                        <Button
                          onClick={handlePlaceBid}
                          disabled={!bidAmount || parseFloat(bidAmount) < minimumBid}
                          className="px-8 h-12 bg-accent hover:bg-accent/90 text-white font-semibold"
                        >
                          Place Bid
                        </Button>
                      </div>
                      <p className="text-xs text-slate-400 mt-2">
                        Enter ${minimumBid.toLocaleString()} or more
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
                    <div className="mx-auto bg-emerald-100 text-emerald-600 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                      <Trophy className="size-6" />
                    </div>
                    <h3 className="text-lg font-bold text-emerald-800 mb-1">Auction Ended</h3>
                    <p className="text-emerald-600 text-sm">This item has been successfully sold.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Trust Badge */}
            <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-4 border">
              <div className="p-2 bg-white rounded-lg">
                <Shield className="size-6 text-slate-700" />
              </div>
              <div>
                <p className="font-semibold text-sm">Verified & Authenticated</p>
                <p className="text-xs text-muted-foreground">All items professionally verified</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Info Tabs */}
        <Tabs defaultValue="description" className="mb-16">
          <TabsList className="grid w-full max-w-md grid-cols-2 h-12">
            <TabsTrigger value="description" className="text-base">Description</TabsTrigger>
            <TabsTrigger value="bids" className="text-base">Bid History</TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="mt-8">
            <Card className="border-2">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">Product Details</h3>
                <p className="text-slate-700 leading-relaxed text-lg mb-6">
                  {product.description}
                </p>
                <Separator className="my-6" />
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground font-medium">Condition:</span>
                    <Badge className="bg-accent text-white">{product.condition}</Badge>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground font-medium">Starting Price:</span>
                    <span className="font-bold text-lg">${product.startingBid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-muted-foreground font-medium">Category:</span>
                    <span className="font-semibold capitalize">{product.category}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="bids" className="mt-8">
            <Card className="border-2">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-6">Bidding Activity</h3>
                <div className="space-y-1">
                  {product.bids.map((bid, index) => {
                    const isWinningBid = product.acceptedBidId === bid.id;
                    const isLeadingBid = index === 0 && !isWinningBid && product.status !== 'sold';
                    return (
                      <div
                        key={bid.id}
                        className={`flex items-center justify-between py-4 px-4 hover:bg-slate-50 rounded-xl transition-colors ${isWinningBid ? 'bg-emerald-50/50 border border-emerald-100' : ''}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`size-12 rounded-full flex items-center justify-center border-2 ${isWinningBid ? 'bg-emerald-100 border-emerald-200 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                            {isWinningBid ? <Trophy className="size-6" /> : <User className="size-6" />}
                          </div>
                          <div>
                            <p className="font-semibold text-lg">{bid.bidder}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(bid.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold text-2xl ${isWinningBid ? 'text-emerald-700' : ''}`}>${bid.amount.toLocaleString()}</p>
                          {isWinningBid && (
                            <Badge className="mt-1 bg-emerald-500 hover:bg-emerald-600 text-white">
                              Winning Bid
                            </Badge>
                          )}
                          {isLeadingBid && (
                            <Badge className="mt-1 bg-accent text-white">
                              Leading Bid
                            </Badge>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section>
            <h2 className="text-3xl md:text-4xl font-bold mb-8">Similar Auctions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {relatedProducts.map((relatedProduct) => (
                <Link key={relatedProduct.id} href={`/product/${relatedProduct.id}`}>
                  <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-slate-200 group">
                    <div className="aspect-square overflow-hidden bg-slate-100">
                      <img
                        src={relatedProduct.image}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-5">
                      <h3 className="font-semibold mb-2 line-clamp-2">{relatedProduct.name}</h3>
                      <p className="text-2xl font-bold text-slate-900">
                        ${relatedProduct.currentBid.toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
