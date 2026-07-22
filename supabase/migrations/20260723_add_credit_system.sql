-- Run this in your Supabase SQL Editor
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS balance DECIMAL(10, 2) DEFAULT 0;

-- Table for tracking top-up requests
CREATE TABLE IF NOT EXISTS topup_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  slip_url TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for topup_requests
ALTER TABLE topup_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own topup requests" ON topup_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create topup requests" ON topup_requests FOR INSERT WITH CHECK (auth.uid() = user_id);
