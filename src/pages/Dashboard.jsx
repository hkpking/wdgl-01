import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Search, LogOut, Trash2, Edit, Edit2, Eye, LayoutGrid, List as ListIcon, FolderPlus, MoreVertical, FileText, FolderInput, Folder } from 'lucide-react';
import { getTextContent } from '../utils/editor';
import * as mockStorage from '../services/mockStorage';
import { DOC_STATUS, STATUS_LABELS, STATUS_COLORS } from '../utils/constants';
import FolderTree from '../components/FolderTree';
import FolderSelector from '../components/FolderSelector';
import Breadcrumbs, { getFolderPath } from '../components/Breadcrumbs';
import { DndContext, DragOverlay, useSensor, useSensors, MouseSensor, TouchSensor, closestCenter } from '@dnd-kit/core';
import DraggableItem from '../components/DraggableItem';

export default function Dashboard() {
    const [documents, setDocuments] = useState([]);
    const [folders, setFolders] = useState([]);
    const [selectedFolderId, setSelectedFolderId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [deleteId, setDeleteId] = useState(null);
    const [sortBy, setSortBy] = useState('updatedAt');
    const [filterStatus, setFilterStatus] = useState('all');
    const [viewMode, setViewMode] = useState('grid');

    // Folder Action State
    const [folderMenu, setFolderMenu] = useState(null); // { x, y, folder }
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
    const [folderNameInput, setFolderNameInput] = useState('');
    const [targetFolderForCreate, setTargetFolderForCreate] = useState(null); // parentId for new folder
    const [moveDocId, setMoveDocId] = useState(null); // Document ID to move
    const [activeDragId, setActiveDragId] = useState(null); // ID of item being dragged

    const currentUser = mockStorage.getCurrentUser();
    const navigate = useNavigate();
    const menuRef = useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setFolderMenu(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const loadData = () => {
        if (!currentUser) return;
        setLoading(true);
        const docs = mockStorage.getAllDocuments(currentUser.uid);
        const userFolders = mockStorage.getFolders(currentUser.uid);
        setDocuments(docs);
        setFolders(userFolders);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleLogout = () => {
        if (window.confirm('确定要退出吗?')) {
            navigate('/login');
        }
    };

    const handleDeleteDoc = () => {
        if (!deleteId || !currentUser) return;
        try {
            mockStorage.deleteDocument(currentUser.uid, deleteId);
            setDeleteId(null);
            loadData();
        } catch (error) {
            console.error('Error deleting document:', error);
            alert("删除失败");
        }
    };

    const handleCreateDoc = () => {
        const newId = mockStorage.generateId();
        const newDoc = {
            id: newId,
            title: '无标题文档',
            content: '',
            status: DOC_STATUS.DRAFT,
            contentType: 'html',
            parentId: selectedFolderId // Create in current folder
        };
        mockStorage.saveDocument(currentUser.uid, newId, newDoc);
        navigate(`/editor/${newId}`);
    };

    // --- Folder Operations ---

    const handleFolderAction = (e, folder, type) => {
        e.preventDefault();
        if (type === 'create') {
            setTargetFolderForCreate(null); // Root
            setFolderNameInput('');
            setIsCreateFolderModalOpen(true);
        } else if (type === 'menu') {
            setFolderMenu({
                x: e.clientX,
                y: e.clientY,
                folder
            });
        }
    };

    const handleCreateFolder = () => {
        if (!folderNameInput.trim()) return;
        try {
            mockStorage.createFolder(currentUser.uid, folderNameInput, targetFolderForCreate);
            setIsCreateFolderModalOpen(false);
            loadData();
        } catch (error) {
            alert('创建文件夹失败');
        }
    };

    const handleRenameFolder = () => {
        if (!folderNameInput.trim() || !folderMenu?.folder) return;
        try {
            mockStorage.updateFolder(currentUser.uid, folderMenu.folder.id, { name: folderNameInput });
            setIsRenameModalOpen(false);
            setFolderMenu(null);
            loadData();
        } catch (error) {
            alert('重命名失败');
        }
    };

    const handleDeleteFolder = () => {
        if (!folderMenu?.folder) return;
        if (window.confirm(`确定要删除文件夹 "${folderMenu.folder.name}" 吗？\n其中的文件将移动到"全部文档"。`)) {
            try {
                mockStorage.deleteFolder(currentUser.uid, folderMenu.folder.id);
                setFolderMenu(null);
                if (selectedFolderId === folderMenu.folder.id) {
                    setSelectedFolderId(null);
                }
                loadData();
            } catch (error) {
                alert('删除失败');
            }
        }
    };

    const handleMoveDoc = (targetFolderId) => {
        if (!moveDocId) return;
        try {
            mockStorage.moveDocument(currentUser.uid, moveDocId, targetFolderId);
            setMoveDocId(null);
            loadData();
        } catch (error) {
            alert('移动文档失败');
        }
    };

    // --- Drag & Drop ---
    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 10, // Drag needs to move 10px to start, preventing accidental drags on click
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        })
    );

    const handleDragStart = (event) => {
        setActiveDragId(event.active.id);
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        setActiveDragId(null);

        if (over && active.id !== over.id) {
            // Check if dropped on a folder
            const folderId = over.id;
            const docId = active.id;

            // Prevent moving to same folder
            const doc = documents.find(d => d.id === docId);
            if (doc && doc.parentId !== folderId) {
                try {
                    mockStorage.moveDocument(currentUser.uid, docId, folderId);
                    loadData();
                } catch (error) {
                    console.error('Drag move failed:', error);
                }
            }
        }
    };

    // --- Filtering ---

    const filteredDocs = documents
        .filter(doc => {
            const matchesSearch = (doc.title || '无标题').toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === 'all' || (doc.status || DOC_STATUS.DRAFT) === filterStatus;

            // Folder Filter
            // If selectedFolderId is null, show ALL documents (or maybe only root? usually ALL in "All Documents" view)
            // Let's implement: Null = All Documents. If we want "Uncategorized", we need a specific filter.
            // But for "Folder View", we usually want strict filtering.
            // Let's say: Null = All. Specific ID = That folder only.
            const matchesFolder = selectedFolderId ? doc.parentId === selectedFolderId : true;

            return matchesSearch && matchesStatus && matchesFolder;
        })
        .sort((a, b) => {
            if (sortBy === 'title') {
                return (a.title || '').localeCompare(b.title || '');
            }
            const timeA = a[sortBy] ? new Date(a[sortBy]).getTime() : 0;
            const timeB = b[sortBy] ? new Date(b[sortBy]).getTime() : 0;
            return timeB - timeA;
        });

    // Get current folder name for display
    const currentFolder = folders.find(f => f.id === selectedFolderId);
    const currentFolderName = selectedFolderId ? currentFolder?.name : '全部文档';

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="min-h-screen bg-gray-100 flex flex-col">
                {/* Header */}
                <header className="bg-white shadow-sm z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-600 p-1.5 rounded-lg">
                                <FileText className="text-white" size={20} />
                            </div>
                            <h1 className="text-xl font-bold text-gray-900">制度管理系统</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500">{currentUser?.email || '演示模式'}</span>
                            <button onClick={handleLogout} className="text-gray-500 hover:text-gray-800">
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </header>

                <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 gap-6">
                    {/* Sidebar */}
                    <aside className="w-64 bg-white rounded-lg shadow-sm flex flex-col h-[calc(100vh-8rem)] sticky top-24">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="font-semibold text-gray-700">目录导航</h2>
                            <button
                                onClick={() => {
                                    setTargetFolderForCreate(null);
                                    setFolderNameInput('');
                                    setIsCreateFolderModalOpen(true);
                                }}
                                className="p-1 hover:bg-gray-100 rounded text-blue-600"
                                title="新建文件夹"
                            >
                                <FolderPlus size={18} />
                            </button>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar">
                            <FolderTree
                                folders={folders}
                                selectedFolderId={selectedFolderId}
                                onSelectFolder={setSelectedFolderId}
                                onAction={handleFolderAction}
                            />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 bg-white rounded-lg shadow-sm p-6 min-h-[calc(100vh-8rem)]">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                {currentFolderName}
                                {selectedFolderId && <span className="text-sm font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{filteredDocs.length}</span>}
                            </h2>
                            <button
                                onClick={handleCreateDoc}
                                className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition shadow-sm"
                            >
                                <Plus size={18} />
                                新建文档
                            </button>
                        </div>

                        <Breadcrumbs
                            folders={folders}
                            currentFolderId={selectedFolderId}
                            onNavigate={setSelectedFolderId}
                        />

                        {/* Toolbar */}
                        <div className="flex flex-wrap gap-4 mb-6">
                            <div className="relative flex-1 min-w-[200px]">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="搜索当前目录..."
                                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2"
                                >
                                    <option value="all">所有状态</option>
                                    <option value={DOC_STATUS.DRAFT}>草稿</option>
                                    <option value={DOC_STATUS.REVIEW}>待审核</option>
                                    <option value={DOC_STATUS.PUBLISHED}>已发布</option>
                                </select>

                                <div className="flex bg-gray-50 rounded-lg border border-gray-200 p-0.5">
                                    <button
                                        onClick={() => setViewMode('grid')}
                                        className={`p-1.5 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        <LayoutGrid size={18} />
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`p-1.5 rounded ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        <ListIcon size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Document List */}
                        {loading ? (
                            <div className="text-center py-20 text-gray-400">加载中...</div>
                        ) : filteredDocs.length === 0 ? (
                            <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                <p className="text-gray-500 mb-2">此文件夹为空</p>
                                <button onClick={handleCreateDoc} className="text-blue-600 hover:underline text-sm">
                                    创建第一个文档
                                </button>
                            </div>
                        ) : viewMode === 'grid' ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredDocs.map(doc => (
                                    <DraggableItem key={doc.id} id={doc.id} data={doc} className="h-full">
                                        <div className="group bg-white border border-gray-200 rounded-lg hover:shadow-md transition p-4 flex flex-col h-48 relative">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex-1 pr-2 overflow-hidden">
                                                    <h3 className="font-medium text-gray-900 truncate" title={doc.title}>{doc.title || '无标题'}</h3>
                                                    {searchTerm && doc.parentId && (
                                                        <div className="text-[10px] text-gray-400 flex items-center mt-0.5 truncate">
                                                            <Folder size={10} className="mr-1" />
                                                            {getFolderPath(doc.parentId, folders).map(f => f.name).join(' > ')}
                                                        </div>
                                                    )}
                                                </div>
                                                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${STATUS_COLORS[doc.status] ? 'bg-opacity-10 border-opacity-20' : 'bg-gray-100 border-gray-200 text-gray-500'}`} style={{
                                                    color: STATUS_COLORS[doc.status] ? undefined : '#6b7280',
                                                    borderColor: 'currentColor'
                                                }}>
                                                    {STATUS_LABELS[doc.status]}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-500 line-clamp-4 flex-1 mb-3">
                                                {getTextContent(doc.content || '').substring(0, 100) || '无内容...'}
                                            </p>
                                            <div className="flex justify-between items-center text-xs text-gray-400 pt-3 border-t border-gray-50">
                                                <span>{new Date(doc.updatedAt).toLocaleDateString()}</span>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button onClick={() => setMoveDocId(doc.id)} className="hover:text-blue-600" title="移动到..."><FolderInput size={14} /></button>
                                                    <Link to={`/editor/${doc.id}`} className="hover:text-blue-600"><Edit size={14} /></Link>
                                                    <button onClick={() => setDeleteId(doc.id)} className="hover:text-red-600"><Trash2 size={14} /></button>
                                                </div>
                                            </div>
                                        </div>
                                    </DraggableItem>
                                ))}
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                        <tr>
                                            <th className="px-4 py-3 text-left">标题</th>
                                            <th className="px-4 py-3 text-left">状态</th>
                                            <th className="px-4 py-3 text-left">更新时间</th>
                                            <th className="px-4 py-3 text-right">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredDocs.map(doc => (
                                            <DraggableItem key={doc.id} id={doc.id} data={doc} className="contents">
                                                <tr className="hover:bg-gray-50 group">
                                                    <td className="px-4 py-3">
                                                        <div className="text-sm font-medium text-gray-900">{doc.title || '无标题'}</div>
                                                        {searchTerm && doc.parentId && (
                                                            <div className="text-xs text-gray-400 flex items-center mt-0.5">
                                                                <Folder size={10} className="mr-1" />
                                                                {getFolderPath(doc.parentId, folders).map(f => f.name).join(' > ')}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td className="px-4 py-3">
                                                        <span className="text-xs text-gray-500">{STATUS_LABELS[doc.status]}</span>
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-500">
                                                        {new Date(doc.updatedAt).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-4 py-3 text-right">
                                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <button onClick={() => setMoveDocId(doc.id)} className="text-gray-400 hover:text-blue-600" title="移动到..."><FolderInput size={16} /></button>
                                                            <Link to={`/editor/${doc.id}`} className="text-gray-400 hover:text-blue-600"><Edit size={16} /></Link>
                                                            <button onClick={() => setDeleteId(doc.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </DraggableItem>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </main>
                </div>

                {/* Context Menu for Folders */}
                {folderMenu && (
                    <div
                        ref={menuRef}
                        className="fixed bg-white shadow-lg rounded-lg border border-gray-200 py-1 z-50 w-40"
                        style={{ top: folderMenu.y, left: folderMenu.x }}
                    >
                        <button
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            onClick={() => {
                                setTargetFolderForCreate(folderMenu.folder.id);
                                setFolderNameInput('');
                                setIsCreateFolderModalOpen(true);
                                setFolderMenu(null);
                            }}
                        >
                            <FolderPlus size={14} /> 新建子文件夹
                        </button>
                        <button
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                            onClick={() => {
                                setFolderNameInput(folderMenu.folder.name);
                                setIsRenameModalOpen(true);
                            }}
                        >
                            <Edit2 size={14} /> 重命名
                        </button>
                        <button
                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                            onClick={handleDeleteFolder}
                        >
                            <Trash2 size={14} /> 删除
                        </button>
                    </div>
                )}

                {/* Create Folder Modal */}
                {isCreateFolderModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                            <h3 className="text-lg font-bold mb-4">新建文件夹</h3>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="文件夹名称"
                                value={folderNameInput}
                                onChange={e => setFolderNameInput(e.target.value)}
                                autoFocus
                            />
                            <div className="flex justify-end gap-2">
                                <button onClick={() => setIsCreateFolderModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">取消</button>
                                <button onClick={handleCreateFolder} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">创建</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Rename Folder Modal */}
                {isRenameModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                            <h3 className="text-lg font-bold mb-4">重命名文件夹</h3>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="文件夹名称"
                                value={folderNameInput}
                                onChange={e => setFolderNameInput(e.target.value)}
                                autoFocus
                            />
                            <div className="flex justify-end gap-2">
                                <button onClick={() => setIsRenameModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded">取消</button>
                                <button onClick={handleRenameFolder} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">保存</button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal (Document) */}
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
                                    onClick={handleDeleteDoc}
                                    className="bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition"
                                >
                                    确认删除
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Move Document Modal */}
                <FolderSelector
                    isOpen={!!moveDocId}
                    folders={folders}
                    currentFolderId={documents.find(d => d.id === moveDocId)?.parentId || null}
                    onSelect={handleMoveDoc}
                    onCancel={() => setMoveDocId(null)}
                />

                <DragOverlay>
                    {activeDragId ? (
                        <div className="bg-white p-4 rounded-lg shadow-xl border border-blue-500 w-64 opacity-90">
                            <div className="flex items-center gap-2">
                                <FileText className="text-blue-600" size={20} />
                                <span className="font-medium truncate">
                                    {documents.find(d => d.id === activeDragId)?.title || '文档'}
                                </span>
                            </div>
                        </div>
                    ) : null}
                </DragOverlay>
            </div>
        </DndContext>
    );
}
