"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { 
  Smartphone, 
  Watch, 
  ShoppingBag, 
  Briefcase, 
  Shirt, 
  Laptop,
  Shield,
  TrendingUp,
  Award
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { ProductCard } from "../components/ProductCard";
import { categories } from "../data/products";
import { useProducts } from "../context/ProductContext";
import { useAuth } from "../context/AuthContext";

const iconMap: Record<string, any> = {
  Smartphone,
  Watch,
  ShoppingBag,
  Briefcase,
  Shirt,
  Laptop,
};

export default function HomePage() {
  const { products } = useProducts();
  const { user } = useAuth();
  
  const featuredProducts = products.filter((p) => p.featured);
  const recentProducts = products.slice(0, 8);
  
  // If seller is logged in, prioritize showing their own product that has active bids in the hero
  const sellerActiveBids = user?.role === "seller" 
    ? [...products].filter(p => p.sellerId === user.id && p.status !== 'sold' && p.bids.length > 0).sort((a,b) => b.bids.length - a.bids.length)
    : [];
    
  // Find the product globally that has the most recent bid (most active)
  const mostActiveProduct = [...products]
    .filter(p => p.status !== 'sold' && p.bids.length > 0)
    .sort((a, b) => new Date(b.bids[0].timestamp).getTime() - new Date(a.bids[0].timestamp).getTime())[0];
    
  const heroProduct = sellerActiveBids.length > 0 
    ? sellerActiveBids[0] 
    : mostActiveProduct || featuredProducts.find(p => p.status !== 'sold') || products.find(p => p.status !== 'sold') || products[0];

  return (
    <div>
      {/* Hero Section - Always Visible */}
      <section className="bg-slate-900 text-white relative overflow-hidden">
        {/* Abstract background blobs */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-accent/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl"></div>
        
        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-block mb-4">
                <span className="px-4 py-1.5 bg-accent/20 text-accent border border-accent/30 rounded-full text-sm tracking-wide">
                  LIVE BIDDING MARKETPLACE
                </span>
              </div>
              <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold mb-6 tracking-tight">
                Bid Win and Own
                <span className="block text-accent mt-2">Any Item You Desire</span>
              </h1>
              <p className="text-xl md:text-2xl mb-10 text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Your ultimate destination for competitive bidding. From everyday essentials to rare finds, place your bids on anything and secure the best deals today.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Button size="lg" className="px-8 py-6 text-lg bg-accent hover:bg-accent/90 text-white shadow-lg shadow-accent/20" asChild>
                  <Link href="#featured-auctions">Start Bidding</Link>
                </Button>
                {!user && (
                  <Button size="lg" variant="outline" className="px-8 py-6 text-lg bg-transparent text-white border-white/30 hover:bg-white/10 hover:border-white/50" asChild>
                    <Link href="/login">Join as User</Link>
                  </Button>
                )}
              </div>
            </div>
            <div className="mt-14 lg:mt-0 relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[360px]">
                <div className="absolute -inset-4 bg-gradient-to-tr from-accent/40 to-transparent rounded-3xl blur-2xl -z-10"></div>
                {heroProduct && (
                  <div className="shadow-2xl rounded-xl ring-4 ring-white/10 dark-mode-override relative">
                    <div className="absolute -top-3 -left-3 z-30 flex items-center justify-center">
                      <span className="relative flex h-8 w-20">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20"></span>
                        <span className="relative inline-flex rounded-full h-8 w-20 bg-emerald-500 text-white font-bold text-[10px] items-center justify-center tracking-[0.2em] shadow-lg border border-emerald-400 uppercase">
                          <span className="size-1.5 rounded-full bg-white mr-1.5"></span>
                          LIVE
                        </span>
                      </span>
                    </div>
                    <ProductCard product={heroProduct} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Buyer Specific View */}
      {user?.role === 'buyer' && (
        <section className="bg-slate-50 border-b">
          <div className="container mx-auto px-4 py-12 md:py-16">
            
            {/* My Active Bids Section */}
            {(() => {
              const myBids = products.filter(p => p.bids.some(b => b.bidder === user.name) && p.status !== 'sold');
              if (myBids.length > 0) {
                return (
                  <div className="mb-16">
                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
                      <div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-slate-800 tracking-tight flex items-center gap-3">
                          <span className="relative flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                          </span>
                          Your Active Bids
                        </h2>
                        <p className="text-lg text-slate-500">Track the auctions you are currently participating in.</p>
                      </div>
                    </div>
                    <Swiper
                      modules={[Autoplay]}
                      spaceBetween={24}
                      slidesPerView={1}
                      breakpoints={{
                        768: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                        1280: { slidesPerView: 4 },
                      }}
                      className="pb-2 px-2"
                    >
                      {myBids.map(product => {
                        const isWinning = product.bids[0].bidder === user.name;
                        return (
                          <SwiperSlide key={`my-bids-${product.id}`}>
                            <div className="relative">
                              <div className="absolute -top-3 -right-3 z-30">
                                {isWinning ? (
                                  <div className="bg-emerald-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border-2 border-emerald-300">
                                    WINNING
                                  </div>
                                ) : (
                                  <div className="bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg border-2 border-amber-300">
                                    OUTBID
                                  </div>
                                )}
                              </div>
                              <ProductCard product={product} />
                            </div>
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  </div>
                );
              }
              return null;
            })()}

            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4 pt-4 border-t border-slate-200">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3 text-slate-800 tracking-tight">Live Auctions</h2>
                <p className="text-lg text-slate-500">Browse all available items currently open for bidding</p>
              </div>
            </div>
            {products.filter(p => p.status !== 'sold').length > 0 ? (
              <Swiper
                modules={[Autoplay]}
                spaceBetween={24}
                slidesPerView={1}
                breakpoints={{
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                  1280: { slidesPerView: 4 },
                }}
                className="pb-6 px-2"
              >
                {products.filter(p => p.status !== 'sold').map(product => (
                  <SwiperSlide key={product.id}>
                    <ProductCard product={product} />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl bg-white">
                <p className="text-xl text-slate-500 font-medium">No active auctions available right now.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Browse by Category</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our carefully curated collection across multiple categories
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => {
            const Icon = iconMap[category.icon] || ShoppingBag;
            return (
              <Link key={category.id} href={`/category/${category.id}`}>
                <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 group">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-primary/5 transition-colors">
                        <Icon className="size-8 text-slate-700 group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                    <h3 className="font-semibold mb-1 text-base">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">{category.count} items</p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-50 py-16 md:py-24 border-y">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-5 bg-white rounded-2xl shadow-sm border">
                  <Shield className="size-10 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-3">Verified Authenticity</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every item is thoroughly authenticated by our expert team to ensure genuine quality and provenance.
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-5 bg-white rounded-2xl shadow-sm border">
                  <Award className="size-10 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-3">Curated Selection</h3>
              <p className="text-muted-foreground leading-relaxed">
                Handpicked premium products from trusted sellers, delivering excellence in every auction.
              </p>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-5 bg-white rounded-2xl shadow-sm border">
                  <TrendingUp className="size-10 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold mb-3">Fair Bidding</h3>
              <p className="text-muted-foreground leading-relaxed">
                Transparent bidding process with real-time updates ensuring a fair marketplace for all participants.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Auctions */}
      <section id="featured-auctions" className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-3">Featured Auctions</h2>
            <p className="text-lg text-muted-foreground">Premium items ending soon</p>
          </div>
          <Button variant="outline" className="hidden md:inline-flex border-2">View All Auctions</Button>
        </div>
        <Swiper
          modules={[Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="pb-6 px-2"
        >
          {featuredProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Recent Auctions */}
      <section className="container mx-auto px-4 py-16 md:py-24 bg-slate-50/50">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-3">Latest Listings</h2>
            <p className="text-lg text-muted-foreground">Recently added to our collection</p>
          </div>
        </div>
        <Swiper
          modules={[Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="pb-6 px-2"
        >
          {recentProducts.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* CTA Section */}
      <section className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 py-20 md:py-32 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Begin Your Collecting Journey
            </h2>
            <p className="text-xl mb-10 text-slate-300 leading-relaxed">
              Join our community of distinguished collectors and discover exceptional items through our trusted auction platform.
            </p>
            <Button size="lg" className="px-10 py-6 text-lg bg-accent hover:bg-accent/90 text-white">
              Create Your Account
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
