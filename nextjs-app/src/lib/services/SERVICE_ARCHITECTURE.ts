/**
 * 服务层架构规范
 * ================
 * 
 * 本文档定义各服务的职责边界和使用规范。
 * 
 * 核心原则：
 * 1. 每个数据表只由一个服务管理
 * 2. 服务使用 TypeScript 编写
 * 3. 字段命名使用 camelCase（前端）/ snake_case（数据库）
 * 4. 【新增】文档统一存储在 documents 表，通过 knowledge_base_id 区分归属
 */

// ============================================
// 服务职责划分
// ============================================

/**
 * teamService.ts
 * 职责：团队管理
 * 数据表：teams, team_members
 * 
 * 功能：
 * - getTeam / getTeams / getVisibleTeams
 * - createTeam / updateTeam / deleteTeam
 * - getTeamMembers / addTeamMember / removeTeamMember
 * - getUserRoleInTeam
 */

/**
 * kbService.ts
 * 职责：知识库及文件夹管理（不再管理文档）
 * 数据表：knowledge_bases, kb_folders
 * 
 * 功能：
 * - 知识库：getKnowledgeBase / getKnowledgeBases / createKnowledgeBase...
 * - 文件夹：getKBFolders / createKBFolder / updateKBFolder...
 * 
 * ⚠️ 已废弃函数：
 * - getKBDocuments → 使用 documentService.getKBDocuments
 * - getKBDocument → 使用 documentService.getKBDocument
 * - createKBDocument → 使用 documentService.saveDocument
 * - updateKBDocument → 使用 documentService.saveDocument
 * - deleteKBDocument → 使用 documentService.deleteDocument
 */

/**
 * documentService.ts
 * 职责：所有文档管理（个人文档 + 知识库文档）
 * 数据表：documents (统一存储)
 * 
 * 区分方式：
 * - 个人文档：knowledge_base_id IS NULL
 * - 知识库文档：knowledge_base_id IS NOT NULL
 * 
 * 功能：
 * - getAllDocuments（个人文档）
 * - getKBDocuments（知识库文档） ← 推荐
 * - getDocument / saveDocument / deleteDocument
 * - 版本历史相关
 * - 评论相关
 */

/**
 * spreadsheetService.ts
 * 职责：表格管理
 * 数据表：spreadsheets
 * 
 * 功能：
 * - getSpreadsheet / listSpreadsheets
 * - createSpreadsheet / updateSpreadsheet / saveSpreadsheet / deleteSpreadsheet
 * - moveSpreadsheet
 */

/**
 * departmentService.ts
 * 职责：部门管理
 * 数据表：departments, department_members
 */

// ============================================
// 字段命名规范
// ============================================

/**
 * 数据库字段（snake_case）→ 前端字段（camelCase）映射：
 * 
 * | 数据库          | 前端            |
 * |-----------------|-----------------|
 * | user_id         | userId          |
 * | author_id       | authorId        |
 * | team_id         | teamId          |
 * | folder_id       | folderId        |
 * | parent_id       | parentId        |
 * | knowledge_base_id | knowledgeBaseId |
 * | created_at      | createdAt       |
 * | updated_at      | updatedAt       |
 */

// ============================================
// 前端架构规范（主从视图模式）
// ============================================

/**
 * 单一数据源原则：
 * - 列表数据：从数据库加载，存储在父组件
 * - 编辑数据：子组件（EditorModule）自己加载完整数据
 * - 状态同步：通过回调函数（onSaveSuccess, onDirtyChange）
 * 
 * 组件职责：
 * - Page：URL 路由 + 布局组合（< 200 行）
 * - Container：状态管理 + 数据获取（< 300 行）
 * - Module：自治功能单元（< 500 行）
 * - Component：纯 UI 展示（< 100 行）
 */

export { };
