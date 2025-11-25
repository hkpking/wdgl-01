import React, { useState, useEffect } from 'react';
import { Search, FileText, Shield, X, Check } from 'lucide-react';
import * as mockStorage from '../../services/mockStorage';

export default function SourceSelector({ isOpen, onClose, onSelect, currentUser, excludeIds = [] }) {
    const [activeTab, setActiveTab] = useState('project'); // 'project', 'system'
    const [searchTerm, setSearchTerm] = useState('');
    const [documents, setDocuments] = useState([]);
    const [systemDocs, setSystemDocs] = useState([]);

    useEffect(() => {
        if (isOpen && currentUser) {
            setDocuments(mockStorage.getAllDocuments(currentUser.uid));
            setSystemDocs(mockStorage.getSystemKnowledge());
        }
    }, [isOpen, currentUser]);

    if (!isOpen) return null;

    const filterDocs = (docs) => {
        return docs.filter(doc => {
            const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase());
            const notExcluded = !excludeIds.includes(doc.id);
            return matchesSearch && notExcluded;
        });
    };

    const displayDocs = activeTab === 'project' ? filterDocs(documents) : filterDocs(systemDocs);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-[600px] max-h-[80vh] flex flex-col">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-800">添加知识来源</h3>
                    <button onClick={onClose} className="text-gray-500 hover:bg-gray-100 p-1 rounded-full">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex border-b border-gray-200">
                    <button
                        className={`flex-1 py-3 text-sm font-medium ${activeTab === 'project' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                        onClick={() => setActiveTab('project')}
                    >
                        项目文档 ({filterDocs(documents).length})
                    </button>
                    <button
                        className={`flex-1 py-3 text-sm font-medium ${activeTab === 'system' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
                        onClick={() => setActiveTab('system')}
                    >
                        系统知识库 ({filterDocs(systemDocs).length})
                    </button>
                </div>

                <div className="p-4 border-b border-gray-200">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="搜索文档..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2">
                    {displayDocs.length === 0 ? (
                        <div className="text-center py-10 text-gray-400">未找到匹配文档</div>
                    ) : (
                        <div className="space-y-1">
                            {displayDocs.map(doc => (
                                <div
                                    key={doc.id}
                                    onClick={() => onSelect(doc)}
                                    className="flex items-center p-3 hover:bg-blue-50 cursor-pointer rounded-lg group transition"
                                >
                                    <div className={`p-2 rounded-lg mr-3 ${activeTab === 'system' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {activeTab === 'system' ? <Shield size={20} /> : <FileText size={20} />}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-800">{doc.title}</h4>
                                        <p className="text-xs text-gray-500 line-clamp-1">
                                            {doc.content ? doc.content.substring(0, 60) + '...' : '无内容'}
                                        </p>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 text-blue-600">
                                        <Check size={20} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
