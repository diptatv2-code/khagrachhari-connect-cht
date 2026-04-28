CREATE TABLE IF NOT EXISTS jobs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT DEFAULT 'খাগড়াছড়ি',
  job_type TEXT DEFAULT 'full-time' CHECK (job_type IN ('full-time', 'part-time', 'contract', 'freelance')),
  salary_range TEXT,
  description TEXT NOT NULL,
  requirements TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  application_deadline DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'pending')),
  posted_by_name TEXT,
  posted_by_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days')
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active jobs" ON jobs FOR SELECT USING (status = 'active');
CREATE POLICY "Anyone can post jobs" ON jobs FOR INSERT WITH CHECK (true);

INSERT INTO jobs (title, company, location, job_type, salary_range, description, requirements, contact_phone) VALUES
('অফিস সহকারী', 'খাগড়াছড়ি জেলা প্রশাসন', 'খাগড়াছড়ি সদর', 'full-time', '৳১৫,০০০-২০,০০০/মাস', 'অফিসের দৈনন্দিন কাজ পরিচালনা এবং ফাইল ব্যবস্থাপনা।', 'এইচএসসি পাস, কম্পিউটার জ্ঞান থাকতে হবে', '01711-000050'),
('শিক্ষক (গণিত)', 'খাগড়াছড়ি উচ্চ বিদ্যালয়', 'খাগড়াছড়ি সদর', 'full-time', '৳১২,০০০-১৮,০০০/মাস', 'মাধ্যমিক বিদ্যালয়ে গণিত পড়ানো।', 'গণিতে স্নাতক/স্নাতকোত্তর', '01712-000050'),
('ড্রাইভার (মাইক্রোবাস)', 'ব্যক্তিগত চাহিদা', 'খাগড়াছড়ি', 'full-time', '৳১৮,০০০-২৫,০০০/মাস', 'পারিবারিক মাইক্রোবাস চালানো এবং রক্ষণাবেক্ষণ।', 'ভালো ড্রাইভিং লাইসেন্স, ৫ বছরের অভিজ্ঞতা', '01715-000050'),
('ফার্মেসি সেলসম্যান', 'আল-শেফা ফার্মেসি', 'খাগড়াছড়ি সদর', 'full-time', '৳৮,০০০-১২,০০০/মাস', 'ওষুধ বিক্রয় এবং গ্রাহক সেবা।', 'ফার্মেসি সম্পর্কে জ্ঞান থাকতে হবে', '01716-000050'),
('ডেলিভারি ম্যান', 'পাহাড়িকা রেস্টুরেন্ট', 'খাগড়াছড়ি সদর', 'part-time', '৳৬,০০০-১০,০০০/মাস', 'খাবার ডেলিভারি এবং অর্ডার নেওয়া।', 'মোটরসাইকেল থাকতে হবে', '01715-000001'),
('অ্যাকাউন্ট্যান্ট', 'স্থানীয় ব্যবসা প্রতিষ্ঠান', 'খাগড়াছড়ি', 'full-time', '৳২০,০০০-৩০,০০০/মাস', 'হিসাব সংরক্ষণ, ট্যাক্স রিটার্ন এবং আর্থিক বিশ্লেষণ।', 'বিকম/এমকম পাস, Tally বা একাউন্টিং সফটওয়্যার জানতে হবে', '01714-000050'),
('কম্পিউটার টেকনিশিয়ান', 'IT Service Center', 'খাগড়াছড়ি সদর', 'full-time', '৳১০,০০০-১৫,০০০/মাস', 'কম্পিউটার মেরামত, নেটওয়ার্ক সেটআপ।', 'কম্পিউটার বিজ্ঞানে ডিপ্লোমা বা অভিজ্ঞতা', '01717-000050'),
('সেলস এক্সিকিউটিভ', 'স্থানীয় পণ্য বিপণন', 'খাগড়াছড়ি জেলা', 'full-time', '৳১২,০০০ + কমিশন', 'পণ্য বিক্রয় ও মার্কেটিং।', 'এইচএসসি পাস, যোগাযোগ দক্ষতা', '01718-000050'),
('নার্স/প্যারামেডিক', 'স্থানীয় ক্লিনিক', 'খাগড়াছড়ি সদর', 'full-time', '৳১৫,০০০-২২,০০০/মাস', 'রোগীদের সেবা এবং চিকিৎসা সহায়তা।', 'নার্সিং ডিপ্লোমা বা সার্টিফিকেট', '01711-000060'),
('গ্রাফিক ডিজাইনার', 'ডিজিটাল মার্কেটিং এজেন্সি', 'খাগড়াছড়ি', 'freelance', '৳প্রজেক্ট ভিত্তিক', 'লোগো, ব্যানার, সোশ্যাল মিডিয়া গ্রাফিক্স ডিজাইন।', 'Photoshop, Illustrator দক্ষতা', '01712-000060');
