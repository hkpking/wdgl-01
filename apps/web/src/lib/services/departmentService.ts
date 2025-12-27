/**
 * Department Service - 部门服务层
 * 提供部门 CRUD 和成员管理功能
 */

import { supabase } from '@/lib/services/supabase';
import type { Department, DepartmentMember } from '@/types/team';

// ============================================
// 部门 CRUD
// ============================================

/**
 * 获取所有部门（树形结构）
 */
export async function getDepartments(): Promise<Department[]> {
    const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name', { ascending: true });

    if (error) {
        console.error('[deptService] 获取部门列表失败:', error);
        return [];
    }

    return (data || []).map(transformDepartment);
}

/**
 * 获取部门详情
 */
export async function getDepartment(deptId: string): Promise<Department | null> {
    const { data, error } = await supabase
        .from('departments')
        .select('*')
        .eq('id', deptId)
        .single();

    if (error) {
        console.error('[deptService] 获取部门详情失败:', error);
        return null;
    }

    return transformDepartment(data);
}

/**
 * 创建部门
 */
export async function createDepartment(name: string, parentId?: string): Promise<Department | null> {
    const { data, error } = await supabase
        .from('departments')
        .insert({
            name,
            parent_id: parentId || null
        })
        .select()
        .single();

    if (error) {
        console.error('[deptService] 创建部门失败:', error);
        return null;
    }

    return transformDepartment(data);
}

/**
 * 更新部门
 */
export async function updateDepartment(deptId: string, name: string, parentId?: string | null): Promise<Department | null> {
    const updates: Record<string, unknown> = { name };
    if (parentId !== undefined) {
        updates.parent_id = parentId;
    }

    const { data, error } = await supabase
        .from('departments')
        .update(updates)
        .eq('id', deptId)
        .select()
        .single();

    if (error) {
        console.error('[deptService] 更新部门失败:', error);
        return null;
    }

    return transformDepartment(data);
}

/**
 * 删除部门
 */
export async function deleteDepartment(deptId: string): Promise<boolean> {
    const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', deptId);

    if (error) {
        console.error('[deptService] 删除部门失败:', error);
        return false;
    }

    return true;
}

// ============================================
// 部门成员管理
// ============================================

/**
 * 获取部门成员
 */
export async function getDepartmentMembers(deptId: string): Promise<DepartmentMember[]> {
    const { data, error } = await supabase
        .from('department_members')
        .select(`
            *,
            profiles:user_id(id, display_name, avatar_url)
        `)
        .eq('department_id', deptId);

    if (error) {
        console.error('[deptService] 获取部门成员失败:', error);
        return [];
    }

    return (data || []).map(transformDepartmentMember);
}

/**
 * 添加部门成员
 */
export async function addDepartmentMember(deptId: string, userId: string): Promise<DepartmentMember | null> {
    const { data, error } = await supabase
        .from('department_members')
        .insert({
            department_id: deptId,
            user_id: userId
        })
        .select()
        .single();

    if (error) {
        console.error('[deptService] 添加部门成员失败:', error);
        return null;
    }

    return transformDepartmentMember(data);
}

/**
 * 移除部门成员
 */
export async function removeDepartmentMember(deptId: string, userId: string): Promise<boolean> {
    const { error } = await supabase
        .from('department_members')
        .delete()
        .eq('department_id', deptId)
        .eq('user_id', userId);

    if (error) {
        console.error('[deptService] 移除部门成员失败:', error);
        return false;
    }

    return true;
}

/**
 * 获取用户所属的部门
 */
export async function getUserDepartments(userId: string): Promise<Department[]> {
    const { data, error } = await supabase
        .from('department_members')
        .select(`
            departments:department_id(*)
        `)
        .eq('user_id', userId);

    if (error) {
        console.error('[deptService] 获取用户部门失败:', error);
        return [];
    }

    return (data || [])
        .map(d => d.departments)
        .filter(Boolean)
        .map(transformDepartment);
}

// ============================================
// 辅助函数
// ============================================

/**
 * 构建部门树
 */
export function buildDepartmentTree(departments: Department[]): (Department & { children: Department[] })[] {
    const map = new Map<string, Department & { children: Department[] }>();
    const roots: (Department & { children: Department[] })[] = [];

    // 初始化所有节点
    departments.forEach(dept => {
        map.set(dept.id, { ...dept, children: [] });
    });

    // 构建树
    departments.forEach(dept => {
        const node = map.get(dept.id)!;
        if (dept.parentId && map.has(dept.parentId)) {
            map.get(dept.parentId)!.children.push(node);
        } else {
            roots.push(node);
        }
    });

    return roots;
}

// ============================================
// 数据转换
// ============================================

function transformDepartment(data: any): Department {
    return {
        id: data.id,
        name: data.name,
        parentId: data.parent_id,
        createdAt: data.created_at,
        updatedAt: data.updated_at
    };
}

function transformDepartmentMember(data: any): DepartmentMember {
    return {
        id: data.id,
        departmentId: data.department_id,
        userId: data.user_id,
        createdAt: data.created_at,
        user: data.profiles ? {
            id: data.profiles.id,
            displayName: data.profiles.display_name,
            avatarUrl: data.profiles.avatar_url
        } : undefined
    };
}
