import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, addDoc, updateDoc, collection, serverTimestamp, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Save, Clock, RotateCcw } from 'lucide-react';
import RichTextEditor from '../components/RichTextEditor';
import ErrorBoundary from '../components/ErrorBoundary';
import { getTextContent, isPlainText, plainTextToHtml } from '../utils/editor';

export default function Editor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [wordCount, setWordCount] = useState(0);
    const [showHistory, setShowHistory] = useState(false);
    const [versions, setVersions] = useState([]);
    const [lastSavedContent, setLastSavedContent] = useState('');

    // Load document if ID exists
    useEffect(() => {
        if (!id || !currentUser) return;

        const loadDoc = async () => {
            const docRef = doc(db, `artifacts/1:354969438898:web:3fe49633eb0cedafabd7ab/users/${currentUser.uid}/documents`, id);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setTitle(data.title || '');

                // Handle both HTML and plain text formats
                let loadedContent = data.content || '';
                if (isPlainText(loadedContent)) {
                    // Convert old plain text to HTML
                    loadedContent = plainTextToHtml(loadedContent);
                }
                setContent(loadedContent);
                setLastSavedContent(loadedContent); // Initialize last saved content
                setLastSaved(data.updatedAt?.toDate() || data.createdAt?.toDate());
            } else {
                navigate('/');
            }
        };
        loadDoc();
    }, [id, currentUser, navigate]);

    // Update word count
    useEffect(() => {
        // Extract plain text from HTML for accurate word count
        const plainText = getTextContent(content);
        setWordCount(plainText.length);
    }, [content]);

    const saveDocument = useCallback(async (silent = false) => {
        if (!title && !content) return;
        if (!currentUser) return;

        setSaving(true);
        try {
            const docData = {
                title,
                content,
                contentType: 'html', // Mark as HTML format
                updatedAt: serverTimestamp()
            };

            if (id) {
                // Update existing
                const docRef = doc(db, `artifacts/1:354969438898:web:3fe49633eb0cedafabd7ab/users/${currentUser.uid}/documents`, id);

                // Save version before update (simplified versioning)
                // In a real app, you might want to check if content actually changed significantly
                const versionsRef = collection(docRef, 'versions');
                await addDoc(versionsRef, {
                    title,
                    content,
                    savedAt: serverTimestamp()
                });

                await updateDoc(docRef, docData);
            } else {
                // Create new
                const collectionRef = collection(db, `artifacts/1:354969438898:web:3fe49633eb0cedafabd7ab/users/${currentUser.uid}/documents`);
                const newDocRef = await addDoc(collectionRef, {
                    ...docData,
                    createdAt: serverTimestamp()
                });

                // Create initial version
                const versionsRef = collection(newDocRef, 'versions');
                await addDoc(versionsRef, {
                    title,
                    content,
                    savedAt: serverTimestamp()
                });

                navigate(`/editor/${newDocRef.id}`, { replace: true });
            }

            setLastSaved(new Date());
            setLastSavedContent(content); // Update last saved content
            if (!silent) {
                // Optional: Show success toast
            }
        } catch (error) {
            console.error("Save failed:", error);
            alert("保存失败");
        } finally {
            setSaving(false);
        }
    }, [title, content, id, currentUser, navigate]);

    // Auto-save every 5 seconds if content changed
    useEffect(() => {
        if (!id || !title && !content) return; // Only auto-save existing docs with content

        // Check if content actually changed
        const contentChanged = content !== lastSavedContent;
        if (!contentChanged) return;

        const timer = setTimeout(() => {
            saveDocument(true); // Silent save
        }, 5000); // 5 second debounce

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

    const loadVersions = async () => {
        if (!id || !currentUser) return;
        setShowHistory(true);
        const docRef = doc(db, `artifacts/1:354969438898:web:3fe49633eb0cedafabd7ab/users/${currentUser.uid}/documents`, id);
        const versionsRef = collection(docRef, 'versions');
        const snapshot = await getDocs(versionsRef);
        const v = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        v.sort((a, b) => (b.savedAt?.toMillis() || 0) - (a.savedAt?.toMillis() || 0));
        setVersions(v);
    };

    const restoreVersion = (v) => {
        if (window.confirm('确定要恢复到此版本吗？当前未保存的内容将丢失。')) {
            setTitle(v.title);
            setContent(v.content);
            setShowHistory(false);
        }
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
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl h-[80vh] flex flex-col p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold text-gray-900">历史版本</h3>
                            <button onClick={() => setShowHistory(false)} className="text-gray-500 hover:text-gray-800">关闭</button>
                        </div>
                        <div className="flex-1 overflow-y-auto space-y-3">
                            {versions.length === 0 ? <p>暂无历史记录</p> : versions.map((v, i) => (
                                <div key={v.id} className="border p-4 rounded hover:bg-gray-50 flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold">版本 {versions.length - i}</p>
                                        <p className="text-xs text-gray-500">{v.savedAt?.toDate().toLocaleString()}</p>
                                        <p className="text-sm text-gray-600 mt-1 truncate w-96">{v.content.substring(0, 50)}...</p>
                                    </div>
                                    <button
                                        onClick={() => restoreVersion(v)}
                                        className="text-blue-600 hover:underline text-sm flex items-center gap-1"
                                    >
                                        <RotateCcw size={14} /> 恢复
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div >
    );
}
