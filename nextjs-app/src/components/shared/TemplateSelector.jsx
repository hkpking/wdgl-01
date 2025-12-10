/**
 * 模板选择器组件
 * 用于创建文档时选择模板
 */
import React, { useState } from 'react';
import { X, FileText, Search } from 'lucide-react';
import { documentTemplates, templateCategories } from '../../data/templates';

export default function TemplateSelector({ isOpen, onClose, onSelect }) {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    if (!isOpen) return null;

    // 过滤模板
    const filteredTemplates = documentTemplates.filter(template => {
        const matchCategory = selectedCategory === 'all' || template.category === selectedCategory;
        const matchSearch = !searchQuery ||
            template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchSearch;
    });

    const handleSelect = (template) => {
        onSelect(template);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">选择模板</h2>
                        <p className="text-sm text-gray-500 mt-1">快速开始创建结构化文档</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Search & Categories */}
                <div className="p-4 border-b space-y-3">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="搜索模板..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    {/* Category Tabs */}
                    <div className="flex gap-2 overflow-x-auto">
                        {templateCategories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSelectedCategory(cat.id)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${selectedCategory === cat.id
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Template Grid */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {filteredTemplates.map(template => (
                            <button
                                key={template.id}
                                onClick={() => handleSelect(template)}
                                className="flex flex-col items-start p-4 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 rounded-xl transition text-left group"
                            >
                                <div className="text-3xl mb-3">{template.icon}</div>
                                <h3 className="font-semibold text-gray-900 group-hover:text-blue-700">
                                    {template.name}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                    {template.description}
                                </p>
                                <span className="mt-2 text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded">
                                    {template.category}
                                </span>
                            </button>
                        ))}
                    </div>

                    {filteredTemplates.length === 0 && (
                        <div className="text-center py-12">
                            <FileText className="mx-auto text-gray-300" size={48} />
                            <p className="text-gray-500 mt-4">未找到匹配的模板</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
