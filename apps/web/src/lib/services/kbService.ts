/**
 * Knowledge Base Service - 知识库服务层
 * 提供知识库 CRUD、文件夹和文档管理功能
 */

import { supabase } from '@/lib/services/supabase';
import type {
    KnowledgeBase, KBFolder,
    CreateKBInput, UpdateKBInput
} from '@/types/team';

// ============================================
// 知识库 CRUD
// ============================================

/**
 * 获取团队的知识库列表
 */
export async function getKnowledgeBases(teamId: string): Promise<KnowledgeBase[]> {
    const { data, error } = await supabase
        .from('knowledge_bases')
        .select('*')
        .eq('team_id', teamId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[kbService] 获取知识库列表失败:', error);
        return [];
    }

    return (data || []).map(transformKB);
}

/**
 * 获取知识库详情
 */
export async function getKnowledgeBase(kbId: string): Promise<KnowledgeBase | null> {
    const { data, error } = await supabase
        .from('knowledge_bases')
        .select('*')
        .eq('id', kbId)
        .single();

    if (error) {
        console.error('[kbService] 获取知识库详情失败:', error);
        return null;
    }

    return transformKB(data);
}

/**
 * 创建知识库
 */
export async function createKnowledgeBase(userId: string, input: CreateKBInput): Promise<KnowledgeBase | null> {
    const { data, error } = await supabase
        .from('knowledge_bases')
        .insert({
            name: input.name,
            description: input.description || null,
            icon: input.icon || '📚',
            team_id: input.teamId,
            created_by: userId,
            visibility: input.visibility || 'team'
        })
        .select()
        .single();

    if (error) {
        console.error('[kbService] 创建知识库失败:', error);
        return null;
    }

    return transformKB(data);
}

/**
 * 更新知识库
 */
export async function updateKnowledgeBase(kbId: string, input: UpdateKBInput): Promise<KnowledgeBase | null> {
    const updates: Record<string, unknown> = {};
    if (input.name !== undefined) updates.name = input.name;
    if (input.description !== undefined) updates.description = input.description;
    if (input.icon !== undefined) updates.icon = input.icon;
    if (input.visibility !== undefined) updates.visibility = input.visibility;

    const { data, error } = await supabase
        .from('knowledge_bases')
        .update(updates)
        .eq('id', kbId)
        .select()
        .single();

    if (error) {
        console.error('[kbService] 更新知识库失败:', error);
        return null;
    }

    return transformKB(data);
}

/**
 * 删除知识库
 */
export async function deleteKnowledgeBase(kbId: string): Promise<boolean> {
    const { error } = await supabase
        .from('knowledge_bases')
        .delete()
        .eq('id', kbId);

    if (error) {
        console.error('[kbService] 删除知识库失败:', error);
        return false;
    }

    return true;
}

// ============================================
// 知识库文件夹
// ============================================

/**
 * 获取知识库文件夹列表
 */
export async function getKBFolders(kbId: string): Promise<KBFolder[]> {
    const { data, error } = await supabase
        .from('kb_folders')
        .select('*')
        .eq('knowledge_base_id', kbId)
        .order('name', { ascending: true });

    if (error) {
        console.error('[kbService] 获取文件夹列表失败:', error);
        return [];
    }

    return (data || []).map(transformKBFolder);
}

/**
 * 创建文件夹
 */
export async function createKBFolder(kbId: string, name: string, parentId?: string): Promise<KBFolder | null> {
    const { data, error } = await supabase
        .from('kb_folders')
        .insert({
            name,
            knowledge_base_id: kbId,
            parent_id: parentId || null
        })
        .select()
        .single();

    if (error) {
        console.error('[kbService] 创建文件夹失败:', error);
        return null;
    }

    return transformKBFolder(data);
}

/**
 * 更新文件夹（名称或父文件夹）
 */
export async function updateKBFolder(
    folderId: string,
    updates: { name?: string; parentId?: string | null }
): Promise<KBFolder | null> {
    const updateData: Record<string, unknown> = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.parentId !== undefined) updateData.parent_id = updates.parentId;

    const { data, error } = await supabase
        .from('kb_folders')
        .update(updateData)
        .eq('id', folderId)
        .select()
        .single();

    if (error) {
        console.error('[kbService] 更新文件夹失败:', error);
        return null;
    }

    return transformKBFolder(data);
}

/**
 * 移动文件夹到新的父文件夹
 */
export async function moveKBFolder(folderId: string, newParentId: string | null): Promise<KBFolder | null> {
    return updateKBFolder(folderId, { parentId: newParentId });
}

/**
 * 删除文件夹
 */
export async function deleteKBFolder(folderId: string): Promise<boolean> {
    const { error } = await supabase
        .from('kb_folders')
        .delete()
        .eq('id', folderId);

    if (error) {
        console.error('[kbService] 删除文件夹失败:', error);
        return false;
    }

    return true;
}



// ============================================
// 数据转换
// ============================================

function transformKB(data: any): KnowledgeBase {
    return {
        id: data.id,
        name: data.name,
        description: data.description,
        icon: data.icon,
        teamId: data.team_id,
        createdBy: data.created_by,
        visibility: data.visibility,
        createdAt: data.created_at,
        updatedAt: data.updated_at
    };
}

function transformKBFolder(data: any): KBFolder {
    return {
        id: data.id,
        name: data.name,
        parentId: data.parent_id,
        knowledgeBaseId: data.knowledge_base_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at
    };
}
