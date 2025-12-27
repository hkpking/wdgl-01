/**
 * Supabase API 服务层
 * 提供与 mockStorage 相同的接口，实现后端数据持久化
 */
import { supabase } from '../supabase';
import type {
    Document, DocumentInput, DocumentStatus,
    Folder, FolderRow
} from './documentService.types';
import type {
    User,
    Comment,
    CommentReply,
    DocumentVersion,
    StorageInfo
} from '@/types/storage';
import type { AuthChangeEvent, Session } from '@supabase/supabase-js';

// ============================================
// 类型定义
// ============================================

/** 数据库文档行类型 */
interface DbDocumentRow {
    id: string;
    user_id: string;
    title: string;
    content: string;
    status: string;
    folder_id: string | null;
    knowledge_base_id: string | null;
    team_id: string | null;
    created_at: string;
    updated_at: string;
}

/** 数据库文件夹行类型 */
interface DbFolderRow {
    id: string;
    user_id: string;
    name: string;
    parent_id: string | null;
    created_at: string;
}

/** 数据库版本行类型 */
interface DbVersionRow {
    id: string;
    document_id: string;
    user_id: string;
    title: string;
    content: string;
    name: string | null;
    created_at: string;
}

/** 评论状态类型 */
type CommentStatus = 'open' | 'resolved';

/** 数据库评论行类型 */
interface DbCommentRow {
    id: string;
    document_id: string;
    parent_id: string | null;
    content: string;
    quote: string | null;
    status: CommentStatus;
    author_id: string;
    author_name: string;
    created_at: string;
}









// ============================================
// 工具函数
// ============================================

/**
 * 获取当前用户 ID
 */
const getCurrentUserId = async (): Promise<string | undefined> => {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id;
};

// ============================================
// 文档操作
// ============================================

/**
 * 获取用户所有个人文档（不包含知识库文档）
 */
export async function getAllDocuments(userId: string): Promise<Document[]> {
    const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', userId)
        .is('knowledge_base_id', null)  // 只获取个人文档
        .order('updated_at', { ascending: false });

    if (error) {
        console.error('获取文档列表失败:', error);
        return [];
    }

    // 转换为兼容格式
    return data.map((doc: DbDocumentRow) => ({
        id: doc.id,
        title: doc.title,
        content: doc.content,
        status: doc.status as DocumentStatus,
        folderId: doc.folder_id,
        knowledgeBaseId: doc.knowledge_base_id,
        teamId: doc.team_id,
        createdAt: doc.created_at,
        updatedAt: doc.updated_at,
    }));
}

/**
 * 获取知识库文档列表
 * 统一使用 documents 表，通过 knowledge_base_id 过滤
 */
export async function getKBDocuments(knowledgeBaseId: string): Promise<Document[]> {
    const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('knowledge_base_id', knowledgeBaseId)
        .order('updated_at', { ascending: false });

    if (error) {
        console.error('获取知识库文档失败:', error);
        return [];
    }

    return data.map(doc => ({
        id: doc.id,
        title: doc.title,
        content: doc.content,
        status: doc.status,
        folderId: doc.folder_id,
        knowledgeBaseId: doc.knowledge_base_id,
        teamId: doc.team_id,
        createdAt: doc.created_at,
        updatedAt: doc.updated_at,
    }));
}

/**
 * 获取单个文档
 */
export async function getDocument(userId: string, docId: string): Promise<Document | null> {
    const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', docId)
        .eq('user_id', userId)
        .single();

    if (error) {
        console.error('获取文档失败:', error);
        return null;
    }

    return {
        id: data.id,
        title: data.title,
        content: data.content,
        status: data.status,
        folderId: data.folder_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
    };
}

/**
 * 获取知识库文档详情
 * 统一使用 documents 表
 */
export async function getKBDocument(docId: string): Promise<Document | null> {
    const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', docId)
        .maybeSingle();

    if (error) {
        console.error('获取知识库文档失败:', error);
        return null;
    }

    // 如果没有找到文档
    if (!data) {
        console.warn('文档不存在:', docId);
        return null;
    }

    return {
        id: data.id,
        title: data.title,
        content: data.content,
        status: data.status,
        folderId: data.folder_id,
        metadata: data.metadata,
        knowledgeBaseId: data.knowledge_base_id,
        teamId: data.team_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
    };
}

/**
 * 保存文档 (创建或更新)
 */
export async function saveDocument(userId: string, docId: string | null, docData: Partial<DocumentInput>): Promise<Document | null> {
    // 构建 payload，只包含已定义的字段 (Partial Update)
    const payload: Record<string, unknown> = {
        user_id: userId,
        updated_at: new Date().toISOString(),
    };

    if (docData.title !== undefined) payload.title = docData.title;
    if (docData.content !== undefined) payload.content = docData.content;
    if (docData.status !== undefined) payload.status = docData.status; // 不要默认 'draft'，防止覆盖
    if (docData.folderId !== undefined) payload.folder_id = docData.folderId; // 支持 null (移出文件夹)
    if (docData.knowledgeBaseId !== undefined) payload.knowledge_base_id = docData.knowledgeBaseId;
    if (docData.teamId !== undefined) payload.team_id = docData.teamId;
    if (docData.contentType !== undefined) payload.content_type = docData.contentType; // 流程图等特殊类型
    if (docData.metadata !== undefined) payload.metadata = docData.metadata; // 流程图预览图等元数据

    // 如果是创建且没有 status，则默认为 draft
    if (!docId && !payload.status) {
        payload.status = 'draft';
    }

    let result;

    if (docId) {
        // 更新
        const { data, error } = await supabase
            .from('documents')
            .update(payload)
            .eq('id', docId)
            .eq('user_id', userId)
            .select()
            .single();

        if (error) {
            console.error('更新文档失败:', error);
            return null;
        }
        result = data;
    } else {
        // 创建
        const { data, error } = await supabase
            .from('documents')
            .insert(payload)
            .select()
            .single();

        if (error) {
            console.error('创建文档失败:', error);
            return null;
        }
        result = data;
    }

    // 异步生成 embedding (不阻塞保存返回)
    // 只有当有内容时才生成
    if (docData.content?.trim()) {
        // 提取纯文本以减小 payload (去除 HTML 标签和 base64 图片)
        const plainText = docData.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

        // 确保使用正确的标题：检查是否为有效的非空字符串
        // 优先级：docData.title > result.title > 默认值
        const docTitle = (docData.title && docData.title.trim())
            ? docData.title.trim()
            : (result.title && result.title.trim())
                ? result.title.trim()
                : '无标题文档';

        console.log(`[AutoEmbedding] Title debug: docData.title="${docData.title}", result.title="${result.title}", final="${docTitle}"`);

        if (plainText) {
            // 带重试机制的 embedding 生成
            const generateEmbeddingWithRetry = async (retries = 3, delay = 2000) => {
                for (let attempt = 1; attempt <= retries; attempt++) {
                    try {
                        console.log(`[AutoEmbedding] Attempt ${attempt}/${retries} for doc: ${docTitle} (${plainText.length} chars)`);

                        const response = await fetch('/api/embeddings', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                documentId: result.id,
                                userId,
                                content: plainText,
                                title: docTitle
                            })
                        });

                        if (response.ok) {
                            const resData = await response.json();
                            console.log(`[AutoEmbedding] ✅ Success: ${resData.chunksCreated} chunks created`);
                            return resData;
                        }

                        // 非成功响应
                        const errorText = await response.text();
                        console.error(`[AutoEmbedding] ❌ Attempt ${attempt} failed: ${response.status} - ${errorText}`);

                        if (attempt < retries) {
                            console.log(`[AutoEmbedding] Retrying in ${delay / 1000}s...`);
                            await new Promise(r => setTimeout(r, delay));
                        }
                    } catch (err) {
                        console.error(`[AutoEmbedding] ❌ Attempt ${attempt} error:`, err);
                        if (attempt < retries) {
                            await new Promise(r => setTimeout(r, delay));
                        }
                    }
                }
                console.error('[AutoEmbedding] ❌ All retries failed for doc:', result.id);
                return null;
            };

            // 异步执行，不阻塞主流程
            generateEmbeddingWithRetry();
        }
    }


    return {
        id: result.id,
        title: result.title,
        content: result.content,
        status: result.status,
        folderId: result.folder_id,
        knowledgeBaseId: result.knowledge_base_id,
        teamId: result.team_id,
        createdAt: result.created_at,
        updatedAt: result.updated_at,
    };
}

/**
 * 删除文档
 */
export async function deleteDocument(userId: string, docId: string): Promise<boolean> {
    const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', docId)
        .eq('user_id', userId);

    if (error) {
        console.error('删除文档失败:', error);
        return false;
    }
    return true;
}

// ============================================
// 版本历史
// ============================================

/**
 * 保存版本
 */
export async function saveVersion(userId: string, docId: string, versionData: { title: string; content: string; name?: string }): Promise<DocumentVersion | null> {
    const { data, error } = await supabase
        .from('versions')
        .insert({
            document_id: docId,
            title: versionData.title,
            content: versionData.content,
            name: versionData.name || null,
            user_id: userId,
        })
        .select()
        .single();

    if (error) {
        console.error('保存版本失败:', error);
        return null;
    }

    return {
        id: data.id,
        documentId: data.document_id,
        title: data.title,
        content: data.content,
        name: data.name,
        savedAt: data.created_at,
    };
}

/**
 * 获取版本历史
 */
export async function getVersions(userId: string, docId: string): Promise<DocumentVersion[]> {
    const { data, error } = await supabase
        .from('versions')
        .select('*')
        .eq('document_id', docId)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('获取版本历史失败:', error);
        return [];
    }

    return data.map(v => ({
        id: v.id,
        documentId: v.document_id,
        title: v.title,
        content: v.content,
        name: v.name,
        savedAt: v.created_at,
    }));
}

/**
 * 更新版本信息
 */
export async function updateVersion(userId: string, docId: string, versionId: string, updates: { name: string }): Promise<{ id: string; name: string } | null> {
    const { data, error } = await supabase
        .from('versions')
        .update({ name: updates.name })
        .eq('id', versionId)
        .eq('user_id', userId)
        .select()
        .single();

    if (error) {
        console.error('更新版本失败:', error);
        return null;
    }

    return {
        id: data.id,
        name: data.name,
    };
}

// ============================================
// 文件夹操作
// ============================================

/**
 * 获取所有文件夹
 */
export async function getFolders(userId: string): Promise<Folder[]> {
    const { data, error } = await supabase
        .from('folders')
        .select('*')
        .eq('user_id', userId)
        .order('name');

    if (error) {
        console.error('获取文件夹失败:', error);
        return [];
    }

    return data.map(f => ({
        id: f.id,
        name: f.name,
        parentId: f.parent_id,
        createdAt: f.created_at,
    }));
}

/**
 * 创建文件夹
 */
export async function createFolder(userId: string, name: string, parentId: string | null = null): Promise<Folder | null> {
    const { data, error } = await supabase
        .from('folders')
        .insert({
            name,
            parent_id: parentId,
            user_id: userId,
        })
        .select()
        .single();

    if (error) {
        console.error('创建文件夹失败:', error);
        return null;
    }

    return {
        id: data.id,
        name: data.name,
        parentId: data.parent_id,
        createdAt: data.created_at,
    };
}

/**
 * 更新文件夹
 */
export async function updateFolder(userId: string, folderId: string, updates: { name?: string; parentId?: string | null }): Promise<Folder | null> {
    const { data, error } = await supabase
        .from('folders')
        .update({
            name: updates.name,
            parent_id: updates.parentId,
        })
        .eq('id', folderId)
        .eq('user_id', userId)
        .select()
        .single();

    if (error) {
        console.error('更新文件夹失败:', error);
        return null;
    }

    return {
        id: data.id,
        name: data.name,
        parentId: data.parent_id,
        createdAt: data.created_at,
    };
}

/**
 * 删除文件夹
 */
export async function deleteFolder(userId: string, folderId: string): Promise<boolean> {
    // 先将文件夹内的文档移动到根目录
    await supabase
        .from('documents')
        .update({ folder_id: null })
        .eq('folder_id', folderId)
        .eq('user_id', userId);

    const { error } = await supabase
        .from('folders')
        .delete()
        .eq('id', folderId)
        .eq('user_id', userId);

    if (error) {
        console.error('删除文件夹失败:', error);
        return false;
    }
    return true;
}

/**
 * 移动文档到文件夹
 */
export async function moveDocument(userId: string, docId: string, folderId: string | null): Promise<{ id: string; folderId: string | null } | null> {
    const { data, error } = await supabase
        .from('documents')
        .update({ folder_id: folderId })
        .eq('id', docId)
        .eq('user_id', userId)
        .select()
        .single();

    if (error) {
        console.error('移动文档失败:', error);
        return null;
    }

    return {
        id: data.id,
        folderId: data.folder_id,
    };
}

// ============================================
// 评论系统
// ============================================

/**
 * 获取文档评论
 */
export async function getComments(userId: string, docId: string): Promise<Comment[]> {
    const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('document_id', docId)
        .is('parent_id', null) // 只获取顶级评论
        .order('created_at', { ascending: true });

    if (error) {
        console.error('获取评论失败:', error);
        return [];
    }

    // 获取所有回复
    const commentIds = data.map(c => c.id);
    const { data: replies } = await supabase
        .from('comments')
        .select('*')
        .in('parent_id', commentIds)
        .order('created_at', { ascending: true });

    // 组装评论树
    return data.map((comment: DbCommentRow) => ({
        id: comment.id,
        docId: comment.document_id,
        content: comment.content,
        quote: comment.quote,
        status: comment.status,
        author: {
            uid: comment.author_id,
            name: comment.author_name,
        },
        createdAt: comment.created_at,
        replies: (replies || [])
            .filter((r: DbCommentRow) => r.parent_id === comment.id)
            .map((r: DbCommentRow) => ({
                id: r.id,
                content: r.content,
                author: {
                    uid: r.author_id,
                    name: r.author_name,
                },
                createdAt: r.created_at,
            })),
    }));
}

/**
 * 添加评论
 */
export async function addComment(userId: string, docId: string, commentData: { content: string; quote?: string; author?: { name: string } }): Promise<Comment | null> {
    const { data, error } = await supabase
        .from('comments')
        .insert({
            document_id: docId,
            content: commentData.content,
            quote: commentData.quote || null,
            author_id: userId,
            author_name: commentData.author?.name || 'Anonymous',
        })
        .select()
        .single();

    if (error) {
        console.error('添加评论失败:', error);
        return null;
    }

    return {
        id: data.id,
        docId: data.document_id,
        content: data.content,
        quote: data.quote,
        status: data.status,
        author: {
            uid: data.author_id,
            name: data.author_name,
        },
        createdAt: data.created_at,
        replies: [],
    };
}

/**
 * 添加回复
 */
export async function addReply(userId: string, docId: string, commentId: string, replyData: { content: string; author?: { name: string } }): Promise<CommentReply | null> {
    const { data, error } = await supabase
        .from('comments')
        .insert({
            document_id: docId,
            parent_id: commentId,
            content: replyData.content,
            author_id: userId,
            author_name: replyData.author?.name || 'Anonymous',
        })
        .select()
        .single();

    if (error) {
        console.error('添加回复失败:', error);
        return null;
    }

    return {
        id: data.id,
        content: data.content,
        author: {
            uid: data.author_id,
            name: data.author_name,
        },
        createdAt: data.created_at,
    };
}

/**
 * 更新评论状态
 */
export async function updateCommentStatus(userId: string, docId: string, commentId: string, status: string): Promise<{ id: string; status: string } | null> {
    const { data, error } = await supabase
        .from('comments')
        .update({ status })
        .eq('id', commentId)
        .select()
        .single();

    if (error) {
        console.error('更新评论状态失败:', error);
        return null;
    }

    return {
        id: data.id,
        status: data.status,
    };
}

/**
 * 删除评论
 */
export async function deleteComment(userId: string, docId: string, commentId: string): Promise<boolean> {
    const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

    if (error) {
        console.error('删除评论失败:', error);
        return false;
    }
    return true;
}

// ============================================
// 认证相关
// ============================================

/**
 * 获取当前用户
 */
export async function getCurrentUser(): Promise<User | null> {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return null;
    }

    return {
        uid: user.id,
        email: user.email,
        displayName: user.user_metadata?.display_name || user.email?.split('@')[0] || 'User',
    };
}

/**
 * 邮箱密码登录
 */
export async function signInWithEmail(email: string, password: string): Promise<User> {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        throw error;
    }

    return {
        uid: data.user.id,
        email: data.user.email,
        displayName: data.user.user_metadata?.display_name || email.split('@')[0] || 'User',
    };
}

/**
 * 邮箱密码注册
 */
export async function signUpWithEmail(email: string, password: string, displayName: string): Promise<User> {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                display_name: displayName,
            },
        },
    });

    if (error) {
        throw error;
    }

    return {
        uid: data.user?.id || '',
        email: data.user?.email,
        displayName,
    };
}

/**
 * 登出
 */
export async function signOut(): Promise<void> {
    const { error } = await supabase.auth.signOut();
    if (error) {
        throw error;
    }
}

/**
 * 监听认证状态变化
 */
export function onAuthStateChange(callback: (user: User | null) => void) {
    return supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
            callback({
                uid: session.user.id,
                email: session.user.email,
                displayName: session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || 'User',
            });
        } else {
            callback(null);
        }
    });
}

// ============================================
// 搜索功能
// ============================================

/**
 * 搜索文档
 */
export async function searchDocuments(userId: string, query: string): Promise<Document[]> {
    const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', userId)
        .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
        .order('updated_at', { ascending: false })
        .limit(20);

    if (error) {
        console.error('搜索文档失败:', error);
        return [];
    }

    return data.map((doc: DbDocumentRow) => ({
        id: doc.id,
        title: doc.title,
        content: doc.content,
        status: doc.status as DocumentStatus,
        folderId: doc.folder_id,
        knowledgeBaseId: doc.knowledge_base_id,
        teamId: doc.team_id,
        createdAt: doc.created_at,
        updatedAt: doc.updated_at,
    }));
}

// ============================================
// 存储信息
// ============================================

/**
 * 获取存储使用情况 (Supabase 中暂不实现详细统计)
 */
export function getStorageInfo(): StorageInfo {
    return {
        used: 0,
        total: Infinity,
        percentage: 0,
    };
}
