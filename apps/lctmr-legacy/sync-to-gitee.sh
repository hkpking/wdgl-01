#!/bin/bash
# 同步脚本 - 将本地更改推送到Gitee

echo "🚀 开始同步到Gitee..."

# 1. 检查Git状态
echo "📋 检查Git状态..."
git status

# 2. 添加所有更改
echo "📁 添加文件到Git..."
git add .

# 3. 提交更改
echo "💾 提交更改..."
git commit -m "Update: $(date '+%Y-%m-%d %H:%M:%S')"

# 4. 推送到Gitee
echo "🌐 推送到Gitee..."
git push origin main

echo "✅ 同步完成！"
