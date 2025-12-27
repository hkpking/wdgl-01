# 环境配置说明

## 📊 数据库配置

### 数据库服务器
- **统一数据库服务器**: `120.79.181.206`
- 所有环境都连接到同一个数据库服务器

### 数据库分离

| 环境 | 端口 | 数据库名称 | 用途 |
|------|------|-----------|------|
| **开发环境** | **3002** | `lctmr_development` | 开发和测试使用 |
| **生产环境** | **3001** | `lctmr_production` | 正式生产使用 |

### 配置位置

- **开发环境配置**: `env.development`
  ```bash
  DB_HOST=120.79.181.206
  DB_NAME=lctmr_development
  PORT=3002
  ```

- **生产环境配置**: `env.production`
  ```bash
  DB_HOST=120.79.181.206
  DB_NAME=lctmr_production
  PORT=3001
  ```

## 🌐 前端访问配置

### 开发环境访问方式

1. **通过 IP+端口访问**（推荐）
   - 访问地址: `http://服务器IP:端口`
   - 后端 API: `http://服务器IP:3001/api`
   - 示例: `http://172.19.77.22:80` → 后端: `http://172.19.77.22:3001/api`

2. **通过 localhost 访问**（本地开发）
   - 访问地址: `http://localhost:5500`
   - 后端 API: `http://localhost:3001/api`

### 生产环境访问方式

- **通过域名访问**
  - 访问地址: `http://process.xjio.cn`
  - 后端 API: `http://process.xjio.cn/api`

### 自动识别机制

前端配置会自动识别访问方式：
- 如果是 IP 地址 → 使用开发环境配置
- 如果是域名 → 使用生产环境配置
- 如果是 localhost → 使用开发环境配置

## ⚙️ 配置说明

### 开发环境 (`env.development`)

```bash
NODE_ENV=development
DB_HOST=120.79.181.206
DB_NAME=lctmr_development    # 开发数据库
PORT=3001                    # 开发环境端口
```

### 生产环境 (`env.production`)

```bash
NODE_ENV=production
DB_HOST=120.79.181.206
DB_NAME=lctmr_production     # 生产数据库
PORT=3002                    # 生产环境端口
```

## 📝 重要提醒

### 数据库创建

**首次部署前，请确保在数据库服务器 `120.79.181.206` 上创建以下数据库：**

```sql
-- 创建开发数据库
CREATE DATABASE lctmr_development;

-- 创建生产数据库（如果还没有）
CREATE DATABASE lctmr_production;

-- 授予权限（根据实际用户）
GRANT ALL PRIVILEGES ON DATABASE lctmr_development TO web_app;
GRANT ALL PRIVILEGES ON DATABASE lctmr_production TO web_app;
```

### 数据库迁移

如果需要将现有数据迁移到开发数据库：

```bash
# 从生产数据库导出
pg_dump -h 120.79.181.206 -U web_app -d lctmr_production > production_backup.sql

# 导入到开发数据库
psql -h 120.79.181.206 -U web_app -d lctmr_development < production_backup.sql
```

## 🔍 验证配置

### 检查环境配置

```bash
# 查看开发环境配置
cat env.development | grep DB_

# 查看生产环境配置
cat env.production | grep DB_
```

### 测试数据库连接

```bash
# 测试开发数据库连接
psql -h 120.79.181.206 -U web_app -d lctmr_development -c "SELECT version();"

# 测试生产数据库连接
psql -h 120.79.181.206 -U web_app -d lctmr_production -c "SELECT version();"
```

### 测试前端访问

1. **开发环境**:
   - 浏览器访问: `http://服务器IP:端口`
   - 打开控制台，查看配置是否正确加载
   - 应该显示: `开发环境配置已加载`，API 地址为 `http://服务器IP:3001/api`

2. **生产环境**:
   - 浏览器访问: `http://process.xjio.cn`
   - 打开控制台，查看配置是否正确加载
   - 应该显示: `环境配置已加载: production`

## 🛠️ 故障排查

### 前端无法连接后端

1. **检查后端服务是否运行**
   ```bash
   ./scripts/deploy.sh status
   ```

2. **检查端口是否开放**
   ```bash
   # 开发环境
   curl http://localhost:3001/health
   
   # 生产环境
   curl http://localhost:3002/health
   ```

3. **检查防火墙规则**
   ```bash
   # 查看防火墙状态
   sudo ufw status
   
   # 如果需要，开放端口
   sudo ufw allow 3001/tcp  # 开发环境
   sudo ufw allow 3002/tcp  # 生产环境
   ```

### 数据库连接失败

1. **检查数据库是否存在**
   ```bash
   psql -h 120.79.181.206 -U web_app -l | grep lctmr
   ```

2. **检查数据库权限**
   ```bash
   psql -h 120.79.181.206 -U web_app -d lctmr_development -c "\du"
   ```

3. **查看后端日志**
   ```bash
   tail -f logs/backend-development.log
   tail -f logs/backend-production.log
   ```

---

**最后更新**: 2025-01-27

