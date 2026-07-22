-- PremShop Database Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PRODUCTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  unit VARCHAR(50) DEFAULT 'เดือน',
  badge VARCHAR(10), -- HOT, NEW, SALE
  rating DECIMAL(3, 2) DEFAULT 5.0,
  review_count INTEGER DEFAULT 0,
  color VARCHAR(20),
  bg_color VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PRODUCT VARIANTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  duration VARCHAR(100) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PROFILES TABLE (extends Supabase auth.users)
-- =============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255),
  display_name VARCHAR(255),
  avatar_url TEXT,
  balance DECIMAL(10, 2) DEFAULT 0,
  total_spent DECIMAL(10, 2) DEFAULT 0,
  total_orders INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ORDERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number VARCHAR(20) UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  email VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, paid, delivered, cancelled
  payment_method VARCHAR(50),
  payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, failed
  subtotal DECIMAL(10, 2) NOT NULL,
  discount DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  coupon_code VARCHAR(50),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ORDER ITEMS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name VARCHAR(255) NOT NULL,
  variant_name VARCHAR(255),
  duration VARCHAR(100),
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  account_data TEXT, -- Encrypted account credentials sent to customer
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- REVIEWS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  order_id UUID REFERENCES orders(id),
  reviewer_name VARCHAR(255) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- PROMOTIONS / COUPONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS coupons (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_type VARCHAR(20) NOT NULL, -- 'percent' or 'fixed'
  discount_value DECIMAL(10, 2) NOT NULL,
  min_purchase DECIMAL(10, 2) DEFAULT 0,
  max_discount DECIMAL(10, 2),
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- WISHLIST TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS wishlists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;

-- Products: everyone can read, only admins can write
CREATE POLICY "Products are publicly readable" ON products
  FOR SELECT USING (is_active = true);

CREATE POLICY "Variants are publicly readable" ON product_variants
  FOR SELECT USING (is_active = true);

-- Profiles: users can only see/edit their own
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Orders: users can only see their own orders
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create an order" ON orders
  FOR INSERT WITH CHECK (true);

-- Order items: visible via order
CREATE POLICY "Users can view own order items" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM orders WHERE orders.id = order_id AND orders.user_id = auth.uid())
  );

-- Reviews: public read, authenticated write
CREATE POLICY "Reviews are publicly readable" ON reviews
  FOR SELECT USING (is_visible = true);

CREATE POLICY "Authenticated users can write reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Wishlists: own only
CREATE POLICY "Users can manage own wishlist" ON wishlists
  FOR ALL USING (auth.uid() = user_id);

-- Coupons: public read
CREATE POLICY "Coupons are publicly readable" ON coupons
  FOR SELECT USING (is_active = true);

-- =============================================
-- SEED DATA
-- =============================================

INSERT INTO products (name, slug, category, description, price, badge, rating, review_count, color, bg_color, sort_order) VALUES
('Netflix Premium', 'netflix-premium', 'streaming', '4K UHD\nรับประกัน 100%', 129.00, 'HOT', 4.9, 5432, '#E50914', 'rgba(229, 9, 20, 0.15)', 1),
('Disney+ Premium', 'disney-plus-premium', 'streaming', '4K UHD\nรับประกัน 100%', 129.00, 'HOT', 4.9, 3245, '#113CCF', 'rgba(17, 60, 207, 0.15)', 2),
('Spotify Premium', 'spotify-premium', 'music', 'ฟังเพลงไม่จำกัด\nดาวน์โหลดได้', 69.00, 'HOT', 4.8, 2154, '#1DB954', 'rgba(29, 185, 84, 0.15)', 3),
('YouTube Premium', 'youtube-premium', 'streaming', 'ไม่มีโฆษณา\nYouTube Music', 89.00, 'NEW', 4.8, 3876, '#FF0000', 'rgba(255, 0, 0, 0.15)', 4),
('Prime Video', 'prime-video', 'streaming', '4K UHD\nส่งอัจฉริมิติ', 129.00, 'HOT', 4.8, 1987, '#00A8E1', 'rgba(0, 168, 225, 0.15)', 5),
('HBO Max', 'hbo-max', 'streaming', '4K UHD\nรับประกัน 100%', 129.00, 'NEW', 4.9, 1254, '#5822B4', 'rgba(88, 34, 180, 0.15)', 6);

-- Product variants
INSERT INTO product_variants (product_id, name, duration, price)
SELECT p.id, 'Netflix Premium', '1 เดือน', 129.00 FROM products p WHERE p.slug = 'netflix-premium'
UNION ALL
SELECT p.id, 'Netflix Premium', '3 เดือน', 359.00 FROM products p WHERE p.slug = 'netflix-premium'
UNION ALL
SELECT p.id, 'Netflix 4K Ultra HD', '1 เดือน', 159.00 FROM products p WHERE p.slug = 'netflix-premium'
UNION ALL
SELECT p.id, 'Spotify Premium', '1 เดือน', 69.00 FROM products p WHERE p.slug = 'spotify-premium'
UNION ALL
SELECT p.id, 'Spotify Premium', '3 เดือน', 189.00 FROM products p WHERE p.slug = 'spotify-premium';

-- Seed coupons
INSERT INTO coupons (code, discount_type, discount_value, min_purchase, is_active) VALUES
('NEW20', 'percent', 20, 200, true),
('PREM50', 'fixed', 50, 300, true),
('NETFLIX10', 'percent', 10, 129, true);

-- Seed sample reviews
INSERT INTO reviews (reviewer_name, rating, comment, is_verified, is_visible, product_id)
SELECT 'Natcha', 5, 'ซื้อ Netflix ไปใช้แล้ว งานได้จริง ส่งไวมากกก', true, true, p.id
FROM products p WHERE p.slug = 'netflix-premium';

INSERT INTO reviews (reviewer_name, rating, comment, is_verified, is_visible, product_id)
SELECT 'Kittipong', 5, 'Spotify Premium คุ้มมากครับ ฟังเพลงได้ทุกที่ ไม่มีโฆษณา แนะนำเลย', true, true, p.id
FROM products p WHERE p.slug = 'spotify-premium';

-- =============================================
-- FUNCTIONS
-- =============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'display_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'PS' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(nextval('order_seq')::TEXT, 5, '0');
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS order_seq START 1;
