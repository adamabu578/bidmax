"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { ProductCard } from "../../../components/ProductCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { categories } from "../../../data/products";
import { useProducts } from "../../../context/ProductContext";

export default function CategoryPage() {
  const { products } = useProducts();
  const params = useParams();
  const categoryId = params?.categoryId as string;
  const category = categories.find(c => c.id === categoryId);
  const categoryProducts = products.filter(p => p.category === categoryId);

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Category not found</h2>
        <Link href="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-6">
            <Link href="/">
              <Button variant="outline" size="icon" className="bg-white/10 border-white/20 hover:bg-white/20 text-white">
                <ArrowLeft className="size-5" />
              </Button>
            </Link>
            <div className="h-8 w-px bg-white/20"></div>
            <Link href="/" className="text-sm text-slate-400 hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-slate-600">/</span>
            <span className="text-sm">{category.name}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-3">
            {category.name}
          </h1>
          <p className="text-lg md:text-xl text-slate-300">
            {categoryProducts.length} premium {categoryProducts.length === 1 ? 'auction' : 'auctions'} available
          </p>
        </div>
      </section>

      {/* Filters and Content */}
      <section className="container mx-auto px-4 py-10 md:py-16">
        {/* Filters and Sort */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-3">
            <Button variant="outline" className="gap-2 border-2">
              <SlidersHorizontal className="size-4" />
              Filters
            </Button>
            <span className="text-sm text-muted-foreground">
              Showing {categoryProducts.length} results
            </span>
          </div>
          <Select defaultValue="ending-soon">
            <SelectTrigger className="w-full sm:w-[220px] border-2">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ending-soon">Ending Soon</SelectItem>
              <SelectItem value="newly-listed">Newly Listed</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="most-bids">Most Bids</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Products Grid */}
        {categoryProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-2xl">
            <p className="text-lg text-muted-foreground mb-6">No auctions available in this category yet.</p>
            <Link href="/">
              <Button className="bg-slate-900 hover:bg-slate-800">Browse Other Categories</Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
