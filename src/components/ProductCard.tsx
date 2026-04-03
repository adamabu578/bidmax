import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock, TrendingUp, Trophy } from "lucide-react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { CountdownTimer } from "./CountdownTimer";
import { Product } from "../data/products";
import { useAuth } from "../context/AuthContext";
import { useProducts } from "../context/ProductContext";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { user } = useAuth();
  const { acceptBid } = useProducts();
  const pathname = usePathname();
  
  // Show seller controls if the user is a seller AND they are browsing within the seller dashboard area
  const isSellerView = user?.role === "seller" && pathname?.startsWith("/seller");

  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 hover:border-slate-200 group w-full max-w-[360px] mx-auto flex flex-col">
      <Link href={`/product/${product.id}`}>
        <div className="w-full aspect-[4/3] overflow-hidden bg-slate-100 relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3">
            <Badge className="bg-white/95 text-slate-900 backdrop-blur-sm border-0 shadow-lg">
              {product.condition}
            </Badge>
          </div>
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold mb-2 hover:text-primary transition-colors leading-snug line-clamp-2 text-sm">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-end justify-between mb-2">
          <div>
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">Current Bid</p>
            <p className="text-2xl font-bold text-slate-900">
              ${product.currentBid.toLocaleString()}
            </p>
          </div>
          <Badge variant="secondary" className="gap-1.5 bg-slate-100 text-slate-700 border-slate-200">
            <TrendingUp className="size-3.5" />
            {product.bids.length}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground bg-slate-50 rounded-lg px-2 py-1.5 text-sm">
          {product.status === 'sold' ? (
            <div className="font-semibold text-emerald-600 flex items-center gap-2">
              <Trophy className="size-4" />
              Sold / Won
            </div>
          ) : (
            <>
              <Clock className="size-4" />
              <CountdownTimer endTime={product.endTime} />
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        {isSellerView ? (
          <Button 
            className={`w-full font-semibold ${product.status === 'sold' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
            disabled={product.status === 'sold' || product.bids.length === 0}
            onClick={(e) => {
              e.preventDefault();
              if (product.status !== 'sold' && product.bids.length > 0) {
                 acceptBid(product.id, product.bids[0].id);
              }
            }}
          >
            {product.status === 'sold' ? 'Sold Out' : product.bids.length > 0 ? 'Accept Bid' : 'No Bids Yet'}
          </Button>
        ) : (
          <Link href={`/product/${product.id}`} className="w-full">
            <Button className={`w-full font-semibold ${product.status === 'sold' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-900 hover:bg-slate-800'}`}>
              {product.status === 'sold' ? 'Sold Out' : 'Place Bid'}
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  );
}