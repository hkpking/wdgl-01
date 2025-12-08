# 环境配置 (Environment Configuration)

## 开发环境

| 项目 | 值 |
|------|-----|
| **主机名** | `vmi2918619` |
| **操作系统** | Debian Linux (kernel 5.10.0-34-cloud-amd64) |
| **公网 IP** | `194.238.27.79` |
| **Node.js** | v24.11.1 |
| **NPM** | v11.6.2 |

### 开发服务器

```bash
npm run dev          # 启动开发服务器
# 本地: http://localhost:5173
# 外网: http://194.238.27.79:5173
```

---

## 生产环境 (阿里云 ECS)

| 项目 | 值 |
|------|-----|
| **主机名** | `iZwz9cbthrgfp35dyxw9fyZ` |
| **操作系统** | Debian GNU/Linux 12 (bookworm) |
| **公网 IP** | `120.79.181.206` |
| **CPU** | 2 核心 |
| **内存** | 3.5 GB |
| **磁盘** | 40 GB |
| **Node.js** | v20.19.5 |
| **Nginx** | 1.22.1 |
| **PM2** | 6.0.13 |

### 服务端点

| 服务 | 端口 | 地址 |
|------|------|------|
| **前端应用** | 3000 | `http://120.79.181.206:3000` |
| **协作服务器** | 1234 | `ws://120.79.181.206:1234` |

### 部署路径

```
/var/www/wdgl-01/
├── dist/                    # 构建产物
├── backend/                 # 协作服务器
├── deploy/                  # 部署配置
└── logs/                    # 日志目录
```

### 常用运维命令

```bash
# SSH 连接
ssh root@120.79.181.206

# 更新部署
cd /var/www/wdgl-01
git pull && npm install --legacy-peer-deps && npm run build
pm2 restart wdgl-collab

# 查看状态
pm2 list
pm2 logs wdgl-collab
```

---

## 敏感信息管理

> ⚠️ 以下文件已在 .gitignore 中排除，禁止提交到 Git

| 文件 | 说明 |
|------|------|
| `.env` | 环境变量 |
| `.env.production` | 生产环境变量 |
| `.env.test` | 测试环境变量 |
| `.env.local` | 本地环境变量 |

### 敏感信息配置

```bash
# 在生产服务器上
cp .env.example .env.production
nano .env.production  # 填入真实密钥
```

---

## 注意事项

1. **Supabase 配置**: 目前硬编码在 `src/services/supabase.js`，建议迁移到环境变量
2. **SSH 密码**: 禁止写入代码，存储在本地密码管理器
3. **HTTPS**: 建议后续配置 Let's Encrypt SSL 证书
