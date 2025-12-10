/**
 * Supabase API 服务层
 * 提供与 mockStorage 相同的接口，实现后端数据持久化
 */
import { supabase } from '../supabase';

// ============================================
// 工具函数
// ============================================

/**
 * 获取当前用户 ID
 */
const getCurrentUserId = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id;
};

// ============================================
// 文档操作
// ============================================

/**
 * 获取用户所有文档
 */
export async function getAllDocuments(userId) {
    const { data, error } = await supabase
        .from('documents')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

    if (error) {
        console.error('获取文档列表失败:', error);
        return [];
    }

    // 转换为兼容格式
    return data.map(doc => ({
        id: doc.id,
        title: doc.title,
        content: doc.content,
        status: doc.status,
        folderId: doc.folder_id,
        createdAt: doc.created_at,
        updatedAt: doc.updated_at,
    }));
}

/**
 * 获取单个文档
 */
export async function getDocument(userId, docId) {
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
 * 保存文档 (创建或更新)
 */
export async function saveDocument(userId, docId, docData) {
    const payload = {
        title: docData.title,
        content: docData.content,
        status: docData.status || 'draft',
        folder_id: docData.folderId || null,
        user_id: userId,
    };

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

    return {
        id: result.id,
        title: result.title,
        content: result.content,
        status: result.status,
        folderId: result.folder_id,
        createdAt: result.created_at,
        updatedAt: result.updated_at,
    };
}

/**
 * 删除文档
 */
export async function deleteDocument(userId, docId) {
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
export async function saveVersion(userId, docId, versionData) {
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
export async function getVersions(userId, docId) {
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
export async function updateVersion(userId, docId, versionId, updates) {
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
export async function getFolders(userId) {
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
export async function createFolder(userId, name, parentId = null) {
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
export async function updateFolder(userId, folderId, updates) {
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
    };
}

/**
 * 删除文件夹
 */
export async function deleteFolder(userId, folderId) {
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
export async function moveDocument(userId, docId, folderId) {
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
export async function getComments(userId, docId) {
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
    return data.map(comment => ({
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
            .filter(r => r.parent_id === comment.id)
            .map(r => ({
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
export async function addComment(userId, docId, commentData) {
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
export async function addReply(userId, docId, commentId, replyData) {
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
export async function updateCommentStatus(userId, docId, commentId, status) {
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
export async function deleteComment(userId, docId, commentId) {
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
export async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return null;
    }

    return {
        uid: user.id,
        email: user.email,
        displayName: user.user_metadata?.display_name || user.email?.split('@')[0],
    };
}

/**
 * 邮箱密码登录
 */
export async function signInWithEmail(email, password) {
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
        displayName: data.user.user_metadata?.display_name || email.split('@')[0],
    };
}

/**
 * 邮箱密码注册
 */
export async function signUpWithEmail(email, password, displayName) {
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
        uid: data.user?.id,
        email: data.user?.email,
        displayName,
    };
}

/**
 * 登出
 */
export async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        throw error;
    }
}

/**
 * 监听认证状态变化
 */
export function onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
            callback({
                uid: session.user.id,
                email: session.user.email,
                displayName: session.user.user_metadata?.display_name || session.user.email?.split('@')[0],
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
export async function searchDocuments(userId, query) {
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

    return data.map(doc => ({
        id: doc.id,
        title: doc.title,
        content: doc.content,
        status: doc.status,
        updatedAt: doc.updated_at,
    }));
}

// ============================================
// 存储信息
// ============================================

/**
 * 获取存储使用情况 (Supabase 中暂不实现详细统计)
 */
export function getStorageInfo() {
    return {
        used: 0,
        total: Infinity,
        percentage: 0,
    };
}
