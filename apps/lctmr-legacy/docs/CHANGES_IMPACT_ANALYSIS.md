# 本次改动影响分析

## 📋 改动摘要

本次改动主要涉及：
1. 环境配置调整（端口、数据库）
2. 前端配置更新（支持IP访问）
3. **后端注册逻辑修改**（`backend/routes/auth.js`）

## ⚠️ 关键改动：后端注册逻辑

### 修改内容

**文件**: `backend/routes/auth.js`

**修改前**:
```javascript
// 手动创建scores和user_progress记录
await client.query('INSERT INTO public.scores ...');
await client.query('INSERT INTO public.user_progress ...');
```

**修改后**:
```javascript
// 依赖触发器自动创建（触发器 handle_new_user 会自动创建）
// 只更新profile的full_name
```

### 影响分析

#### ✅ 不会影响生产环境的情况

如果生产环境数据库**也有相同的触发器** `handle_new_user`，那么：
- ✅ 修改后的代码可以在生产环境正常工作
- ✅ 触发器会自动创建 profiles、scores、user_progress
- ✅ 不会产生冲突

#### ⚠️ 可能影响生产环境的情况

如果生产环境数据库**没有触发器**或触发器不同：
- ❌ 新用户注册时不会自动创建 scores 和 user_progress
- ❌ 可能导致功能异常

## 🔍 需要验证

### 1. 检查生产环境触发器

```bash
# 检查生产环境是否有 handle_new_user 触发器
PGPASSWORD='xxx' psql -h localhost -U web_app -d lctmr_production -c "
SELECT tgname, proname 
FROM pg_trigger t
JOIN pg_proc p ON t.tgfoid = p.oid
WHERE tgname = 'on_auth_user_created';"
```

### 2. 测试生产环境注册功能

在部署到生产环境前，建议：
1. 在生产环境测试用户注册
2. 验证新用户是否有 scores 和 user_progress 记录

## 💡 建议

### 方案 A：确认触发器存在（推荐）

如果生产环境有相同的触发器，直接重启生产环境即可：
```bash
./scripts/deploy.sh production restart
```

### 方案 B：如果没有触发器，需要回滚或修复

#### 选项 1：回滚代码改动
```bash
git checkout HEAD -- backend/routes/auth.js
./scripts/deploy.sh production restart
```

#### 选项 2：在生产环境创建触发器
```sql
-- 在生产环境执行，创建相同的触发器
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, role, full_name)
    VALUES (NEW.id, 'user', NULL);
    
    INSERT INTO public.scores (user_id, username, points)
    VALUES (NEW.id, NEW.email, 0);
    
    INSERT INTO public.user_progress (user_id)
    VALUES (NEW.id);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION handle_new_user();
```

## 📊 改动文件清单

| 文件 | 影响范围 | 是否影响生产环境 |
|------|---------|----------------|
| `env.production` | 端口、数据库配置 | ✅ 会（需要重启） |
| `env.development` | 端口、数据库配置 | ❌ 不会 |
| `config.js` | 前端环境检测 | ✅ 会（前端代码） |
| `local-config.js` | 本地开发配置 | ❌ 不会 |
| `backend/routes/auth.js` | **注册逻辑** | ⚠️ **可能影响** |
| `backend/server.js` | dotenv加载方式 | ✅ 会（但向后兼容） |
| `scripts/deploy.sh` | 部署脚本 | ❌ 不会 |

## 🎯 推荐操作流程

1. **验证生产环境触发器**
   ```bash
   # 检查是否有触发器
   ```

2. **如果触发器存在** → 直接重启生产环境
   ```bash
   ./scripts/deploy.sh production restart
   ```

3. **如果触发器不存在** → 
   - 先创建触发器（方案B选项2）
   - 或回滚代码改动（方案B选项1）
   - 然后重启生产环境

4. **测试生产环境**
   - 测试用户注册功能
   - 验证新用户数据完整性

---

**最后更新**: 2025-11-03


