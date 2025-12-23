/**
 * 通用评论服务
 * 支持文档、表格、PDF等多种内容类型的评论功能
 */
import { supabase } from './supabase';

// ============================================
// 类型定义
// ============================================

export type CommentTargetType = 'document' | 'spreadsheet' | 'pdf';

export interface CommentTarget {
    type: CommentTargetType;
    id: string;
}

export interface CommentRange {
    // 通用：引用的文本
    quote?: string;
    // 文档：字符位置
    startOffset?: number;
    endOffset?: number;
    // 表格：单元格位置
    cellRow?: number;
    cellCol?: number;
    // PDF：页码和位置
    pageNumber?: number;
    positionX?: number;
    positionY?: number;
}

export interface CommentAuthor {
    uid: string;
    name: string;
    avatar?: string;
}

export interface CommentReply {
    id: string;
    content: string;
    author: CommentAuthor;
    createdAt: string;
    mentions?: string[];
}

export interface Comment {
    id: string;
    targetType: CommentTargetType;
    targetId: string;
    content: string;
    author: CommentAuthor;
    status: 'open' | 'resolved';
    range?: CommentRange;
    replies: CommentReply[];
    mentions?: string[];
    createdAt: string;
    updatedAt: string;
}

// ============================================
// 评论 CRUD 操作
// ============================================

/**
 * 添加评论
 */
export async function addComment(
    userId: string,
    target: CommentTarget,
    content: string,
    author: CommentAuthor,
    range?: CommentRange,
    mentions?: string[]
): Promise<Comment | null> {
    try {
        const { data, error } = await supabase
            .from('comments')
            .insert({
                target_type: target.type,
                target_id: target.id,
                user_id: userId,
                content,
                author_uid: author.uid,
                author_name: author.name,
                author_avatar: author.avatar,
                status: 'open',
                quote: range?.quote,
                start_offset: range?.startOffset,
                end_offset: range?.endOffset,
                cell_row: range?.cellRow,
                cell_col: range?.cellCol,
                page_number: range?.pageNumber,
                position_x: range?.positionX,
                position_y: range?.positionY,
                mentions: mentions || [],
                replies: []
            })
            .select()
            .single();

        if (error) {
            console.error('添加评论失败:', error);
            return null;
        }

        return mapDbToComment(data);
    } catch (error) {
        console.error('添加评论失败:', error);
        return null;
    }
}

/**
 * 获取目标的所有评论
 */
export async function getComments(target: CommentTarget): Promise<Comment[]> {
    try {
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('target_type', target.type)
            .eq('target_id', target.id)
            .order('created_at', { ascending: true });

        if (error) {
            console.error('获取评论失败:', error);
            return [];
        }

        return (data || []).map(mapDbToComment);
    } catch (error) {
        console.error('获取评论失败:', error);
        return [];
    }
}

/**
 * 回复评论
 */
export async function replyToComment(
    commentId: string,
    content: string,
    author: CommentAuthor,
    mentions?: string[]
): Promise<CommentReply | null> {
    try {
        // 先获取现有评论
        const { data: comment, error: fetchError } = await supabase
            .from('comments')
            .select('replies')
            .eq('id', commentId)
            .single();

        if (fetchError || !comment) {
            console.error('获取评论失败:', fetchError);
            return null;
        }

        const newReply: CommentReply = {
            id: `reply_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            content,
            author,
            createdAt: new Date().toISOString(),
            mentions
        };

        const updatedReplies = [...(comment.replies || []), newReply];

        const { error: updateError } = await supabase
            .from('comments')
            .update({ replies: updatedReplies, updated_at: new Date().toISOString() })
            .eq('id', commentId);

        if (updateError) {
            console.error('添加回复失败:', updateError);
            return null;
        }

        return newReply;
    } catch (error) {
        console.error('添加回复失败:', error);
        return null;
    }
}

/**
 * 更新评论状态
 */
export async function updateCommentStatus(
    commentId: string,
    status: 'open' | 'resolved'
): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('comments')
            .update({ status, updated_at: new Date().toISOString() })
            .eq('id', commentId);

        if (error) {
            console.error('更新评论状态失败:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('更新评论状态失败:', error);
        return false;
    }
}

/**
 * 删除评论
 */
export async function deleteComment(commentId: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('comments')
            .delete()
            .eq('id', commentId);

        if (error) {
            console.error('删除评论失败:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('删除评论失败:', error);
        return false;
    }
}

// ============================================
// 辅助函数
// ============================================

/**
 * 将数据库记录映射为 Comment 对象
 */
function mapDbToComment(row: any): Comment {
    return {
        id: row.id,
        targetType: row.target_type,
        targetId: row.target_id,
        content: row.content,
        author: {
            uid: row.author_uid,
            name: row.author_name,
            avatar: row.author_avatar
        },
        status: row.status,
        range: {
            quote: row.quote,
            startOffset: row.start_offset,
            endOffset: row.end_offset,
            cellRow: row.cell_row,
            cellCol: row.cell_col,
            pageNumber: row.page_number,
            positionX: row.position_x,
            positionY: row.position_y
        },
        replies: row.replies || [],
        mentions: row.mentions || [],
        createdAt: row.created_at,
        updatedAt: row.updated_at
    };
}

// ============================================
// 兼容旧 API（过渡期使用）
// ============================================

/**
 * 兼容旧的文档评论 API
 * @deprecated 请使用 addComment(userId, { type: 'document', id: docId }, ...)
 */
export async function addDocumentComment(
    userId: string,
    docId: string,
    commentData: {
        quote?: string;
        content: string;
        author: CommentAuthor;
        from?: number;
        to?: number;
    }
): Promise<Comment | null> {
    return addComment(
        userId,
        { type: 'document', id: docId },
        commentData.content,
        commentData.author,
        {
            quote: commentData.quote,
            startOffset: commentData.from,
            endOffset: commentData.to
        }
    );
}

/**
 * 兼容旧的获取文档评论 API
 * @deprecated 请使用 getComments({ type: 'document', id: docId })
 */
export async function getDocumentComments(docId: string): Promise<Comment[]> {
    return getComments({ type: 'document', id: docId });
}
