"use client";

import { usePathname } from "next/navigation";
import { Gavel } from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  
  const isAuthPage = pathname === "/login" || pathname === "/register";
  if (isAuthPage) {
    return null;
  }

  return (
    <footer className="border-t bg-slate-900 text-white mt-12">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-accent rounded-lg">
                <Gavel className="size-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg">BidMax</span>
                <span className="block text-xs text-slate-400 tracking-wide">PREMIUM AUCTIONS</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your trusted platform for authentic luxury auctions and premium collectibles.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-accent">About</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Our Story</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Trust & Safety</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-accent">Support</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Buyer Protection</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-accent">Legal</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Auction Rules</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-8 border-t border-slate-800 text-center">
          <p className="text-sm text-slate-400">
            © 2026 BidMax. All rights reserved. | Crafted with excellence for discerning collectors.
          </p>
        </div>
      </div>
    </footer>
  );
}
