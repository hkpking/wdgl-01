"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Clock, ArrowLeft, RotateCcw, MessageSquarePlus, Sparkles } from 'lucide-react';
import RichTextEditor from '@/components/RichTextEditor';
import DocHeader from '@/components/DocHeader';
import DocToolbar from '@/components/DocToolbar';
import VersionHistorySidebar from '@/components/VersionHistorySidebar';
import CommentSidebar from '@/components/Comments/CommentSidebar';
import AISidebar from '@/components/AI/AISidebar';
import MagicCommand from '@/components/AI/MagicCommand';
import { getTextContent, isPlainText, plainTextToHtml } from '@/lib/editor-utils';
import { useDocumentData } from '@/hooks/useDocumentData';
import { useAutoSave } from '@/hooks/useAutoSave';
import { DOC_STATUS, STATUS_LABELS } from '@/lib/constants';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useDocumentExport } from '@/hooks/useDocumentExport';
import CollaborationStatus from '@/components/shared/CollaborationStatus';
import EditModeSelector from '@/components/EditModeSelector';
import * as storage from '@/lib/storage';

export default function EditorPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    // 使用 mock 用户
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        const user = storage.getCurrentUser();
        if (!user) {
            router.push('/login');
            return;
        }
        setCurrentUser(user);
    }, [router]);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [status, setStatus] = useState(DOC_STATUS.DRAFT);
    const [wordCount, setWordCount] = useState(0);
    const [editorInstance, setEditorInstance] = useState<any>(null);

    // Version History State
    const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
    const [viewingVersion, setViewingVersion] = useState<any>(null);

    // Export hook
    const { exportAsPDF } = useDocumentExport() as any;

    // Comment System State
    const [comments, setComments] = useState<any[]>([]);
    const [isCommentSidebarOpen, setIsCommentSidebarOpen] = useState(false);
    const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);
    const [isMagicCommandOpen, setIsMagicCommandOpen] = useState(false);
    const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
    const [newCommentDraft, setNewCommentDraft] = useState<any>(null);

    // Edit Mode State
    const [editMode, setEditMode] = useState('editing');

    // Document Data Hook
    const { document: loadedDoc, loading, error, reload } = useDocumentData(id, currentUser) as any;

    // 追踪已处理的文档
    const processedDocRef = useRef<string | null>(null);

    useEffect(() => {
        if (!loadedDoc || processedDocRef.current === loadedDoc.id) {
            return;
        }
        processedDocRef.current = loadedDoc.id;
        setTitle(loadedDoc.title || '');
        setContent(loadedDoc.content || '');
        setStatus(loadedDoc.status || DOC_STATUS.DRAFT);

        // 异步加载评论
        const loadComments = async () => {
            try {
                const loadedComments = storage.getComments(currentUser?.uid, id);
                setComments(loadedComments || []);
            } catch (err) {
                console.error('加载评论失败:', err);
                setComments([]);
            }
        };
        if (currentUser) loadComments();
    }, [loadedDoc?.id, currentUser, id]);

    // Update browser tab title
    useEffect(() => {
        if (title) {
            document.title = `${title} - 在线文档系统`;
        } else {
            document.title = '在线文档系统';
        }
        return () => {
            document.title = '在线文档系统';
        };
    }, [title]);

    // Auto Save Hook
    const documentState = useMemo(() => ({ title, content, status }), [title, content, status]);
    const { saving, lastSaved, handleSave, isDirty } = useAutoSave(
        id,
        currentUser,
        documentState,
        isVersionHistoryOpen
    );

    // Comment Handlers
    const handleAddComment = () => {
        if (!editorInstance) return;
        const { from, to, empty } = editorInstance.state.selection;
        if (empty) {
            alert('请先选择要评论的文本');
            return;
        }
        const quote = editorInstance.state.doc.textBetween(from, to, ' ');
        setIsCommentSidebarOpen(true);
        setIsAISidebarOpen(false);
        setNewCommentDraft({ quote, from, to });
    };

    const handleSubmitComment = async (commentContent: string) => {
        if (!newCommentDraft || !currentUser) return;
        const commentData = {
            docId: id,
            quote: newCommentDraft.quote,
            content: commentContent,
            author: {
                uid: currentUser.uid,
                name: currentUser.displayName || currentUser.email
            }
        };

        try {
            const newComment = storage.addComment(currentUser.uid, id, commentData);
            if (!newComment) {
                alert('评论保存失败，请重试');
                return;
            }
            setComments([...comments, newComment]);
            if (editorInstance && newCommentDraft.from && newCommentDraft.to) {
                editorInstance.chain()
                    .focus()
                    .setTextSelection({ from: newCommentDraft.from, to: newCommentDraft.to })
                    .setComment({ commentId: newComment.id })
                    .setTextSelection(newCommentDraft.to)
                    .run();
            }
            setNewCommentDraft(null);
            setActiveCommentId(newComment.id);
        } catch (error) {
            console.error('添加评论失败:', error);
            alert('评论保存失败，请重试');
        }
    };

    const handleReply = async (commentId: string, replyContent: string) => {
        if (!currentUser) return;
        const replyData = {
            content: replyContent,
            author: {
                uid: currentUser.uid,
                name: currentUser.displayName || currentUser.email
            }
        };
        try {
            const newReply = storage.addReply(currentUser.uid, id, commentId, replyData);
            if (!newReply) return;
            setComments(comments.map(c => {
                if (c.id === commentId) {
                    return { ...c, replies: [...(c.replies || []), newReply] };
                }
                return c;
            }));
        } catch (error) {
            console.error('添加回复失败:', error);
        }
    };

    const handleResolve = async (commentId: string) => {
        try {
            const result = storage.updateCommentStatus(currentUser.uid, id, commentId, 'resolved');
            if (result) {
                setComments(comments.map(c => c.id === commentId ? { ...c, status: 'resolved' } : c));
            }
        } catch (error) {
            console.error('更新评论状态失败:', error);
        }
    };

    const handleDelete = async (commentId: string) => {
        if (window.confirm('确定要删除这条评论吗？')) {
            try {
                storage.deleteComment(currentUser.uid, id, commentId);
                setComments(comments.filter(c => c.id !== commentId));
            } catch (error) {
                console.error('删除评论失败:', error);
            }
        }
    };

    const handleSelectComment = (commentId: string) => {
        setActiveCommentId(commentId);
        if (!editorInstance) return;
        const { doc } = editorInstance.state;
        let foundPos: number | null = null;
        doc.descendants((node: any, pos: number) => {
            if (foundPos) return false;
            node.marks.forEach((mark: any) => {
                if (mark.type.name === 'comment' && mark.attrs.commentId === commentId) {
                    foundPos = pos;
                }
            });
        });
        if (foundPos !== null) {
            editorInstance.chain().focus().setTextSelection(foundPos).run();
        }
    };

    const handleOpenMagicCommand = useCallback(() => {
        setIsMagicCommandOpen(true);
    }, []);

    const toggleAISidebar = () => {
        setIsAISidebarOpen(!isAISidebarOpen);
        if (!isAISidebarOpen) setIsCommentSidebarOpen(false);
    };

    // Keyboard Shortcuts
    useKeyboardShortcuts({
        onSave: handleSave,
        onPrint: exportAsPDF,
        onHistory: () => setIsVersionHistoryOpen(true),
        onWordCount: () => alert(`当前文档字数: ${wordCount} 字`),
        onClearFormat: () => { }
    } as any);

    const handleBack = () => {
        if (isDirty) {
            if (window.confirm('您有未保存的更改，确定要离开吗？')) {
                router.push('/dashboard');
            }
        } else {
            router.push('/dashboard');
        }
    };

    const handleShare = () => {
        alert('共享功能开发中...');
    };

    const handleRestoreVersion = () => {
        if (!viewingVersion) return;
        if (window.confirm('确定要还原到此版本吗？当前未保存的更改将会丢失。')) {
            setContent(viewingVersion.content);
            setIsVersionHistoryOpen(false);
            setViewingVersion(null);
            setTimeout(() => {
                const docData = {
                    title,
                    content: viewingVersion.content,
                    status,
                    contentType: 'html'
                };
                storage.saveDocument(currentUser.uid, id, docData);
                storage.saveVersion(currentUser.uid, id, { title, content: viewingVersion.content, status });
                window.location.reload();
            }, 100);
        }
    };

    const canEdit = status === DOC_STATUS.DRAFT && !isVersionHistoryOpen;

    const handleInsertBlock = (type: string, meta?: any) => {
        if (editorInstance) {
            if (type === 'flowchart') {
                editorInstance.chain().focus().insertContent({
                    type: 'flowchart',
                    attrs: { xml: null, previewUrl: null, width: '100%', height: '500px' }
                }).run();
            } else if (type === 'image' && meta?.src) {
                editorInstance.chain().focus().setImage({ src: meta.src }).run();
            } else if (type === 'table' && meta?.rows && meta?.cols) {
                editorInstance.chain().focus().insertTable({
                    rows: meta.rows,
                    cols: meta.cols,
                    withHeaderRow: true
                }).run();
            }
        }
    };

    const handleMagicInsert = (text: string) => {
        if (editorInstance) {
            editorInstance.chain().focus().insertContent(text).run();
        }
    };

    const handleImport = async (file: File) => {
        // Simplified import - just read as text for now
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            if (editorInstance) {
                editorInstance.commands.setContent(text);
            } else {
                setContent(text);
            }
            if (!title || !title.trim()) {
                const fileName = file.name.replace(/\.[^/.]+$/, "");
                setTitle(fileName);
            }
            alert('导入成功！');
        };
        reader.readAsText(file);
    };

    if (!currentUser) {
        return <div className="min-h-screen flex items-center justify-center">加载中...</div>;
    }

    if (id && !canEdit && !isVersionHistoryOpen) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
                    <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock size={32} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">文档处于&quot;{STATUS_LABELS[status]}&quot;状态</h2>
                    <p className="text-gray-600 mb-6">当前状态下无法直接编辑。如需修改，请先撤回或创建新版本。</p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                        >
                            返回仪表盘
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-[#f9fbfd] overflow-hidden">
            {isVersionHistoryOpen ? (
                <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-20 shadow-sm">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => {
                                setIsVersionHistoryOpen(false);
                                setViewingVersion(null);
                                reload();
                            }}
                            className="text-gray-600 hover:bg-gray-100 p-2 rounded transition"
                        >
                            ← 返回编辑
                        </button>
                        <div>
                            <h2 className="font-medium text-gray-900">版本历史</h2>
                            {viewingVersion && (
                                <p className="text-xs text-gray-500">
                                    正在查看历史版本 - {new Date(viewingVersion.savedAt).toLocaleString()}
                                </p>
                            )}
                        </div>
                    </div>
                    {viewingVersion && (
                        <button
                            onClick={handleRestoreVersion}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                        >
                            恢复此版本
                        </button>
                    )}
                </header>
            ) : (
                <DocHeader
                    title={title}
                    setTitle={setTitle}
                    status={status}
                    saving={saving}
                    lastSaved={lastSaved}
                    onBack={handleBack}
                    onShare={handleShare}
                    onOpenVersionHistory={() => setIsVersionHistoryOpen(true)}
                    onAddComment={handleAddComment}
                    onImport={handleImport}
                    onInsertBlock={handleInsertBlock}
                    content={content}
                    editor={editorInstance}
                >
                    <CollaborationStatus
                        connectedUsers={[]}
                        isConnected={true}
                        connectionError={null}
                        reconnectAttempts={0}
                        onReconnect={() => { }}
                    />
                    <EditModeSelector
                        mode={editMode}
                        onChange={setEditMode}
                        currentUser={currentUser}
                    />
                    <button
                        onClick={toggleAISidebar}
                        className={`p-2 rounded-lg transition mr-2 flex items-center gap-1 ${isAISidebarOpen ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
                        title="AI 助手"
                    >
                        <Sparkles size={18} />
                        <span className="text-sm font-medium">AI 助手</span>
                    </button>
                </DocHeader>
            )}

            {!isVersionHistoryOpen && <div className="no-print"><DocToolbar editor={editorInstance} onAddComment={handleAddComment} /></div>}

            <div className="flex flex-1 overflow-hidden relative print-content-wrapper">
                <div className="flex-1 overflow-y-auto flex flex-col items-center bg-[#F8F9FA] relative print-content-wrapper p-8">
                    <div className="bg-white shadow-sm flex flex-col" style={{ width: '816px', minHeight: '1123px' }}>
                        <div className="flex-1">
                            <RichTextEditor
                                content={content}
                                onChange={setContent}
                                editable={canEdit}
                                onEditorReady={setEditorInstance}
                                onMagicCommand={handleOpenMagicCommand}
                            />
                        </div>
                    </div>
                </div>

                <MagicCommand
                    isOpen={isMagicCommandOpen}
                    onClose={() => setIsMagicCommandOpen(false)}
                    onInsert={handleMagicInsert}
                    editor={editorInstance}
                />

                {isVersionHistoryOpen && (
                    <div className="no-print">
                        <VersionHistorySidebar
                            docId={id}
                            currentUser={currentUser}
                            currentVersionId={viewingVersion?.id}
                            onSelectVersion={(version: any) => {
                                setViewingVersion(version);
                                setContent(version.content);
                            }}
                            onClose={() => {
                                setIsVersionHistoryOpen(false);
                                setViewingVersion(null);
                                reload();
                            }}
                        />
                    </div>
                )}

                {!isVersionHistoryOpen && isCommentSidebarOpen && (
                    <div className="no-print border-l border-gray-200">
                        <CommentSidebar
                            comments={comments}
                            currentUser={currentUser}
                            activeCommentId={activeCommentId}
                            onAddComment={handleAddComment}
                            onReply={handleReply}
                            onResolve={handleResolve}
                            onDelete={handleDelete}
                            onClose={() => setIsCommentSidebarOpen(false)}
                            newCommentDraft={newCommentDraft}
                            onCancelDraft={() => setNewCommentDraft(null)}
                            onSubmitDraft={handleSubmitComment}
                            onSelectComment={handleSelectComment}
                            users={[]}
                        />
                    </div>
                )}

                {!isVersionHistoryOpen && isAISidebarOpen && (
                    <div className="no-print border-l border-gray-200 w-80 bg-white shadow-xl z-20">
                        <AISidebar
                            currentUser={currentUser}
                            currentDoc={{ id: id, content: content }}
                            onClose={() => setIsAISidebarOpen(false)}
                            embedded={true}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
