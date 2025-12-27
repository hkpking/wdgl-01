# 测试环境与生产环境配置对比分析

## 一、配置差异总览

### 1. 后端服务配置（env.development vs env.production）

| 配置项 | 开发环境 (env.development) | 生产环境 (env.production) | 说明 |
|--------|--------------------------|-------------------------|------|
| **NODE_ENV** | `development` | `production` | 环境标识 |
| **PORT** | `3002` | `3001` | 服务监听端口（关键差异） |
| **API_URL** | `http://localhost:3002/api` | `http://process-pro.cosmo-lady.com/api` | API 服务地址 |
| **FRONTEND_URL** | `http://localhost:5500` | `http://localhost:3000` | 前端地址（生产环境可能需调整） |
| **JWT_SECRET** | `dev-jwt-secret-key-...` | `7YtYAMJUa4L...` | JWT 密钥（不同，但生产环境密钥应更安全） |
| **JWT_EXPIRES_IN** | `24h` | `24h` | Token 过期时间（相同） |

### 2. 数据库配置

| 配置项 | 开发环境 | 生产环境 | 说明 |
|--------|---------|---------|------|
| **DB_HOST** | `localhost` | `localhost` | 数据库主机（相同，同机部署） |
| **DB_PORT** | `5432` | `5432` | 数据库端口（相同） |
| **DB_USER** | `web_app` | `web_app` | 数据库用户（相同，建议分离） |
| **DB_PASSWORD** | `Dslr*2025#app` | `Dslr*2025#app` | 数据库密码（相同，安全风险） |
| **DB_NAME** | `lctmr_development` | `lctmr_production` | 数据库名称（不同，正确隔离） |
| **DB_SSL** | `false` | `false` | SSL 连接（相同） |
| **DB_CONNECTION_LIMIT** | `10` | `50` | 连接池大小（生产更大） |
| **DB_IDLE_TIMEOUT** | `30000` | `30000` | 空闲超时（相同） |
| **DB_CONNECTION_TIMEOUT** | `2000` | `2000` | 连接超时（相同） |

### 3. CORS 配置（backend/server.js）

开发环境允许的来源（宽松）：
- `http://localhost:*` (多个端口)
- `http://127.0.0.1:*` (多个端口)
- `http://localhost` / `http://127.0.0.1`
- `process.env.FRONTEND_URL`

生产环境允许的来源（严格）：
- `http://process.xjio.cn`
- `https://process.xjio.cn`
- `http://www.process.xjio.cn`
- `https://www.process.xjio.cn`
- `process.env.FRONTEND_URL`

### 4. 前端配置

#### config.js（自动环境检测）

**生产环境判断逻辑：**
- 通过域名判断：非 localhost、非 127.0.0.1、非 IP 地址、非内网 IP（172.x、192.168.x）

**开发环境：**
- 通过 IP 访问：使用 `${hostname}:3002/api`
- 本地访问：使用 `localhost:3002/api`
- 回退配置：`localhost:3001/api`

**生产环境：**
- API_URL: `http://process.xjio.cn/api`
- FRONTEND_URL: `http://process.xjio.cn`

#### local-config.js（本地开发覆盖）

- 通过 IP 访问：`http://${hostname}:3002/api`
- 本地访问：`http://localhost:3002/api`

### 5. Nginx 配置（frontend/nginx.conf）

- Upstream 固定指向：`localhost:3001`（生产环境端口）
- 监听端口：`80`
- 未配置开发环境的 upstream

## 二、关键发现与风险点

### 🔴 高风险问题

1. **数据库密码相同**
   - 开发和生产使用相同的数据库密码
   - 建议：为生产环境使用更强的独立密码

2. **数据库用户相同**
   - 开发和生产使用相同的数据库用户
   - 建议：为生产环境创建独立用户，限制权限

3. **JWT_SECRET 安全性**
   - 开发环境 JWT_SECRET 有 "dev-" 前缀，但生产环境的密钥仍可能不够强
   - 建议：生产环境使用更长的随机密钥，通过环境变量注入

4. **端口配置不一致**
   - deploy.sh 帮助信息中端口描述错误（development 3001, production 3002）
   - 实际配置：development 3002, production 3001
   - 需要修正帮助文档

### ⚠️ 中风险问题

1. **环境标识不够明显**
   - 进程启动时缺少环境标识
   - 日志文件名虽有区分，但进程列表中难以区分
   - 建议：在进程命令中添加环境标识

2. **测试环境访问控制**
   - 开发环境（端口 3002）可能对外暴露
   - 建议：通过防火墙限制 3002 端口仅内网访问

3. **配置文件安全性**
   - `.env` 文件可能被意外提交或泄露
   - 建议：确保 `.gitignore` 正确配置，敏感信息通过环境变量注入

### 💡 改进建议

1. **配置隔离加强**
   - 生产环境数据库密码通过环境变量注入，不在配置文件中硬编码
   - 为生产环境创建独立的数据库用户，仅授予必要权限

2. **运行隔离加强**
   - 在进程启动时添加环境标识（进程名或环境变量标记）
   - 改进日志输出，明确显示当前环境

3. **访问控制**
   - 开发环境端口（3002）仅允许内网访问
   - 生产环境端口（3001）通过 Nginx 反向代理，不直接暴露

## 三、配置差异清单

### 必须不同的配置

- ✅ NODE_ENV
- ✅ PORT
- ✅ DB_NAME
- ✅ API_URL
- ✅ JWT_SECRET（建议）
- ✅ DB_CONNECTION_LIMIT

### 建议不同的配置

- ⚠️ DB_USER（建议分离）
- ⚠️ DB_PASSWORD（强烈建议分离）
- ⚠️ CORS 白名单（已实现）
- ⚠️ 日志级别（可增加）

### 可以相同的配置

- ✅ DB_HOST（同机部署）
- ✅ DB_PORT
- ✅ DB_SSL
- ✅ DB_IDLE_TIMEOUT
- ✅ DB_CONNECTION_TIMEOUT
- ✅ JWT_EXPIRES_IN

## 四、配置验证检查清单

部署前检查：

- [ ] 环境配置文件存在且可读
- [ ] 数据库连接配置正确
- [ ] JWT_SECRET 已设置（生产环境强制要求）
- [ ] 端口未被占用
- [ ] 数据库已创建（lctmr_development 或 lctmr_production）
- [ ] 日志目录存在且可写
- [ ] 防火墙规则已配置（开发环境端口限制）

部署后验证：

- [ ] 服务健康检查通过 (`/health`)
- [ ] API 路由正常响应
- [ ] 数据库连接正常
- [ ] CORS 配置正确
- [ ] 日志正常输出
- [ ] 进程标识清晰可辨



