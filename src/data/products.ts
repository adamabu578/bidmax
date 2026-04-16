export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  currentBid: number;
  startingBid: number;
  endTime: Date;
  description: string;
  condition: string;
  bids: Bid[];
  featured?: boolean;
  sellerId?: string;
  status?: 'active' | 'sold';
  acceptedBidId?: string;
}

export interface Bid {
  id: string;
  amount: number;
  bidder: string;
  timestamp: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export const categories: Category[] = [
  { id: "electronics", name: "Electronics", icon: "Smartphone", count: 156 },
  { id: "watches", name: "Watches", icon: "Watch", count: 89 },
  { id: "shoes", name: "Shoes", icon: "ShoppingBag", count: 234 },
  { id: "bags", name: "Bags", icon: "Briefcase", count: 178 },
  { id: "clothes", name: "Clothes", icon: "Shirt", count: 412 },
  { id: "gadgets", name: "Gadgets", icon: "Laptop", count: 198 },
];

// Mock products data
export const products: Product[] = [
  {
    id: "1",
    name: "Luxury Smart Watch Pro",
    category: "watches",
    image: "https://images.unsplash.com/photo-1737731662588-729f42147158?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzbWFydCUyMHdhdGNofGVufDF8fHx8MTc3NDk1NzkzNnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    currentBid: 450,
    startingBid: 299,
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    description: "Premium smartwatch with advanced health tracking, GPS, and premium materials. Perfect condition with original packaging.",
    condition: "Brand New",
    featured: true,
    bids: [
      { id: "b-demo", amount: 460, bidder: "Demo Buyer", timestamp: new Date() },
      { id: "b1", amount: 450, bidder: "JohnD", timestamp: new Date(Date.now() - 30000) },
      { id: "b2", amount: 420, bidder: "SarahM", timestamp: new Date(Date.now() - 120000) },
      { id: "b3", amount: 380, bidder: "MikeR", timestamp: new Date(Date.now() - 300000) },
    ],
  },
  {
    id: "2",
    name: "Premium Wireless Headphones",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1764557159396-419b85356035?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aXJlbGVzcyUyMGhlYWRwaG9uZXMlMjBlbGVjdHJvbmljc3xlbnwxfHx8fDE3NzQ5NDk5MDN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    currentBid: 280,
    startingBid: 199,
    endTime: new Date(Date.now() + 5 * 60 * 60 * 1000), // 5 hours from now
    description: "High-quality wireless headphones with noise cancellation, 30-hour battery life, and premium sound quality.",
    condition: "Like New",
    featured: true,
    bids: [
      { id: "b4", amount: 280, bidder: "AlexK", timestamp: new Date(Date.now() - 45000) },
      { id: "b5", amount: 250, bidder: "EmilyW", timestamp: new Date(Date.now() - 180000) },
    ],
  },
  {
    id: "3",
    name: "Gaming Laptop RTX 4080",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1606625000171-fa7d471da28c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBsYXB0b3AlMjBjb21wdXRlcnxlbnwxfHx8fDE3NzQ5OTI0NTJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    currentBid: 1850,
    startingBid: 1499,
    endTime: new Date(Date.now() + 8 * 60 * 60 * 1000),
    description: "Powerful gaming laptop with RTX 4080, 32GB RAM, 1TB SSD. Perfect for gaming and content creation.",
    condition: "Excellent",
    featured: true,
    bids: [
      { id: "b6", amount: 1850, bidder: "GamerPro", timestamp: new Date(Date.now() - 60000) },
      { id: "b7", amount: 1750, bidder: "TechGuru", timestamp: new Date(Date.now() - 240000) },
      { id: "b8", amount: 1650, bidder: "LaptopFan", timestamp: new Date(Date.now() - 450000) },
    ],
  },
  {
    id: "4",
    name: "Designer Sneakers Limited Edition",
    category: "shoes",
    image: "https://images.unsplash.com/photo-1686783695684-7b8351fdebbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMHNuZWFrZXJzJTIwc2hvZXN8ZW58MXx8fHwxNzc0OTkwNDgyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    currentBid: 320,
    startingBid: 250,
    endTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
    description: "Rare limited edition designer sneakers. Size 10 US. Never worn, with original box and authentication.",
    condition: "Brand New",
    bids: [
      { id: "b9", amount: 320, bidder: "SneakerHead", timestamp: new Date(Date.now() - 20000) },
      { id: "b10", amount: 290, bidder: "StyleKing", timestamp: new Date(Date.now() - 150000) },
    ],
  },
  {
    id: "5",
    name: "Luxury Leather Handbag",
    category: "bags",
    image: "https://images.unsplash.com/photo-1570431118100-c24a54fdeab0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZWF0aGVyJTIwaGFuZGJhZyUyMHB1cnNlfGVufDF8fHx8MTc3NDk2MDk3Mnww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    currentBid: 680,
    startingBid: 500,
    endTime: new Date(Date.now() + 6 * 60 * 60 * 1000),
    description: "Genuine leather designer handbag. Classic style with gold hardware. Comes with dust bag and certificate.",
    condition: "Excellent",
    bids: [
      { id: "b11", amount: 680, bidder: "FashionQueen", timestamp: new Date(Date.now() - 90000) },
      { id: "b12", amount: 620, bidder: "LuxuryLover", timestamp: new Date(Date.now() - 270000) },
    ],
  },
  {
    id: "6",
    name: "Premium Fashion Jacket",
    category: "clothes",
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwamFja2V0JTIwY2xvdGhpbmd8ZW58MXx8fHwxNzc1MDI4MTc4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    currentBid: 180,
    startingBid: 120,
    endTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
    description: "Stylish designer jacket, perfect for spring/fall. Size M. High-quality materials and construction.",
    condition: "Like New",
    bids: [
      { id: "b13", amount: 180, bidder: "StyleIcon", timestamp: new Date(Date.now() - 50000) },
      { id: "b14", amount: 160, bidder: "FashionBoy", timestamp: new Date(Date.now() - 200000) },
    ],
  },
  {
    id: "7",
    name: "Latest Flagship Smartphone",
    category: "electronics",
    image: "https://images.unsplash.com/photo-1741061962757-3a96e9dbc9e8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydHBob25lJTIwbW9iaWxlJTIwcGhvbmV8ZW58MXx8fHwxNzc0OTExODEwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    currentBid: 820,
    startingBid: 699,
    endTime: new Date(Date.now() + 7 * 60 * 60 * 1000),
    description: "Latest flagship smartphone with 256GB storage, 5G support, and professional camera system. Factory unlocked.",
    condition: "Brand New",
    bids: [
      { id: "b15", amount: 820, bidder: "TechFan", timestamp: new Date(Date.now() - 40000) },
      { id: "b16", amount: 780, bidder: "MobileGuru", timestamp: new Date(Date.now() - 190000) },
    ],
  },
  {
    id: "8",
    name: "Professional Camera Kit",
    category: "gadgets",
    image: "https://images.unsplash.com/photo-1729655669048-a667a0b01148?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYW1lcmElMjBwaG90b2dyYXBoeSUyMGVxdWlwbWVudHxlbnwxfHx8fDE3NzUwMjU5NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    currentBid: 1250,
    startingBid: 999,
    endTime: new Date(Date.now() + 10 * 60 * 60 * 1000),
    description: "Professional camera with multiple lenses, tripod, and accessories. Perfect for photography enthusiasts.",
    condition: "Excellent",
    bids: [
      { id: "b17", amount: 1250, bidder: "PhotoPro", timestamp: new Date(Date.now() - 70000) },
      { id: "b18", amount: 1150, bidder: "ShutterBug", timestamp: new Date(Date.now() - 280000) },
    ],
  },
  {
    id: "9",
    name: "Performance Running Shoes",
    category: "shoes",
    image: "https://images.unsplash.com/photo-1765914448113-ebf0ce8cb918?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxydW5uaW5nJTIwc2hvZXMlMjBhdGhsZXRpY3xlbnwxfHx8fDE3NzQ5ODUzNTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    currentBid: 145,
    startingBid: 99,
    endTime: new Date(Date.now() + 2.5 * 60 * 60 * 1000),
    description: "High-performance running shoes with advanced cushioning. Size 9.5 US. Barely used, excellent condition.",
    condition: "Like New",
    bids: [
      { id: "b19", amount: 145, bidder: "RunnerJoe", timestamp: new Date(Date.now() - 35000) },
      { id: "b20", amount: 125, bidder: "AthleteAmy", timestamp: new Date(Date.now() - 170000) },
    ],
  },
  {
    id: "10",
    name: "Premium Travel Backpack",
    category: "bags",
    image: "https://images.unsplash.com/photo-1673505705687-dffbfd02b613?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWNrcGFjayUyMHRyYXZlbCUyMGJhZ3xlbnwxfHx8fDE3NzQ5MTgzNTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    currentBid: 95,
    startingBid: 65,
    endTime: new Date(Date.now() + 5.5 * 60 * 60 * 1000),
    description: "Durable travel backpack with multiple compartments, laptop sleeve, and water-resistant materials.",
    condition: "Good",
    bids: [
      { id: "b21", amount: 95, bidder: "TravelBug", timestamp: new Date(Date.now() - 55000) },
      { id: "b22", amount: 80, bidder: "Wanderer", timestamp: new Date(Date.now() - 220000) },
    ],
  },
  {
    id: "11",
    name: "4K Camera Drone",
    category: "gadgets",
    image: "https://images.unsplash.com/photo-1774553944407-2bab830a7967?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcm9uZSUyMHF1YWRjb3B0ZXIlMjBnYWRnZXR8ZW58MXx8fHwxNzc1MDM4NzY0fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    currentBid: 580,
    startingBid: 450,
    endTime: new Date(Date.now() + 9 * 60 * 60 * 1000),
    description: "Professional 4K camera drone with gimbal stabilization, 30-minute flight time, and intelligent flight modes.",
    condition: "Like New",
    featured: true,
    bids: [
      { id: "b23", amount: 580, bidder: "AerialView", timestamp: new Date(Date.now() - 25000) },
      { id: "b24", amount: 520, bidder: "DronePilot", timestamp: new Date(Date.now() - 160000) },
    ],
  },
  {
    id: "12",
    name: "Vintage Automatic Watch",
    category: "watches",
    image: "https://images.unsplash.com/photo-1759910546811-8d9df1501688?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aW50YWdlJTIwd3Jpc3R3YXRjaCUyMHRpbWVwaWVjZXxlbnwxfHx8fDE3NzUwMzg3NjV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    currentBid: 890,
    startingBid: 650,
    endTime: new Date(Date.now() + 12 * 60 * 60 * 1000),
    description: "Rare vintage automatic watch from renowned manufacturer. Serviced and authenticated. Includes original box.",
    condition: "Excellent",
    bids: [
      { id: "b25", amount: 890, bidder: "WatchCollector", timestamp: new Date(Date.now() - 80000) },
      { id: "b26", amount: 820, bidder: "TimeKeeper", timestamp: new Date(Date.now() - 320000) },
    ],
  },
];
