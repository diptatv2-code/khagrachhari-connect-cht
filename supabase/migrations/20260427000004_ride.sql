CREATE TABLE IF NOT EXISTS ride_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  passenger_name TEXT NOT NULL,
  passenger_phone TEXT NOT NULL,
  pickup_location TEXT NOT NULL,
  destination TEXT NOT NULL,
  ride_type TEXT DEFAULT 'CNG' CHECK (ride_type IN ('CNG', 'Motorcycle', 'Jeep/Microbus', 'Car')),
  notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE ride_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create ride request" ON ride_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view ride requests" ON ride_requests FOR SELECT USING (true);
