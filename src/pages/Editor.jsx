import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ArrowLeft, RotateCcw, MessageSquarePlus, Sparkles } from 'lucide-react';
import StructuredEditor from '../components/StructuredEditor/StructuredEditor';
import DocHeader from '../components/DocHeader';
import DocToolbar from '../components/DocToolbar';
// import DocOutline from '../components/DocOutline'; // Replaced by internal sidebar
// import Ruler from '../components/Ruler'; // Not needed for block editor
import VersionHistorySidebar from '../components/VersionHistorySidebar';
import CommentSidebar from '../components/Comments/CommentSidebar';
import AISidebar from '../components/AI/AISidebar';
import { getTextContent, isPlainText, plainTextToHtml } from '../utils/editor';
import { htmlToBlocks, blocksToHtml } from '../utils/blockConverter';
import { useStorage } from '../contexts/StorageContext';
import { useDocumentData } from '../hooks/useDocumentData';
import { useAutoSave } from '../hooks/useAutoSave';
import { DOC_STATUS, STATUS_LABELS } from '../utils/constants';

import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useDocumentExport } from '../hooks/useDocumentExport';
import { importWordDoc } from '../utils/ImportHandler';

export default function Editor() {
    const { id } = useParams();
    const navigate = useNavigate();

    // 使用 mock 用户
    const storage = useStorage();
    const currentUser = storage.getCurrentUser();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState(''); // Keep for backward compatibility / export
    const [blocks, setBlocks] = useState([]); // New block state
    const [status, setStatus] = useState(DOC_STATUS.DRAFT);
    const [wordCount, setWordCount] = useState(0);
    // const [editorInstance, setEditorInstance] = useState(null); // No longer using Tiptap instance directly

    // Version History State
    const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
    const [viewingVersion, setViewingVersion] = useState(null);

    // Export hook
    const { exportAsPDF } = useDocumentExport();

    // Comment System State
    const [comments, setComments] = useState([]);
    const [isCommentSidebarOpen, setIsCommentSidebarOpen] = useState(false);
    const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);
    const [activeCommentId, setActiveCommentId] = useState(null);
    const [newCommentDraft, setNewCommentDraft] = useState(null);

    // Document Data Hook
    const { document: loadedDoc, loading, error, reload } = useDocumentData(id, currentUser);

    useEffect(() => {
        if (loadedDoc) {
            setTitle(loadedDoc.title || '');
            setContent(loadedDoc.content || '');
            setBlocks(loadedDoc.blocks || []);
            setStatus(loadedDoc.status || DOC_STATUS.DRAFT);
            // Load Comments
            const loadedComments = storage.getComments(currentUser.uid, id);
            setComments(loadedComments);
        }
    }, [loadedDoc, id, currentUser?.uid, storage]);

    // Auto Save Hook
    const documentState = React.useMemo(() => ({ title, blocks, status }), [title, blocks, status]);
    const { saving, lastSaved, handleSave, isDirty } = useAutoSave(
        id,
        currentUser,
        documentState,
        isVersionHistoryOpen
    );

    useEffect(() => {
        console.log('[Editor] Render');
    });

    const handleImport = async (file) => {
        try {
            const html = await importWordDoc(file);
            const newBlocks = htmlToBlocks(html);
            // Append new blocks
            setBlocks(prev => [...prev, ...newBlocks]);
            alert('导入成功！');
        } catch (error) {
            console.error('Import failed:', error);
            alert(`导入失败: ${error.message}`);
        }
    };

    // Comment Handlers
    const handleAddComment = () => {
        alert('评论功能正在适配新编辑器，暂时不可用');
        return;
        // if (!editorInstance) return;
        // const { from, to, empty } = editorInstance.state.selection;

        // if (empty) {
        //     alert('请先选择要评论的文本');
        //     return;
        // }

        // const quote = editorInstance.state.doc.textBetween(from, to, ' ');
        // setIsCommentSidebarOpen(true);
        // setIsAISidebarOpen(false); // Close AI sidebar if opening comments
        // setNewCommentDraft({ quote, from, to });
    };

    const handleSubmitComment = (content) => {
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

        const newComment = storage.addComment(currentUser.uid, id, commentData);
        setComments([...comments, newComment]);

        // Add Mark to Editor - Disabled for Block Editor
        // editorInstance.chain().focus().setTextSelection({ from: newCommentDraft.from, to: newCommentDraft.to }).setComment({ commentId: newComment.id }).run();

        setNewCommentDraft(null);
        setActiveCommentId(newComment.id);
    };

    const handleReply = (commentId, content) => {
        if (!currentUser) return;
        const replyData = {
            content,
            author: {
                uid: currentUser.uid,
                name: currentUser.displayName || currentUser.email
            }
        };
        const newReply = storage.addReply(currentUser.uid, id, commentId, replyData);

        // Update local state
        setComments(comments.map(c => {
            if (c.id === commentId) {
                return { ...c, replies: [...c.replies, newReply] };
            }
            return c;
        }));
    };

    const handleResolve = (commentId) => {
        const updatedComment = storage.updateCommentStatus(currentUser.uid, id, commentId, 'resolved');
        setComments(comments.map(c => c.id === commentId ? updatedComment : c));
    };

    const handleDelete = (commentId) => {
        if (window.confirm('确定要删除这条评论吗？')) {
            storage.deleteComment(currentUser.uid, id, commentId);
            setComments(comments.filter(c => c.id !== commentId));

            // Remove Mark from Editor (This is tricky without knowing exact range, 
            // but Tiptap marks are part of the document content. 
            // We need to find marks with this commentId and unset them.
            // For now, we rely on the user manually removing it or we implement a 'unsetComment' command that scans doc.)
            // Simplified: Just remove from list. The mark stays until manually removed or we implement advanced removal.
            // Better: We can traverse the doc to find the mark.
            // For MVP, let's leave the mark but it won't link to anything valid, or we can try to remove it if active.
        }
    };

    const toggleAISidebar = () => {
        // Open AI tab in StructuredEditor
        if (structuredEditorRef.current) {
            structuredEditorRef.current.openAITab();
        }
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
        if (structuredEditorRef.current) {
            structuredEditorRef.current.addBlock(type, meta);
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
                    editor={null} // Removed editor instance
                >
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

            {/* Legacy Toolbar - Only show if NOT using block editor (or if we want to support mixed mode later) */}
            {/* For now, we hide it because StructuredEditor has its own toolbar */}
            {/* {!isVersionHistoryOpen && <div className="no-print"><DocToolbar editor={null} onAddComment={handleAddComment} /></div>} */}

            <div className="flex flex-1 overflow-hidden relative print-content-wrapper">
                {/* Left Sidebar: Outline - Replaced by StructuredEditor's internal sidebar */}
                {/* {!isVersionHistoryOpen && <div className="no-print"><DocOutline editor={editorInstance} /></div>} */}

                {/* Main Content Area */}
                {/* Main Content Area */}
                <div className="flex-1 overflow-hidden flex flex-col bg-[#f9fbfd] relative print-content-wrapper">
                    {/* Structured Editor - Full Width/Height */}
                    <StructuredEditor
                        ref={structuredEditorRef}
                        blocks={blocks}
                        onChange={(newBlocks) => {
                            setBlocks(newBlocks);
                            // Update content string for comparison/autosave check
                            const newHtml = blocksToHtml(newBlocks);
                            setContent(newHtml);
                            setWordCount(getTextContent(newHtml).length);
                        }}
                        readOnly={!canEdit}
                        currentUser={currentUser}
                        docId={id}
                    />
                </div>

                {/* Right Sidebar: Version History OR Comment Sidebar */}
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
                            />
                        </div>
                    )
                }

                {/* AI Sidebar removed - Integrated into StructuredEditor's RightSidebar */}
            </div >
        </div >
    );
}
