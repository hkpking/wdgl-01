-- 用户进度迁移 SQL
-- 基于用户名匹配 Supabase user_id


INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'e573db83-941a-46f8-af64-82832cee8768'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liangyijian'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '07f7f37f-e77b-4943-b8c6-2af521ff65fb'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liangyijian'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '0260f637-cf56-4efb-8300-b2a1c77df03d'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liangyijian'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '0d005ba5-45d8-4c3c-97ce-6743644400c5'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liangyijian'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '29f1e54c-8dab-4168-b22e-dbab4303c00a'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liangyijian'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '60576453-fd0a-4b09-8921-29422c51cfef'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liangyijian'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'a88a1e23-6dd5-48f4-ad64-cdb385877014'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liangyijian'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '86675d17-8ada-4127-9bcf-c4295ec30eb7'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liangyijian'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '5bb5133f-03e5-44b8-a90b-8bc4141bd134'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liangyijian'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '22d3a3a9-d72d-469e-af7f-4387b690b1a4'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liangyijian'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '691d333b-07f4-4617-9201-3c607743610f'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liangyijian'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '870b2ddf-c58f-426b-ba38-4c5c33b70b3b'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liangyijian'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '0ad8e860-4ff0-4930-9408-b5d0d173d0d9'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liangyijian'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '4e3843c9-dd6c-4230-adac-b9fc3a2d4c9e'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liangyijian'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'fe8762c2-82bf-4c86-9fc5-ad299d23f6eb'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liangyijian'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '126e2898-355a-47d2-aa1e-9f9a812ab8e6'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liangyijian'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '6969eed1-8855-4a0d-8cee-1dabf0d14206'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liangyijian'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '764744f3-35d8-4051-8ed2-b06051e990a5'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liangyijian'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '52f543ed-da89-41ba-b1f8-a9efbc585ef8'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liangyijian'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'e573db83-941a-46f8-af64-82832cee8768'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yumingzhong'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '07f7f37f-e77b-4943-b8c6-2af521ff65fb'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yumingzhong'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '0260f637-cf56-4efb-8300-b2a1c77df03d'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yumingzhong'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '0d005ba5-45d8-4c3c-97ce-6743644400c5'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yumingzhong'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '29f1e54c-8dab-4168-b22e-dbab4303c00a'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yumingzhong'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '60576453-fd0a-4b09-8921-29422c51cfef'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yumingzhong'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'a88a1e23-6dd5-48f4-ad64-cdb385877014'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yumingzhong'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '86675d17-8ada-4127-9bcf-c4295ec30eb7'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yumingzhong'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '5bb5133f-03e5-44b8-a90b-8bc4141bd134'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yumingzhong'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '22d3a3a9-d72d-469e-af7f-4387b690b1a4'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yumingzhong'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '691d333b-07f4-4617-9201-3c607743610f'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yumingzhong'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '870b2ddf-c58f-426b-ba38-4c5c33b70b3b'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yumingzhong'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '0ad8e860-4ff0-4930-9408-b5d0d173d0d9'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yumingzhong'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '4e3843c9-dd6c-4230-adac-b9fc3a2d4c9e'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yumingzhong'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'fe8762c2-82bf-4c86-9fc5-ad299d23f6eb'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yumingzhong'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '126e2898-355a-47d2-aa1e-9f9a812ab8e6'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yumingzhong'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '6969eed1-8855-4a0d-8cee-1dabf0d14206'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yumingzhong'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '764744f3-35d8-4051-8ed2-b06051e990a5'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yumingzhong'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '52f543ed-da89-41ba-b1f8-a9efbc585ef8'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yumingzhong'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'e573db83-941a-46f8-af64-82832cee8768'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'dengzhixiong'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '07f7f37f-e77b-4943-b8c6-2af521ff65fb'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'dengzhixiong'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'e573db83-941a-46f8-af64-82832cee8768'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yangziyu'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '07f7f37f-e77b-4943-b8c6-2af521ff65fb'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yangziyu'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '0260f637-cf56-4efb-8300-b2a1c77df03d'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yangziyu'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '0d005ba5-45d8-4c3c-97ce-6743644400c5'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yangziyu'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '29f1e54c-8dab-4168-b22e-dbab4303c00a'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yangziyu'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '60576453-fd0a-4b09-8921-29422c51cfef'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yangziyu'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'a88a1e23-6dd5-48f4-ad64-cdb385877014'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yangziyu'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '86675d17-8ada-4127-9bcf-c4295ec30eb7'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yangziyu'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '5bb5133f-03e5-44b8-a90b-8bc4141bd134'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yangziyu'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '22d3a3a9-d72d-469e-af7f-4387b690b1a4'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yangziyu'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '691d333b-07f4-4617-9201-3c607743610f'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yangziyu'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '870b2ddf-c58f-426b-ba38-4c5c33b70b3b'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yangziyu'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '0ad8e860-4ff0-4930-9408-b5d0d173d0d9'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yangziyu'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '4e3843c9-dd6c-4230-adac-b9fc3a2d4c9e'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yangziyu'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'fe8762c2-82bf-4c86-9fc5-ad299d23f6eb'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yangziyu'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '126e2898-355a-47d2-aa1e-9f9a812ab8e6'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yangziyu'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '6969eed1-8855-4a0d-8cee-1dabf0d14206'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yangziyu'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '764744f3-35d8-4051-8ed2-b06051e990a5'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yangziyu'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '52f543ed-da89-41ba-b1f8-a9efbc585ef8'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yangziyu'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'e573db83-941a-46f8-af64-82832cee8768'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'chenmaoteng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '07f7f37f-e77b-4943-b8c6-2af521ff65fb'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'chenmaoteng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '0260f637-cf56-4efb-8300-b2a1c77df03d'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'chenmaoteng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '0d005ba5-45d8-4c3c-97ce-6743644400c5'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'chenmaoteng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '29f1e54c-8dab-4168-b22e-dbab4303c00a'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'chenmaoteng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '60576453-fd0a-4b09-8921-29422c51cfef'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'chenmaoteng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'a88a1e23-6dd5-48f4-ad64-cdb385877014'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'chenmaoteng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '86675d17-8ada-4127-9bcf-c4295ec30eb7'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'chenmaoteng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '5bb5133f-03e5-44b8-a90b-8bc4141bd134'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'chenmaoteng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '22d3a3a9-d72d-469e-af7f-4387b690b1a4'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'chenmaoteng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '691d333b-07f4-4617-9201-3c607743610f'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'chenmaoteng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '870b2ddf-c58f-426b-ba38-4c5c33b70b3b'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'chenmaoteng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '0ad8e860-4ff0-4930-9408-b5d0d173d0d9'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'chenmaoteng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '4e3843c9-dd6c-4230-adac-b9fc3a2d4c9e'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'chenmaoteng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'fe8762c2-82bf-4c86-9fc5-ad299d23f6eb'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'chenmaoteng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '126e2898-355a-47d2-aa1e-9f9a812ab8e6'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'chenmaoteng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '6969eed1-8855-4a0d-8cee-1dabf0d14206'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'chenmaoteng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '764744f3-35d8-4051-8ed2-b06051e990a5'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'chenmaoteng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '52f543ed-da89-41ba-b1f8-a9efbc585ef8'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'chenmaoteng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'e573db83-941a-46f8-af64-82832cee8768'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'shule'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'e573db83-941a-46f8-af64-82832cee8768'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liqiheng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '07f7f37f-e77b-4943-b8c6-2af521ff65fb'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liqiheng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '0260f637-cf56-4efb-8300-b2a1c77df03d'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liqiheng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '0d005ba5-45d8-4c3c-97ce-6743644400c5'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liqiheng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '29f1e54c-8dab-4168-b22e-dbab4303c00a'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liqiheng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '60576453-fd0a-4b09-8921-29422c51cfef'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liqiheng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'a88a1e23-6dd5-48f4-ad64-cdb385877014'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liqiheng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '86675d17-8ada-4127-9bcf-c4295ec30eb7'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liqiheng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '5bb5133f-03e5-44b8-a90b-8bc4141bd134'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liqiheng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '22d3a3a9-d72d-469e-af7f-4387b690b1a4'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liqiheng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '691d333b-07f4-4617-9201-3c607743610f'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liqiheng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '870b2ddf-c58f-426b-ba38-4c5c33b70b3b'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liqiheng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '0ad8e860-4ff0-4930-9408-b5d0d173d0d9'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liqiheng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '4e3843c9-dd6c-4230-adac-b9fc3a2d4c9e'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liqiheng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'fe8762c2-82bf-4c86-9fc5-ad299d23f6eb'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liqiheng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '126e2898-355a-47d2-aa1e-9f9a812ab8e6'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liqiheng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '6969eed1-8855-4a0d-8cee-1dabf0d14206'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liqiheng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '764744f3-35d8-4051-8ed2-b06051e990a5'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liqiheng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '52f543ed-da89-41ba-b1f8-a9efbc585ef8'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liqiheng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'e573db83-941a-46f8-af64-82832cee8768'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'wenyuanfeng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '07f7f37f-e77b-4943-b8c6-2af521ff65fb'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'wenyuanfeng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '0260f637-cf56-4efb-8300-b2a1c77df03d'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'wenyuanfeng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '0d005ba5-45d8-4c3c-97ce-6743644400c5'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'wenyuanfeng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '29f1e54c-8dab-4168-b22e-dbab4303c00a'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'wenyuanfeng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '60576453-fd0a-4b09-8921-29422c51cfef'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'wenyuanfeng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'a88a1e23-6dd5-48f4-ad64-cdb385877014'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'wenyuanfeng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '86675d17-8ada-4127-9bcf-c4295ec30eb7'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'wenyuanfeng'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'e573db83-941a-46f8-af64-82832cee8768'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liuguang'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'e573db83-941a-46f8-af64-82832cee8768'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liujiashuanga'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '07f7f37f-e77b-4943-b8c6-2af521ff65fb'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liujiashuanga'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '0260f637-cf56-4efb-8300-b2a1c77df03d'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'liujiashuanga'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'e573db83-941a-46f8-af64-82832cee8768'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yuejianglei'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '07f7f37f-e77b-4943-b8c6-2af521ff65fb'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yuejianglei'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '0260f637-cf56-4efb-8300-b2a1c77df03d'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yuejianglei'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '0d005ba5-45d8-4c3c-97ce-6743644400c5'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yuejianglei'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '29f1e54c-8dab-4168-b22e-dbab4303c00a'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yuejianglei'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '60576453-fd0a-4b09-8921-29422c51cfef'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yuejianglei'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'a88a1e23-6dd5-48f4-ad64-cdb385877014'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yuejianglei'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '86675d17-8ada-4127-9bcf-c4295ec30eb7'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yuejianglei'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '5bb5133f-03e5-44b8-a90b-8bc4141bd134'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yuejianglei'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '22d3a3a9-d72d-469e-af7f-4387b690b1a4'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yuejianglei'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '691d333b-07f4-4617-9201-3c607743610f'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'yuejianglei'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'e573db83-941a-46f8-af64-82832cee8768'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'zhangjunping'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '07f7f37f-e77b-4943-b8c6-2af521ff65fb'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'zhangjunping'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '0260f637-cf56-4efb-8300-b2a1c77df03d'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'zhangjunping'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '0d005ba5-45d8-4c3c-97ce-6743644400c5'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'zhangjunping'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '29f1e54c-8dab-4168-b22e-dbab4303c00a'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'zhangjunping'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '60576453-fd0a-4b09-8921-29422c51cfef'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'zhangjunping'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'a88a1e23-6dd5-48f4-ad64-cdb385877014'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'zhangjunping'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '86675d17-8ada-4127-9bcf-c4295ec30eb7'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'zhangjunping'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '5bb5133f-03e5-44b8-a90b-8bc4141bd134'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'zhangjunping'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '22d3a3a9-d72d-469e-af7f-4387b690b1a4'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'zhangjunping'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '691d333b-07f4-4617-9201-3c607743610f'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'zhangjunping'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '870b2ddf-c58f-426b-ba38-4c5c33b70b3b'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'zhangjunping'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '0ad8e860-4ff0-4930-9408-b5d0d173d0d9'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'zhangjunping'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '4e3843c9-dd6c-4230-adac-b9fc3a2d4c9e'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'zhangjunping'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'fe8762c2-82bf-4c86-9fc5-ad299d23f6eb'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'zhangjunping'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '126e2898-355a-47d2-aa1e-9f9a812ab8e6'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'zhangjunping'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '6969eed1-8855-4a0d-8cee-1dabf0d14206'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'zhangjunping'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '764744f3-35d8-4051-8ed2-b06051e990a5'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'zhangjunping'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '52f543ed-da89-41ba-b1f8-a9efbc585ef8'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'zhangjunping'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'dd9d17fe-0899-4415-8c5e-02853758350b'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'zhangjunping'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '7a9d09b2-6270-4a21-8133-3521944b009e'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'zhangjunping'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '717de790-a699-44ed-9275-4cc97878b61f'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'zhangjunping'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '292a589d-5587-47b6-8c86-9881f5a38465'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'zhangjunping'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '7cc4fca9-eb7d-4832-8af2-247273817f54'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'zhangjunping'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'e573db83-941a-46f8-af64-82832cee8768'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'zhangdongliang'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '07f7f37f-e77b-4943-b8c6-2af521ff65fb'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'zhangdongliang'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '0260f637-cf56-4efb-8300-b2a1c77df03d'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'zhangdongliang'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '0d005ba5-45d8-4c3c-97ce-6743644400c5'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'zhangdongliang'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '29f1e54c-8dab-4168-b22e-dbab4303c00a'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'zhangdongliang'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '60576453-fd0a-4b09-8921-29422c51cfef'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'zhangdongliang'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'a88a1e23-6dd5-48f4-ad64-cdb385877014'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'zhangdongliang'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '86675d17-8ada-4127-9bcf-c4295ec30eb7'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'zhangdongliang'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '5bb5133f-03e5-44b8-a90b-8bc4141bd134'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'zhangdongliang'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '22d3a3a9-d72d-469e-af7f-4387b690b1a4'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'zhangdongliang'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '691d333b-07f4-4617-9201-3c607743610f'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'zhangdongliang'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '870b2ddf-c58f-426b-ba38-4c5c33b70b3b'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'zhangdongliang'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'e573db83-941a-46f8-af64-82832cee8768'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'chenyonga'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '07f7f37f-e77b-4943-b8c6-2af521ff65fb'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'chenyonga'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '0260f637-cf56-4efb-8300-b2a1c77df03d'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'chenyonga'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '0d005ba5-45d8-4c3c-97ce-6743644400c5'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'chenyonga'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '29f1e54c-8dab-4168-b22e-dbab4303c00a'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'chenyonga'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '60576453-fd0a-4b09-8921-29422c51cfef'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'chenyonga'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'a88a1e23-6dd5-48f4-ad64-cdb385877014'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'chenyonga'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '86675d17-8ada-4127-9bcf-c4295ec30eb7'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'chenyonga'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '5bb5133f-03e5-44b8-a90b-8bc4141bd134'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'chenyonga'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '22d3a3a9-d72d-469e-af7f-4387b690b1a4'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'chenyonga'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '691d333b-07f4-4617-9201-3c607743610f'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'chenyonga'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '870b2ddf-c58f-426b-ba38-4c5c33b70b3b'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'chenyonga'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '0ad8e860-4ff0-4930-9408-b5d0d173d0d9'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'chenyonga'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '4e3843c9-dd6c-4230-adac-b9fc3a2d4c9e'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'chenyonga'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'fe8762c2-82bf-4c86-9fc5-ad299d23f6eb'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'chenyonga'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '126e2898-355a-47d2-aa1e-9f9a812ab8e6'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'chenyonga'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '6969eed1-8855-4a0d-8cee-1dabf0d14206'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'chenyonga'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '764744f3-35d8-4051-8ed2-b06051e990a5'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'chenyonga'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '52f543ed-da89-41ba-b1f8-a9efbc585ef8'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'chenyonga'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'e573db83-941a-46f8-af64-82832cee8768'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'hkpking'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '07f7f37f-e77b-4943-b8c6-2af521ff65fb'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'hkpking'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '0260f637-cf56-4efb-8300-b2a1c77df03d'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'hkpking'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '0d005ba5-45d8-4c3c-97ce-6743644400c5'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'hkpking'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '29f1e54c-8dab-4168-b22e-dbab4303c00a'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'hkpking'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '60576453-fd0a-4b09-8921-29422c51cfef'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'hkpking'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'a88a1e23-6dd5-48f4-ad64-cdb385877014'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'hkpking'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '86675d17-8ada-4127-9bcf-c4295ec30eb7'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'hkpking'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '5bb5133f-03e5-44b8-a90b-8bc4141bd134'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'hkpking'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '22d3a3a9-d72d-469e-af7f-4387b690b1a4'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'hkpking'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '691d333b-07f4-4617-9201-3c607743610f'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'hkpking'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '870b2ddf-c58f-426b-ba38-4c5c33b70b3b'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'hkpking'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '0ad8e860-4ff0-4930-9408-b5d0d173d0d9'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'hkpking'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '4e3843c9-dd6c-4230-adac-b9fc3a2d4c9e'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'hkpking'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'fe8762c2-82bf-4c86-9fc5-ad299d23f6eb'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'hkpking'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '126e2898-355a-47d2-aa1e-9f9a812ab8e6'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'hkpking'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '6969eed1-8855-4a0d-8cee-1dabf0d14206'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'hkpking'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '764744f3-35d8-4051-8ed2-b06051e990a5'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'hkpking'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '52f543ed-da89-41ba-b1f8-a9efbc585ef8'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'hkpking'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'dd9d17fe-0899-4415-8c5e-02853758350b'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'hkpking'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '7a9d09b2-6270-4a21-8133-3521944b009e'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'hkpking'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '3b62e5a1-da42-4d86-9d15-01a37411d0a7'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'hkpking'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '3068f470-08b7-445a-82fb-fc3d46aba700'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'hkpking'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'c69d5dc1-6e7c-462f-8651-cf7eaa310d88'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'hkpking'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '48eb8b92-d59f-42b4-9c29-0d3f6b0ccbb4'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'hkpking'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'e01995e2-a42b-4c37-aed3-644165f9a0d7'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'hkpking'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'a9237b3f-c345-4ebb-8d9d-bf97be47f14d'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'hkpking'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '28fe4fa0-aa35-4716-aba1-0ab3aa76af30'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'hkpking'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '15582ca0-6142-49bd-9185-168b05961574'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'hkpking'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, 'd8683f09-8d8c-4663-85ea-c866b71676d2'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'hkpking'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '191880f2-5f4f-4d09-b298-98ee239ebe61'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'hkpking'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '039016e4-4de8-47c4-a1fe-0946b99338c3'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'hkpking'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '6899681c-3097-44a0-958f-154cd0565a7d'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'hkpking'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '2a44b2bd-54bd-43b5-bfee-00cc2f848cb0'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'hkpking'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '717de790-a699-44ed-9275-4cc97878b61f'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'hkpking'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '292a589d-5587-47b6-8c86-9881f5a38465'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'hkpking'
ON CONFLICT (user_id, block_id) DO NOTHING;

INSERT INTO lctmr_user_progress (user_id, block_id, is_completed)
SELECT p.id, '7cc4fca9-eb7d-4832-8af2-247273817f54'::uuid, true
FROM lctmr_profiles p
WHERE p.username = 'hkpking'
ON CONFLICT (user_id, block_id) DO NOTHING;