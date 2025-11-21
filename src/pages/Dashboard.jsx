import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, onSnapshot, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Search, LogOut, FileText, Trash2, Edit } from 'lucide-react';

export default function Dashboard() {
    const [documents, setDocuments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!currentUser) return;

        const collectionPath = `artifacts/1:354969438898:web:3fe49633eb0cedafabd7ab/users/${currentUser.uid}/documents`;
        const q = query(collection(db, collectionPath)); // Client-side sorting for simplicity or add orderBy if index exists

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const docs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            // Sort by updatedAt desc
            docs.sort((a, b) => {
                const timeA = a.updatedAt?.toMillis() || a.createdAt?.toMillis() || 0;
                const timeB = b.updatedAt?.toMillis() || b.createdAt?.toMillis() || 0;
                return timeB - timeA;
            });
            setDocuments(docs);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching documents:", error);
            setLoading(false);
        });

        return unsubscribe;
    }, [currentUser]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const handleDelete = async () => {
        if (!deleteId || !currentUser) return;
        try {
            const docRef = doc(db, `artifacts/1:354969438898:web:3fe49633eb0cedafabd7ab/users/${currentUser.uid}/documents`, deleteId);
            await deleteDoc(docRef);
            setDeleteId(null);
        } catch (error) {
            console.error("Error deleting document:", error);
            alert("删除失败");
        }
    };

    const filteredDocs = documents.filter(doc =>
        (doc.title || '无标题').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">我的仪表盘</h1>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition"
                    >
                        <LogOut size={18} />
                        退出登录
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <Link
                        to="/editor"
                        className="flex items-center justify-center gap-2 bg-green-600 text-white py-2 px-6 rounded-lg font-semibold hover:bg-green-700 transition shadow-md"
                    >
                        <Plus size={20} />
                        创建新文档
                    </Link>
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="搜索我的文档..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <p className="text-center text-gray-500">加载中...</p>
                    ) : filteredDocs.length === 0 ? (
                        <div className="text-center py-10 text-gray-500">
                            {searchTerm ? '未找到匹配的文档' : '还没有文档，点击上方按钮创建第一个文档'}
                        </div>
                    ) : (
                        filteredDocs.map(doc => (
                            <div key={doc.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-md transition">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-lg text-blue-700 mb-1">{doc.title || '无标题文档'}</h3>
                                        <p className="text-sm text-gray-600 line-clamp-2">{doc.content}</p>
                                        <p className="text-xs text-gray-400 mt-2">
                                            {doc.updatedAt ? '更新于: ' + doc.updatedAt.toDate().toLocaleString('zh-CN') : '创建于: ' + doc.createdAt?.toDate().toLocaleString('zh-CN')}
                                        </p>
                                    </div>
                                    <div className="flex gap-3">
                                        <Link
                                            to={`/editor/${doc.id}`}
                                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition"
                                            title="编辑"
                                        >
                                            <Edit size={18} />
                                        </Link>
                                        <button
                                            onClick={() => setDeleteId(doc.id)}
                                            className="p-2 text-red-600 hover:bg-red-100 rounded-full transition"
                                            title="删除"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
                        <h3 className="text-lg font-bold text-gray-900">确认删除</h3>
                        <p className="my-4 text-gray-600">您确定要删除这个文档吗？此操作无法撤销。</p>
                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition"
                            >
                                取消
                            </button>
                            <button
                                onClick={handleDelete}
                                className="bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition"
                            >
                                确认删除
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
