-- Create menu_data table for storing restaurant menu information
CREATE TABLE IF NOT EXISTS menu_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants(id) ON DELETE CASCADE,
  
  -- Basic menu information
  menu_name VARCHAR(255),
  menu_description TEXT,
  
  -- Input method and raw data
  input_method VARCHAR(50) CHECK (input_method IN ('upload', 'scan', 'manual', 'import')),
  raw_menu_text TEXT,
  menu_file_url TEXT,
  
  -- Parsed menu data (JSON fields)
  parsed_categories JSONB DEFAULT '[]'::jsonb,
  parsed_items JSONB DEFAULT '[]'::jsonb,
  pricing_analysis JSONB DEFAULT '{}'::jsonb,
  
  -- Integration and processing info
  pos_integration VARCHAR(100),
  processing_status VARCHAR(50) DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'error')),
  processing_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_menu_data_restaurant_id ON menu_data(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_data_processing_status ON menu_data(processing_status);
CREATE INDEX IF NOT EXISTS idx_menu_data_created_at ON menu_data(created_at);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_menu_data_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_menu_data_updated_at
  BEFORE UPDATE ON menu_data
  FOR EACH ROW
  EXECUTE FUNCTION update_menu_data_updated_at();

-- Add some sample data (optional)
INSERT INTO menu_data (
  restaurant_id,
  menu_name,
  menu_description,
  input_method,
  raw_menu_text,
  parsed_categories,
  parsed_items,
  pricing_analysis,
  processing_status,
  processing_notes
) VALUES (
  gen_random_uuid(), -- You'll need to replace this with actual restaurant_id
  'Main Menu',
  'Our signature dishes featuring fresh, locally-sourced ingredients',
  'manual',
  'APPETIZERS
Caesar Salad - Fresh romaine lettuce with parmesan cheese - $12.99
Buffalo Wings - Crispy chicken wings with spicy sauce - $14.99

MAIN COURSES
Grilled Salmon - Fresh Atlantic salmon with vegetables - $28.99
Ribeye Steak - 12oz prime ribeye with mashed potatoes - $34.99

DESSERTS
Chocolate Lava Cake - Warm cake with vanilla ice cream - $8.99',
  '[
    {"id": "1", "name": "Appetizers", "description": "Start your meal right", "order": 1},
    {"id": "2", "name": "Main Courses", "description": "Our signature dishes", "order": 2},
    {"id": "3", "name": "Desserts", "description": "Sweet endings", "order": 3}
  ]'::jsonb,
  '[
    {
      "id": "1",
      "category_id": "1",
      "name": "Caesar Salad",
      "description": "Fresh romaine lettuce with parmesan cheese, croutons, and signature Caesar dressing",
      "price": 12.99,
      "dietary_tags": ["Vegetarian"],
      "availability": true
    },
    {
      "id": "2",
      "category_id": "1",
      "name": "Buffalo Wings",
      "description": "Crispy chicken wings tossed in spicy buffalo sauce, served with celery and blue cheese",
      "price": 14.99,
      "dietary_tags": ["Spicy", "Popular"],
      "availability": true
    },
    {
      "id": "3",
      "category_id": "2",
      "name": "Grilled Salmon",
      "description": "Fresh Atlantic salmon grilled to perfection, served with seasonal vegetables and lemon butter",
      "price": 28.99,
      "dietary_tags": ["Gluten-Free", "Healthy"],
      "availability": true
    },
    {
      "id": "4",
      "category_id": "2",
      "name": "Ribeye Steak",
      "description": "12oz prime ribeye steak cooked to preference, served with mashed potatoes and asparagus",
      "price": 34.99,
      "dietary_tags": ["Popular"],
      "availability": true
    },
    {
      "id": "5",
      "category_id": "3",
      "name": "Chocolate Lava Cake",
      "description": "Warm chocolate cake with molten center, served with vanilla ice cream",
      "price": 8.99,
      "dietary_tags": ["Popular"],
      "availability": true
    }
  ]'::jsonb,
  '{
    "average_price": 18.50,
    "price_range": {"min": 8.99, "max": 34.99},
    "category_averages": {
      "Appetizers": 13.99,
      "Main Courses": 31.99,
      "Desserts": 8.99
    },
    "price_bands": {
      "Under $15": 2,
      "$15-$30": 2,
      "$30+": 1
    }
  }'::jsonb,
  'completed',
  'Successfully processed 5 menu items across 3 categories'
);
