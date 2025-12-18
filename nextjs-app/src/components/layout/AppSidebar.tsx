"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    Sparkles,
    FileText,
    FolderOpen,
    Search,
    Plus,
    Upload,
    Settings,
    LogOut,
    ChevronRight,
    ChevronDown,
    ChevronLeft,
    Compass,
    User,
    Users,
    MoreHorizontal,
    Home,
    MessageSquare,
    PanelLeftClose
} from 'lucide-react';
import * as teamService from '@/lib/services/teamService';
import type { Team, KnowledgeBase, KBFolder } from '@/types/team';
import CreateTeamModal from '@/components/Team/CreateTeamModal';
import FolderTree from '@/components/FolderTree';

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
    onMenuClick?: (e: React.MouseEvent, item: any, type: 'folder' | 'document' | 'create-folder') => void;
    onMoveItem?: (itemId: string, itemType: string, targetFolderId: string | null) => void;
    onCollapse?: () => void;
}

export default function AppSidebar({
    currentUser,
    onLogout,
    onCreateDoc,
    onUpload,
    folders = [],
    selectedFolderId,
    onSelectFolder,
    onOpenSearch,
    // 知识库模式
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
    onCollapse
}: AppSidebarProps) {
    const pathname = usePathname();
    const router = useRouter();

    // 团队相关状态
    const [teams, setTeams] = useState<Team[]>([]);
    const [teamsExpanded, setTeamsExpanded] = useState(true);
    const [isCreateTeamModalOpen, setIsCreateTeamModalOpen] = useState(false);
    const [loadingTeams, setLoadingTeams] = useState(false);

    const navItems = [
        { id: 'ask-ai', label: '问AI', icon: Sparkles, href: '/ask-ai', color: 'text-blue-600' },
        { id: 'discover', label: '发现', icon: Compass, href: '/discover', color: 'text-gray-600', disabled: true },
        { id: 'my-docs', label: '我的文档', icon: User, href: '/dashboard', color: 'text-gray-600' },
    ];

    const isActive = (href: string) => pathname === href || pathname?.startsWith(href + '/');

    // 加载团队列表
    useEffect(() => {
        if (currentUser?.uid) {
            loadTeams();
        }
    }, [currentUser?.uid]);

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

    // 创建团队
    const handleCreateTeam = async (input: { name: string; description?: string; visibility?: 'public' | 'team' | 'private' }) => {
        if (!currentUser?.uid) return;
        const team = await teamService.createTeam(currentUser.uid, input);
        if (team) {
            setTeams(prev => [team, ...prev]);
            router.push(`/teams/${team.id}`);
        }
    };

    // 构建文件夹树
    const rootFolders = folders.filter(f => !f.parentId);

    return (
        <>
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col h-screen sticky top-0">
                {/* Logo / Brand / KB Title */}
                <div className="p-4 border-b border-gray-100">
                    {mode === 'knowledgeBase' && kb ? (
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => router.push(`/teams/${kb.teamId}`)}
                                className="flex items-center gap-2 hover:opacity-80 transition"
                            >
                                <span className="text-xl">{kb.icon || '📁'}</span>
                                <span className="font-semibold text-gray-900 truncate text-sm">{kb.name}</span>
                            </button>
                            {onCollapse && (
                                <button
                                    onClick={onCollapse}
                                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition"
                                    title="收起侧边栏"
                                >
                                    <PanelLeftClose size={16} />
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <Sparkles className="text-white" size={18} />
                            </div>
                            <span className="font-bold text-gray-900">制度管理系统</span>
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="p-3 space-y-3">
                    <div className="flex gap-2">
                        <button
                            onClick={onCreateDoc}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                        >
                            <Plus size={16} />
                            新建
                        </button>
                        <button
                            onClick={onUpload}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
                        >
                            <Upload size={16} />
                            上传
                        </button>
                    </div>

                    {/* 搜索按钮 */}
                    <button
                        onClick={onOpenSearch}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                    >
                        <Search size={16} />
                        <span className="flex-1 text-left">搜索...</span>
                        <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-xs text-gray-400 bg-gray-200 rounded">⌘K</kbd>
                    </button>
                </div>

                {/* Main Navigation */}
                <nav className="flex-1 overflow-y-auto px-3 py-2">
                    {mode === 'knowledgeBase' ? (
                        /* 知识库模式导航 */
                        <>
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
                                />
                            </div>
                        </>
                    ) : (
                        /* 默认模式导航 */
                        <>
                            {/* Primary Nav Items */}
                            <div className="space-y-1 mb-4">
                                {navItems.map(item => (
                                    <Link
                                        key={item.id}
                                        href={item.disabled ? '#' : item.href}
                                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition text-sm font-medium ${isActive(item.href)
                                            ? 'bg-blue-50 text-blue-700'
                                            : item.disabled
                                                ? 'text-gray-400 cursor-not-allowed'
                                                : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                        onClick={e => item.disabled && e.preventDefault()}
                                    >
                                        <item.icon size={18} className={isActive(item.href) ? 'text-blue-600' : item.color} />
                                        {item.label}
                                        {item.disabled && (
                                            <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">即将上线</span>
                                        )}
                                    </Link>
                                ))}
                            </div>

                            {/* 快速访问 - 文件夹 */}
                            {folders.length > 0 && (
                                <div className="border-t border-gray-100 pt-4 mb-4">
                                    <div className="flex items-center justify-between px-3 mb-2">
                                        <span className="text-xs font-semibold text-gray-400 uppercase">快速访问</span>
                                    </div>
                                    <div className="space-y-1">
                                        <button
                                            onClick={() => onSelectFolder?.(null)}
                                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${!selectedFolderId ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            <FolderOpen size={16} />
                                            全部文档
                                        </button>
                                        {rootFolders.map(folder => (
                                            <button
                                                key={folder.id}
                                                onClick={() => onSelectFolder?.(folder.id)}
                                                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition ${selectedFolderId === folder.id ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-600 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <FolderOpen size={16} />
                                                <span className="truncate">{folder.name}</span>
                                                <ChevronRight size={14} className="ml-auto text-gray-400" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 团队列表区域 */}
                            <div className="border-t border-gray-100 pt-4">
                                <div className="flex items-center justify-between px-3 mb-2">
                                    <button
                                        onClick={() => setTeamsExpanded(!teamsExpanded)}
                                        className="flex items-center gap-1 text-xs font-semibold text-gray-400 uppercase hover:text-gray-600"
                                    >
                                        {teamsExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                        采用团队
                                    </button>
                                    <button
                                        onClick={() => setIsCreateTeamModalOpen(true)}
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
                                                onClick={() => setIsCreateTeamModalOpen(true)}
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
                        </>
                    )}
                </nav>

                {/* User Section */}
                <div className="p-3 border-t border-gray-100">
                    <div className="flex items-center gap-3 px-2 py-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">
                            {currentUser?.displayName?.[0] || currentUser?.email?.[0] || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                                {currentUser?.displayName || currentUser?.email?.split('@')[0] || '用户'}
                            </div>
                            <div className="text-xs text-gray-500 truncate">
                                {currentUser?.email || ''}
                            </div>
                        </div>
                        <button
                            onClick={onLogout}
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition"
                            title="退出登录"
                        >
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </aside>

            {/* 创建团队弹窗 */}
            <CreateTeamModal
                isOpen={isCreateTeamModalOpen}
                onClose={() => setIsCreateTeamModalOpen(false)}
                onSubmit={handleCreateTeam}
            />
        </>
    );
}
