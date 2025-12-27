# 重构版本管理策略

## 分支结构

```
main                          # 生产分支（稳定）
├── refactor/monorepo-integration  # 当前重构分支
│   ├── 每个 Phase 完成后合并到此
│   └── 重构完成后合并回 main
└── develop                   # 日常开发分支（可选）
```

## 标签策略

| 标签 | 用途 |
|:---|:---|
| `v1.0.0-lctmr-stable` | ✅ 当前稳定版本（回滚点） |
| `v2.0.0-alpha.1` | 重构 Phase 1 完成 |
| `v2.0.0-alpha.2` | 重构 Phase 2 完成 |
| `v2.0.0-beta` | 重构功能完成 |
| `v2.0.0` | 重构完全稳定 |

## 重构期间的注意事项

### 1. 保持 main 分支可部署

- 重构工作在 `refactor/monorepo-integration` 分支进行
- 紧急修复可直接在 `main` 进行，再 cherry-pick 到重构分支
- **不要**在重构完成前合并到 main

### 2. 频繁小提交

```bash
# 每个逻辑单元一个提交
git commit -m "refactor(lctmr): 迁移 LearningMap 组件到 React"
git commit -m "refactor(lctmr): 添加 BlockContent 组件"
git commit -m "test: 添加 LearningMap 单元测试"
```

### 3. 里程碑标签

```bash
# Phase 1 完成后
git tag -a v2.0.0-alpha.1 -m "Monorepo 基础设施完成"

# Phase 2 完成后
git tag -a v2.0.0-alpha.2 -m "LCTMR 核心组件迁移完成"
```

### 4. 回滚策略

如果重构出现问题：

```bash
# 回滚到稳定版本
git checkout v1.0.0-lctmr-stable

# 或者切回 main
git checkout main
```

### 5. 同步远程

```bash
# 定期推送重构进度
git push origin refactor/monorepo-integration

# 推送标签
git push origin --tags
```

## 当前状态

- ✅ 创建标签 `v1.0.0-lctmr-stable`
- ✅ 创建分支 `refactor/monorepo-integration`
- ⏳ 开始 Phase 1: Monorepo 基础设施
