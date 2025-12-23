"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as teamService from '@/lib/services/teamService';
import type { KnowledgeBase, KBFolder } from '@/types/team';
import CreateTeamModal from '@/components/Team/CreateTeamModal';
import CreateItemModal from '@/components/shared/CreateItemModal';

// 子组件
import SidebarHeader from './SidebarHeader';
import SidebarActions from './SidebarActions';
import SidebarNavigation from './SidebarNavigation';
import SidebarUserSection from './SidebarUserSection';

interface KBDocument {
    id: string;
    title: string;
    folderId?: string | null;
    status?: string;
}

interface AppSidebarProps {
    currentUser?: {
        uid: string;
        email?: string;
        displayName?: string;
    } | null;
    onLogout?: () => void;
    onCreateDoc?: () => void;
    onUpload?: () => void;
    folders?: Array<{ id: string; name: string; parentId?: string | null }>;
    selectedFolderId?: string | null;
    onSelectFolder?: (folderId: string | null) => void;
    onOpenSearch?: () => void;
    // 知识库模式
    mode?: 'default' | 'knowledgeBase';
    kb?: KnowledgeBase | null;
    kbFolders?: KBFolder[];
    kbDocuments?: KBDocument[];
    activeKBDocId?: string | null;
    onSelectKBDoc?: (docId: string) => void;
    onSelectKBHome?: () => void;
    onKBFolderAction?: (e: React.MouseEvent, folder: any, action: string) => void;
    onMenuClick?: (e: React.MouseEvent, item: any, type: 'folder' | 'document' | 'spreadsheet' | 'create-folder') => void;
    onMoveItem?: (itemId: string, itemType: string, targetFolderId: string | null) => void;
    onCollapse?: () => void;
    renamingItemId?: string | null;
    onRenameItem?: (id: string, newName: string | null, type: 'folder' | 'document' | 'spreadsheet') => void;
}

/**
 * 应用侧边栏组件
 * 组合了 4 个子组件：Header、Actions、Navigation、UserSection
 */
export default function AppSidebar({
    currentUser,
    onLogout,
    onCreateDoc,
    onUpload,
    folders = [],
    selectedFolderId,
    onSelectFolder,
    onOpenSearch,
    mode = 'default',
    kb,
    kbFolders = [],
    kbDocuments = [],
    activeKBDocId,
    onSelectKBDoc,
    onSelectKBHome,
    onKBFolderAction,
    onMenuClick,
    onMoveItem,
    onCollapse,
    renamingItemId,
    onRenameItem
}: AppSidebarProps) {
    const router = useRouter();

    // Modal 状态
    const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
    const [isCreateItemModalOpen, setIsCreateItemModalOpen] = useState(false);

    // 创建团队
    const handleCreateTeam = async (input: { name: string; description?: string; visibility?: 'public' | 'team' | 'private' }) => {
        if (!currentUser?.uid) return;
        const team = await teamService.createTeam(currentUser.uid, input);
        if (team) {
            router.push(`/teams/${team.id}`);
        }
    };

    return (
        <>
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
                {/* Header: Logo/品牌区域 */}
                <SidebarHeader
                    mode={mode}
                    kb={kb}
                    onCollapse={onCollapse}
                />

                {/* Quick Actions: 新建/上传/搜索 */}
                <SidebarActions
                    onCreateNew={() => setIsCreateItemModalOpen(true)}
                    onUpload={onUpload}
                    onOpenSearch={onOpenSearch}
                />

                {/* Navigation: 导航菜单/目录树 */}
                <SidebarNavigation
                    currentUser={currentUser}
                    folders={folders}
                    selectedFolderId={selectedFolderId}
                    onSelectFolder={onSelectFolder}
                    mode={mode}
                    kb={kb}
                    kbFolders={kbFolders}
                    kbDocuments={kbDocuments}
                    activeKBDocId={activeKBDocId}
                    onSelectKBDoc={onSelectKBDoc}
                    onSelectKBHome={onSelectKBHome}
                    onKBFolderAction={onKBFolderAction}
                    onMenuClick={onMenuClick}
                    onMoveItem={onMoveItem}
                    renamingItemId={renamingItemId}
                    onRenameItem={onRenameItem}
                    onOpenCreateTeamModal={() => setIsCreateTeamModalOpen(true)}
                />

                {/* User Section: 用户信息/登出 */}
                <SidebarUserSection
                    currentUser={currentUser}
                    onLogout={onLogout}
                />
            </aside>

            {/* 创建团队弹窗 */}
            <CreateTeamModal
                isOpen={isCreateTeamModalOpen}
                onClose={() => setIsCreateTeamModalOpen(false)}
                onSubmit={handleCreateTeam}
            />

            {/* 新建文档/表格弹窗 */}
            <CreateItemModal
                isOpen={isCreateItemModalOpen}
                onClose={() => setIsCreateItemModalOpen(false)}
                currentUser={currentUser}
                defaultTeamId={mode === 'knowledgeBase' && kb ? kb.teamId : undefined}
                defaultKbId={mode === 'knowledgeBase' && kb ? kb.id : undefined}
                onCreateDocument={(teamId, kbId) => {
                    router.push(`/teams/${teamId}/kb/${kbId}?action=new-doc`);
                }}
                onCreateSpreadsheet={(teamId, kbId) => {
                    router.push(`/teams/${teamId}/kb/${kbId}?action=new-sheet`);
                }}
            />
        </>
    );
}
