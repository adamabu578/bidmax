-- Create custom types (if not already created)
CREATE TYPE user_role AS ENUM ('buyer', 'seller', 'admin');

-- 1. Create profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT NOT NULL,
  role user_role DEFAULT 'buyer'::user_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Create auctions table
CREATE TABLE auctions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  starting_price DECIMAL(12, 2) NOT NULL,
  current_price DECIMAL(12, 2) NOT NULL,
  image_url TEXT,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'ended', 'cancelled')) NOT NULL
);

-- Turn on Row Level Security for auctions
ALTER TABLE auctions ENABLE ROW LEVEL SECURITY;

-- Policies for auctions
CREATE POLICY "Auctions are viewable by everyone." ON auctions FOR SELECT USING (true);
CREATE POLICY "Sellers can create auctions." ON auctions FOR INSERT WITH CHECK (
  auth.uid() = seller_id AND 
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'seller')
);
CREATE POLICY "Sellers can update their own auctions." ON auctions FOR UPDATE USING (auth.uid() = seller_id);

-- 3. Create bids table
CREATE TABLE bids (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  auction_id UUID REFERENCES auctions(id) ON DELETE CASCADE NOT NULL,
  bidder_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  amount DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security for bids
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;

-- Policies for bids
CREATE POLICY "Bids are viewable by everyone." ON bids FOR SELECT USING (true);
CREATE POLICY "Buyers can place bids." ON bids FOR INSERT WITH CHECK (auth.uid() = bidder_id);

-- Optional: Create a function and trigger to automatically update the 'current_price' in the auctions table whenever a new bid is placed.
CREATE OR REPLACE FUNCTION update_auction_current_price()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the auction price if the new bid is higher
  UPDATE auctions
  SET current_price = NEW.amount
  WHERE id = NEW.auction_id AND current_price < NEW.amount;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_price_after_bid
AFTER INSERT ON bids
FOR EACH ROW
EXECUTE FUNCTION update_auction_current_price();
