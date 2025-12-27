# 快速使用指南 - 多环境并行部署

## 🎯 核心功能

现在支持**开发和生产环境同时运行**，互不影响！

- ✅ 开发环境（端口 3001）- 用于开发和测试
- ✅ 生产环境（端口 3002）- 用于生产服务
- ✅ 可以同时运行，独立管理

## 🚀 快速开始

### 1. 启动环境

```bash
# 启动生产环境
./scripts/deploy.sh production start

# 启动开发环境（与生产环境并行运行）
./scripts/deploy.sh development start
```

### 2. 查看状态

```bash
# 查看所有环境状态
./scripts/deploy.sh status
```

### 3. 开发流程

```bash
# 1. 修改代码...

# 2. 重启开发环境测试新代码
./scripts/deploy.sh development restart

# 3. 测试通过后，重启生产环境应用新代码
./scripts/deploy.sh production restart
```

## 📋 常用命令

| 命令 | 说明 | 示例 |
|------|------|------|
| `start` | 启动环境 | `./scripts/deploy.sh production start` |
| `stop` | 停止环境 | `./scripts/deploy.sh development stop` |
| `restart` | 重启环境 | `./scripts/deploy.sh production restart` |
| `deploy` | 智能部署（运行则重启，否则启动） | `./scripts/deploy.sh production deploy` |
| `status` | 查看所有环境状态 | `./scripts/deploy.sh status` |

## 💡 典型场景

### 场景：开发新功能

```bash
# 1. 确保生产环境在运行
./scripts/deploy.sh production start

# 2. 启动开发环境
./scripts/deploy.sh development start

# 3. 修改代码...

# 4. 重启开发环境测试
./scripts/deploy.sh development restart

# 5. 测试通过，重启生产环境
./scripts/deploy.sh production restart
```

### 场景：仅更新生产环境

```bash
# 如果代码已经更新，只需要重启生产环境
./scripts/deploy.sh production restart
```

## 🔍 检查日志

```bash
# 开发环境日志
tail -f logs/backend-development.log

# 生产环境日志
tail -f logs/backend-production.log
```

## ⚠️ 注意事项

1. **端口配置**：
   - 开发环境：3001
   - 生产环境：3002

2. **代码共享**：
   - 两个环境共享同一份代码
   - 修改代码后需要重启对应环境才能生效

3. **环境配置**：
   - 开发环境配置：`env.development`
   - 生产环境配置：`env.production`

4. **数据库**：
   - 建议使用不同的数据库（开发/生产分离）
   - 当前配置在环境文件中

## 🆘 故障排查

### 端口被占用

```bash
# 检查端口占用
netstat -tlnp | grep 3001
netstat -tlnp | grep 3002

# 或使用
lsof -i:3001
lsof -i:3002
```

### 服务启动失败

```bash
# 查看日志
tail -50 logs/backend-development.log
tail -50 logs/backend-production.log
```

### 检查进程

```bash
# 查看所有 Node 进程
ps aux | grep node

# 查看环境状态
./scripts/deploy.sh status
```

---

**详细文档**: 查看 `docs/DEPLOYMENT_GUIDE.md`

