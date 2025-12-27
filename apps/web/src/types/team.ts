/**
 * Team & Knowledge Base Types
 * 团队与知识库类型定义
 */

// ============================================
// Department Types (部门)
// ============================================

export interface Department {
    id: string;
    name: string;
    parentId: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface DepartmentMember {
    id: string;
    departmentId: string;
    userId: string;
    createdAt: string;
    // 关联数据
    user?: {
        id: string;
        displayName: string;
        avatarUrl?: string;
    };
}

// ============================================
// Team Types (团队)
// ============================================

export type TeamVisibility = 'public' | 'team' | 'private';
export type TeamMemberRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface Team {
    id: string;
    name: string;
    description?: string;
    avatarUrl?: string;
    coverUrl?: string;
    ownerId: string;
    visibility: TeamVisibility;
    createdAt: string;
    updatedAt: string;
    // 关联数据
    owner?: {
        id: string;
        displayName: string;
        avatarUrl?: string;
    };
    memberCount?: number;
}

export interface TeamMember {
    id: string;
    teamId: string;
    userId: string;
    role: TeamMemberRole;
    createdAt: string;
    // 关联数据
    user?: {
        id: string;
        displayName: string;
        email?: string;
        avatarUrl?: string;
    };
}

export interface CreateTeamInput {
    name: string;
    description?: string;
    avatarUrl?: string;
    visibility?: TeamVisibility;
}

export interface UpdateTeamInput {
    name?: string;
    description?: string;
    avatarUrl?: string;
    coverUrl?: string;
    visibility?: TeamVisibility;
}

// ============================================
// Knowledge Base Types (知识库)
// ============================================

export type KBVisibility = 'public' | 'team' | 'private';
export type KBDocumentStatus = 'draft' | 'review' | 'published';

export interface KnowledgeBase {
    id: string;
    name: string;
    description?: string;
    icon: string;
    teamId: string;
    createdBy?: string;
    visibility: KBVisibility;
    createdAt: string;
    updatedAt: string;
    // 关联数据
    team?: Team;
    documentCount?: number;
}

export interface KBFolder {
    id: string;
    name: string;
    parentId: string | null;
    knowledgeBaseId: string;
    createdAt: string;
    updatedAt: string;
    // 树形结构
    children?: KBFolder[];
}

export interface KBDocument {
    id: string;
    title: string;
    content: string;
    status: KBDocumentStatus;
    folderId: string | null;
    knowledgeBaseId: string;
    authorId: string | null;
    createdAt: string;
    updatedAt: string;
    // 关联数据
    author?: {
        id: string;
        displayName: string;
        avatarUrl?: string;
    };
    folder?: KBFolder;
}

export interface CreateKBInput {
    name: string;
    description?: string;
    icon?: string;
    teamId: string;
    visibility?: KBVisibility;
}

export interface UpdateKBInput {
    name?: string;
    description?: string;
    icon?: string;
    visibility?: KBVisibility;
}

export interface CreateKBDocumentInput {
    title?: string;
    content?: string;
    status?: KBDocumentStatus;
    folderId?: string | null;
    knowledgeBaseId: string;
}

export interface UpdateKBDocumentInput {
    title?: string;
    content?: string;
    status?: KBDocumentStatus;
    folderId?: string | null;
}

// ============================================
// Permission Types (权限)
// ============================================

export interface TeamPermissions {
    canView: boolean;
    canEdit: boolean;
    canManageMembers: boolean;
    canDelete: boolean;
}

export interface KBPermissions {
    canView: boolean;
    canCreateDoc: boolean;
    canEditDoc: boolean;
    canDeleteDoc: boolean;
    canManageKB: boolean;
}

/**
 * 根据角色获取团队权限
 */
export function getTeamPermissions(role: TeamMemberRole | null): TeamPermissions {
    if (!role) {
        return { canView: false, canEdit: false, canManageMembers: false, canDelete: false };
    }

    switch (role) {
        case 'owner':
            return { canView: true, canEdit: true, canManageMembers: true, canDelete: true };
        case 'admin':
            return { canView: true, canEdit: true, canManageMembers: true, canDelete: false };
        case 'member':
            return { canView: true, canEdit: true, canManageMembers: false, canDelete: false };
        case 'viewer':
            return { canView: true, canEdit: false, canManageMembers: false, canDelete: false };
        default:
            return { canView: false, canEdit: false, canManageMembers: false, canDelete: false };
    }
}

/**
 * 根据角色获取知识库权限
 */
export function getKBPermissions(role: TeamMemberRole | null): KBPermissions {
    if (!role) {
        return { canView: false, canCreateDoc: false, canEditDoc: false, canDeleteDoc: false, canManageKB: false };
    }

    switch (role) {
        case 'owner':
        case 'admin':
            return { canView: true, canCreateDoc: true, canEditDoc: true, canDeleteDoc: true, canManageKB: true };
        case 'member':
            return { canView: true, canCreateDoc: true, canEditDoc: true, canDeleteDoc: false, canManageKB: false };
        case 'viewer':
            return { canView: true, canCreateDoc: false, canEditDoc: false, canDeleteDoc: false, canManageKB: false };
        default:
            return { canView: false, canCreateDoc: false, canEditDoc: false, canDeleteDoc: false, canManageKB: false };
    }
}
