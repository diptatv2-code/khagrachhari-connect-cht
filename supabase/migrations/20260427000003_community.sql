CREATE TABLE IF NOT EXISTS community_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'সাধারণ' CHECK (category IN ('সাধারণ', 'খবর', 'সমস্যা', 'সাহায্য', 'বিজ্ঞপ্তি', 'আলোচনা')),
  author_name TEXT NOT NULL,
  author_phone TEXT,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS community_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view approved posts" ON community_posts FOR SELECT USING (is_approved = true);
CREATE POLICY "Anyone can create posts" ON community_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update post counts" ON community_posts FOR UPDATE USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can view comments" ON community_comments FOR SELECT USING (true);
CREATE POLICY "Anyone can comment" ON community_comments FOR INSERT WITH CHECK (true);

INSERT INTO community_posts (title, content, category, author_name) VALUES
('খাগড়াছড়ি শহরে নতুন সড়ক নির্মাণ', 'শহরের মূল সড়কে নতুন উন্নয়নমূলক কাজ শুরু হয়েছে। যানজট কমবে বলে আশা করা যাচ্ছে।', 'খবর', 'সামাজিক কর্মী রহিম'),
('আলুটিলা গুহায় পর্যটক বাড়ছে', 'এই শীত মৌসুমে আলুটিলায় পর্যটকের সংখ্যা গত বছরের তুলনায় দ্বিগুণ হয়েছে।', 'খবর', 'পর্যটন সংবাদদাতা'),
('বিদ্যুৎ সমস্যা সমাধান চাই', 'খাগড়াছড়ি সদরে প্রতিদিন ৪-৬ ঘন্টা লোডশেডিং হচ্ছে। এই সমস্যার দ্রুত সমাধান দরকার।', 'সমস্যা', 'স্থানীয় বাসিন্দা করিম'),
('নতুন ব্যবসায়ীদের জন্য পরামর্শ', 'খাগড়াছড়িতে নতুন ব্যবসা শুরু করতে চাইলে কোন ব্যবসাটা ভালো হবে? অভিজ্ঞদের মতামত চাই।', 'আলোচনা', 'উদ্যোক্তা মিজান'),
('সাজেক ভ্রমণ গাইড - সম্পূর্ণ তথ্য', 'সাজেক যাওয়ার জন্য সম্পূর্ণ গাইড। কখন যাবেন, কোথায় থাকবেন, কত খরচ হবে।', 'সাহায্য', 'ভ্রমণকারী সুমন');
