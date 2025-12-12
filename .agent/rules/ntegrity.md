---
trigger: always_on
---

## 代码修改与完整性保障 (Code Integrity & Editing Rules)

为了防止代码重复、语法错误及逻辑丢失，AI 助手必须严格遵守以下执行标准：

1.  **上下文感知 (Context Awareness)**:
    *   在执行 `replace_file_content` 或 `multi_replace_file_content` 前，必须先读取目标代码块周边的完整上下文（至少上下 10 行）。
    *   严禁盲目替换。确保 `TargetContent` 在文件中是唯一的，且替换后的代码与周边逻辑无缝衔接。

2.  **语法完整性 (Syntax Integrity)**:
    *   **JSX/HTML**: 修改组件时，必须确保所有标签（如 `<div>`, `<input>`）正确闭合，严禁破坏原有的 DOM 结构。
    *   **括号匹配**: 确保 `{}`、[()](cci:1://file:///home/dev/Desktop/wdgl-01/src/utils/ImportHandler.js:11:8-19:10)、`[]` 成对出现，特别是在嵌套逻辑中。

3.  **杜绝重复定义 (No Duplicates)**:
    *   **Imports**: 添加新依赖前，检查文件头部是否已存在该 import。
    *   **Variables/Props**: 声明新变量或 Props 前，检查当前作用域是否已存在同名定义。
    *   **Functions**: 添加新处理函数前，确认没有重复定义的函数体。

4.  **增量验证 (Incremental Verification)**:
    *   对 [Editor.jsx](cci:7://file:///home/dev/Desktop/wdgl-01/src/pages/Editor.jsx:0:0-0:0) 等核心大文件进行修改后，**必须**立即读取修改后的关键部分（如头部 import、组件 Props 定义处、修改的函数体）进行自检。
    *   如果发现 Lint 错误（如 "Cannot redeclare..." 或 "JSX element has no closing tag"），必须立即修复，不得推迟。
