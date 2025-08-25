-- Create data processing log table for GDPR compliance
CREATE TABLE IF NOT EXISTS data_processing_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  activity TEXT NOT NULL,
  purpose TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Create consent tracking table
CREATE TABLE IF NOT EXISTS user_consent (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  consent_type TEXT NOT NULL, -- 'cookies', 'marketing', 'analytics'
  consent_given BOOLEAN NOT NULL,
  consent_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  consent_method TEXT, -- 'banner', 'settings', 'signup'
  ip_address INET,
  user_agent TEXT
);

-- Create data retention policies table
CREATE TABLE IF NOT EXISTS data_retention_policies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  data_type TEXT NOT NULL,
  retention_period_days INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE data_processing_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_consent ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_retention_policies ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can only access their own processing log" ON data_processing_log
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can only access their own consent records" ON user_consent
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Data retention policies are read-only for all users" ON data_retention_policies
  FOR SELECT USING (true);

-- Insert default retention policies
INSERT INTO data_retention_policies (data_type, retention_period_days, description) VALUES
('user_profile', 2555, 'User profile data retained for 7 years after account deletion'),
('marketing_data', 1095, 'Marketing data retained for 3 years'),
('analytics_data', 730, 'Analytics data retained for 2 years'),
('billing_data', 2555, 'Billing data retained for 7 years for tax purposes'),
('support_tickets', 1095, 'Support communications retained for 3 years');
