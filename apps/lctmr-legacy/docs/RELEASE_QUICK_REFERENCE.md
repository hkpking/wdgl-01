# 发布流程快速参考

## 标准发布流程（5步）

```bash
# 步骤 1: 测试环境验证
./scripts/deploy.sh development restart
# 进行功能测试...

# 步骤 2: 备份生产数据库（重要！）
pg_dump -h localhost -U web_app -d lctmr_production > backup/lctmr_production_$(date +%Y%m%d_%H%M%S).sql

# 步骤 3: 拉取最新代码
git pull origin main

# 步骤 4: 部署到生产
./scripts/deploy.sh production deploy

# 步骤 5: 验证
curl http://localhost:3001/health
tail -20 logs/backend-production.log
```

## 快速回滚

```bash
# 回滚代码
git reset --hard <上一个稳定版本>
./scripts/deploy.sh production restart

# 回滚数据库（谨慎使用）
psql -h localhost -U web_app -d lctmr_production < backup/lctmr_production_最新备份.sql
```

## 常用命令

```bash
# 查看所有环境状态
./scripts/deploy.sh status

# 测试环境操作
./scripts/deploy.sh development [start|stop|restart|deploy]

# 生产环境操作
./scripts/deploy.sh production [start|stop|restart|deploy]

# 查看日志
tail -f logs/backend-development.log
tail -f logs/backend-production.log
```



