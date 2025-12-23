"use client";

/**
 * DocumentEditorModule - 文档编辑器独立模块
 * 
 * 这是一个完整的、可复用的文档编辑器模块。
 * 可以被独立编辑页和知识库页面共同使用。
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles } from 'lucide-react';
import dynamic from 'next/dynamic';
import { getTextContent, isPlainText, plainTextToHtml } from '@/lib/editor-utils';
import { importWordDoc } from '@/lib/utils/ImportHandler';
import { useAutoSave } from '@/hooks/useAutoSave';
import { DOC_STATUS, STATUS_LABELS } from '@/lib/constants';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useDocumentExport } from '@/hooks/useDocumentExport';
import { useCollaboration } from '@/hooks/useCollaboration';
import CollaborationStatus from '@/components/shared/CollaborationStatus';
import CollaborationToast, { useCollaborationToast } from '@/components/shared/CollaborationToast';
import * as documentService from '@/lib/services/api/documentService';

// 动态导入重量级组件
const RichTextEditor = dynamic(() => import('@/components/RichTextEditor'), { ssr: false });
const DocHeader = dynamic(() => import('@/components/DocHeader'), { ssr: false });
const DocToolbar = dynamic(() => import('@/components/DocToolbar'), { ssr: false });
const VersionHistorySidebar = dynamic(() => import('@/components/VersionHistorySidebar'), { ssr: false });
const CommentSidebar = dynamic(() => import('@/components/Comments/CommentSidebar'), { ssr: false });
const AISidebar = dynamic(() => import('@/components/AI/AISidebar'), { ssr: false });
const MagicCommand = dynamic(() => import('@/components/AI/MagicCommand'), { ssr: false });
const DocOutlinePanel = dynamic(() => import('@/components/shared/DocOutlinePanel'), { ssr: false });
const FocusMode = dynamic(() => import('@/components/shared/FocusMode').then(m => ({ default: m.default })), { ssr: false });

// 类型定义
export interface DocumentEditorModuleProps {
    /** 文档 ID */
    documentId: string;
    /** 初始文档数据（可选，如果不传则自动加载） */
    initialDocument?: {
        title: string;
        content: string;
        status: string;
    };
    /** 当前用户 */
    currentUser: {
        uid: string;
        displayName?: string;
        email?: string;
    };
    /** 存储 API（可选，默认使用内置实现） */
    storageApi?: {
        saveDocument: (userId: string, docId: string, data: any) => Promise<any>;
        saveVersion?: (userId: string, docId: string, data: any) => Promise<any>;
        getComments?: (userId: string, docId: string) => Promise<any[]>;
        addComment?: (userId: string, docId: string, data: any) => Promise<any>;
        addReply?: (userId: string, docId: string, commentId: string, data: any) => Promise<any>;
        updateCommentStatus?: (userId: string, docId: string, commentId: string, status: string) => Promise<any>;
        deleteComment?: (userId: string, docId: string, commentId: string) => Promise<any>;
    };
    /** 显示模式 */
    mode?: 'standalone' | 'embedded';
    /** 返回按钮回调（standalone 模式） */
    onBack?: () => void;
    /** 知识库 ID（用于知识库上下文） */
    knowledgeBaseId?: string;
    /** 团队 ID（用于协作） */
    teamId?: string;
    /** 是否显示返回按钮 */
    showBackButton?: boolean;
    /** 标题变化回调 */
    onTitleChange?: (title: string) => void;
    /** 内容变化回调 */
    onContentChange?: (content: string) => void;
    /** 编辑状态变化回调（用于同步父组件 dirty 状态） */
    onDirtyChange?: (isDirty: boolean) => void;
    /** 保存成功回调（用于更新父组件列表） */
    onSaveSuccess?: (doc: { id: string; title: string; updatedAt: string }) => void;
}

export default function DocumentEditorModule({
    documentId,
    initialDocument,
    currentUser,
    storageApi,
    mode = 'standalone',
    onBack,
    knowledgeBaseId,
    teamId,
    showBackButton = true,
    onTitleChange,
    onContentChange,
    onDirtyChange,
    onSaveSuccess,
}: DocumentEditorModuleProps) {
    const router = useRouter();

    // 默认的 storageApi 实现
    const defaultStorageApi = useMemo(() => ({
        saveDocument: async (userId: string, docId: string, data: any) => {
            const result = await documentService.saveDocument(userId, docId, data);
            if (result && onSaveSuccess) {
                onSaveSuccess({
                    id: docId,
                    title: data.title,
                    updatedAt: new Date().toISOString()
                });
            }
            return result;
        },
        getComments: async () => [],
        addComment: async () => null,
        addReply: async () => null,
        updateCommentStatus: async () => null,
        deleteComment: async () => false,
    }), [onSaveSuccess]);

    // 使用传入的 storageApi 或默认实现
    const effectiveStorageApi = storageApi ?? defaultStorageApi;

    // 文档状态
    const [title, setTitle] = useState(initialDocument?.title || '');
    const [content, setContent] = useState(initialDocument?.content || '');
    const [status, setStatus] = useState(initialDocument?.status || DOC_STATUS.DRAFT);
    const [editorInstance, setEditorInstance] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    // 如果没有提供初始内容且有 documentId，尝试自动加载
    useEffect(() => {
        if (documentId && !initialDocument?.content && currentUser?.uid) {
            setIsLoading(true);
            documentService.getDocument(currentUser.uid, documentId)
                .then(doc => {
                    if (doc) {
                        setTitle(doc.title);
                        setContent(doc.content || '');
                        setStatus(doc.status);
                        // 如果编辑器实例已存在，更新内容
                        if (editorInstance) {
                            editorInstance.commands.setContent(doc.content || '');
                        }
                    }
                })
                .catch(err => console.error('自加载文档失败:', err))
                .finally(() => setIsLoading(false));
        }
    }, [documentId, currentUser?.uid]);

    // 监听 props 中的 title 变化（例如侧边栏重命名）
    useEffect(() => {
        if (initialDocument?.title && initialDocument.title !== title) {
            setTitle(initialDocument.title);
        }
    }, [initialDocument?.title]);

    // 当 editorInstance 就绪且内容刚刚加载完成时，同步内容
    useEffect(() => {
        if (editorInstance && content && !editorInstance.getText()) {
            editorInstance.commands.setContent(content);
        }
    }, [editorInstance, content]);

    // UI 状态
    const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
    const [isCommentSidebarOpen, setIsCommentSidebarOpen] = useState(false);
    const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);
    const [isMagicCommandOpen, setIsMagicCommandOpen] = useState(false);
    const [isOutlinePanelOpen, setIsOutlinePanelOpen] = useState(false);
    const [isFocusModeActive, setIsFocusModeActive] = useState(false);
    const [viewingVersion, setViewingVersion] = useState<any>(null);

    // 评论状态
    const [comments, setComments] = useState<any[]>([]);
    const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
    const [newCommentDraft, setNewCommentDraft] = useState<any>(null);

    // 导出 Hook
    const { exportAsPDF } = useDocumentExport() as any;

    // 协作功能
    const collaborationUser = useMemo(() => ({
        id: currentUser.uid,
        name: currentUser.displayName || currentUser.email || '匿名用户',
    }), [currentUser]);

    const { toasts, dismissToast, notifyUserJoined, notifyUserLeft } = useCollaborationToast();

    const {
        ydoc,
        provider,
        isConnected,
        connectedUsers,
        connectionError,
        reconnectAttempts,
        reconnect,
    } = useCollaboration(documentId, collaborationUser, {
        onUserJoined: notifyUserJoined,
        onUserLeft: notifyUserLeft,
    }) as any;

    const collaboration = useMemo(() => {
        if (!ydoc || !provider || !isConnected) return undefined;
        try {
            if (typeof ydoc.getText !== 'function') return undefined;
        } catch { return undefined; }
        return { ydoc, provider, user: collaborationUser };
    }, [ydoc, provider, collaborationUser, isConnected]);

    // 自动保存
    const documentState = useMemo(() => ({ title, content, status }), [title, content, status]);
    const { saving, lastSaved, handleSave, isDirty } = useAutoSave(
        documentId,
        currentUser,
        documentState,
        effectiveStorageApi,
        isVersionHistoryOpen
    );

    // 加载评论
    useEffect(() => {
        if (effectiveStorageApi.getComments && currentUser) {
            effectiveStorageApi.getComments(currentUser.uid, documentId)
                .then(setComments)
                .catch(() => setComments([]));
        }
    }, [documentId, currentUser, effectiveStorageApi]);

    // 回调
    useEffect(() => {
        onTitleChange?.(title);
    }, [title, onTitleChange]);

    useEffect(() => {
        onContentChange?.(content);
    }, [content, onContentChange]);

    // 同步 dirty 状态到父组件
    useEffect(() => {
        onDirtyChange?.(isDirty);
    }, [isDirty, onDirtyChange]);

    // 快捷键
    useKeyboardShortcuts({
        onSave: handleSave,
        onPrint: exportAsPDF,
        onHistory: () => setIsVersionHistoryOpen(true),
    } as any);

    // 处理函数
    const handleBack = useCallback(() => {
        if (onBack) {
            onBack();
        } else {
            router.push('/dashboard');
        }
    }, [onBack, router]);

    const handleAddComment = useCallback(() => {
        console.log('[评论] handleAddComment 被调用, editorInstance:', !!editorInstance);
        if (!editorInstance) {
            console.warn('[评论] editorInstance 为空');
            alert('编辑器尚未准备好，请稍后再试');
            return;
        }
        const { from, to, empty } = editorInstance.state.selection;
        console.log('[评论] 选区信息:', { from, to, empty });
        if (empty) {
            alert('请先选择要评论的文本');
            return;
        }
        const quote = editorInstance.state.doc.textBetween(from, to, ' ');
        console.log('[评论] 引用文本:', quote);
        setIsCommentSidebarOpen(true);
        setIsAISidebarOpen(false);
        setNewCommentDraft({ quote, from, to });
    }, [editorInstance]);

    // 提交新评论
    const handleSubmitComment = useCallback(async (content: string, mentions: any[] = []) => {
        if (!newCommentDraft || !effectiveStorageApi.addComment) return;

        const commentData = {
            docId: documentId,
            quote: newCommentDraft.quote,
            content,
            mentions,
            author: {
                uid: currentUser.uid,
                name: currentUser.displayName || currentUser.email
            },
            status: 'open'
        };

        try {
            const newComment = await effectiveStorageApi.addComment(currentUser.uid, documentId, commentData);
            if (newComment) {
                setComments(prev => [...prev, newComment]);
                // 添加 CommentMark 到编辑器选区
                if (editorInstance && newCommentDraft.from && newCommentDraft.to) {
                    editorInstance.chain()
                        .focus()
                        .setTextSelection({ from: newCommentDraft.from, to: newCommentDraft.to })
                        .setComment({ commentId: newComment.id })
                        .setTextSelection(newCommentDraft.to)
                        .run();
                }
                setActiveCommentId(newComment.id);
            }
        } catch (error) {
            console.error('添加评论失败:', error);
            alert('评论保存失败，请重试');
        }
        setNewCommentDraft(null);
    }, [newCommentDraft, effectiveStorageApi, documentId, currentUser, editorInstance]);

    // 回复评论
    const handleReplyComment = useCallback(async (commentId: string, content: string) => {
        if (!effectiveStorageApi.addReply) return;

        const replyData = {
            content,
            author: {
                uid: currentUser.uid,
                name: currentUser.displayName || currentUser.email
            }
        };

        try {
            const newReply = await effectiveStorageApi.addReply(currentUser.uid, documentId, commentId, replyData);
            if (newReply) {
                setComments(prev => prev.map(c => {
                    if (c.id === commentId) {
                        return { ...c, replies: [...(c.replies || []), newReply] };
                    }
                    return c;
                }));
            }
        } catch (error) {
            console.error('添加回复失败:', error);
        }
    }, [effectiveStorageApi, documentId, currentUser]);

    // 解决评论
    const handleResolveComment = useCallback(async (commentId: string) => {
        if (!effectiveStorageApi.updateCommentStatus) return;

        try {
            const result = await effectiveStorageApi.updateCommentStatus(currentUser.uid, documentId, commentId, 'resolved');
            if (result) {
                setComments(prev => prev.map(c =>
                    c.id === commentId ? { ...c, status: 'resolved' } : c
                ));
            }
        } catch (error) {
            console.error('更新评论状态失败:', error);
        }
    }, [effectiveStorageApi, documentId, currentUser]);

    // 删除评论
    const handleDeleteComment = useCallback(async (commentId: string) => {
        if (!effectiveStorageApi.deleteComment) return;
        if (!window.confirm('确定要删除这条评论吗？')) return;

        try {
            await effectiveStorageApi.deleteComment(currentUser.uid, documentId, commentId);
            setComments(prev => prev.filter(c => c.id !== commentId));
            // 移除编辑器中的评论标记
            if (editorInstance) {
                const { doc } = editorInstance.state;
                doc.descendants((node: any, pos: number) => {
                    node.marks?.forEach((mark: any) => {
                        if (mark.type.name === 'comment' && mark.attrs.commentId === commentId) {
                            editorInstance.chain().focus().setTextSelection(pos).unsetComment().run();
                        }
                    });
                });
            }
        } catch (error) {
            console.error('删除评论失败:', error);
        }
    }, [effectiveStorageApi, documentId, currentUser, editorInstance]);

    // 选择评论（跳转到文档位置）
    const handleSelectComment = useCallback((commentId: string) => {
        setActiveCommentId(commentId);

        if (!editorInstance) return;

        const { doc } = editorInstance.state;
        let foundPos: number | null = null;

        doc.descendants((node: any, pos: number) => {
            if (foundPos !== null) return false;
            node.marks?.forEach((mark: any) => {
                if (mark.type.name === 'comment' && mark.attrs.commentId === commentId) {
                    foundPos = pos;
                }
            });
        });

        if (foundPos !== null) {
            editorInstance.chain().focus().setTextSelection(foundPos).run();
            // 高亮评论文本
            const commentElements = document.querySelectorAll(`[data-comment-id="${commentId}"]`);
            commentElements.forEach(el => {
                el.classList.add('active-comment');
                setTimeout(() => el.classList.remove('active-comment'), 2000);
            });
        }
    }, [editorInstance]);

    const handleMagicInsert = useCallback((text: string) => {
        if (editorInstance) {
            editorInstance.chain().focus().insertContent(text).run();
        }
    }, [editorInstance]);

    const handleImport = useCallback(async (file: File) => {
        try {
            const html = await importWordDoc(file) as string;
            if (editorInstance) {
                editorInstance.commands.setContent(html);
            } else {
                setContent(html);
            }
            if (!title || !title.trim()) {
                const fileName = file.name.replace(/\.[^/.]+$/, "");
                setTitle(fileName);
            }
        } catch (error) {
            console.error('[Import] 导入失败:', error);
            alert('导入失败');
        }
    }, [editorInstance, title]);

    const toggleAISidebar = useCallback(() => {
        setIsAISidebarOpen(!isAISidebarOpen);
        if (!isAISidebarOpen) setIsCommentSidebarOpen(false);
    }, [isAISidebarOpen]);

    const canEdit = status === DOC_STATUS.DRAFT && !isVersionHistoryOpen;

    return (
        <div className="h-full flex flex-col bg-[#f9fbfd] overflow-hidden">
            {/* 头部 */}
            {!isFocusModeActive && (
                <DocHeader
                    title={title}
                    setTitle={setTitle}
                    status={status}
                    saving={saving}
                    lastSaved={lastSaved}
                    onBack={showBackButton ? handleBack : () => { }}
                    onShare={() => alert('共享功能开发中...')}
                    onOpenVersionHistory={() => setIsVersionHistoryOpen(true)}
                    onImport={handleImport}
                    content={content}
                    editor={editorInstance}
                >
                    <CollaborationStatus
                        connectedUsers={connectedUsers}
                        isConnected={isConnected}
                        connectionError={connectionError}
                        reconnectAttempts={reconnectAttempts}
                        onReconnect={reconnect}
                    />
                    <button
                        onClick={toggleAISidebar}
                        className={`p-2 rounded-lg transition mr-2 flex items-center gap-1 ${isAISidebarOpen ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                        title="AI 助手"
                    >
                        <Sparkles size={18} />
                        <span className="text-sm font-medium">AI</span>
                    </button>
                </DocHeader>
            )}

            {/* 工具栏 */}
            {!isVersionHistoryOpen && !isFocusModeActive && (
                <DocToolbar editor={editorInstance} onAddComment={handleAddComment} />
            )}

            {/* 主内容区 */}
            <div className="flex flex-1 overflow-hidden relative">
                {/* 编辑区域 */}
                <div className="flex-1 overflow-y-auto flex flex-col items-center bg-[#F8F9FA] p-8">
                    <div className="bg-white shadow-sm flex flex-col" style={{ width: '816px', minHeight: '1123px' }}>
                        <div className="flex-1">
                            <RichTextEditor
                                content={content}
                                onChange={setContent}
                                editable={canEdit}
                                onEditorReady={setEditorInstance}
                                onMagicCommand={() => setIsMagicCommandOpen(true)}
                                collaboration={collaboration}
                            />
                        </div>
                    </div>
                </div>

                {/* 大纲面板 */}
                {isOutlinePanelOpen && !isVersionHistoryOpen && (
                    <DocOutlinePanel
                        editor={editorInstance}
                        isOpen={isOutlinePanelOpen}
                        className="w-56 flex-shrink-0 border-l"
                    />
                )}

                {/* AI 侧边栏 */}
                {isAISidebarOpen && !isVersionHistoryOpen && (
                    <div className="w-80 border-l border-gray-200 bg-white shadow-xl z-20">
                        <AISidebar
                            currentUser={currentUser}
                            currentDoc={{ id: documentId, content }}
                            onClose={() => setIsAISidebarOpen(false)}
                            embedded={true}
                            knowledgeBaseId={knowledgeBaseId}
                        />
                    </div>
                )}

                {/* 评论侧边栏 */}
                {isCommentSidebarOpen && !isVersionHistoryOpen && (
                    <div className="border-l border-gray-200">
                        <CommentSidebar
                            comments={comments}
                            currentUser={currentUser}
                            activeCommentId={activeCommentId}
                            onAddComment={handleAddComment}
                            onSubmitDraft={handleSubmitComment}
                            onReply={handleReplyComment}
                            onResolve={handleResolveComment}
                            onDelete={handleDeleteComment}
                            onSelectComment={handleSelectComment}
                            onClose={() => setIsCommentSidebarOpen(false)}
                            newCommentDraft={newCommentDraft}
                            onCancelDraft={() => setNewCommentDraft(null)}
                            users={connectedUsers || []}
                        />
                    </div>
                )}

                {/* 版本历史 */}
                {isVersionHistoryOpen && (
                    <VersionHistorySidebar
                        docId={documentId}
                        currentUser={currentUser}
                        currentVersionId={viewingVersion?.id}
                        onSelectVersion={(version: any) => {
                            setViewingVersion(version);
                            setContent(version.content);
                        }}
                        onClose={() => {
                            setIsVersionHistoryOpen(false);
                            setViewingVersion(null);
                        }}
                    />
                )}
            </div>

            {/* Magic Command */}
            <MagicCommand
                isOpen={isMagicCommandOpen}
                onClose={() => setIsMagicCommandOpen(false)}
                onInsert={handleMagicInsert}
                editor={editorInstance}
            />

            {/* 协作通知 */}
            <CollaborationToast toasts={toasts} onDismiss={dismissToast} />
        </div>
    );
}
