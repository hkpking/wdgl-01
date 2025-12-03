---
trigger: always_on
---

# 项目开发规范 (Project Development Principles)

## 核心理念

本规范遵循 **"高阶原则 + 实践案例"** 的结构，确保规则在任何场景下都具有指导意义。

---

## 1. 最小化变更原则 (Principle of Minimal Change)

**原则**：每次修改应精准定位到最小必要范围，避免大范围替换导致的副作用。

**指导方针**：
- 优先使用 `multi_replace_file_content` 进行多点局部修改
- 禁止使用 `// ...` 或 `// existing code` 占位符（会导致代码被删除）
- 大文件（> 200 行）必须定位到具体函数/代码块，严禁全量替换

**实践案例**：
- ❌ 错误：替换整个 `Dashboard.jsx` (456 行)，导致遗漏 `Edit2` import
- ✅ 正确：只替换 `handleFolderAction` 函数体

---

## 2. 依赖完整性原则 (Principle of Dependency Integrity)

**原则**：任何新增功能都必须保证依赖链的完整性，从 import 到函数定义再到调用链。

**指导方针**：
- 新增任何 UI 元素 → 检查相关库的 import（如 `lucide-react`）
- 新增 Hook/函数 → 检查函数定义和参数传递
- 修改现有代码 → 确认未误删依赖

**实践案例**：
- ❌ 错误：使用 `<Edit2 />` 但未从 `lucide-react` 导入
- ✅ 正确：先更新 import 列表，再使用新组件

---

## 3. 核心流程验证原则 (Principle of Critical Path Validation)

**原则**：每次修改后，必须验证受影响模块的**核心业务流程**是否正常。

**指导方针**：
- 识别模块的核心功能（通常是用户的主要操作路径）
- 修改后立即检查控制台错误（`ReferenceError`, `undefined` 等）
- 确认核心流程的入口函数和依赖未被破坏

**实践案例**：
- **Editor.jsx** 核心流程：保存 → 自动保存 → 导出
  - 验证点：`handleSave` 存在、`useEffect` 定时器正常、导出 Hook 完整
- **Dashboard.jsx** 核心流程：列表加载 → CRUD 操作 → 文件夹切换
  - 验证点：`loadData` 调用、新建/删除逻辑、文件夹筛选

---

## 4. 单一职责与组合原则 (Principle of Single Responsibility & Composition)

**原则**：组件应遵循单一职责，复杂功能通过组合实现。

**指导方针**：
- 文件超过 **300 行** → 考虑拆分
- 有重复逻辑 → 抽取通用组件/Hook
- 组件命名应清晰反映其职责

**实践案例**：
- ❌ 错误：`Dashboard.jsx` 包含文件夹树、文档列表、3 个 Modal（臃肿）
- ✅ 正确：拆分为 `FolderTree`, `DocumentList`, `ConfirmModal`

---

## 5. 自底向上构建原则 (Principle of Bottom-Up Construction)

**原则**：开发顺序应遵循 **数据层 → 组件层 → 页面层**，确保基础稳固。

**指导方针**：
1. 先设计和实现数据模型（如 `mockStorage` 方法）
2. 再开发独立组件（如 `FolderTree`）
3. 最后集成到页面（如 `Dashboard`）

**实践案例**：
- ✅ 正确顺序（目录管理功能）：
  1. `mockStorage.js` 添加 `createFolder`, `getFolders`
  2. `FolderTree.jsx` 实现树形展示
  3. `Dashboard.jsx` 集成并添加交互逻辑

---

## 6. 输出规范 (Output Standards)

**原则**：所有输出必须符合约定格式，确保沟通一致性。

**强制要求**：
- **语言**：所有回复、思考过程及任务与计划清单，均使用**中文**
- **标记**：每次回答末尾必须添加 **🛸** (UFO) 符号，证明已读取系统规则

---

## 附录：常见反模式 (Anti-Patterns)

| 反模式 | 后果 | 正确做法 |
|--------|------|----------|
| 全量替换大文件 | 遗漏依赖、破坏逻辑 | 精准定位函数级修改 |
| 盲目添加功能不检查依赖 | 运行时 `ReferenceError` | 修改前先更新 import |
| 忽略核心流程验证 | 功能静默失败 | 修改后立即测试关键路径 |
| 单文件包含过多职责 | 难以维护、易出错 | 按职责拆分组件 |
| 先做 UI 再补数据逻辑 | 频繁返工 | 自底向上构建 |

---

## 7. 接口契约同步原则 (Principle of Interface Contract Synchronization)

**原则**：修改组件或函数的调用方式（Caller）时，必须同步检查并更新其定义（Callee），反之亦然。

**指导方针**：
- **Props 变更**：在父组件传递新 Prop（如 `children`, `className`）前，必须确认子组件已声明并正确处理该 Prop。
- **参数变更**：修改函数调用参数时，必须同步更新函数定义签名。
- **返回值变更**：修改函数返回值结构时，必须检查所有调用处是否适配。

**实践案例**：
- ❌ 错误：在 `Editor.jsx` 中向 `<DocHeader>` 传递 `children`，但 `DocHeader.jsx` 未解构接收 `children`，导致内容不显示。
- ✅ 正确：先修改 `DocHeader` 定义使其接收 `children`，再在父组件中传递。
