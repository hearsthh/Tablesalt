-- Seed predefined options for all restaurant amenity categories
-- This provides a comprehensive base set of options that restaurants can choose from

-- Insert option categories
INSERT INTO option_categories (name, display_name, description, icon, sort_order) VALUES
('dining_features', 'Dining Features', 'Physical dining arrangements and seating options', 'utensils', 1),
('dietary_accommodations', 'Dietary Accommodations', 'Special dietary needs and restrictions supported', 'leaf', 2),
('ambiance_tags', 'Ambiance & Atmosphere', 'Restaurant mood, vibe, and atmosphere descriptors', 'heart', 3),
('music_entertainment', 'Music & Entertainment', 'Entertainment options and music offerings', 'music', 4),
('parking_options', 'Parking Options', 'Available parking arrangements', 'car', 5),
('payment_methods', 'Payment Methods', 'Accepted payment types and methods', 'credit-card', 6),
('special_services', 'Special Services', 'Additional services offered beyond dining', 'star', 7),
('catering_services', 'Catering Services', 'Catering and event service options', 'truck', 8),
('delivery_options', 'Delivery Options', 'Food delivery and takeout services', 'package', 9),
('sustainability_practices', 'Sustainability Practices', 'Environmental and sustainability initiatives', 'recycle', 10),
('awards_certifications', 'Awards & Certifications', 'Recognition, awards, and certifications received', 'award', 11),
('health_safety_measures', 'Health & Safety', 'Health and safety protocols and measures', 'shield', 12),
('accessibility_features', 'Accessibility Features', 'Accessibility accommodations and features', 'accessibility', 13),
('technology_features', 'Technology Features', 'Digital and technology offerings', 'smartphone', 14),
('signature_dishes', 'Signature Dishes', 'Specialty and signature menu items', 'chef-hat', 15);

-- Dining Features
INSERT INTO predefined_options (category_id, value, display_name, description, popularity_score, applicable_business_types, sort_order) VALUES
((SELECT id FROM option_categories WHERE name = 'dining_features'), 'outdoor_seating', 'Outdoor Seating', 'Patio, terrace, or sidewalk dining options', 95, ARRAY['restaurant', 'cafe', 'bar'], 1),
((SELECT id FROM option_categories WHERE name = 'dining_features'), 'private_dining', 'Private Dining', 'Private rooms or areas for special events', 85, ARRAY['restaurant', 'bar'], 2),
((SELECT id FROM option_categories WHERE name = 'dining_features'), 'bar_seating', 'Bar Seating', 'Counter seating at the bar area', 80, ARRAY['restaurant', 'bar'], 3),
((SELECT id FROM option_categories WHERE name = 'dining_features'), 'counter_seating', 'Counter Seating', 'Kitchen counter or chef counter seating', 70, ARRAY['restaurant', 'fast-food'], 4),
((SELECT id FROM option_categories WHERE name = 'dining_features'), 'booth_seating', 'Booth Seating', 'Traditional booth-style seating', 75, ARRAY['restaurant', 'fast-food'], 5),
((SELECT id FROM option_categories WHERE name = 'dining_features'), 'family_style', 'Family Style', 'Large tables for family-style dining', 60, ARRAY['restaurant'], 6),
((SELECT id FROM option_categories WHERE name = 'dining_features'), 'communal_tables', 'Communal Tables', 'Shared seating with other guests', 45, ARRAY['restaurant', 'cafe'], 7),
((SELECT id FROM option_categories WHERE name = 'dining_features'), 'rooftop_dining', 'Rooftop Dining', 'Dining area on rooftop or upper level', 40, ARRAY['restaurant', 'bar'], 8),
((SELECT id FROM option_categories WHERE name = 'dining_features'), 'waterfront_seating', 'Waterfront Seating', 'Seating with water views', 35, ARRAY['restaurant'], 9),
((SELECT id FROM option_categories WHERE name = 'dining_features'), 'garden_seating', 'Garden Seating', 'Dining in garden or greenhouse setting', 30, ARRAY['restaurant', 'cafe'], 10);

-- Dietary Accommodations
INSERT INTO predefined_options (category_id, value, display_name, description, popularity_score, sort_order) VALUES
((SELECT id FROM option_categories WHERE name = 'dietary_accommodations'), 'vegetarian', 'Vegetarian', 'Vegetarian menu options available', 90, 1),
((SELECT id FROM option_categories WHERE name = 'dietary_accommodations'), 'vegan', 'Vegan', 'Plant-based vegan options', 85, 2),
((SELECT id FROM option_categories WHERE name = 'dietary_accommodations'), 'gluten_free', 'Gluten-Free', 'Gluten-free menu items and preparation', 80, 3),
((SELECT id FROM option_categories WHERE name = 'dietary_accommodations'), 'dairy_free', 'Dairy-Free', 'Lactose-free and dairy-free options', 70, 4),
((SELECT id FROM option_categories WHERE name = 'dietary_accommodations'), 'nut_free', 'Nut-Free', 'Nut allergy safe preparation and options', 65, 5),
((SELECT id FROM option_categories WHERE name = 'dietary_accommodations'), 'keto', 'Keto-Friendly', 'Low-carb ketogenic diet options', 60, 6),
((SELECT id FROM option_categories WHERE name = 'dietary_accommodations'), 'paleo', 'Paleo', 'Paleolithic diet compliant options', 50, 7),
((SELECT id FROM option_categories WHERE name = 'dietary_accommodations'), 'halal', 'Halal', 'Halal-certified ingredients and preparation', 55, 8),
((SELECT id FROM option_categories WHERE name = 'dietary_accommodations'), 'kosher', 'Kosher', 'Kosher-certified food and preparation', 45, 9),
((SELECT id FROM option_categories WHERE name = 'dietary_accommodations'), 'low_sodium', 'Low Sodium', 'Reduced sodium menu options', 40, 10),
((SELECT id FROM option_categories WHERE name = 'dietary_accommodations'), 'diabetic_friendly', 'Diabetic-Friendly', 'Low sugar and diabetic-safe options', 35, 11),
((SELECT id FROM option_categories WHERE name = 'dietary_accommodations'), 'raw_food', 'Raw Food', 'Uncooked, raw food preparations', 25, 12);

-- Ambiance Tags
INSERT INTO predefined_options (category_id, value, display_name, description, popularity_score, sort_order) VALUES
((SELECT id FROM option_categories WHERE name = 'ambiance_tags'), 'romantic', 'Romantic', 'Intimate setting perfect for dates', 85, 1),
((SELECT id FROM option_categories WHERE name = 'ambiance_tags'), 'family_friendly', 'Family-Friendly', 'Welcoming environment for families with children', 90, 2),
((SELECT id FROM option_categories WHERE name = 'ambiance_tags'), 'business_dining', 'Business Dining', 'Professional atmosphere for business meetings', 75, 3),
((SELECT id FROM option_categories WHERE name = 'ambiance_tags'), 'casual', 'Casual', 'Relaxed, informal dining atmosphere', 95, 4),
((SELECT id FROM option_categories WHERE name = 'ambiance_tags'), 'upscale', 'Upscale', 'Elegant, sophisticated dining experience', 70, 5),
((SELECT id FROM option_categories WHERE name = 'ambiance_tags'), 'trendy', 'Trendy', 'Modern, fashionable atmosphere', 65, 6),
((SELECT id FROM option_categories WHERE name = 'ambiance_tags'), 'cozy', 'Cozy', 'Warm, comfortable, intimate setting', 80, 7),
((SELECT id FROM option_categories WHERE name = 'ambiance_tags'), 'lively', 'Lively', 'Energetic, vibrant atmosphere', 60, 8),
((SELECT id FROM option_categories WHERE name = 'ambiance_tags'), 'quiet', 'Quiet', 'Peaceful, low-noise environment', 55, 9),
((SELECT id FROM option_categories WHERE name = 'ambiance_tags'), 'rustic', 'Rustic', 'Country-style, traditional decor', 50, 10),
((SELECT id FROM option_categories WHERE name = 'ambiance_tags'), 'modern', 'Modern', 'Contemporary design and atmosphere', 65, 11),
((SELECT id FROM option_categories WHERE name = 'ambiance_tags'), 'vintage', 'Vintage', 'Retro or classic themed decor', 45, 12);

-- Music & Entertainment
INSERT INTO predefined_options (category_id, value, display_name, description, popularity_score, sort_order) VALUES
((SELECT id FROM option_categories WHERE name = 'music_entertainment'), 'live_music', 'Live Music', 'Regular live musical performances', 70, 1),
((SELECT id FROM option_categories WHERE name = 'music_entertainment'), 'dj', 'DJ', 'DJ performances and music mixing', 60, 2),
((SELECT id FROM option_categories WHERE name = 'music_entertainment'), 'karaoke', 'Karaoke', 'Karaoke nights and equipment', 45, 3),
((SELECT id FROM option_categories WHERE name = 'music_entertainment'), 'sports_tv', 'Sports TV', 'Television screens showing sports', 75, 4),
((SELECT id FROM option_categories WHERE name = 'music_entertainment'), 'background_music', 'Background Music', 'Ambient background music', 85, 5),
((SELECT id FROM option_categories WHERE name = 'music_entertainment'), 'piano_bar', 'Piano Bar', 'Piano performances and sing-alongs', 40, 6),
((SELECT id FROM option_categories WHERE name = 'music_entertainment'), 'jazz', 'Jazz Music', 'Jazz performances and atmosphere', 35, 7),
((SELECT id FROM option_categories WHERE name = 'music_entertainment'), 'acoustic', 'Acoustic Music', 'Acoustic guitar and unplugged performances', 50, 8),
((SELECT id FROM option_categories WHERE name = 'music_entertainment'), 'trivia_night', 'Trivia Night', 'Weekly trivia competitions', 55, 9),
((SELECT id FROM option_categories WHERE name = 'music_entertainment'), 'comedy_shows', 'Comedy Shows', 'Stand-up comedy performances', 30, 10);

-- Parking Options
INSERT INTO predefined_options (category_id, value, display_name, description, popularity_score, sort_order) VALUES
((SELECT id FROM option_categories WHERE name = 'parking_options'), 'street_parking', 'Street Parking', 'Public street parking available', 80, 1),
((SELECT id FROM option_categories WHERE name = 'parking_options'), 'parking_lot', 'Parking Lot', 'Dedicated parking lot', 85, 2),
((SELECT id FROM option_categories WHERE name = 'parking_options'), 'valet_parking', 'Valet Parking', 'Valet parking service', 45, 3),
((SELECT id FROM option_categories WHERE name = 'parking_options'), 'garage_parking', 'Garage Parking', 'Covered garage parking', 60, 4),
((SELECT id FROM option_categories WHERE name = 'parking_options'), 'free_parking', 'Free Parking', 'No charge for parking', 90, 5),
((SELECT id FROM option_categories WHERE name = 'parking_options'), 'paid_parking', 'Paid Parking', 'Parking fees apply', 70, 6),
((SELECT id FROM option_categories WHERE name = 'parking_options'), 'validated_parking', 'Validated Parking', 'Parking validation with dining', 55, 7),
((SELECT id FROM option_categories WHERE name = 'parking_options'), 'handicap_accessible', 'Handicap Accessible', 'ADA compliant parking spaces', 75, 8);

-- Payment Methods
INSERT INTO predefined_options (category_id, value, display_name, description, popularity_score, sort_order) VALUES
((SELECT id FROM option_categories WHERE name = 'payment_methods'), 'cash', 'Cash', 'Cash payments accepted', 95, 1),
((SELECT id FROM option_categories WHERE name = 'payment_methods'), 'credit_cards', 'Credit Cards', 'Major credit cards accepted', 98, 2),
((SELECT id FROM option_categories WHERE name = 'payment_methods'), 'debit_cards', 'Debit Cards', 'Debit card payments', 95, 3),
((SELECT id FROM option_categories WHERE name = 'payment_methods'), 'mobile_payments', 'Mobile Payments', 'Smartphone payment apps', 85, 4),
((SELECT id FROM option_categories WHERE name = 'payment_methods'), 'apple_pay', 'Apple Pay', 'Apple Pay contactless payment', 80, 5),
((SELECT id FROM option_categories WHERE name = 'payment_methods'), 'google_pay', 'Google Pay', 'Google Pay mobile payment', 75, 6),
((SELECT id FROM option_categories WHERE name = 'payment_methods'), 'contactless', 'Contactless Payment', 'Tap-to-pay contactless cards', 90, 7),
((SELECT id FROM option_categories WHERE name = 'payment_methods'), 'paypal', 'PayPal', 'PayPal online payments', 60, 8),
((SELECT id FROM option_categories WHERE name = 'payment_methods'), 'venmo', 'Venmo', 'Venmo peer-to-peer payments', 55, 9),
((SELECT id FROM option_categories WHERE name = 'payment_methods'), 'cryptocurrency', 'Cryptocurrency', 'Bitcoin and other crypto payments', 20, 10);

-- Special Services
INSERT INTO predefined_options (category_id, value, display_name, description, popularity_score, sort_order) VALUES
((SELECT id FROM option_categories WHERE name = 'special_services'), 'private_events', 'Private Events', 'Private party and event hosting', 75, 1),
((SELECT id FROM option_categories WHERE name = 'special_services'), 'catering', 'Catering', 'Off-site catering services', 70, 2),
((SELECT id FROM option_categories WHERE name = 'special_services'), 'wine_tastings', 'Wine Tastings', 'Wine tasting events and education', 50, 3),
((SELECT id FROM option_categories WHERE name = 'special_services'), 'cooking_classes', 'Cooking Classes', 'Culinary education and classes', 35, 4),
((SELECT id FROM option_categories WHERE name = 'special_services'), 'chef_table', 'Chef\'s Table', 'Exclusive chef\'s table experience', 30, 5),
((SELECT id FROM option_categories WHERE name = 'special_services'), 'meal_prep', 'Meal Prep', 'Prepared meals for pickup', 40, 6),
((SELECT id FROM option_categories WHERE name = 'special_services'), 'gift_cards', 'Gift Cards', 'Restaurant gift cards available', 80, 7),
((SELECT id FROM option_categories WHERE name = 'special_services'), 'loyalty_program', 'Loyalty Program', 'Customer rewards and loyalty program', 65, 8);

-- Technology Features
INSERT INTO predefined_options (category_id, value, display_name, description, popularity_score, sort_order) VALUES
((SELECT id FROM option_categories WHERE name = 'technology_features'), 'online_ordering', 'Online Ordering', 'Order food online through website/app', 85, 1),
((SELECT id FROM option_categories WHERE name = 'technology_features'), 'mobile_app', 'Mobile App', 'Dedicated restaurant mobile application', 60, 2),
((SELECT id FROM option_categories WHERE name = 'technology_features'), 'qr_code_menus', 'QR Code Menus', 'Digital menus accessed via QR codes', 75, 3),
((SELECT id FROM option_categories WHERE name = 'technology_features'), 'wifi', 'Free WiFi', 'Complimentary wireless internet', 90, 4),
((SELECT id FROM option_categories WHERE name = 'technology_features'), 'online_reservations', 'Online Reservations', 'Book tables online', 80, 5),
((SELECT id FROM option_categories WHERE name = 'technology_features'), 'digital_receipts', 'Digital Receipts', 'Email or SMS receipts', 70, 6),
((SELECT id FROM option_categories WHERE name = 'technology_features'), 'tableside_ordering', 'Tableside Ordering', 'Order from tablets at the table', 45, 7),
((SELECT id FROM option_categories WHERE name = 'technology_features'), 'social_media_integration', 'Social Media Integration', 'Connected social media presence', 55, 8);

-- Sustainability Practices
INSERT INTO predefined_options (category_id, value, display_name, description, popularity_score, sort_order) VALUES
((SELECT id FROM option_categories WHERE name = 'sustainability_practices'), 'locally_sourced', 'Locally Sourced', 'Ingredients sourced from local suppliers', 75, 1),
((SELECT id FROM option_categories WHERE name = 'sustainability_practices'), 'organic_ingredients', 'Organic Ingredients', 'Certified organic ingredients used', 65, 2),
((SELECT id FROM option_categories WHERE name = 'sustainability_practices'), 'compostable_packaging', 'Compostable Packaging', 'Eco-friendly packaging materials', 60, 3),
((SELECT id FROM option_categories WHERE name = 'sustainability_practices'), 'recycling_program', 'Recycling Program', 'Active recycling and waste reduction', 70, 4),
((SELECT id FROM option_categories WHERE name = 'sustainability_practices'), 'energy_efficient', 'Energy Efficient', 'LED lighting and energy-saving equipment', 55, 5),
((SELECT id FROM option_categories WHERE name = 'sustainability_practices'), 'water_conservation', 'Water Conservation', 'Water-saving practices and equipment', 50, 6),
((SELECT id FROM option_categories WHERE name = 'sustainability_practices'), 'zero_waste', 'Zero Waste', 'Commitment to zero waste practices', 40, 7),
((SELECT id FROM option_categories WHERE name = 'sustainability_practices'), 'sustainable_seafood', 'Sustainable Seafood', 'Responsibly sourced seafood', 45, 8);

-- Update popularity scores based on typical restaurant industry data
UPDATE predefined_options SET popularity_score = 
    CASE 
        WHEN value IN ('free_parking', 'credit_cards', 'wifi', 'family_friendly', 'casual') THEN 95
        WHEN value IN ('outdoor_seating', 'vegetarian', 'contactless') THEN 90
        WHEN value IN ('vegan', 'private_dining', 'background_music') THEN 85
        WHEN value IN ('gluten_free', 'bar_seating', 'online_ordering') THEN 80
        WHEN value IN ('sports_tv', 'booth_seating', 'gift_cards') THEN 75
        ELSE popularity_score
    END;

-- Create some sample AI-suggested options to demonstrate the system
INSERT INTO custom_options (category_id, restaurant_id, value, display_name, description, source, ai_confidence_score, usage_count) VALUES
((SELECT id FROM option_categories WHERE name = 'dietary_accommodations'), 1, 'alkaline_diet', 'Alkaline Diet', 'pH-balanced alkaline diet options', 'ai', 0.85, 3),
((SELECT id FROM option_categories WHERE name = 'ambiance_tags'), 1, 'instagram_worthy', 'Instagram-Worthy', 'Photogenic decor and plating', 'ai', 0.92, 8),
((SELECT id FROM option_categories WHERE name = 'music_entertainment'), 1, 'sound_healing', 'Sound Healing', 'Therapeutic sound bath sessions', 'ai', 0.78, 2),
((SELECT id FROM option_categories WHERE name = 'special_services'), 1, 'pet_friendly_patio', 'Pet-Friendly Patio', 'Outdoor seating welcomes pets', 'user', NULL, 12),
((SELECT id FROM option_categories WHERE name = 'technology_features'), 1, 'ar_menu', 'AR Menu Experience', 'Augmented reality menu visualization', 'ai', 0.88, 1);

COMMENT ON TABLE predefined_options IS 'Standard restaurant amenities and features available to all restaurants';
COMMENT ON TABLE custom_options IS 'Restaurant-specific or AI-suggested custom amenities and features';
COMMENT ON COLUMN predefined_options.popularity_score IS 'Usage popularity (0-100) for sorting and recommendations';
COMMENT ON COLUMN custom_options.ai_confidence_score IS 'AI confidence level (0.00-1.00) for AI-generated suggestions';
