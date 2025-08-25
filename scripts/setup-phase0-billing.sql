-- Setup Phase 0 billing configuration
-- Insert Phase 0 trial subscriptions for test restaurants
INSERT INTO user_subscriptions (user_id, plan, status, current_period_start, current_period_end)
SELECT 
  u.id as user_id,
  'phase0_trial' as plan,
  'active' as status,
  NOW() as current_period_start,
  NOW() + INTERVAL '90 days' as current_period_end
FROM auth.users u
JOIN restaurants r ON r.user_id = u.id
WHERE r.id IN ('rest_001', 'rest_002', 'rest_003', 'rest_004', 'rest_005', 'rest_006', 'rest_007', 'rest_008', 'rest_009', 'rest_010')
ON CONFLICT (user_id) DO UPDATE SET
  plan = 'phase0_trial',
  status = 'active',
  current_period_start = NOW(),
  current_period_end = NOW() + INTERVAL '90 days';

-- Initialize usage tracking for Phase 0 restaurants
INSERT INTO usage_tracking (user_id, resource_type, usage_count, period_start, period_end)
SELECT 
  u.id as user_id,
  resource_type,
  0 as usage_count,
  NOW() as period_start,
  NOW() + INTERVAL '90 days' as period_end
FROM auth.users u
JOIN restaurants r ON r.user_id = u.id
CROSS JOIN (
  VALUES ('ai_generations'), ('campaigns'), ('menu_items'), ('integrations')
) AS resources(resource_type)
WHERE r.id IN ('rest_001', 'rest_002', 'rest_003', 'rest_004', 'rest_005', 'rest_006', 'rest_007', 'rest_008', 'rest_009', 'rest_010')
ON CONFLICT (user_id, resource_type) DO NOTHING;
