"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FileText, FileSpreadsheet, GitBranch } from 'lucide-react';
import * as teamService from '@/lib/services/teamService';
import * as kbService from '@/lib/services/kbService';
import { saveDocument } from '@/lib/services/api/documentService'; // Import document service
import { createSpreadsheet } from '@/lib/services/spreadsheetService'; // Import spreadsheet service
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
    onCreateSpreadsheet?: () => void;
    onCreateFlowchart?: () => void;
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
    onCreateSpreadsheet,
    onCreateFlowchart,
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

    // 知识库模式下的快速创建下拉菜单
    const [isQuickCreateOpen, setIsQuickCreateOpen] = useState(false);
    const quickCreateRef = useRef<HTMLDivElement>(null);

    // 点击外部关闭快速创建菜单
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (quickCreateRef.current && !quickCreateRef.current.contains(event.target as Node)) {
                setIsQuickCreateOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 创建团队
    const handleCreateTeam = async (input: { name: string; description?: string; visibility?: 'public' | 'team' | 'private' }) => {
        if (!currentUser?.uid) return;
        const team = await teamService.createTeam(currentUser.uid, input);
        if (team) {
            router.push(`/teams/${team.id}`);
        }
    };

    // 处理新建按钮点击
    const handleCreateNew = () => {
        if (mode === 'knowledgeBase' && kb) {
            // 知识库模式：显示快速创建下拉菜单
            setIsQuickCreateOpen(true);
        } else {
            // 默认模式：打开完整选择弹窗
            setIsCreateItemModalOpen(true);
        }
    };

    // 快速创建文档（知识库模式）
    const handleQuickCreateDocument = () => {
        setIsQuickCreateOpen(false);
        // 优先使用传入的回调（避免路由跳转）
        if (onCreateDoc) {
            onCreateDoc();
            return;
        }
        if (kb) {
            router.push(`/teams/${kb.teamId}/kb/${kb.id}?action=new-doc`);
        }
    };

    // 快速创建表格（知识库模式）
    const handleQuickCreateSpreadsheet = () => {
        setIsQuickCreateOpen(false);
        if (onCreateSpreadsheet) {
            onCreateSpreadsheet();
            return;
        }
        if (kb) {
            router.push(`/teams/${kb.teamId}/kb/${kb.id}?action=new-sheet`);
        }
    };

    // 快速创建流程图（知识库模式）
    const handleQuickCreateFlowchart = () => {
        setIsQuickCreateOpen(false);
        if (onCreateFlowchart) {
            onCreateFlowchart();
            return;
        }
        if (kb) {
            router.push(`/teams/${kb.teamId}/kb/${kb.id}?action=new-flowchart`);
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
                <div className="relative" ref={quickCreateRef}>
                    <SidebarActions
                        onCreateNew={handleCreateNew}
                        onUpload={onUpload}
                        onOpenSearch={onOpenSearch}
                    />

                    {/* 知识库模式下的快速创建下拉菜单 */}
                    {isQuickCreateOpen && mode === 'knowledgeBase' && kb && (
                        <div className="absolute top-full left-3 right-3 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 animate-in fade-in zoom-in-95 duration-100">
                            <button
                                onClick={handleQuickCreateDocument}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                            >
                                <FileText size={20} className="text-blue-600" />
                                <div>
                                    <div className="font-medium text-gray-900">文档</div>
                                    <div className="text-xs text-gray-500">在当前知识库创建</div>
                                </div>
                            </button>

                            <div className="h-px bg-gray-100 mx-2" />

                            <button
                                onClick={handleQuickCreateSpreadsheet}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                            >
                                <FileSpreadsheet size={20} className="text-green-600" />
                                <div>
                                    <div className="font-medium text-gray-900">表格</div>
                                    <div className="text-xs text-gray-500">在当前知识库创建</div>
                                </div>
                            </button>

                            <div className="h-px bg-gray-100 mx-2" />

                            <button
                                onClick={handleQuickCreateFlowchart}
                                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                            >
                                <GitBranch size={20} className="text-purple-600" />
                                <div>
                                    <div className="font-medium text-gray-900">流程图</div>
                                    <div className="text-xs text-gray-500">使用 AI 辅助绘制</div>
                                </div>
                            </button>
                        </div>
                    )}
                </div>

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

            {/* 新建文档/表格弹窗 (仅非知识库模式使用) */}
            <CreateItemModal
                isOpen={isCreateItemModalOpen}
                onClose={() => setIsCreateItemModalOpen(false)}
                currentUser={currentUser}
                defaultTeamId={undefined}
                defaultKbId={undefined}
                onCreateDocument={async (teamId, kbId) => {
                    // Direct creation logic for "Outside KB"
                    try {
                        const newDoc = {
                            title: '无标题文档',
                            content: '',
                            status: 'draft',
                            contentType: 'html',
                            folderId: null, // Create in root
                            knowledgeBaseId: kbId,
                            teamId: teamId,
                        };
                        const savedDoc = await saveDocument(currentUser?.uid || '', null, newDoc as any);
                        if (savedDoc?.id) {
                            router.push(`/teams/${teamId}/kb/${kbId}?doc=${savedDoc.id}`);
                        }
                    } catch (error) {
                        console.error('Failed to create document:', error);
                        // Fallback or error handling
                    }
                }}
                onCreateSpreadsheet={async (teamId, kbId) => {
                    // Direct creation logic for "Outside KB"
                    try {
                        const sheet = await createSpreadsheet(currentUser?.uid || '', {
                            title: '无标题表格',
                            teamId: teamId,
                            knowledgeBaseId: kbId,
                            folderId: undefined // Create in root
                        });
                        if (sheet?.id) {
                            router.push(`/teams/${teamId}/kb/${kbId}?sheet=${sheet.id}`);
                        }
                    } catch (error) {
                        console.error('Failed to create spreadsheet:', error);
                    }
                }}
                onCreateFlowchart={async (teamId, kbId) => {
                    // Direct creation logic for "Outside KB"
                    try {
                        const newDoc = {
                            title: '新建流程图',
                            content: '',
                            status: 'draft',
                            contentType: 'flowchart',
                            folderId: null, // Create in root
                            knowledgeBaseId: kbId,
                            teamId: teamId,
                        };
                        const savedDoc = await saveDocument(currentUser?.uid || '', null, newDoc as any);
                        if (savedDoc?.id) {
                            router.push(`/teams/${teamId}/kb/${kbId}?flowchart=${savedDoc.id}`);
                        }
                    } catch (error) {
                        console.error('Failed to create flowchart:', error);
                    }
                }}
            />
        </>
    );
}

