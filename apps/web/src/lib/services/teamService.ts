/**
 * Team Service - 团队服务层
 * 提供团队 CRUD 和成员管理功能
 */

import { supabase } from '@/lib/services/supabase';
import type {
    Team, TeamMember, CreateTeamInput, UpdateTeamInput,
    TeamMemberRole
} from '@/types/team';

// ============================================
// 团队 CRUD
// ============================================

/**
 * 获取用户的团队列表
 */
export async function getUserTeams(userId: string): Promise<Team[]> {
    const { data, error } = await supabase
        .from('teams')
        .select(`
            *,
            team_members!inner(user_id, role)
        `)
        .eq('team_members.user_id', userId)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('[teamService] 获取团队列表失败:', error);
        return [];
    }

    return (data || []).map(transformTeam);
}

/**
 * 获取用户可见的所有团队
 * - public 团队：所有登录用户可见
 * - team/private 团队：仅成员可见
 */
export async function getVisibleTeams(userId: string): Promise<Team[]> {
    // 1. 获取所有公开团队
    const { data: publicTeams, error: publicError } = await supabase
        .from('teams')
        .select('*')
        .eq('visibility', 'public')
        .order('created_at', { ascending: false });

    if (publicError) {
        console.error('[teamService] 获取公开团队失败:', publicError);
    }

    // 2. 获取用户是成员的团队（包括非公开）
    const { data: memberTeams, error: memberError } = await supabase
        .from('teams')
        .select(`
            *,
            team_members!inner(user_id, role)
        `)
        .eq('team_members.user_id', userId)
        .order('created_at', { ascending: false });

    if (memberError) {
        console.error('[teamService] 获取成员团队失败:', memberError);
    }

    // 3. 合并并去重
    const teamMap = new Map<string, any>();

    // 先添加成员团队（优先级更高，因为用户是成员）
    for (const team of memberTeams || []) {
        teamMap.set(team.id, team);
    }

    // 再添加公开团队（不覆盖已存在的）
    for (const team of publicTeams || []) {
        if (!teamMap.has(team.id)) {
            teamMap.set(team.id, team);
        }
    }

    // 按创建时间排序
    const allTeams = Array.from(teamMap.values())
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return allTeams.map(transformTeam);
}

/**
 * 获取团队详情
 */
export async function getTeam(teamId: string): Promise<Team | null> {
    const { data, error } = await supabase
        .from('teams')
        .select('*')
        .eq('id', teamId)
        .single();

    if (error) {
        console.error('[teamService] 获取团队详情失败:', error);
        return null;
    }

    return transformTeam(data);
}

/**
 * 创建团队
 */
export async function createTeam(userId: string, input: CreateTeamInput): Promise<Team | null> {
    // 1. 创建团队
    const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({
            name: input.name,
            description: input.description || null,
            avatar_url: input.avatarUrl || null,
            owner_id: userId,
            visibility: input.visibility || 'team'
        })
        .select()
        .single();

    if (teamError) {
        console.error('[teamService] 创建团队失败:', teamError);
        return null;
    }

    // 2. 将创建者添加为 owner
    const { error: memberError } = await supabase
        .from('team_members')
        .insert({
            team_id: team.id,
            user_id: userId,
            role: 'owner'
        });

    if (memberError) {
        console.error('[teamService] 添加团队成员失败:', memberError);
    }

    return transformTeam(team);
}

/**
 * 更新团队
 */
export async function updateTeam(teamId: string, input: UpdateTeamInput): Promise<Team | null> {
    const updates: Record<string, unknown> = {};
    if (input.name !== undefined) updates.name = input.name;
    if (input.description !== undefined) updates.description = input.description;
    if (input.avatarUrl !== undefined) updates.avatar_url = input.avatarUrl;
    if (input.coverUrl !== undefined) updates.cover_url = input.coverUrl;
    if (input.visibility !== undefined) updates.visibility = input.visibility;

    const { data, error } = await supabase
        .from('teams')
        .update(updates)
        .eq('id', teamId)
        .select()
        .single();

    if (error) {
        console.error('[teamService] 更新团队失败:', error);
        return null;
    }

    return transformTeam(data);
}

/**
 * 删除团队
 */
export async function deleteTeam(teamId: string): Promise<boolean> {
    const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId);

    if (error) {
        console.error('[teamService] 删除团队失败:', error);
        return false;
    }

    return true;
}

// ============================================
// 团队成员管理
// ============================================

/**
 * 获取团队成员列表
 */
export async function getTeamMembers(teamId: string): Promise<TeamMember[]> {
    const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', teamId)
        .order('created_at', { ascending: true });

    if (error) {
        console.error('[teamService] 获取团队成员失败:', error);
        return [];
    }

    return (data || []).map(transformTeamMember);
}

/**
 * 添加团队成员
 */
export async function addTeamMember(
    teamId: string,
    userId: string,
    role: TeamMemberRole = 'member'
): Promise<TeamMember | null> {
    const { data, error } = await supabase
        .from('team_members')
        .insert({
            team_id: teamId,
            user_id: userId,
            role
        })
        .select()
        .single();

    if (error) {
        console.error('[teamService] 添加团队成员失败:', error);
        return null;
    }

    return transformTeamMember(data);
}

/**
 * 更新成员角色
 */
export async function updateMemberRole(
    teamId: string,
    userId: string,
    role: TeamMemberRole
): Promise<boolean> {
    const { error } = await supabase
        .from('team_members')
        .update({ role })
        .eq('team_id', teamId)
        .eq('user_id', userId);

    if (error) {
        console.error('[teamService] 更新成员角色失败:', error);
        return false;
    }

    return true;
}

/**
 * 移除团队成员
 */
export async function removeTeamMember(teamId: string, userId: string): Promise<boolean> {
    const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId)
        .eq('user_id', userId);

    if (error) {
        console.error('[teamService] 移除团队成员失败:', error);
        return false;
    }

    return true;
}

/**
 * 获取用户在团队中的角色
 */
export async function getUserRoleInTeam(teamId: string, userId: string): Promise<TeamMemberRole | null> {
    const { data, error } = await supabase
        .from('team_members')
        .select('role')
        .eq('team_id', teamId)
        .eq('user_id', userId)
        .single();

    if (error) {
        return null;
    }

    return data?.role as TeamMemberRole;
}

// ============================================
// 数据转换
// ============================================

function transformTeam(data: any): Team {
    return {
        id: data.id,
        name: data.name,
        description: data.description,
        avatarUrl: data.avatar_url,
        coverUrl: data.cover_url,
        ownerId: data.owner_id,
        visibility: data.visibility,
        createdAt: data.created_at,
        updatedAt: data.updated_at
    };
}

function transformTeamMember(data: any): TeamMember {
    return {
        id: data.id,
        teamId: data.team_id,
        userId: data.user_id,
        role: data.role,
        createdAt: data.created_at,
        user: data.profiles ? {
            id: data.profiles.id,
            displayName: data.profiles.display_name,
            avatarUrl: data.profiles.avatar_url
        } : undefined
    };
}
