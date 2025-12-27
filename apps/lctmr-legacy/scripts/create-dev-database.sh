#!/bin/bash
# 创建开发数据库脚本
# 使用方法：在数据库服务器上执行，或确保可以连接到数据库服务器

set -e

# 颜色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}📊 创建开发数据库...${NC}"
echo ""

# 数据库配置
DB_HOST="120.79.181.206"
DB_PORT="5432"
DB_USER="web_app"
DB_NAME="lctmr_development"

# 方法1：如果可以在数据库服务器本地执行
echo -e "${BLUE}方法1: 在数据库服务器本地执行${NC}"
echo ""
echo "如果数据库服务器是 120.79.181.206，请在该服务器上执行："
echo ""
echo -e "${GREEN}psql -U web_app -d postgres << EOF${NC}"
echo -e "${GREEN}CREATE DATABASE lctmr_development;${NC}"
echo -e "${GREEN}GRANT ALL PRIVILEGES ON DATABASE lctmr_development TO web_app;${NC}"
echo -e "${GREEN}\\q${NC}"
echo -e "${GREEN}EOF${NC}"
echo ""

# 方法2：如果可以通过 SSH 连接
echo -e "${BLUE}方法2: 通过 SSH 连接数据库服务器${NC}"
echo ""
echo "如果您有 SSH 访问权限，可以执行："
echo ""
echo -e "${GREEN}ssh user@120.79.181.206 'psql -U web_app -d postgres -c \"CREATE DATABASE lctmr_development;\"'${NC}"
echo ""

# 方法3：手动执行 SQL
echo -e "${BLUE}方法3: 手动执行 SQL 脚本${NC}"
echo ""
echo "在数据库管理工具（如 pgAdmin、DBeaver）中执行以下 SQL："
echo ""
echo -e "${GREEN}CREATE DATABASE lctmr_development;${NC}"
echo -e "${GREEN}GRANT ALL PRIVILEGES ON DATABASE lctmr_development TO web_app;${NC}"
echo ""

# 检查数据库是否已存在
if command -v psql &> /dev/null; then
    echo -e "${BLUE}尝试检查数据库连接...${NC}"
    if PGPASSWORD='Dslr*2025#app' psql -h "$DB_HOST" -U "$DB_USER" -d postgres -c "\l" 2>/dev/null | grep -q "$DB_NAME"; then
        echo -e "${GREEN}✅ 数据库 $DB_NAME 已存在${NC}"
    else
        echo -e "${YELLOW}⚠️  无法连接到数据库服务器 $DB_HOST:5432${NC}"
        echo -e "${YELLOW}   请检查：${NC}"
        echo "    1. 数据库服务器是否运行"
        echo "    2. 防火墙是否允许 5432 端口"
        echo "    3. PostgreSQL 是否配置允许远程连接"
        echo "    4. 网络连接是否正常"
    fi
else
    echo -e "${YELLOW}⚠️  未安装 psql 客户端${NC}"
fi

echo ""
echo -e "${BLUE}📝 数据库创建后，执行以下命令启动开发环境：${NC}"
echo -e "${GREEN}./scripts/deploy.sh development start${NC}"

