#!/bin/bash
# 从生产数据库复制用户数据到开发数据库

set -e

source /var/www/lctmr/env.development

echo "📋 从生产数据库复制用户数据到开发数据库..."

# 导出生产数据库用户数据
echo "1️⃣ 导出生产数据库用户数据..."
PGPASSWORD='Dslr*2025#app' pg_dump -h localhost -U web_app -d lctmr_production \
    -t users -t profiles -t scores \
    --data-only \
    --column-inserts > /tmp/prod_users_data.sql

# 导入到开发数据库
echo "2️⃣ 导入到开发数据库..."
PGPASSWORD='Dslr*2025#app' psql -h localhost -U web_app -d lctmr_development < /tmp/prod_users_data.sql 2>&1 | grep -v "ERROR" || true

# 检查结果
echo ""
echo "3️⃣ 检查开发数据库用户数量..."
PGPASSWORD='Dslr*2025#app' psql -h localhost -U web_app -d lctmr_development -c "SELECT COUNT(*) as user_count FROM users;"

# 清理临时文件
rm -f /tmp/prod_users_data.sql

echo ""
echo "✅ 用户数据复制完成！"


