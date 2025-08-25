-- Insert common dietary tags
INSERT INTO dietary_tags (name, color) VALUES
  ('Vegetarian', '#10B981'),
  ('Vegan', '#059669'),
  ('Gluten-Free', '#F59E0B'),
  ('Dairy-Free', '#8B5CF6'),
  ('Nut-Free', '#EF4444'),
  ('Keto', '#6366F1'),
  ('Low-Carb', '#84CC16'),
  ('High-Protein', '#F97316'),
  ('Organic', '#22C55E'),
  ('Spicy', '#DC2626'),
  ('Halal', '#3B82F6'),
  ('Kosher', '#7C3AED')
ON CONFLICT (name) DO NOTHING;

-- Insert common allergens
INSERT INTO allergens (name) VALUES
  ('Nuts'),
  ('Dairy'),
  ('Eggs'),
  ('Gluten'),
  ('Soy'),
  ('Shellfish'),
  ('Fish'),
  ('Sesame')
ON CONFLICT (name) DO NOTHING;
