#!/bin/bash
# 修复开发数据库schema问题
# 创建auth schema或创建视图指向public.users

set -e

source /var/www/lctmr/env.development

echo "🔧 修复开发数据库schema配置..."

PGPASSWORD='Dslr*2025#app' psql -h "$DB_HOST" -U web_app -d "$DB_NAME" << 'EOF'
-- 创建auth schema（如果不存在）
CREATE SCHEMA IF NOT EXISTS auth;

-- 创建视图指向public.users（让auth.users指向public.users）
CREATE OR REPLACE VIEW auth.users AS 
SELECT id, email, password_hash as encrypted_password, created_at, updated_at
FROM public.users;

-- 授予权限
GRANT USAGE ON SCHEMA auth TO web_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON auth.users TO web_app;

-- 如果需要支持INSERT，创建触发器或使用规则
-- 这里创建一个简单的INSERT规则（PostgreSQL不支持直接对视图INSERT，需要使用规则或INSTEAD OF触发器）
CREATE OR REPLACE FUNCTION auth.insert_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, password_hash, created_at, updated_at)
    VALUES (NEW.id, NEW.email, NEW.encrypted_password, NEW.created_at, NEW.updated_at);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 创建INSTEAD OF触发器支持INSERT
DROP TRIGGER IF EXISTS insert_user_trigger ON auth.users;
CREATE TRIGGER insert_user_trigger
INSTEAD OF INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION auth.insert_user();

-- 检查结果
SELECT 'auth.users视图已创建' as status;
SELECT COUNT(*) as user_count FROM auth.users;
EOF

echo ""
echo "✅ 开发数据库schema修复完成！"
echo "现在后端可以通过 auth.users 访问用户表了"


