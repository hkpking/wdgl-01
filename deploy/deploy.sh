#!/bin/bash
#
# WDGL 制度管理系统 - 部署脚本
# 
# 使用方法:
#   首次部署: ./deploy/deploy.sh setup
#   更新部署: ./deploy/deploy.sh update
#   查看状态: ./deploy/deploy.sh status
#   查看日志: ./deploy/deploy.sh logs
#

set -e  # 遇到错误立即退出

# ============================================
# 配置区域 - 按需修改
# ============================================
APP_NAME="wdgl"
APP_DIR="/var/www/wdgl"
NGINX_SITES_ENABLED="/etc/nginx/sites-enabled"
NODE_VERSION="20"

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# ============================================
# 检查依赖
# ============================================
check_dependencies() {
    log_info "检查系统依赖..."
    
    if ! command -v node &> /dev/null; then
        log_error "Node.js 未安装，请先安装 Node.js $NODE_VERSION"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        log_error "npm 未安装"
        exit 1
    fi
    
    if ! command -v pm2 &> /dev/null; then
        log_warn "PM2 未安装，正在安装..."
        npm install -g pm2
    fi
    
    if ! command -v nginx &> /dev/null; then
        log_error "Nginx 未安装，请先安装: sudo apt install nginx"
        exit 1
    fi
    
    log_info "依赖检查通过 ✓"
}

# ============================================
# 首次部署
# ============================================
setup() {
    log_info "========== 首次部署 =========="
    check_dependencies
    
    # 创建日志目录
    mkdir -p "$APP_DIR/logs"
    
    # 检查环境变量文件
    if [ ! -f "$APP_DIR/.env.production" ]; then
        log_warn "未找到 .env.production，正在从模板创建..."
        cp "$APP_DIR/.env.example" "$APP_DIR/.env.production"
        log_warn "请编辑 $APP_DIR/.env.production 填入真实配置"
        log_warn "完成后重新运行: ./deploy/deploy.sh setup"
        exit 0
    fi
    
    # 安装前端依赖并构建
    log_info "安装前端依赖..."
    cd "$APP_DIR"
    npm ci --production=false
    
    log_info "构建前端应用..."
    npm run build
    
    # 安装后端依赖
    log_info "安装后端依赖..."
    cd "$APP_DIR/backend"
    npm ci --production
    
    # 配置 Nginx
    log_info "配置 Nginx..."
    sudo ln -sf "$APP_DIR/deploy/nginx.conf" "$NGINX_SITES_ENABLED/$APP_NAME"
    sudo nginx -t
    sudo systemctl reload nginx
    
    # 启动 PM2 服务
    log_info "启动协作服务器..."
    cd "$APP_DIR"
    pm2 start deploy/ecosystem.config.js
    pm2 save
    
    # 设置 PM2 开机自启
    log_info "配置 PM2 开机自启..."
    pm2 startup systemd -u $USER --hp $HOME || true
    
    log_info "========== 部署完成 =========="
    log_info "前端地址: http://your-domain.com"
    log_info "协作服务: ws://your-domain.com/ws"
    status
}

# ============================================
# 更新部署
# ============================================
update() {
    log_info "========== 更新部署 =========="
    cd "$APP_DIR"
    
    # 拉取最新代码
    log_info "拉取最新代码..."
    git pull
    
    # 更新前端
    log_info "更新前端依赖..."
    npm ci --production=false
    
    log_info "重新构建..."
    npm run build
    
    # 更新后端
    log_info "更新后端依赖..."
    cd "$APP_DIR/backend"
    npm ci --production
    
    # 重启服务
    log_info "重启协作服务器..."
    pm2 restart wdgl-collab
    
    log_info "========== 更新完成 =========="
    status
}

# ============================================
# 查看状态
# ============================================
status() {
    log_info "========== 服务状态 =========="
    echo ""
    log_info "PM2 进程:"
    pm2 list
    echo ""
    log_info "Nginx 状态:"
    sudo systemctl status nginx --no-pager -l | head -5
    echo ""
    log_info "磁盘使用:"
    du -sh "$APP_DIR/dist" "$APP_DIR/node_modules" 2>/dev/null || true
}

# ============================================
# 查看日志
# ============================================
logs() {
    pm2 logs wdgl-collab --lines 50
}

# ============================================
# 停止服务
# ============================================
stop() {
    log_info "停止服务..."
    pm2 stop wdgl-collab
    log_info "服务已停止"
}

# ============================================
# 重启服务
# ============================================
restart() {
    log_info "重启服务..."
    pm2 restart wdgl-collab
    sudo systemctl reload nginx
    log_info "服务已重启"
}

# ============================================
# 主入口
# ============================================
case "$1" in
    setup)
        setup
        ;;
    update)
        update
        ;;
    status)
        status
        ;;
    logs)
        logs
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    *)
        echo "WDGL 部署脚本"
        echo ""
        echo "用法: $0 {setup|update|status|logs|stop|restart}"
        echo ""
        echo "命令说明:"
        echo "  setup   - 首次部署 (安装依赖、构建、配置 Nginx、启动服务)"
        echo "  update  - 更新部署 (拉取代码、重新构建、重启服务)"
        echo "  status  - 查看服务状态"
        echo "  logs    - 查看协作服务器日志"
        echo "  stop    - 停止协作服务器"
        echo "  restart - 重启所有服务"
        exit 1
        ;;
esac
