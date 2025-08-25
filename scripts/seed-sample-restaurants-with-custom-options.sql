-- Sample restaurants demonstrating the custom options system
-- Shows how different restaurant types use both predefined and custom options

-- Sample restaurant data (simplified - would normally have full restaurant profiles)
CREATE TEMP TABLE sample_restaurants (
    id INTEGER,
    name VARCHAR(200),
    business_type VARCHAR(50),
    cuisine_type VARCHAR(100)
);

INSERT INTO sample_restaurants VALUES
(1, 'Bella Italiana', 'restaurant', 'Italian'),
(2, 'Taco Libre', 'fast-food', 'Mexican'),
(3, 'Garden Cafe', 'cafe', 'Healthy'),
(4, 'The Steakhouse', 'restaurant', 'American'),
(5, 'Sushi Zen', 'restaurant', 'Japanese');

-- Bella Italiana (Upscale Italian Restaurant)
-- Predefined options
INSERT INTO restaurant_dining_features (restaurant_id, option_type, predefined_option_id, added_by) VALUES
(1, 'predefined', (SELECT id FROM predefined_options WHERE value = 'outdoor_seating'), 'setup_wizard'),
(1, 'predefined', (SELECT id FROM predefined_options WHERE value = 'private_dining'), 'setup_wizard'),
(1, 'predefined', (SELECT id FROM predefined_options WHERE value = 'bar_seating'), 'setup_wizard');

-- Custom dining features for Bella Italiana
INSERT INTO custom_options (category_id, restaurant_id, value, display_name, description, source, created_by) VALUES
((SELECT id FROM option_categories WHERE name = 'dining_features'), 1, 'wine_cellar_dining', 'Wine Cellar Dining', 'Intimate dining experience in our historic wine cellar', 'user', 'restaurant_owner'),
((SELECT id FROM option_categories WHERE name = 'dining_features'), 1, 'chefs_counter', 'Chef\'s Counter', 'Watch our chefs prepare your meal at the kitchen counter', 'user', 'restaurant_owner');

INSERT INTO restaurant_dining_features (restaurant_id, option_type, custom_option_id, added_by) VALUES
(1, 'custom', (SELECT id FROM custom_options WHERE value = 'wine_cellar_dining' AND restaurant_id = 1), 'restaurant_owner'),
(1, 'custom', (SELECT id FROM custom_options WHERE value = 'chefs_counter' AND restaurant_id = 1), 'restaurant_owner');

-- Dietary accommodations with custom options
INSERT INTO restaurant_dietary_accommodations (restaurant_id, option_type, predefined_option_id, added_by) VALUES
(1, 'predefined', (SELECT id FROM predefined_options WHERE value = 'vegetarian'), 'setup_wizard'),
(1, 'predefined', (SELECT id FROM predefined_options WHERE value = 'gluten_free'), 'setup_wizard');

INSERT INTO custom_options (category_id, restaurant_id, value, display_name, description, source, ai_confidence_score, created_by) VALUES
((SELECT id FROM option_categories WHERE name = 'dietary_accommodations'), 1, 'sicilian_diet', 'Traditional Sicilian Diet', 'Authentic Sicilian dietary preparations', 'ai', 0.89, 'ai_assistant');

INSERT INTO restaurant_dietary_accommodations (restaurant_id, option_type, custom_option_id, added_by) VALUES
(1, 'custom', (SELECT id FROM custom_options WHERE value = 'sicilian_diet' AND restaurant_id = 1), 'ai_assistant');

-- Music & Entertainment with custom options
INSERT INTO custom_options (category_id, restaurant_id, value, display_name, description, source, usage_count, created_by) VALUES
((SELECT id FROM option_categories WHERE name = 'music_entertainment'), 1, 'opera_nights', 'Opera Nights', 'Monthly live opera performances during dinner', 'user', 15, 'restaurant_owner'),
((SELECT id FROM option_categories WHERE name = 'music_entertainment'), 1, 'italian_folk_music', 'Italian Folk Music', 'Traditional Italian folk music on weekends', 'user', 8, 'restaurant_owner');

INSERT INTO restaurant_music_entertainment (restaurant_id, option_type, custom_option_id, added_by) VALUES
(1, 'custom', (SELECT id FROM custom_options WHERE value = 'opera_nights' AND restaurant_id = 1), 'restaurant_owner'),
(1, 'custom', (SELECT id FROM custom_options WHERE value = 'italian_folk_music' AND restaurant_id = 1), 'restaurant_owner');

-- Taco Libre (Fast-Casual Mexican)
-- Mix of predefined and custom options
INSERT INTO restaurant_dining_features (restaurant_id, option_type, predefined_option_id, added_by) VALUES
(2, 'predefined', (SELECT id FROM predefined_options WHERE value = 'outdoor_seating'), 'setup_wizard'),
(2, 'predefined', (SELECT id FROM predefined_options WHERE value = 'counter_seating'), 'setup_wizard');

INSERT INTO custom_options (category_id, restaurant_id, value, display_name, description, source, usage_count, created_by) VALUES
((SELECT id FROM option_categories WHERE name = 'dining_features'), 2, 'taco_bar_seating', 'Taco Bar Seating', 'Watch tacos being made at our taco assembly bar', 'user', 22, 'restaurant_manager'),
((SELECT id FROM option_categories WHERE name = 'dining_features'), 2, 'picnic_tables', 'Picnic Tables', 'Casual outdoor picnic-style seating', 'user', 18, 'restaurant_manager');

INSERT INTO restaurant_dining_features (restaurant_id, option_type, custom_option_id, added_by) VALUES
(2, 'custom', (SELECT id FROM custom_options WHERE value = 'taco_bar_seating' AND restaurant_id = 2), 'restaurant_manager'),
(2, 'custom', (SELECT id FROM custom_options WHERE value = 'picnic_tables' AND restaurant_id = 2), 'restaurant_manager');

-- Custom entertainment options
INSERT INTO custom_options (category_id, restaurant_id, value, display_name, description, source, usage_count, created_by) VALUES
((SELECT id FROM option_categories WHERE name = 'music_entertainment'), 2, 'mariachi_nights', 'Mariachi Nights', 'Live mariachi band every Friday night', 'user', 25, 'restaurant_owner'),
((SELECT id FROM option_categories WHERE name = 'music_entertainment'), 2, 'salsa_dancing', 'Salsa Dancing', 'Salsa dancing lessons and social dancing', 'user', 12, 'restaurant_owner');

INSERT INTO restaurant_music_entertainment (restaurant_id, option_type, custom_option_id, added_by) VALUES
(2, 'custom', (SELECT id FROM custom_options WHERE value = 'mariachi_nights' AND restaurant_id = 2), 'restaurant_owner'),
(2, 'custom', (SELECT id FROM custom_options WHERE value = 'salsa_dancing' AND restaurant_id = 2), 'restaurant_owner');

-- Garden Cafe (Health-Focused Cafe)
-- Heavy use of AI-suggested custom options
INSERT INTO restaurant_dietary_accommodations (restaurant_id, option_type, predefined_option_id, added_by) VALUES
(3, 'predefined', (SELECT id FROM predefined_options WHERE value = 'vegan'), 'setup_wizard'),
(3, 'predefined', (SELECT id FROM predefined_options WHERE value = 'gluten_free'), 'setup_wizard'),
(3, 'predefined', (SELECT id FROM predefined_options WHERE value = 'raw_food'), 'setup_wizard');

-- AI-suggested custom dietary options
INSERT INTO custom_options (category_id, restaurant_id, value, display_name, description, source, ai_confidence_score, usage_count, created_by) VALUES
((SELECT id FROM option_categories WHERE name = 'dietary_accommodations'), 3, 'alkaline_diet', 'Alkaline Diet', 'pH-balanced alkaline diet menu options', 'ai', 0.91, 8, 'ai_assistant'),
((SELECT id FROM option_categories WHERE name = 'dietary_accommodations'), 3, 'anti_inflammatory', 'Anti-Inflammatory', 'Foods specifically chosen to reduce inflammation', 'ai', 0.88, 6, 'ai_assistant'),
((SELECT id FROM option_categories WHERE name = 'dietary_accommodations'), 3, 'ayurvedic_principles', 'Ayurvedic Principles', 'Menu items following Ayurvedic dietary guidelines', 'ai', 0.82, 4, 'ai_assistant');

INSERT INTO restaurant_dietary_accommodations (restaurant_id, option_type, custom_option_id, added_by) VALUES
(3, 'custom', (SELECT id FROM custom_options WHERE value = 'alkaline_diet' AND restaurant_id = 3), 'ai_assistant'),
(3, 'custom', (SELECT id FROM custom_options WHERE value = 'anti_inflammatory' AND restaurant_id = 3), 'ai_assistant'),
(3, 'custom', (SELECT id FROM custom_options WHERE value = 'ayurvedic_principles' AND restaurant_id = 3), 'ai_assistant');

-- AI-suggested ambiance and services
INSERT INTO custom_options (category_id, restaurant_id, value, display_name, description, source, ai_confidence_score, usage_count, created_by) VALUES
((SELECT id FROM option_categories WHERE name = 'ambiance_tags'), 3, 'wellness_focused', 'Wellness-Focused', 'Environment designed for health and wellness', 'ai', 0.94, 11, 'ai_assistant'),
((SELECT id FROM option_categories WHERE name = 'ambiance_tags'), 3, 'meditation_friendly', 'Meditation-Friendly', 'Quiet spaces suitable for meditation', 'ai', 0.87, 7, 'ai_assistant'),
((SELECT id FROM option_categories WHERE name = 'special_services'), 3, 'nutrition_consultations', 'Nutrition Consultations', 'One-on-one nutrition advice with certified nutritionist', 'ai', 0.85, 5, 'ai_assistant'),
((SELECT id FROM option_categories WHERE name = 'special_services'), 3, 'juice_cleanses', 'Juice Cleanses', 'Multi-day cold-pressed juice cleanse programs', 'ai', 0.89, 9, 'ai_assistant');

INSERT INTO restaurant_ambiance_tags (restaurant_id, option_type, custom_option_id, added_by) VALUES
(3, 'custom', (SELECT id FROM custom_options WHERE value = 'wellness_focused' AND restaurant_id = 3), 'ai_assistant'),
(3, 'custom', (SELECT id FROM custom_options WHERE value = 'meditation_friendly' AND restaurant_id = 3), 'ai_assistant');

INSERT INTO restaurant_special_services (restaurant_id, option_type, custom_option_id, added_by) VALUES
(3, 'custom', (SELECT id FROM custom_options WHERE value = 'nutrition_consultations' AND restaurant_id = 3), 'ai_assistant'),
(3, 'custom', (SELECT id FROM custom_options WHERE value = 'juice_cleanses' AND restaurant_id = 3), 'ai_assistant');

-- The Steakhouse (Traditional American Steakhouse)
-- Premium dining features
INSERT INTO restaurant_dining_features (restaurant_id, option_type, predefined_option_id, added_by) VALUES
(4, 'predefined', (SELECT id FROM predefined_options WHERE value = 'private_dining'), 'setup_wizard'),
(4, 'predefined', (SELECT id FROM predefined_options WHERE value = 'bar_seating'), 'setup_wizard');

INSERT INTO custom_options (category_id, restaurant_id, value, display_name, description, source, usage_count, created_by) VALUES
((SELECT id FROM option_categories WHERE name = 'dining_features'), 4, 'dry_aging_room_view', 'Dry Aging Room View', 'Tables with view into our dry aging room', 'user', 14, 'restaurant_owner'),
((SELECT id FROM option_categories WHERE name = 'dining_features'), 4, 'whiskey_lounge', 'Whiskey Lounge', 'Separate lounge area with premium whiskey selection', 'user', 19, 'restaurant_owner'),
((SELECT id FROM option_categories WHERE name = 'special_services'), 4, 'steak_education', 'Steak Education', 'Learn about different cuts and preparation methods', 'user', 7, 'restaurant_owner'),
((SELECT id FROM option_categories WHERE name = 'special_services'), 4, 'cigar_pairings', 'Cigar Pairings', 'Curated cigar and steak pairing experiences', 'user', 11, 'restaurant_owner');

INSERT INTO restaurant_dining_features (restaurant_id, option_type, custom_option_id, added_by) VALUES
(4, 'custom', (SELECT id FROM custom_options WHERE value = 'dry_aging_room_view' AND restaurant_id = 4), 'restaurant_owner'),
(4, 'custom', (SELECT id FROM custom_options WHERE value = 'whiskey_lounge' AND restaurant_id = 4), 'restaurant_owner');

INSERT INTO restaurant_special_services (restaurant_id, option_type, custom_option_id, added_by) VALUES
(4, 'custom', (SELECT id FROM custom_options WHERE value = 'steak_education' AND restaurant_id = 4), 'restaurant_owner'),
(4, 'custom', (SELECT id FROM custom_options WHERE value = 'cigar_pairings' AND restaurant_id = 4), 'restaurant_owner');

-- Sushi Zen (Japanese Restaurant)
-- Cultural-specific options
INSERT INTO restaurant_dining_features (restaurant_id, option_type, predefined_option_id, added_by) VALUES
(5, 'predefined', (SELECT id FROM predefined_options WHERE value = 'counter_seating'), 'setup_wizard'),
(5, 'predefined', (SELECT id FROM predefined_options WHERE value = 'private_dining'), 'setup_wizard');

INSERT INTO custom_options (category_id, restaurant_id, value, display_name, description, source, usage_count, created_by) VALUES
((SELECT id FROM option_categories WHERE name = 'dining_features'), 5, 'sushi_bar', 'Sushi Bar', 'Traditional sushi bar with master sushi chef', 'user', 28, 'restaurant_owner'),
((SELECT id FROM option_categories WHERE name = 'dining_features'), 5, 'tatami_rooms', 'Tatami Rooms', 'Traditional Japanese tatami mat private rooms', 'user', 16, 'restaurant_owner'),
((SELECT id FROM option_categories WHERE name = 'dining_features'), 5, 'omakase_counter', 'Omakase Counter', 'Chef\'s choice tasting menu at the counter', 'user', 21, 'restaurant_owner'),
((SELECT id FROM option_categories WHERE name = 'special_services'), 5, 'sake_education', 'Sake Education', 'Learn about sake varieties and pairing', 'user', 9, 'restaurant_owner'),
((SELECT id FROM option_categories WHERE name = 'special_services'), 5, 'sushi_making_classes', 'Sushi Making Classes', 'Hands-on sushi preparation classes', 'user', 13, 'restaurant_owner');

INSERT INTO restaurant_dining_features (restaurant_id, option_type, custom_option_id, added_by) VALUES
(5, 'custom', (SELECT id FROM custom_options WHERE value = 'sushi_bar' AND restaurant_id = 5), 'restaurant_owner'),
(5, 'custom', (SELECT id FROM custom_options WHERE value = 'tatami_rooms' AND restaurant_id = 5), 'restaurant_owner'),
(5, 'custom', (SELECT id FROM custom_options WHERE value = 'omakase_counter' AND restaurant_id = 5), 'restaurant_owner');

INSERT INTO restaurant_special_services (restaurant_id, option_type, custom_option_id, added_by) VALUES
(5, 'custom', (SELECT id FROM custom_options WHERE value = 'sake_education' AND restaurant_id = 5), 'restaurant_owner'),
(5, 'custom', (SELECT id FROM custom_options WHERE value = 'sushi_making_classes' AND restaurant_id = 5), 'restaurant_owner');

-- Add some popular custom options that could be promoted to predefined
INSERT INTO custom_options (category_id, restaurant_id, value, display_name, description, source, usage_count, created_by) VALUES
-- Popular across multiple restaurants
((SELECT id FROM option_categories WHERE name = 'ambiance_tags'), NULL, 'instagram_worthy', 'Instagram-Worthy', 'Photogenic decor and food presentation', 'ai', 45, 'ai_assistant'),
((SELECT id FROM option_categories WHERE name = 'special_services'), NULL, 'pet_friendly', 'Pet-Friendly', 'Welcomes well-behaved pets', 'user', 38, 'multiple_users'),
((SELECT id FROM option_categories WHERE name = 'technology_features'), NULL, 'social_media_walls', 'Social Media Walls', 'Live social media feed displays', 'ai', 22, 'ai_assistant'),
((SELECT id FROM option_categories WHERE name = 'dietary_accommodations'), NULL, 'whole30_compliant', 'Whole30 Compliant', 'Whole30 diet program approved options', 'ai', 31, 'ai_assistant');

-- Clean up temp table
DROP TABLE sample_restaurants;

-- Show summary of the data
SELECT 
    'Summary Report' as report_type,
    (SELECT COUNT(*) FROM option_categories) as total_categories,
    (SELECT COUNT(*) FROM predefined_options) as total_predefined_options,
    (SELECT COUNT(*) FROM custom_options) as total_custom_options,
    (SELECT COUNT(*) FROM custom_options WHERE source = 'ai') as ai_suggested_options,
    (SELECT COUNT(*) FROM custom_options WHERE usage_count >= 10) as popular_custom_options;
