/**
 * 文档服务类型定义
 * 为 documentService.js 提供类型支持，并为迁移到 TypeScript 做准备
 */

// ============================================
// 基础类型
// ============================================

/** 文档状态 */
export type DocumentStatus = 'draft' | 'published' | 'archived';

/** 文档内容类型 */
export type DocumentContentType = 'html' | 'markdown' | 'json';

// ============================================
// 个人文档类型（documents 表）
// ============================================

/** 个人文档（前端格式） */
export interface Document {
    id: string;
    title: string;
    content: string;
    status: DocumentStatus;
    folderId: string | null;
    knowledgeBaseId?: string | null;
    teamId?: string | null;
    createdAt: string;
    updatedAt: string;
}

/** 文档创建/更新输入 */
export interface DocumentInput {
    title: string;
    content: string;
    status?: DocumentStatus;
    contentType?: DocumentContentType;
    folderId?: string | null;
    knowledgeBaseId?: string | null;
    teamId?: string | null;
}

// ============================================
// 数据库行类型（snake_case）
// ============================================

/** 数据库文档行 */
export interface DocumentRow {
    id: string;
    user_id: string;
    title: string;
    content: string;
    status: DocumentStatus;
    content_type?: DocumentContentType;
    folder_id: string | null;
    knowledge_base_id: string | null;
    team_id: string | null;
    created_at: string;
    updated_at: string;
}

// ============================================
// 文件夹类型
// ============================================

export interface Folder {
    id: string;
    name: string;
    parentId: string | null;
    createdAt: string;
}

export interface FolderRow {
    id: string;
    user_id: string;
    name: string;
    parent_id: string | null;
    created_at: string;
}

// ============================================
// 工具类型
// ============================================

/** 字段映射工具类型 */
export type SnakeToCamel<S extends string> =
    S extends `${infer T}_${infer U}`
    ? `${T}${Capitalize<SnakeToCamel<U>>}`
    : S;

/** 将数据库行转换为前端对象 */
export function transformDocument(row: DocumentRow): Document {
    return {
        id: row.id,
        title: row.title,
        content: row.content,
        status: row.status,
        folderId: row.folder_id,
        knowledgeBaseId: row.knowledge_base_id,
        teamId: row.team_id,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

/** 将前端对象转换为数据库行（部分字段） */
export function toDocumentRow(doc: DocumentInput, userId: string): Partial<DocumentRow> {
    return {
        user_id: userId,
        title: doc.title,
        content: doc.content,
        status: doc.status || 'draft',
        content_type: doc.contentType,
        folder_id: doc.folderId || null,
        knowledge_base_id: doc.knowledgeBaseId || null,
        team_id: doc.teamId || null,
    };
}
