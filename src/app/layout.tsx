import { Toaster } from "../components/ui/sonner";
import { AppProviders } from "../components/AppProviders";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import "./globals.css";

export const metadata = {
  title: "BidMax - Premium Auctions",
  description: "Curated auctions for discerning collectors.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <div className="min-h-screen flex flex-col">
            <Toaster />
            <Header />
            
            {/* Main Content */}
            <main className="flex-1">
              {children}
            </main>

            {/* Footer */}
            <Footer />
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
