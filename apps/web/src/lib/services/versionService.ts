/**
 * 通用版本历史服务
 * 支持文档、表格、PDF等多种内容类型的版本管理
 */
import { supabase } from './supabase';

// ============================================
// 类型定义
// ============================================

export type VersionTargetType = 'document' | 'spreadsheet' | 'pdf';

export interface VersionTarget {
    type: VersionTargetType;
    id: string;
}

export interface Version {
    id: string;
    targetType: VersionTargetType;
    targetId: string;
    content: any;  // 文档为 HTML，表格为 sheet data，PDF为注释层
    label?: string;  // 用户自定义版本名
    createdBy: {
        uid: string;
        name: string;
    };
    createdAt: string;
    // 元数据
    metadata?: {
        title?: string;
        size?: number;
        changeCount?: number;
    };
}

export interface VersionDiff {
    added: string[];
    removed: string[];
    changed: string[];
}

// ============================================
// 版本 CRUD 操作
// ============================================

/**
 * 保存新版本
 */
export async function saveVersion(
    userId: string,
    target: VersionTarget,
    content: any,
    createdBy: { uid: string; name: string },
    label?: string,
    metadata?: { title?: string; size?: number }
): Promise<Version | null> {
    try {
        const { data, error } = await supabase
            .from('versions')
            .insert({
                target_type: target.type,
                target_id: target.id,
                user_id: userId,
                content,
                label,
                created_by_uid: createdBy.uid,
                created_by_name: createdBy.name,
                metadata
            })
            .select()
            .single();

        if (error) {
            console.error('保存版本失败:', error);
            return null;
        }

        return mapDbToVersion(data);
    } catch (error) {
        console.error('保存版本失败:', error);
        return null;
    }
}

/**
 * 获取目标的所有版本
 */
export async function getVersions(target: VersionTarget): Promise<Version[]> {
    try {
        const { data, error } = await supabase
            .from('versions')
            .select('*')
            .eq('target_type', target.type)
            .eq('target_id', target.id)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('获取版本历史失败:', error);
            return [];
        }

        return (data || []).map(mapDbToVersion);
    } catch (error) {
        console.error('获取版本历史失败:', error);
        return [];
    }
}

/**
 * 获取单个版本
 */
export async function getVersion(versionId: string): Promise<Version | null> {
    try {
        const { data, error } = await supabase
            .from('versions')
            .select('*')
            .eq('id', versionId)
            .single();

        if (error) {
            console.error('获取版本失败:', error);
            return null;
        }

        return mapDbToVersion(data);
    } catch (error) {
        console.error('获取版本失败:', error);
        return null;
    }
}

/**
 * 更新版本标签
 */
export async function updateVersionLabel(
    versionId: string,
    label: string
): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('versions')
            .update({ label })
            .eq('id', versionId);

        if (error) {
            console.error('更新版本标签失败:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('更新版本标签失败:', error);
        return false;
    }
}

/**
 * 删除版本
 */
export async function deleteVersion(versionId: string): Promise<boolean> {
    try {
        const { error } = await supabase
            .from('versions')
            .delete()
            .eq('id', versionId);

        if (error) {
            console.error('删除版本失败:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('删除版本失败:', error);
        return false;
    }
}

// ============================================
// 版本对比
// ============================================

/**
 * 对比两个版本（简单文本对比）
 */
export async function compareVersions(
    version1Id: string,
    version2Id: string
): Promise<{ v1: Version; v2: Version; diff: VersionDiff } | null> {
    try {
        const [v1, v2] = await Promise.all([
            getVersion(version1Id),
            getVersion(version2Id)
        ]);

        if (!v1 || !v2) {
            console.error('获取版本失败');
            return null;
        }

        // 简单文本对比（对于文档）
        const diff = computeSimpleDiff(
            typeof v1.content === 'string' ? v1.content : JSON.stringify(v1.content),
            typeof v2.content === 'string' ? v2.content : JSON.stringify(v2.content)
        );

        return { v1, v2, diff };
    } catch (error) {
        console.error('版本对比失败:', error);
        return null;
    }
}

/**
 * 简单的文本差异计算
 */
function computeSimpleDiff(text1: string, text2: string): VersionDiff {
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const set1 = new Set(lines1);
    const set2 = new Set(lines2);

    const added = lines2.filter(line => !set1.has(line));
    const removed = lines1.filter(line => !set2.has(line));
    const changed: string[] = [];  // 简化版本不计算具体变更

    return { added, removed, changed };
}

// ============================================
// 辅助函数
// ============================================

/**
 * 将数据库记录映射为 Version 对象
 */
function mapDbToVersion(row: any): Version {
    return {
        id: row.id,
        targetType: row.target_type,
        targetId: row.target_id,
        content: row.content,
        label: row.label,
        createdBy: {
            uid: row.created_by_uid,
            name: row.created_by_name
        },
        createdAt: row.created_at,
        metadata: row.metadata
    };
}

// ============================================
// 兼容旧 API（过渡期使用）
// ============================================

/**
 * 兼容旧的文档版本保存 API
 * @deprecated 请使用 saveVersion(userId, { type: 'document', id: docId }, ...)
 */
export async function saveDocumentVersion(
    userId: string,
    docId: string,
    content: string,
    title?: string
): Promise<Version | null> {
    return saveVersion(
        userId,
        { type: 'document', id: docId },
        content,
        { uid: userId, name: 'User' },
        undefined,
        { title }
    );
}

/**
 * 兼容旧的获取文档版本 API
 * @deprecated 请使用 getVersions({ type: 'document', id: docId })
 */
export async function getDocumentVersions(docId: string): Promise<Version[]> {
    return getVersions({ type: 'document', id: docId });
}
