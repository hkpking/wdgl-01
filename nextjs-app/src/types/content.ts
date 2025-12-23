/**
 * 统一内容类型定义
 * 对应数据库视图 all_content_items
 */

export type ContentType = 'document' | 'spreadsheet';

export interface ContentItem {
    id: string;
    type: ContentType;
    title: string;
    folderId: string | null;
    teamId: string | null;
    knowledgeBaseId: string | null;
    userId: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

/**
 * 从数据库行转换为前端类型
 */
export function transformContentItem(row: any): ContentItem {
    return {
        id: row.id,
        type: row.type,
        title: row.title,
        folderId: row.folder_id,
        teamId: row.team_id,
        knowledgeBaseId: row.knowledge_base_id,
        userId: row.user_id,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}
