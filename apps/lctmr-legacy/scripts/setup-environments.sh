#!/bin/bash
# 环境设置脚本 - 初始化开发和生产环境
# 使用方法: ./setup-environments.sh

set -e

# 颜色输出
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo -e "${BLUE}🔧 开始设置开发和生产环境...${NC}"

# 创建必要的目录结构
echo -e "${BLUE}📁 创建目录结构...${NC}"
mkdir -p "$PROJECT_ROOT/logs"
mkdir -p "$PROJECT_ROOT/backup/env-backups"
mkdir -p "$PROJECT_ROOT/config/environments"

# 创建 systemd 服务文件（可选）
create_systemd_service() {
    local env=$1
    local service_file="/etc/systemd/system/lctmr-$env.service"
    
    echo -e "${BLUE}📝 创建 systemd 服务文件: lctmr-$env.service${NC}"
    
    cat > "$PROJECT_ROOT/config/environments/lctmr-$env.service" << EOF
[Unit]
Description=LCTMR API Server - $env Environment
After=network.target postgresql.service

[Service]
Type=simple
User=$USER
WorkingDirectory=$PROJECT_ROOT/backend
EnvironmentFile=$PROJECT_ROOT/env.$env
ExecStart=/usr/bin/node $PROJECT_ROOT/backend/server.js
Restart=always
RestartSec=10
StandardOutput=append:$PROJECT_ROOT/logs/backend-$env.log
StandardError=append:$PROJECT_ROOT/logs/backend-$env-error.log

[Install]
WantedBy=multi-user.target
EOF
    
    echo -e "${GREEN}✅ 服务文件已创建: $PROJECT_ROOT/config/environments/lctmr-$env.service${NC}"
    echo -e "${YELLOW}💡 要使用 systemd 管理服务，请执行:${NC}"
    echo -e "   sudo cp $PROJECT_ROOT/config/environments/lctmr-$env.service /etc/systemd/system/"
    echo -e "   sudo systemctl daemon-reload"
    echo -e "   sudo systemctl enable lctmr-$env"
    echo -e "   sudo systemctl start lctmr-$env"
}

# 创建环境切换快捷脚本
create_env_aliases() {
    echo -e "${BLUE}📝 创建环境切换快捷脚本...${NC}"
    
    cat > "$PROJECT_ROOT/scripts/env-dev.sh" << 'EOF'
#!/bin/bash
cd "$(dirname "$0")/.."
./scripts/deploy.sh development switch
EOF

    cat > "$PROJECT_ROOT/scripts/env-prod.sh" << 'EOF'
#!/bin/bash
cd "$(dirname "$0")/.."
./scripts/deploy.sh production switch
EOF

    chmod +x "$PROJECT_ROOT/scripts/env-dev.sh"
    chmod +x "$PROJECT_ROOT/scripts/env-prod.sh"
    
    echo -e "${GREEN}✅ 快捷脚本已创建${NC}"
}

# 创建 .gitignore 条目（如果不存在）
update_gitignore() {
    if [ ! -f "$PROJECT_ROOT/.gitignore" ]; then
        touch "$PROJECT_ROOT/.gitignore"
    fi
    
    if ! grep -q "^\.env$" "$PROJECT_ROOT/.gitignore"; then
        echo -e "${BLUE}📝 更新 .gitignore...${NC}"
        echo "" >> "$PROJECT_ROOT/.gitignore"
        echo "# 环境配置文件" >> "$PROJECT_ROOT/.gitignore"
        echo ".env" >> "$PROJECT_ROOT/.gitignore"
        echo "logs/" >> "$PROJECT_ROOT/.gitignore"
        echo "backup/" >> "$PROJECT_ROOT/.gitignore"
    fi
}

# 验证环境文件
verify_env_files() {
    echo -e "${BLUE}🔍 验证环境配置文件...${NC}"
    
    for env in development production; do
        local env_file="$PROJECT_ROOT/env.$env"
        if [ -f "$env_file" ]; then
            echo -e "${GREEN}✅ 找到: $env_file${NC}"
        else
            echo -e "${YELLOW}⚠️  未找到: $env_file（请手动创建）${NC}"
        fi
    done
}

# 主流程
echo ""
create_systemd_service "development"
echo ""
create_systemd_service "production"
echo ""
create_env_aliases
echo ""
update_gitignore
echo ""
verify_env_files
echo ""

echo -e "${GREEN}✅ 环境设置完成！${NC}"
echo ""
echo -e "${BLUE}📋 下一步操作:${NC}"
echo "  1. 检查环境配置文件: env.development 和 env.production"
echo "  2. 安装后端依赖: cd backend && npm install"
echo "  3. 部署到开发环境: ./scripts/deploy.sh development deploy"
echo "  4. 部署到生产环境: ./scripts/deploy.sh production deploy"
echo ""
echo -e "${BLUE}💡 快捷命令:${NC}"
echo "  ./scripts/env-dev.sh   - 切换到开发环境"
echo "  ./scripts/env-prod.sh  - 切换到生产环境"

