-- Add real hotels, restaurants and banks to existing businesses table.
-- Uses NOT EXISTS guard so re-runs are idempotent.

INSERT INTO businesses (name_bn, name_en, category, section, address, phone, rating, tag)
SELECT 'হোটেল শৈবাল', 'Hotel Shaibal', 'hotel', 'hotels', 'খাগড়াছড়ি সদর', '0371-61278', '4.2', 'জনপ্রিয়'
WHERE NOT EXISTS (SELECT 1 FROM businesses WHERE name_bn = 'হোটেল শৈবাল');

INSERT INTO businesses (name_bn, name_en, category, section, address, phone, rating, tag)
SELECT 'পর্যটন মোটেল', 'Parjatan Motel', 'hotel', 'hotels', 'খাগড়াছড়ি সদর', '0371-61301', '4.0', 'সরকারি'
WHERE NOT EXISTS (SELECT 1 FROM businesses WHERE name_bn = 'পর্যটন মোটেল');

INSERT INTO businesses (name_bn, name_en, category, section, address, phone, rating, tag)
SELECT 'হোটেল গিরিসুবর্ণ', 'Hotel Girishubarna', 'hotel', 'hotels', 'খাগড়াছড়ি শহর', '01718-000000', '3.8', 'বাজেট'
WHERE NOT EXISTS (SELECT 1 FROM businesses WHERE name_bn = 'হোটেল গিরিসুবর্ণ');

INSERT INTO businesses (name_bn, name_en, category, section, address, phone, rating)
SELECT 'পাহাড়িকা রেস্টুরেন্ট', 'Paharika Restaurant', 'restaurant', 'food', 'খাগড়াছড়ি সদর', '01715-000001', '4.5'
WHERE NOT EXISTS (SELECT 1 FROM businesses WHERE name_bn = 'পাহাড়িকা রেস্টুরেন্ট');

INSERT INTO businesses (name_bn, name_en, category, section, address, phone, rating)
SELECT 'মুক্তি রেস্তোরাঁ', 'Mukti Restaurant', 'restaurant', 'food', 'বাস স্ট্যান্ড, খাগড়াছড়ি', '01716-000001', '4.0'
WHERE NOT EXISTS (SELECT 1 FROM businesses WHERE name_bn = 'মুক্তি রেস্তোরাঁ');

INSERT INTO businesses (name_bn, name_en, category, section, address, phone, rating)
SELECT 'চাঁদের হাট রেস্তোরাঁ', 'Chander Haat Restaurant', 'restaurant', 'food', 'খাগড়াছড়ি শহর', '01711-000010', '4.4'
WHERE NOT EXISTS (SELECT 1 FROM businesses WHERE name_bn = 'চাঁদের হাট রেস্তোরাঁ');

INSERT INTO businesses (name_bn, name_en, category, section, address, phone, rating)
SELECT 'সোনালী ব্যাংক', 'Sonali Bank', 'bank', 'financial', 'মেইন রোড, খাগড়াছড়ি', '0371-61211', '4.0'
WHERE NOT EXISTS (SELECT 1 FROM businesses WHERE name_bn = 'সোনালী ব্যাংক');

INSERT INTO businesses (name_bn, name_en, category, section, address, phone, rating)
SELECT 'জনতা ব্যাংক', 'Janata Bank', 'bank', 'financial', 'খাগড়াছড়ি সদর', '0371-61212', '4.0'
WHERE NOT EXISTS (SELECT 1 FROM businesses WHERE name_bn = 'জনতা ব্যাংক');

INSERT INTO businesses (name_bn, name_en, category, section, address, phone, rating)
SELECT 'ডাচ-বাংলা ব্যাংক', 'Dutch-Bangla Bank', 'bank', 'financial', 'খাগড়াছড়ি সদর', '16216', '4.3'
WHERE NOT EXISTS (SELECT 1 FROM businesses WHERE name_bn = 'ডাচ-বাংলা ব্যাংক');

INSERT INTO businesses (name_bn, name_en, category, section, address, phone, rating)
SELECT 'ইসলামী ব্যাংক', 'Islami Bank', 'bank', 'financial', 'খাগড়াছড়ি সদর', '16259', '4.1'
WHERE NOT EXISTS (SELECT 1 FROM businesses WHERE name_bn = 'ইসলামী ব্যাংক');
