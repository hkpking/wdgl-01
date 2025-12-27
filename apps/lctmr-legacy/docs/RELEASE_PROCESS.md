# 测试环境到生产环境发布流程

## 一、概述

本文档描述了从测试环境验证到生产环境部署的完整流程，包括代码发布、数据库迁移和回滚方案。

### 环境说明

- **测试环境**：
  - 端口: 3002
  - 数据库: `lctmr_development`
  - 配置文件: `env.development`
  - 用途: 功能测试、集成测试、预发布验证

- **生产环境**：
  - 端口: 3001
  - 数据库: `lctmr_production`
  - 配置文件: `env.production`
  - 用途: 正式服务、用户访问

## 二、发布前准备

### 2.1 代码准备

- [ ] 所有功能开发完成
- [ ] 代码已提交到 Git 仓库
- [ ] 代码已推送到远程仓库（Gitee）
- [ ] 测试环境已验证功能正常

### 2.2 数据库迁移准备

- [ ] 检查是否有数据库结构变更
- [ ] 准备数据库迁移脚本（如有）
- [ ] 在测试环境验证迁移脚本
- [ ] 备份生产环境数据库（重要）

### 2.3 配置文件检查

- [ ] 确认 `env.production` 配置正确
- [ ] 确认生产环境 JWT_SECRET 已设置
- [ ] 确认数据库连接信息正确
- [ ] 确认 API_URL 和 FRONTEND_URL 配置正确

## 三、测试环境验证流程

### 3.1 启动测试环境

```bash
# 进入项目目录
cd /var/www/lctmr

# 查看测试环境状态
./scripts/deploy.sh development status

# 如果未运行，启动测试环境
./scripts/deploy.sh development start

# 或重启测试环境
./scripts/deploy.sh development restart
```

### 3.2 功能测试清单

#### API 接口测试

```bash
# 健康检查
curl http://localhost:3002/health

# API 信息
curl http://localhost:3002/api

# 测试认证接口（根据需要）
# 测试学习接口
# 测试用户接口
```

#### 前端功能测试

1. 访问测试环境前端
2. 测试核心功能流程
3. 测试用户注册/登录
4. 测试学习进度保存
5. 测试对话学习功能
6. 检查错误处理和边界情况

### 3.3 性能测试（可选）

- 接口响应时间
- 并发请求处理能力
- 数据库查询性能
- 内存和 CPU 使用情况

### 3.4 数据库验证

```bash
# 检查测试数据库状态
psql -h localhost -U web_app -d lctmr_development -c "\dt"

# 检查数据完整性
# 验证关键表的数据
```

## 四、数据库迁移流程

### 4.1 迁移脚本位置

迁移脚本位于 `backend/sql/` 目录：

- `init-simple-database.sql` - 基础数据库结构
- `lctmr_complete_database.sql` - 完整数据库结构
- `init-conversation-learning.sql` - 对话学习相关表
- `migrate-from-auth-to-public.sql` - 从 auth schema 迁移
- `missing_tables_data.sql` - 缺失表数据

### 4.2 迁移步骤

#### 步骤 1: 备份生产数据库

```bash
# 备份生产数据库（重要！）
pg_dump -h localhost -U web_app -d lctmr_production > backup/lctmr_production_$(date +%Y%m%d_%H%M%S).sql

# 或使用脚本备份
./scripts/backup-database.sh production
```

#### 步骤 2: 在测试环境验证迁移

```bash
# 在测试环境执行迁移脚本（验证）
psql -h localhost -U web_app -d lctmr_development -f backend/sql/your-migration-script.sql

# 验证迁移结果
psql -h localhost -U web_app -d lctmr_development -c "\dt"
```

#### 步骤 3: 在生产环境执行迁移

```bash
# 确认迁移脚本正确后，在生产环境执行
# 建议在维护窗口期间执行

# 方法一：直接执行 SQL 文件
psql -h localhost -U web_app -d lctmr_production -f backend/sql/your-migration-script.sql

# 方法二：使用事务确保原子性
psql -h localhost -U web_app -d lctmr_production << EOF
BEGIN;
\i backend/sql/your-migration-script.sql
COMMIT;
EOF
```

#### 步骤 4: 验证迁移结果

```bash
# 检查表结构
psql -h localhost -U web_app -d lctmr_production -c "\dt"

# 检查数据完整性
# 验证关键数据是否正确迁移
```

### 4.3 迁移注意事项

- ⚠️ **始终先备份生产数据库**
- ⚠️ **先在测试环境验证迁移脚本**
- ⚠️ **在维护窗口期间执行迁移**
- ⚠️ **迁移脚本应该是幂等的（可重复执行）**
- ⚠️ **准备回滚脚本**

## 五、生产环境部署流程

### 5.1 部署前检查

```bash
# 1. 确认生产环境配置
cat env.production

# 2. 检查生产环境当前状态
./scripts/deploy.sh production status

# 3. 确认端口未被占用
netstat -tlnp | grep 3001

# 4. 检查日志目录
ls -la logs/
```

### 5.2 代码部署

#### 方法一：从 Git 拉取最新代码（推荐）

```bash
# 1. 进入项目目录
cd /var/www/lctmr

# 2. 拉取最新代码
git pull origin main

# 3. 检查变更
git log --oneline -5

# 4. 确认代码版本
git rev-parse HEAD
```

#### 方法二：本地文件直接部署

如果代码已经在服务器上：

```bash
# 确认代码已更新
cd /var/www/lctmr
git status
```

### 5.3 安装依赖（如有变更）

```bash
# 检查 package.json 是否有变更
cd backend
git diff HEAD~1 package.json

# 如有变更，更新依赖
npm install
```

### 5.4 部署服务

```bash
# 方法一：使用部署脚本（推荐）
cd /var/www/lctmr
./scripts/deploy.sh production deploy

# 方法二：手动重启
./scripts/deploy.sh production restart
```

### 5.5 部署后验证

#### 健康检查

```bash
# 检查服务健康状态
curl http://localhost:3001/health

# 检查 API 信息
curl http://localhost:3001/api
```

#### 功能验证

1. 访问生产环境前端
2. 测试核心功能
3. 检查日志是否有错误
4. 监控服务状态

#### 日志检查

```bash
# 查看最新日志
tail -f logs/backend-production.log

# 检查错误日志
grep -i error logs/backend-production.log | tail -20

# 检查启动日志
grep -i "启动\|start\|error" logs/backend-production.log | tail -20
```

## 六、完整发布流程示例

### 场景：发布新功能到生产环境

```bash
# ========== 步骤 1: 测试环境验证 ==========
cd /var/www/lctmr

# 查看测试环境状态
./scripts/deploy.sh development status

# 如果测试环境未运行，启动它
./scripts/deploy.sh development start

# 测试新功能
# ... 进行功能测试 ...

# ========== 步骤 2: 数据库迁移（如有需要）==========
# 备份生产数据库
pg_dump -h localhost -U web_app -d lctmr_production > backup/lctmr_production_$(date +%Y%m%d_%H%M%S).sql

# 在测试环境验证迁移
psql -h localhost -U web_app -d lctmr_development -f backend/sql/new-migration.sql

# 在生产环境执行迁移
psql -h localhost -U web_app -d lctmr_production -f backend/sql/new-migration.sql

# ========== 步骤 3: 代码部署 ==========
# 拉取最新代码
git pull origin main

# 检查代码版本
git log --oneline -1

# ========== 步骤 4: 生产环境部署 ==========
# 部署到生产环境
./scripts/deploy.sh production deploy

# ========== 步骤 5: 验证 ==========
# 健康检查
sleep 5
curl http://localhost:3001/health

# 检查日志
tail -20 logs/backend-production.log

# 功能验证
# ... 访问生产环境进行验证 ...
```

## 七、回滚方案

### 7.1 代码回滚

#### 方法一：使用 Git 回滚到指定版本

```bash
# 1. 查看提交历史
git log --oneline -10

# 2. 回滚到指定版本（假设要回滚到 abc1234）
git reset --hard abc1234

# 3. 重启生产服务
./scripts/deploy.sh production restart

# 4. 验证回滚结果
curl http://localhost:3001/health
```

#### 方法二：使用 Git 创建回滚提交

```bash
# 1. 查看要回滚到的版本
git log --oneline -10

# 2. 创建回滚提交（保留历史记录）
git revert HEAD

# 3. 部署回滚
./scripts/deploy.sh production deploy
```

### 7.2 数据库回滚

```bash
# 1. 找到备份文件
ls -lh backup/lctmr_production_*.sql

# 2. 恢复数据库（危险操作，请谨慎）
# 注意：这会覆盖当前数据库数据
psql -h localhost -U web_app -d lctmr_production < backup/lctmr_production_YYYYMMDD_HHMMSS.sql

# 或者使用恢复脚本（更安全的方式）
./scripts/restore-database.sh production backup/lctmr_production_YYYYMMDD_HHMMSS.sql
```

### 7.3 服务回滚

```bash
# 如果只是服务出现问题，可以尝试重启
./scripts/deploy.sh production restart

# 如果重启无效，停止服务后检查
./scripts/deploy.sh production stop
# 检查日志和配置
./scripts/deploy.sh production start
```

### 7.4 回滚检查清单

- [ ] 确认回滚版本
- [ ] 备份当前生产数据库（回滚前）
- [ ] 通知相关人员（如有必要）
- [ ] 执行代码回滚
- [ ] 执行数据库回滚（如需要）
- [ ] 重启服务
- [ ] 验证回滚结果
- [ ] 记录回滚原因和过程

## 八、紧急回滚流程

### 8.1 快速回滚步骤

```bash
# 1. 立即停止生产服务
./scripts/deploy.sh production stop

# 2. 回滚代码（快速）
git reset --hard <上一个稳定版本>

# 3. 重启服务
./scripts/deploy.sh production start

# 4. 验证
curl http://localhost:3001/health
```

### 8.2 数据库紧急回滚

```bash
# 如果数据库出现问题，立即恢复备份
# 使用最近的备份文件
psql -h localhost -U web_app -d lctmr_production < backup/lctmr_production_最新备份.sql
```

## 九、发布检查清单

### 发布前

- [ ] 代码已完成开发并通过测试
- [ ] 测试环境验证通过
- [ ] 代码已提交并推送到 Git
- [ ] 生产数据库已备份
- [ ] 配置文件已检查
- [ ] 迁移脚本已准备（如有）
- [ ] 回滚方案已准备

### 发布中

- [ ] 数据库迁移已执行（如有）
- [ ] 代码已部署
- [ ] 服务已重启
- [ ] 健康检查通过
- [ ] 日志无错误

### 发布后

- [ ] 功能验证通过
- [ ] 性能正常
- [ ] 监控告警正常
- [ ] 用户反馈正常
- [ ] 文档已更新（如有变更）

## 十、常见问题处理

### 10.1 服务启动失败

```bash
# 查看日志
tail -50 logs/backend-production.log

# 检查端口占用
netstat -tlnp | grep 3001

# 检查配置文件
cat env.production

# 检查数据库连接
psql -h localhost -U web_app -d lctmr_production -c "SELECT version();"
```

### 10.2 数据库连接失败

```bash
# 检查数据库服务状态
sudo systemctl status postgresql

# 检查数据库配置
cat env.production | grep DB_

# 测试数据库连接
psql -h localhost -U web_app -d lctmr_production
```

### 10.3 端口被占用

```bash
# 查找占用端口的进程
lsof -i :3001
# 或
netstat -tlnp | grep 3001

# 停止占用端口的进程
kill <PID>
```

## 十一、最佳实践

1. **版本管理**
   - 使用 Git 标签标记发布版本
   - 记录每次发布的版本号和变更内容

2. **数据库迁移**
   - 迁移脚本应该是幂等的
   - 总是先备份再迁移
   - 准备回滚脚本

3. **部署时间**
   - 选择低峰期部署
   - 提前通知用户（如有必要）

4. **监控和告警**
   - 部署后密切关注监控指标
   - 设置告警规则

5. **文档记录**
   - 记录每次发布的变更
   - 记录遇到的问题和解决方案

## 十二、发布命令快速参考

```bash
# 查看环境状态
./scripts/deploy.sh [development|production] status

# 启动环境
./scripts/deploy.sh [development|production] start

# 停止环境
./scripts/deploy.sh [development|production] stop

# 重启环境
./scripts/deploy.sh [development|production] restart

# 部署（启动或重启）
./scripts/deploy.sh [development|production] deploy

# 查看帮助
./scripts/deploy.sh help
```

## 附录：版本发布示例

### 发布版本 1.2.7

```bash
# 1. 测试环境验证
./scripts/deploy.sh development restart
# ... 测试功能 ...

# 2. 更新版本号
cd backend
npm version patch  # 从 1.2.6 升级到 1.2.7

# 3. 提交版本变更
git add backend/package.json
git commit -m "chore: bump version to 1.2.7"
git push origin main

# 4. 创建 Git 标签
git tag -a v1.2.7 -m "Release version 1.2.7"
git push origin v1.2.7

# 5. 备份生产数据库
pg_dump -h localhost -U web_app -d lctmr_production > backup/lctmr_production_$(date +%Y%m%d_%H%M%S).sql

# 6. 部署到生产
cd /var/www/lctmr
git pull origin main
./scripts/deploy.sh production deploy

# 7. 验证
curl http://localhost:3001/health
```



