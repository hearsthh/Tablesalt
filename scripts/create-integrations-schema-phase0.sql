-- Phase 0 Integration Schema for Testing
-- This creates the essential tables needed for integration testing

-- Integration providers table
CREATE TABLE IF NOT EXISTS integration_providers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  display_name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  logo_url TEXT,
  api_available BOOLEAN DEFAULT false,
  demo_available BOOLEAN DEFAULT true,
  supported_countries TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Restaurant integrations table
CREATE TABLE IF NOT EXISTS restaurant_integrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES restaurants(id) ON DELETE CASCADE,
  provider_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'demo' CHECK (status IN ('demo', 'connected', 'disconnected', 'error')),
  config JSONB DEFAULT '{}',
  credentials JSONB DEFAULT '{}', -- Encrypted in production
  last_sync_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(restaurant_id, provider_name)
);

-- Insert core integration providers for Phase 0
INSERT INTO integration_providers (name, display_name, category, description, api_available, demo_available, supported_countries) VALUES
('google-my-business', 'Google My Business', 'restaurantInfo', 'Manage your Google listing', true, true, ARRAY['US', 'UK', 'CA', 'AU', 'IN']),
('square-pos', 'Square POS', 'menuOrders', 'Point of sale system', true, true, ARRAY['US', 'CA', 'AU', 'UK']),
('yelp', 'Yelp for Business', 'reviews', 'Customer reviews and ratings', true, true, ARRAY['US', 'CA']),
('mailchimp', 'Mailchimp', 'marketing', 'Email marketing campaigns', true, true, ARRAY['US', 'UK', 'CA', 'AU', 'IN']),
('facebook-business', 'Facebook Business', 'socialMedia', 'Social media management', true, true, ARRAY['US', 'UK', 'CA', 'AU', 'IN'])
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_restaurant_integrations_restaurant_id ON restaurant_integrations(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_restaurant_integrations_status ON restaurant_integrations(status);
CREATE INDEX IF NOT EXISTS idx_integration_providers_category ON integration_providers(category);
