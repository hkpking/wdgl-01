"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Clock, ArrowLeft, RotateCcw, MessageSquarePlus, Sparkles, ChevronLeft, Save, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { useStorage } from '@/contexts/StorageContext';
import { useCollaboration } from '@/hooks/useCollaboration';
import CollaborationStatus from '@/components/shared/CollaborationStatus';
import CollaborationToast, { useCollaborationToast } from '@/components/shared/CollaborationToast';
import * as kbService from '@/lib/services/kbService';
import * as teamService from '@/lib/services/teamService';
import type { KnowledgeBase, KBDocument, TeamMemberRole } from '@/types/team';
import { getKBPermissions } from '@/types/team';

// 动态导入编辑器相关组件 (JSX 格式)
const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false });
const DocHeader = dynamic(() => import('@/components/DocHeader'), { ssr: false });
const DocToolbar = dynamic(() => import('@/components/DocToolbar'), { ssr: false });
const VersionHistorySidebar = dynamic(() => import('@/components/VersionHistorySidebar'), { ssr: false });
const CommentSidebar = dynamic(() => import('@/components/Comments/CommentSidebar'), { ssr: false });
const AISidebar = dynamic(() => import('@/components/AI/AISidebar'), { ssr: false });
const MagicCommand = dynamic(() => import('@/components/AI/MagicCommand'), { ssr: false });

export default function KBEditorPage() {
    const params = useParams();
    const router = useRouter();
    const teamId = params.teamId as string;
    const kbId = params.kbId as string;
    const docId = params.docId as string;

    const storageContext = useStorage() as any;
    const { currentUser, loading: authLoading } = storageContext;

    // 知识库相关状态
    const [kb, setKb] = useState<KnowledgeBase | null>(null);
    const [kbDoc, setKbDoc] = useState<KBDocument | null>(null);
    const [userRole, setUserRole] = useState<TeamMemberRole | null>(null);
    const [loading, setLoading] = useState(true);

    // 编辑器状态
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState('draft');
    const [editorInstance, setEditorInstance] = useState<any>(null);
    const [hasChanges, setHasChanges] = useState(false);
    const [saving, setSaving] = useState(false);

    // 侧边栏状态
    const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
    const [isCommentSidebarOpen, setIsCommentSidebarOpen] = useState(false);
    const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);
    const [isMagicCommandOpen, setIsMagicCommandOpen] = useState(false);

    const permissions = getKBPermissions(userRole);

    // 协作功能
    const collaborationUser = useMemo(() => currentUser ? {
        id: currentUser.uid,
        name: currentUser.displayName || currentUser.email || '匿名用户',
    } : null, [currentUser?.uid, currentUser?.displayName, currentUser?.email]);

    const { toasts, dismissToast, notifyUserJoined, notifyUserLeft } = useCollaborationToast();

    const {
        ydoc,
        provider,
        isConnected,
        connectedUsers,
        reconnect,
    } = useCollaboration(docId, collaborationUser as any, {
        onUserJoined: notifyUserJoined,
        onUserLeft: notifyUserLeft,
    }) as any;

    const collaboration = useMemo(() => {
        if (!ydoc || !provider || !collaborationUser || !isConnected) return undefined;
        try {
            if (typeof ydoc.getText !== 'function') return undefined;
        } catch { return undefined; }
        return { ydoc, provider, user: collaborationUser };
    }, [ydoc, provider, collaborationUser, isConnected]);

    // 加载数据
    useEffect(() => {
        if (docId && teamId && kbId && currentUser?.uid) {
            loadData();
        }
    }, [docId, teamId, kbId, currentUser?.uid]);

    const loadData = async () => {
        if (!docId || !teamId || !kbId || !currentUser?.uid) return;
        setLoading(true);
        try {
            const [kbData, docData, role] = await Promise.all([
                kbService.getKnowledgeBase(kbId),
                kbService.getKBDocument(docId),
                teamService.getUserRoleInTeam(teamId, currentUser.uid)
            ]);
            setKb(kbData);
            setKbDoc(docData);
            setUserRole(role);
            if (docData) {
                setTitle(docData.title);
                setContent(docData.content);
                setStatus(docData.status);
            }
        } catch (error) {
            console.error('加载文档失败:', error);
        } finally {
            setLoading(false);
        }
    };

    // 保存文档
    const handleSave = useCallback(async () => {
        if (!docId || !hasChanges) return;
        setSaving(true);
        try {
            await kbService.updateKBDocument(docId, { title, content, status: status as any });
            setHasChanges(false);
        } catch (error) {
            console.error('保存失败:', error);
        } finally {
            setSaving(false);
        }
    }, [docId, title, content, status, hasChanges]);

    // 自动保存
    useEffect(() => {
        if (!hasChanges) return;
        const timer = setTimeout(handleSave, 30000);
        return () => clearTimeout(timer);
    }, [hasChanges, handleSave]);

    // 键盘快捷键
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [handleSave]);

    // 返回知识库
    const handleBack = () => {
        if (hasChanges && !confirm('您有未保存的更改，确定要离开吗？')) return;
        router.push(`/teams/${teamId}/kb/${kbId}`);
    };

    // 内容变化
    const handleContentChange = (newContent: string) => {
        setContent(newContent);
        setHasChanges(true);
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!kb || !kbDoc) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">文档不存在或无权访问</p>
                    <button onClick={() => router.push(`/teams/${teamId}/kb/${kbId}`)} className="text-blue-600 hover:underline">
                        返回知识库
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            {/* 顶部导航 - 简化版 */}
            <div className="h-12 bg-white border-b border-gray-200 flex items-center px-4 gap-4 flex-shrink-0">
                <button onClick={handleBack} className="flex items-center gap-1 text-gray-500 hover:text-gray-700">
                    <ChevronLeft size={18} />
                    返回
                </button>
                <span className="text-gray-300">|</span>
                <span className="text-sm text-gray-500">{kb.icon} {kb.name}</span>
                <div className="flex-1" />
                {/* 协作状态 */}
                {collaboration && (
                    <CollaborationStatus
                        users={connectedUsers || []}
                        isConnected={isConnected}
                        onReconnect={reconnect}
                    />
                )}
            </div>

            {/* 文档头部 */}
            <DocHeader
                title={title}
                setTitle={(newTitle: string) => { setTitle(newTitle); setHasChanges(true); }}
                status={status}
                saving={saving}
                lastSaved={null}
                onBack={handleBack}
                onShare={() => { }}
                editor={editorInstance}
                onOpenVersionHistory={() => setIsVersionHistoryOpen(true)}
                onImport={async (file: File) => { /* TODO: 导入处理 */ }}
                onInsertBlock={() => { }}
                content={content}
            />

            {/* 工具栏 */}
            <DocToolbar
                editor={editorInstance}
                onSave={handleSave}
                onAI={() => setIsAISidebarOpen(!isAISidebarOpen)}
                onComment={() => setIsCommentSidebarOpen(!isCommentSidebarOpen)}
                onMagicCommand={() => setIsMagicCommandOpen(true)}
            />

            {/* 主内容区 */}
            <div className="flex-1 flex overflow-hidden">
                {/* 编辑器 */}
                <div className="flex-1 overflow-auto">
                    <div className="max-w-4xl mx-auto px-8 py-12">
                        <RichTextEditor
                            content={content}
                            onChange={handleContentChange}
                            onEditorReady={setEditorInstance}
                            editable={permissions.canEditDoc}
                            collaboration={collaboration}
                            placeholder="开始编写文档..."
                        />
                    </div>
                </div>

                {/* 版本历史 */}
                {isVersionHistoryOpen && (
                    <VersionHistorySidebar
                        documentId={docId}
                        currentContent={content}
                        onClose={() => setIsVersionHistoryOpen(false)}
                        onRestore={(versionContent: string) => {
                            setContent(versionContent);
                            setHasChanges(true);
                            setIsVersionHistoryOpen(false);
                        }}
                    />
                )}

                {/* 评论 */}
                {isCommentSidebarOpen && (
                    <CommentSidebar
                        isOpen={isCommentSidebarOpen}
                        onClose={() => setIsCommentSidebarOpen(false)}
                        comments={[]}
                        currentUser={currentUser}
                    />
                )}

                {/* AI 助手 */}
                {isAISidebarOpen && (
                    <AISidebar
                        isOpen={isAISidebarOpen}
                        onClose={() => setIsAISidebarOpen(false)}
                        documentTitle={title}
                        documentContent={content}
                        onInsertContent={(text: string) => {
                            if (editorInstance) {
                                editorInstance.commands.insertContent(text);
                                setHasChanges(true);
                            }
                        }}
                    />
                )}
            </div>

            {/* Magic Command */}
            {isMagicCommandOpen && editorInstance && (
                <MagicCommand
                    editor={editorInstance}
                    onClose={() => setIsMagicCommandOpen(false)}
                />
            )}

            {/* 协作通知 */}
            <CollaborationToast toasts={toasts} onDismiss={dismissToast} />
        </div>
    );
}
