"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Sparkles,
    ChevronRight,
    ChevronDown,
    Users,
    MoreHorizontal,
    Home,
    MessageSquare,
    Plus
} from 'lucide-react';
import * as teamService from '@/lib/services/teamService';
import type { Team, KnowledgeBase, KBFolder } from '@/types/team';
import FolderTree from '@/components/FolderTree';
import RecentDocs from '@/components/shared/RecentDocs';

interface KBDocument {
    id: string;
    title: string;
    folderId?: string | null;
    status?: string;
}

interface SidebarNavigationProps {
    currentUser?: {
        uid: string;
        email?: string;
        displayName?: string;
    } | null;
    // 默认模式
    folders?: Array<{ id: string; name: string; parentId?: string | null }>;
    selectedFolderId?: string | null;
    onSelectFolder?: (folderId: string | null) => void;
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
    renamingItemId?: string | null;
    onRenameItem?: (id: string, newName: string | null, type: 'folder' | 'document' | 'spreadsheet') => void;
    // 团队相关回调
    onOpenCreateTeamModal?: () => void;
}

/**
 * 侧边栏导航组件
 * - 默认模式: 显示导航项、最近访问、团队列表
 * - 知识库模式: 显示知识库目录树
 */
export default function SidebarNavigation({
    currentUser,
    folders = [],
    selectedFolderId,
    onSelectFolder,
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
    renamingItemId,
    onRenameItem,
    onOpenCreateTeamModal
}: SidebarNavigationProps) {
    const pathname = usePathname();
    const router = useRouter();

    // 团队相关状态
    const [teams, setTeams] = useState<Team[]>([]);
    const [teamsExpanded, setTeamsExpanded] = useState(true);
    const [loadingTeams, setLoadingTeams] = useState(false);

    const navItems = [
        { id: 'ask-ai', label: '问AI', icon: Sparkles, href: '/ask-ai', color: 'text-blue-600' },
    ];

    const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/');

    // 加载团队列表
    useEffect(() => {
        if (currentUser?.uid && mode === 'default') {
            loadTeams();
        }
    }, [currentUser?.uid, mode]);

    const loadTeams = async () => {
        if (!currentUser?.uid) return;
        setLoadingTeams(true);
        try {
            const data = await teamService.getVisibleTeams(currentUser.uid);
            setTeams(data);
        } catch (error) {
            console.error('加载团队失败:', error);
        } finally {
            setLoadingTeams(false);
        }
    };

    if (mode === 'knowledgeBase') {
        return (
            <nav className="flex-1 overflow-y-auto px-3 py-2">
                {/* 知识库快捷导航 */}
                <div className="space-y-1 mb-4">
                    <button
                        onClick={onSelectKBHome}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-sm font-medium ${!activeKBDocId ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}
                    >
                        <Home size={18} className={!activeKBDocId ? 'text-blue-600' : 'text-gray-400'} />
                        主页
                    </button>
                    <Link
                        href="/ask-ai"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                        <MessageSquare size={18} className="text-gray-400" />
                        问AI
                    </Link>
                </div>

                {/* 目录树 */}
                <div className="border-t border-gray-100 pt-2">
                    <FolderTree
                        folders={kbFolders}
                        documents={kbDocuments}
                        selectedFolderId={selectedFolderId || null}
                        activeDocId={activeKBDocId || null}
                        onSelectFolder={onSelectFolder || (() => { })}
                        onSelectDocument={(doc: any) => onSelectKBDoc?.(doc.id)}
                        onAction={onKBFolderAction || (() => { })}
                        onMenuClick={onMenuClick}
                        onMoveItem={onMoveItem}
                        showHome={false}
                        enableDragDrop={true}
                        renamingItemId={renamingItemId}
                        onRename={onRenameItem}
                    />
                </div>
            </nav>
        );
    }

    // 默认模式
    return (
        <nav className="flex-1 overflow-y-auto px-3 py-2">
            {/* Primary Nav Items */}
            <div className="space-y-1 mb-4">
                {navItems.map(item => (
                    <Link
                        key={item.id}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-sm font-medium ${isActive(item.href)
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
                            }`}
                    >
                        <item.icon size={18} className={isActive(item.href) ? 'text-blue-600' : item.color} />
                        {item.label}
                    </Link>
                ))}
            </div>

            {/* 最近访问区域 */}
            <div className="border-t border-gray-100 pt-3 mb-3">
                <RecentDocs maxItems={5} />
            </div>

            {/* 团队列表区域 */}
            <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between px-3 mb-2">
                    <button
                        onClick={() => setTeamsExpanded(!teamsExpanded)}
                        className="flex items-center gap-1 text-xs font-semibold text-gray-400 uppercase hover:text-gray-600"
                    >
                        {teamsExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                        常用团队
                    </button>
                    <button
                        onClick={onOpenCreateTeamModal}
                        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                        title="新建团队"
                    >
                        <Plus size={14} />
                    </button>
                </div>

                {teamsExpanded && (
                    <div className="space-y-1">
                        {loadingTeams ? (
                            <div className="px-3 py-2 text-xs text-gray-400">加载中...</div>
                        ) : teams.length === 0 ? (
                            <button
                                onClick={onOpenCreateTeamModal}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            >
                                <Plus size={16} />
                                创建第一个团队
                            </button>
                        ) : (
                            teams.map(team => (
                                <Link
                                    key={team.id}
                                    href={`/teams/${team.id}`}
                                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition group ${pathname?.startsWith(`/teams/${team.id}`)
                                        ? 'bg-blue-50 text-blue-700 font-medium'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <Users size={16} className={pathname?.startsWith(`/teams/${team.id}`) ? 'text-blue-600' : 'text-gray-400'} />
                                    <span className="flex-1 truncate">{team.name}</span>
                                    <button
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                        }}
                                        className="p-1 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-gray-600 transition"
                                    >
                                        <MoreHorizontal size={14} />
                                    </button>
                                </Link>
                            ))
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}
