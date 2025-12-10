#!/bin/bash
#
# Next.js 生产部署脚本
# 在阿里云服务器上执行: bash /var/www/wdgl-01/nextjs-app/deploy-nextjs.sh
#

set -e

echo "===== Next.js 生产部署 ====="

APP_DIR="/var/www/wdgl-01"
NEXTJS_DIR="$APP_DIR/nextjs-app"

# 1. 拉取最新代码
echo "[1/5] 拉取最新代码..."
cd "$APP_DIR"
git pull

# 2. 进入 Next.js 目录
echo "[2/5] 进入 Next.js 目录..."
cd "$NEXTJS_DIR"

# 3. 安装依赖
echo "[3/5] 安装依赖..."
npm install --legacy-peer-deps

# 4. 构建生产版本
echo "[4/5] 构建生产版本..."
npm run build

# 5. 使用 PM2 启动/重启服务
echo "[5/5] 启动 PM2 服务..."
if pm2 describe wdgl-nextjs > /dev/null 2>&1; then
    pm2 restart wdgl-nextjs
else
    pm2 start ecosystem.config.cjs --only wdgl-nextjs
fi

pm2 save

echo ""
echo "===== 部署完成 ====="
echo "前端地址: http://120.79.181.206:3000"
pm2 list
