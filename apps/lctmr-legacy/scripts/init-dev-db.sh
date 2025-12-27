#!/bin/bash
# 初始化开发环境数据库脚本
# 使用 psql 直接执行SQL

set -e

# 加载开发环境配置
source /var/www/lctmr/env.development

echo "🏗️  开始初始化开发环境数据库..."

# 执行SQL初始化脚本
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" << EOF
-- 启用必要的扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 创建核心用户表
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- 创建用户档案表
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'user',
    full_name TEXT,
    faction TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建积分表
CREATE TABLE IF NOT EXISTS public.scores (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    username TEXT,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 检查是否有用户
SELECT COUNT(*) as user_count FROM users;
EOF

echo ""
echo "✅ 开发环境数据库表结构初始化完成！"
echo ""
echo "📋 下一步："
echo "   1. 如果用户数量为 0，可以通过前端注册新用户"
echo "   2. 或者从生产数据库复制用户数据"


