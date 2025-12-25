#!/bin/bash
#
# 本地构建 + 远程部署脚本
# 在开发机器上构建，只传输构建产物到生产服务器
# 避免生产服务器 CPU 过载
#
# 使用方法: bash scripts/deploy-local-build.sh
#

set -e

# 配置
LOCAL_NEXTJS_DIR="/home/dev/Desktop/wdgl-01/nextjs-app"
REMOTE_HOST="root@120.79.181.206"
REMOTE_APP_DIR="/var/www/wdgl-01/nextjs-app"

echo "===== 本地构建 + 远程部署 ====="
echo "开发机器构建，生产服务器只接收产物"
echo ""

# 1. 本地构建
echo "[1/5] 本地构建 Next.js..."
cd "$LOCAL_NEXTJS_DIR"
npm run build

# 2. 打包构建产物
echo "[2/5] 打包构建产物..."
tar -czf /tmp/nextjs-build.tar.gz \
    .next \
    public \
    package.json \
    package-lock.json \
    next.config.ts \
    ecosystem.config.cjs

echo "产物大小: $(du -h /tmp/nextjs-build.tar.gz | cut -f1)"

# 3. 传输到生产服务器
echo "[3/5] 传输到生产服务器..."
scp /tmp/nextjs-build.tar.gz "$REMOTE_HOST:/tmp/"

# 4. 远程解压并重启
echo "[4/5] 远程解压并重启服务..."
ssh "$REMOTE_HOST" << 'ENDSSH'
set -e
cd /var/www/wdgl-01/nextjs-app

# 备份当前版本
if [ -d ".next" ]; then
    rm -rf .next.bak 2>/dev/null || true
    mv .next .next.bak
fi

# 解压新版本
tar -xzf /tmp/nextjs-build.tar.gz
rm /tmp/nextjs-build.tar.gz

# 只安装生产依赖（速度快，CPU 占用低）
npm ci --legacy-peer-deps --omit=dev 2>/dev/null || npm install --legacy-peer-deps --omit=dev

# 重启服务
pm2 restart wdgl-nextjs

# 清理备份
rm -rf .next.bak 2>/dev/null || true

echo "服务已重启！"
pm2 list
ENDSSH

# 5. 清理本地临时文件
echo "[5/5] 清理临时文件..."
rm /tmp/nextjs-build.tar.gz

echo ""
echo "===== 部署完成 ====="
echo "前端地址: https://120.79.181.206"
