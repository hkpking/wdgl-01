import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Clock, RotateCcw } from 'lucide-react';
import RichTextEditor from '../components/RichTextEditor';
import ErrorBoundary from '../components/ErrorBoundary';
import { getTextContent, isPlainText, plainTextToHtml } from '../utils/editor';
import * as mockStorage from '../services/mockStorage';

export default function Editor() {
    const { id } = useParams();
    const navigate = useNavigate();

    // 使用 mock 用户
    const currentUser = mockStorage.getCurrentUser();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [wordCount, setWordCount] = useState(0);
    const [showHistory, setShowHistory] = useState(false);
    const [versions, setVersions] = useState([]);
    const [lastSavedContent, setLastSavedContent] = useState('');
    const [confirmingVersionId, setConfirmingVersionId] = useState(null);

    // Load document if ID exists
    useEffect(() => {
        if (!id || !currentUser) return;

        const loadDoc = () => {
            console.log('[LOAD] Loading document:', id);
            const doc = mockStorage.getDocument(currentUser.uid, id);

            if (doc) {
                console.log('[LOAD] Document found:', doc);
                setTitle(doc.title || '');

                // Handle both HTML and plain text formats
                let loadedContent = doc.content || '';
                if (isPlainText(loadedContent)) {
                    loadedContent = plainTextToHtml(loadedContent);
                }
                setContent(loadedContent);
                setLastSavedContent(loadedContent);
                setLastSaved(doc.updatedAt ? new Date(doc.updatedAt) : (doc.createdAt ? new Date(doc.createdAt) : null));
            } else {
                console.log('[LOAD] Document not found, redirecting to home');
                navigate('/');
            }
        };

        loadDoc();
    }, [id]); // 只依赖 id,避免循环

    // Update word count
    useEffect(() => {
        const plainText = getTextContent(content);
        setWordCount(plainText.length);
    }, [content]);

    const saveDocument = useCallback(async (silent = false) => {
        console.log('[SAVE] Starting save process...', { title, contentLength: content?.length, id, silent });

        if (!title && !content) {
            console.log('[SAVE] Aborted: No title and no content');
            return;
        }

        if (!currentUser) {
            console.error('[SAVE] Aborted: No current user - user not logged in!');
            alert('请先登录后再保存文档');
            return;
        }

        console.log('[SAVE] Current user:', currentUser.uid);
        console.log('[SAVE] Setting saving state to true');
        setSaving(true);

        try {
            const docData = {
                title,
                content,
                contentType: 'html'
            };

            if (id) {
                // Update existing document
                console.log('[SAVE] Updating existing document with ID:', id);

                // Save version before update
                console.log('[SAVE] Creating version backup...');
                mockStorage.saveVersion(currentUser.uid, id, { title, content });
                console.log('[SAVE] Version backup created');

                console.log('[SAVE] Updating document...');
                mockStorage.saveDocument(currentUser.uid, id, docData);
                console.log('[SAVE] Document updated successfully');
            } else {
                // Create new document
                console.log('[SAVE] Creating new document...');
                const savedDoc = mockStorage.saveDocument(currentUser.uid, null, docData);
                console.log('[SAVE] New document created with ID:', savedDoc.id);

                // Create initial version
                console.log('[SAVE] Creating initial version...');
                mockStorage.saveVersion(currentUser.uid, savedDoc.id, { title, content });
                console.log('[SAVE] Initial version created');

                // Navigate to the new document URL
                console.log('[SAVE] Navigating to new document...');
                navigate(`/editor/${savedDoc.id}`, { replace: true });
            }

            if (!silent) {
                console.log('[SAVE] Save completed successfully');
            }
        } catch (error) {
            console.error('[SAVE] Save failed:', error);
            alert("保存失败: " + error.message);
        } finally {
            console.log('[SAVE] Entering finally block');
            console.log('[SAVE] Setting saving state to false');
            setSaving(false);

            const now = new Date();
            console.log('[SAVE] Updating lastSaved to:', now);
            setLastSaved(now);
            console.log('[SAVE] Updating lastSavedContent');
            setLastSavedContent(content);
            console.log('[SAVE] Save process completed');
        }
    }, [title, content, id, currentUser, navigate]);

    // Auto-save every 5 seconds if content changed
    useEffect(() => {
        if (!id || (!title && !content)) return;

        const contentChanged = content !== lastSavedContent;
        if (!contentChanged) return;

        const timer = setTimeout(() => {
            saveDocument(true); // Silent save
        }, 5000);

        return () => clearTimeout(timer);
    }, [title, content, id, lastSavedContent, saveDocument]);

    // Keyboard shortcut
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                saveDocument();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [saveDocument]);

    const loadVersions = () => {
        if (!id || !currentUser) return;
        console.log('[VERSION] Loading versions for document:', id);
        setShowHistory(true);
        setConfirmingVersionId(null); // 重置确认状态
        const v = mockStorage.getVersions(currentUser.uid, id);
        v.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
        console.log('[VERSION] Loaded versions:', v.length);
        setVersions(v);
    };

    const handleRestore = (v) => {
        console.log('[VERSION] Restoring version:', { title: v.title, contentLength: v.content?.length });
        setTitle(v.title || '');
        setContent(v.content || '');
        setLastSavedContent(v.content || '');
        setShowHistory(false);
        setConfirmingVersionId(null);
        console.log('[VERSION] Version restored successfully');
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-800">
                        <ArrowLeft size={24} />
                    </button>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="无标题文档"
                        className="text-xl font-bold text-gray-800 border-none focus:ring-0 placeholder-gray-400 bg-transparent"
                    />
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500 hidden md:inline">
                        {saving ? '保存中...' :
                            lastSaved ? `已保存 ${lastSaved.toLocaleTimeString()}` :
                                (content !== lastSavedContent && content) ? '未保存的更改' : '未保存'}
                    </span>
                    <span className="text-sm text-gray-500">{wordCount} 字</span>
                    <button
                        onClick={loadVersions}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition"
                        title="历史版本"
                        disabled={!id}
                    >
                        <Clock size={20} />
                    </button>
                    <button
                        onClick={() => saveDocument()}
                        disabled={saving}
                        className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        <Save size={18} />
                        {saving ? '保存中' : '保存'}
                    </button>
                </div>
            </header>

            {/* Editor Area */}
            <main className="flex-1 max-w-4xl mx-auto w-full p-6">
                <ErrorBoundary>
                    <RichTextEditor
                        content={content}
                        onChange={setContent}
                        placeholder="开始写作..."
                    />
                </ErrorBoundary>
            </main>

            {/* History Modal */}
            {showHistory && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowHistory(false)}>
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[80vh] flex flex-col p-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">历史版本</h3>
                            <button onClick={() => setShowHistory(false)} className="text-gray-500 hover:text-gray-800">关闭</button>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-3">
                            {versions.length === 0 ? <p>暂无历史记录</p> : versions.map((v, i) => (
                                <div key={v.id} className="border p-4 rounded hover:bg-gray-50 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">版本 {versions.length - i}</p>
                                        <p className="text-xs text-gray-500">{new Date(v.savedAt).toLocaleString()}</p>
                                        <p className="text-sm text-gray-600 mt-1 truncate w-96">{getTextContent(v.content).substring(0, 50)}...</p>
                                    </div>

                                    {confirmingVersionId === v.id ? (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleRestore(v);
                                                }}
                                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                                            >
                                                确定恢复?
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setConfirmingVersionId(null);
                                                }}
                                                className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
                                            >
                                                取消
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setConfirmingVersionId(v.id);
                                            }}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 whitespace-nowrap"
                                        >
                                            <RotateCcw size={14} /> 恢复
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
