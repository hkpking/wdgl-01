import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft, RotateCcw, MessageSquarePlus, Sparkles } from 'lucide-react';
import RichTextEditor from '../components/RichTextEditor';
// import StructuredEditor from '../components/StructuredEditor/StructuredEditor'; // Removed
import DocHeader from '../components/DocHeader';
import DocToolbar from '../components/DocToolbar';
import DocOutline from '../components/DocOutline';
// import Ruler from '../components/Ruler';
import VersionHistorySidebar from '../components/VersionHistorySidebar';
import CommentSidebar from '../components/Comments/CommentSidebar';
import AISidebar from '../components/AI/AISidebar';
import MagicCommand from '../components/AI/MagicCommand';
import { getTextContent, isPlainText, plainTextToHtml } from '../utils/editor';
// import { htmlToBlocks, blocksToHtml } from '../utils/blockConverter'; // Removed
import { useStorage } from '../contexts/StorageContext';
import { useDocumentData } from '../hooks/useDocumentData';
import { useAutoSave } from '../hooks/useAutoSave';
import { DOC_STATUS, STATUS_LABELS } from '../utils/constants';

import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useDocumentExport } from '../hooks/useDocumentExport';
import { importWordDoc } from '../utils/ImportHandler';
import { useCollaboration } from '../hooks/useCollaboration';
import CollaborationStatus from '../components/shared/CollaborationStatus';
import EditModeSelector from '../components/EditModeSelector';

export default function Editor() {
    const { id } = useParams();
    const navigate = useNavigate();

    // 使用 mock 用户
    const storage = useStorage();
    const currentUser = storage.getCurrentUser();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState(''); // Keep for backward compatibility / export

    const [status, setStatus] = useState(DOC_STATUS.DRAFT);
    const [wordCount, setWordCount] = useState(0);
    const [editorInstance, setEditorInstance] = useState(null);

    // Version History State
    const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
    const [viewingVersion, setViewingVersion] = useState(null);

    // Export hook
    const { exportAsPDF } = useDocumentExport();

    // Collaboration hook
    const {
        ydoc,
        provider,
        isConnected,
        connectedUsers,
        connectionError,
        reconnectAttempts,
        reconnect
    } = useCollaboration(id, currentUser);

    // 稳定的用户颜色（只在用户变化时重新生成）
    const userColor = useMemo(() => {
        return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    }, [currentUser?.uid]);

    // 稳定的协作配置（避免每次渲染创建新对象）
    const collaborationConfig = useMemo(() => {
        if (!ydoc || !provider) return null;
        return {
            ydoc,
            provider,
            user: currentUser ? {
                id: currentUser.uid,
                name: currentUser.displayName || currentUser.email,
                color: userColor
            } : null
        };
    }, [ydoc, provider, currentUser, userColor]);

    // Comment System State
    const [comments, setComments] = useState([]);
    const [isCommentSidebarOpen, setIsCommentSidebarOpen] = useState(false);
    const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);
    const [isMagicCommandOpen, setIsMagicCommandOpen] = useState(false);
    const [activeCommentId, setActiveCommentId] = useState(null);
    const [newCommentDraft, setNewCommentDraft] = useState(null);

    // Edit Mode State (编辑模式/建议模式)
    const [editMode, setEditMode] = useState('editing'); // 'editing' | 'suggesting'

    // Document Data Hook
    const { document: loadedDoc, loading, error, reload } = useDocumentData(id, currentUser);

    // 追踪已处理的文档，避免重复设置状态
    const processedDocRef = React.useRef(null);

    useEffect(() => {
        // 如果 loadedDoc 没有变化或已经处理过，跳过
        if (!loadedDoc || processedDocRef.current === loadedDoc.id) {
            return;
        }

        // 标记这个文档已处理
        processedDocRef.current = loadedDoc.id;

        setTitle(loadedDoc.title || '');
        setContent(loadedDoc.content || '');
        setStatus(loadedDoc.status || DOC_STATUS.DRAFT);

        // 异步加载评论
        const loadComments = async () => {
            try {
                const loadedComments = await storage.getComments(currentUser.uid, id);
                setComments(loadedComments || []);
            } catch (err) {
                console.error('加载评论失败:', err);
                setComments([]);
            }
        };
        loadComments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadedDoc?.id]);

    // Update browser tab title
    useEffect(() => {
        if (title) {
            document.title = `${title} - 在线文档系统`;
        } else {
            document.title = '在线文档系统';
        }

        // Cleanup on unmount
        return () => {
            document.title = '在线文档系统';
        };
    }, [title]);

    // Auto Save Hook
    const documentState = React.useMemo(() => ({ title, content, status }), [title, content, status]);
    const { saving, lastSaved, handleSave, isDirty } = useAutoSave(
        id,
        currentUser,
        documentState,
        isVersionHistoryOpen
    );

    // Debug log removed to prevent console spam

    const handleImport = async (file) => {
        try {
            const html = await importWordDoc(file);
            // Directly set imported HTML
            if (editorInstance) {
                editorInstance.commands.setContent(html);
            } else {
                setContent(html);
            }

            // Set title if empty to ensure auto-save works
            if (!title || !title.trim()) {
                // Remove extension from filename
                const fileName = file.name.replace(/\.[^/.]+$/, "");
                setTitle(fileName);
            }

            alert('导入成功！');
        } catch (error) {
            console.error('Import failed:', error);
            alert(`导入失败: ${error.message}`);
        }
    };

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
        setIsAISidebarOpen(false); // Close AI sidebar if opening comments
        setNewCommentDraft({ quote, from, to });
    };

    const handleSubmitComment = async (content) => {
        if (!newCommentDraft || !currentUser) return;

        const commentData = {
            docId: id,
            quote: newCommentDraft.quote,
            content,
            author: {
                uid: currentUser.uid,
                name: currentUser.displayName || currentUser.email
            }
        };

        try {
            const newComment = await storage.addComment(currentUser.uid, id, commentData);

            if (!newComment) {
                console.error('添加评论失败');
                alert('评论保存失败，请重试');
                return;
            }

            setComments([...comments, newComment]);

            // Add CommentMark to selected text
            if (editorInstance && newCommentDraft.from && newCommentDraft.to) {
                editorInstance.chain()
                    .focus()
                    .setTextSelection({ from: newCommentDraft.from, to: newCommentDraft.to })
                    .setComment({ commentId: newComment.id })
                    // 关键修复：设置标记后将光标移到标记末尾之外，避免后续输入继承高亮
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

    const handleReply = async (commentId, content) => {
        if (!currentUser) return;
        const replyData = {
            content,
            author: {
                uid: currentUser.uid,
                name: currentUser.displayName || currentUser.email
            }
        };

        try {
            const newReply = await storage.addReply(currentUser.uid, id, commentId, replyData);
            if (!newReply) return;

            // Update local state
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

    const handleResolve = async (commentId) => {
        try {
            const result = await storage.updateCommentStatus(currentUser.uid, id, commentId, 'resolved');
            if (result) {
                setComments(comments.map(c => c.id === commentId ? { ...c, status: 'resolved' } : c));
            }
        } catch (error) {
            console.error('更新评论状态失败:', error);
        }
    };

    const handleDelete = async (commentId) => {
        if (window.confirm('确定要删除这条评论吗？')) {
            try {
                await storage.deleteComment(currentUser.uid, id, commentId);
                setComments(comments.filter(c => c.id !== commentId));
            } catch (error) {
                console.error('删除评论失败:', error);
            }
        }
    };

    // 点击侧边栏评论跳转到文档对应位置
    const handleSelectComment = (commentId) => {
        setActiveCommentId(commentId);

        if (!editorInstance) return;

        // 查找文档中带有此 commentId 的标记位置
        const { doc } = editorInstance.state;
        let foundPos = null;

        doc.descendants((node, pos) => {
            if (foundPos) return false; // 已找到，停止搜索

            node.marks.forEach(mark => {
                if (mark.type.name === 'comment' && mark.attrs.commentId === commentId) {
                    foundPos = pos;
                }
            });
        });

        if (foundPos !== null) {
            // 滚动到该位置并高亮
            editorInstance.chain().focus().setTextSelection(foundPos).run();

            // 添加临时高亮效果：给当前选中的评论添加 active 类
            const commentElements = document.querySelectorAll(`[data-comment-id="${commentId}"]`);
            commentElements.forEach(el => {
                el.classList.add('active-comment');
                setTimeout(() => el.classList.remove('active-comment'), 2000);
            });
        }
    };

    // Magic Command - 使用 useCallback 确保引用稳定，避免编辑器重建
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
        onClearFormat: () => { } // Not applicable for block editor yet
    });

    const handleBack = () => {
        if (isDirty) {
            if (window.confirm('您有未保存的更改，确定要离开吗？')) {
                navigate('/');
            }
        } else {
            navigate('/');
        }
    };

    const handleShare = () => {
        alert('共享功能开发中...');
    };



    const handleRestoreVersion = () => {
        if (!viewingVersion) return;

        if (window.confirm('确定要还原到此版本吗？当前未保存的更改将会丢失。')) {
            setContent(viewingVersion.content);
            // setLastSavedContent(viewingVersion.content); // Removed
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
                // Note: setLastSaved is now handled by useAutoSave, but here we are doing manual restore.
                // We might need to force a reload or update state.
                // For now, simple reload might be safest or just let auto-save pick it up.
                window.location.reload();
            }, 100);
        }
    };

    // Determine if editable (id always exists in instant creation mode)
    const canEdit = status === DOC_STATUS.DRAFT && !isVersionHistoryOpen;

    const structuredEditorRef = useRef(null);

    const handleInsertBlock = (type, meta) => {
        if (editorInstance) {
            if (type === 'flowchart') {
                editorInstance.chain().focus().insertContent({
                    type: 'flowchart',
                    attrs: {
                        xml: null,
                        previewUrl: null,
                        width: '100%',
                        height: '500px',
                    }
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

    const handleMagicInsert = (text) => {
        if (editorInstance) {
            // Insert text at current selection
            // If it looks like markdown, we might want to parse it, but for now just insert text
            // Tiptap's insertContent handles HTML or text
            editorInstance.chain().focus().insertContent(text).run();
        }
    };

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
                            onClick={() => navigate('/')}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                        >
                            返回仪表盘
                        </button>
                        <button
                            onClick={() => navigate(`/view/${id}`)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                            查看文档
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-[#f9fbfd] overflow-hidden">
            {/* ... (Header logic remains same) ... */}
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
                    onAddComment={handleAddComment} // Pass handler
                    onImport={handleImport}
                    onInsertBlock={handleInsertBlock} // Pass insert handler
                    content={content} // Pass content for export
                    editor={editorInstance}
                >
                    {/* 协作状态 */}
                    <CollaborationStatus
                        connectedUsers={connectedUsers}
                        isConnected={isConnected}
                        connectionError={connectionError}
                        reconnectAttempts={reconnectAttempts}
                        onReconnect={reconnect}
                    />

                    {/* 编辑模式切换 */}
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

            {/* Legacy Toolbar - Restored */}
            {!isVersionHistoryOpen && <div className="no-print"><DocToolbar editor={editorInstance} onAddComment={handleAddComment} /></div>}

            <div className="flex flex-1 overflow-hidden relative print-content-wrapper">
                {/* Left Sidebar: Outline */}
                {!isVersionHistoryOpen && <div className="no-print"><DocOutline editor={editorInstance} /></div>}

                {/* Main Content Area */}
                <div className="flex-1 overflow-y-auto flex flex-col items-center bg-[#F8F9FA] relative print-content-wrapper p-8">

                    {/* Page Container */}
                    <div className="bg-white shadow-sm flex flex-col" style={{ width: '816px', minHeight: '1123px' }}>
                        {/* Ruler Removed per user request */}
                        {/* <Ruler editor={editorInstance} /> */}

                        {/* Editor Area */}
                        <div className="flex-1">
                            <RichTextEditor
                                content={content}
                                onChange={setContent}
                                editable={canEdit}
                                onEditorReady={setEditorInstance}
                                onMagicCommand={handleOpenMagicCommand}
                                collaboration={collaborationConfig}
                            />
                        </div>
                    </div>
                </div>

                {/* Magic Command Overlay */}
                <MagicCommand
                    isOpen={isMagicCommandOpen}
                    onClose={() => setIsMagicCommandOpen(false)}
                    onInsert={handleMagicInsert}
                    editor={editorInstance}
                />

                {/* Right Sidebar: Version History OR Comment Sidebar OR AI Sidebar */}
                {
                    isVersionHistoryOpen && (
                        <div className="no-print">
                            <VersionHistorySidebar
                                docId={id}
                                currentUser={currentUser}
                                currentVersionId={viewingVersion?.id}
                                onSelectVersion={(version) => {
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
                    )
                }

                {/* Comment Sidebar */}
                {
                    !isVersionHistoryOpen && isCommentSidebarOpen && (
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
                                users={connectedUsers} // 协作用户列表用于 @提及
                            />
                        </div>
                    )
                }

                {/* AI Sidebar */}
                {
                    !isVersionHistoryOpen && isAISidebarOpen && (
                        <div className="no-print border-l border-gray-200 w-80 bg-white shadow-xl z-20">
                            <AISidebar
                                currentUser={currentUser}
                                currentDoc={{ id: id, content: content }} // Pass content for context
                                onClose={() => setIsAISidebarOpen(false)}
                                embedded={true}
                            />
                        </div>
                    )
                }
            </div >
        </div >
    );
}
