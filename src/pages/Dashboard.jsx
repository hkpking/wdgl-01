import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, LogOut, Trash2, Edit } from 'lucide-react';
import { getTextContent } from '../utils/editor';
import * as mockStorage from '../services/mockStorage';

export default function Dashboard() {
    const [documents, setDocuments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);

    // 使用 mock 用户
    const currentUser = mockStorage.getCurrentUser();
    const navigate = useNavigate();

    // 加载文档列表(提取为单独函数以便复用)
    const loadDocuments = () => {
        if (!currentUser) return;

        console.log('[DASHBOARD] Loading documents for user:', currentUser.uid);
        const docs = mockStorage.getAllDocuments(currentUser.uid);

        // 按更新时间排序
        docs.sort((a, b) => {
            const timeA = a.updatedAt ? new Date(a.updatedAt).getTime() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
            const timeB = b.updatedAt ? new Date(b.updatedAt).getTime() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
            return timeB - timeA;
        });

        console.log('[DASHBOARD] Loaded documents:', docs.length);
        setDocuments(docs);
        setLoading(false);
    };

    useEffect(() => {
        loadDocuments();
        // 移除自动刷新定时器 - localStorage 不需要轮询
        // TODO: 迁移到后端后,考虑使用 WebSocket 或 Server-Sent Events 进行实时更新
    }, []); // 只在组件挂载时加载一次

    const handleLogout = () => {
        // Mock 登出 - 可以清除数据或跳转到登录页
        if (window.confirm('确定要退出吗?')) {
            navigate('/login');
        }
    };

    const handleDelete = () => {
        if (!deleteId || !currentUser) return;
        try {
            console.log('[DASHBOARD] Deleting document:', deleteId);
            mockStorage.deleteDocument(currentUser.uid, deleteId);
            setDeleteId(null);

            // 刷新列表
            loadDocuments();
        } catch (error) {
            console.error('[DASHBOARD] Error deleting document:', error);
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
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500">{currentUser?.email || '演示模式'}</span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition"
                        >
                            <LogOut size={18} />
                            退出
                        </button>
                    </div>
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
                            {searchTerm ? '未找到匹配的文档' : '还没有文档,点击上方按钮创建第一个文档'}
                        </div>
                    ) : (
                        filteredDocs.map(doc => (
                            <div key={doc.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg hover:shadow-md transition">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg text-blue-700 mb-1">{doc.title || '无标题文档'}</h3>
                                        <p className="text-sm text-gray-600 line-clamp-2">
                                            {getTextContent(doc.content || '').substring(0, 100) || '无内容...'}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-2">
                                            {doc.updatedAt ? '更新于: ' + new Date(doc.updatedAt).toLocaleString('zh-CN') :
                                                (doc.createdAt ? '创建于: ' + new Date(doc.createdAt).toLocaleString('zh-CN') : '')}
                                        </p>
                                    </div>
                                    <div className="flex gap-3 ml-4">
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
                        <p className="my-4 text-gray-600">您确定要删除这个文档吗?此操作无法撤销。</p>
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
