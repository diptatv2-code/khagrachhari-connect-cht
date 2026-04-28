-- Food restaurants table
CREATE TABLE IF NOT EXISTS food_restaurants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_bn TEXT,
  description TEXT,
  cuisine TEXT,
  rating DECIMAL(2,1) DEFAULT 4.0,
  delivery_time TEXT DEFAULT '30-45 min',
  delivery_charge INTEGER DEFAULT 40,
  min_order INTEGER DEFAULT 100,
  image_url TEXT,
  phone TEXT,
  address TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Menu items
CREATE TABLE IF NOT EXISTS food_menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES food_restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  name_bn TEXT,
  description TEXT,
  price INTEGER NOT NULL,
  category TEXT DEFAULT 'মেইন কোর্স',
  image_url TEXT,
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Food orders
CREATE TABLE IF NOT EXISTS food_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES food_restaurants(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  items JSONB NOT NULL,
  total_amount INTEGER NOT NULL,
  delivery_charge INTEGER DEFAULT 40,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'delivered', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS policies
ALTER TABLE food_restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE food_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active restaurants" ON food_restaurants FOR SELECT USING (is_active = true);
CREATE POLICY "Anyone can view menu items" ON food_menu_items FOR SELECT USING (is_available = true);
CREATE POLICY "Anyone can place orders" ON food_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view their orders" ON food_orders FOR SELECT USING (true);

-- Seed restaurants
INSERT INTO food_restaurants (name, name_bn, description, cuisine, rating, delivery_time, delivery_charge, phone, address) VALUES
('Hotel Al-Amin Restaurant', 'হোটেল আল-আমিন', 'খাগড়াছড়ির ঐতিহ্যবাহী বাংলাদেশি খাবার', 'Bangladeshi', 4.3, '30-40 min', 30, '01712-000001', 'Main Road, Khagrachhari'),
('Paharika Restaurant', 'পাহাড়িকা রেস্টুরেন্ট', 'স্থানীয় পাহাড়ি এবং বাংলা খাবার', 'Local Hill Cuisine', 4.5, '25-35 min', 40, '01715-000001', 'Khagrachhari Sadar'),
('Green Hill Restaurant', 'গ্রিন হিল রেস্তোরাঁ', 'তাজা রান্না করা ভাত-তরকারি', 'Bangladeshi', 4.2, '35-45 min', 30, '01714-000001', 'Khagrachhari Sadar'),
('Mukti Restaurant', 'মুক্তি রেস্তোরাঁ', 'বাস স্ট্যান্ড এলাকার সেরা খাবার', 'Bangladeshi', 4.0, '20-30 min', 20, '01716-000001', 'Bus Stand, Khagrachhari'),
('Chander Haat Restaurant', 'চাঁদের হাট রেস্তোরাঁ', 'পরিবারের জন্য বিশেষ খাবার', 'Bangladeshi', 4.4, '40-50 min', 50, '01711-000010', 'Khagrachhari Town');

-- Seed menu items per restaurant
DO $$
DECLARE
  r1 UUID; r2 UUID; r3 UUID; r4 UUID; r5 UUID;
BEGIN
  SELECT id INTO r1 FROM food_restaurants WHERE name = 'Hotel Al-Amin Restaurant' LIMIT 1;
  SELECT id INTO r2 FROM food_restaurants WHERE name = 'Paharika Restaurant' LIMIT 1;
  SELECT id INTO r3 FROM food_restaurants WHERE name = 'Green Hill Restaurant' LIMIT 1;
  SELECT id INTO r4 FROM food_restaurants WHERE name = 'Mukti Restaurant' LIMIT 1;
  SELECT id INTO r5 FROM food_restaurants WHERE name = 'Chander Haat Restaurant' LIMIT 1;

  INSERT INTO food_menu_items (restaurant_id, name, name_bn, price, category, description) VALUES
  (r1, 'Rice + Fish Curry', 'ভাত + মাছের তরকারি', 120, 'মেইন কোর্স', 'গরম ভাত ও দেশী মাছের তরকারি'),
  (r1, 'Rice + Beef', 'ভাত + মাংস', 180, 'মেইন কোর্স', 'গরম ভাত ও মসলাদার মাংস'),
  (r1, 'Rice + Dal + Vegetables', 'ভাত + ডাল + সবজি', 80, 'মেইন কোর্স', 'ভাত, ডাল ও মৌসুমি সবজি'),
  (r1, 'Biryani', 'বিরিয়ানি', 200, 'বিশেষ', 'খুশবুদার বিরিয়ানি'),
  (r1, 'Roti + Vaji', 'রুটি + ভাজি', 60, 'নাস্তা', 'গরম রুটি ও সবজি ভাজি'),

  (r2, 'Bamboo Chicken', 'বাঁশ মুরগি', 280, 'বিশেষ', 'পাহাড়ি স্টাইলে বাঁশের মধ্যে রান্না করা মুরগি'),
  (r2, 'Hill Vegetables', 'পাহাড়ি সবজি', 120, 'মেইন কোর্স', 'স্থানীয় পাহাড়ি সবজির মিশ্রণ'),
  (r2, 'Rice + Pork Curry', 'ভাত + শূকরের মাংস', 220, 'মেইন কোর্স', 'ঐতিহ্যবাহী পাহাড়ি রেসিপি'),
  (r2, 'Fish Chutney', 'মাছ ভর্তা', 100, 'সাইড', 'শুঁটকি মাছ ভর্তা'),
  (r2, 'Hill Tea', 'পাহাড়ি চা', 30, 'পানীয়', 'স্থানীয় চা পাতার বিশেষ চা'),

  (r3, 'Set Menu', 'সেট মেনু', 150, 'কম্বো', 'ভাত + ডাল + সবজি + মাছ/মাংস'),
  (r3, 'Khichuri', 'খিচুড়ি', 100, 'মেইন কোর্স', 'গরম খিচুড়ি ও ডিম'),
  (r3, 'Vegetable Pulao', 'ভেজিটেবল পোলাও', 130, 'মেইন কোর্স', 'মসলাদার সবজি পোলাও'),
  (r3, 'Egg Curry', 'ডিমের তরকারি', 90, 'মেইন কোর্স', 'ডিমের কষা তরকারি'),
  (r3, 'Tea + Snacks', 'চা + নাস্তা', 50, 'নাস্তা', 'এক কাপ চা ও বিস্কুট'),

  (r4, 'Quick Lunch', 'কুইক লাঞ্চ', 100, 'কম্বো', 'ভাত, ডাল ও সবজি'),
  (r4, 'Egg Khichuri', 'ডিম খিচুড়ি', 80, 'মেইন কোর্স', 'ডিম দিয়ে খিচুড়ি'),
  (r4, 'Paratha + Curry', 'পরোটা + ভাজি', 70, 'নাস্তা', 'পরোটা ও সবজি ভাজি'),
  (r4, 'Singara', 'সিঙ্গাড়া', 15, 'নাস্তা', 'গরম সিঙ্গাড়া (১টি)'),
  (r4, 'Rice + Mixed Curry', 'ভাত + মিশ্র তরকারি', 130, 'মেইন কোর্স', 'মিক্স তরকারি'),

  (r5, 'Family Pack', 'ফ্যামিলি প্যাক', 350, 'কম্বো', '৪ জনের জন্য — ভাত, ডাল, মাছ, মাংস ও সবজি'),
  (r5, 'Special Biryani', 'স্পেশাল বিরিয়ানি', 250, 'বিশেষ', 'কাচ্চি বিরিয়ানি'),
  (r5, 'Fish Fry', 'মাছ ভাজা', 180, 'সাইড', 'মুচমুচে মাছ ভাজা'),
  (r5, 'Chicken Roast', 'চিকেন রোস্ট', 220, 'মেইন কোর্স', 'কাজু-কিশমিশ দিয়ে চিকেন রোস্ট'),
  (r5, 'Borhani', 'বোরহানি', 40, 'পানীয়', 'এক গ্লাস বোরহানি');
END $$;
