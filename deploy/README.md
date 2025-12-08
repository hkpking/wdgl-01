# WDGL 部署指南

本指南说明如何将 WDGL 制度管理系统部署到生产服务器。

## 📋 前置要求

### 服务器配置
- **操作系统**: Ubuntu 20.04+ / Debian 11+
- **内存**: 最少 2GB，推荐 4GB+
- **CPU**: 2 核心+
- **磁盘**: 10GB+

### 软件依赖
- Node.js 20+ (推荐使用 [nvm](https://github.com/nvm-sh/nvm))
- Nginx
- PM2 (会自动安装)
- Git

---

## 🚀 快速部署

### 1. 首次部署

```bash
# 1. 克隆代码到服务器
git clone <your-repo-url> /var/www/wdgl
cd /var/www/wdgl

# 2. 配置环境变量
cp .env.example .env.production
nano .env.production  # 填入真实配置

# 3. 执行部署脚本
chmod +x deploy/deploy.sh
./deploy/deploy.sh setup
```

### 2. 更新部署

```bash
cd /var/www/wdgl
./deploy/deploy.sh update
```

---

## 📁 文件结构

```
deploy/
├── nginx.conf           # Nginx 配置
├── ecosystem.config.js  # PM2 进程管理配置
└── deploy.sh            # 部署脚本
.env.example             # 环境变量模板
```

---

## ⚙️ 环境变量配置

编辑 `.env.production` 文件，填入以下配置：

| 变量名 | 说明 | 示例 |
|--------|------|------|
| `VITE_SUPABASE_URL` | Supabase 项目 URL | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | `eyJ...` |
| `VITE_WS_URL` | WebSocket 协作服务器地址 | `wss://your-domain.com/ws` |
| `VITE_GOOGLE_AI_API_KEY` | Google AI API 密钥 | `AIza...` |
| `PORT` | 协作服务器端口 | `1234` |

---

## 🔧 Nginx 配置

部署脚本会自动配置 Nginx，但你需要修改域名：

```bash
nano deploy/nginx.conf
# 将 your-domain.com 替换为你的实际域名或 IP
```

### 启用 HTTPS (推荐)

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 证书会自动续期
```

---

## 📊 常用命令

```bash
# 查看服务状态
./deploy/deploy.sh status

# 查看日志
./deploy/deploy.sh logs
pm2 logs wdgl-collab

# 重启服务
./deploy/deploy.sh restart

# 停止服务
./deploy/deploy.sh stop

# Nginx 相关
sudo nginx -t                    # 测试配置
sudo systemctl reload nginx      # 重载配置
sudo systemctl status nginx      # 查看状态
```

---

## 🔥 防火墙配置

```bash
# 开放必要端口
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 22/tcp    # SSH

# 如果需要直接访问 WebSocket (不通过 Nginx 代理)
# sudo ufw allow 1234/tcp

# 查看状态
sudo ufw status
```

---

## ❓ 故障排查

### 页面无法访问
1. 检查 Nginx 是否运行: `sudo systemctl status nginx`
2. 检查防火墙: `sudo ufw status`
3. 检查构建产物: `ls -la /var/www/wdgl/dist/`

### 协作功能不工作
1. 检查 WebSocket 服务: `pm2 status`
2. 查看日志: `pm2 logs wdgl-collab`
3. 检查 Nginx WebSocket 代理配置

### 登录/数据问题
1. 检查 `.env.production` 中的 Supabase 配置
2. 确认 Supabase 项目正常运行
3. 检查浏览器控制台网络请求

---

## 📝 维护建议

1. **定期备份**: 虽然数据存储在 Supabase，但建议定期导出
2. **监控**: 使用 PM2 内置监控或集成外部监控服务
3. **日志轮转**: 配置 logrotate 防止日志占满磁盘
4. **安全更新**: 定期更新系统和 Node.js

---

## 🔄 回滚

如果新版本有问题，可以快速回滚：

```bash
cd /var/www/wdgl
git log --oneline -5  # 查看最近提交
git checkout <previous-commit-hash>
npm run build
pm2 restart wdgl-collab
```
