"use client";

import React from 'react';
import { FileText, Clock, Trash2 } from 'lucide-react';
import EmptyState from '@/components/shared/EmptyState';

interface KBDocument {
    id: string;
    title: string;
    updatedAt: string;
}

interface KBHomeViewProps {
    kb: {
        name: string;
        icon: string;
        description?: string;
    };
    recentDocs: KBDocument[];
    onOpenDoc: (docId: string) => void;
    onDeleteDoc: (docId: string, e: React.MouseEvent) => void;
    onCreateDoc: () => void;
    onCreateSpreadsheet: () => void;
    formatDate: (dateStr: string) => string;
}

/**
 * 知识库首页视图
 * 显示知识库信息和最近更新的文档列表
 */
export default function KBHomeView({
    kb,
    recentDocs,
    onOpenDoc,
    onDeleteDoc,
    onCreateDoc,
    onCreateSpreadsheet,
    formatDate
}: KBHomeViewProps) {
    return (
        <div className="flex-1 overflow-auto p-6">
            {/* 知识库信息 */}
            <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center text-3xl">
                    {kb.icon}
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">{kb.name}</h2>
                    <p className="text-gray-500">{kb.description || ''}</p>
                </div>
            </div>

            {/* 统计卡片 */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                        <FileText size={14} />
                        文档数量
                    </div>
                    <div className="text-2xl font-semibold text-gray-900">
                        {recentDocs.length}
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                        <Clock size={14} />
                        最近更新
                    </div>
                    <div className="text-sm text-gray-600">
                        {recentDocs.length > 0
                            ? formatDate(recentDocs[0].updatedAt)
                            : '暂无'
                        }
                    </div>
                </div>
            </div>

            {/* 最近更新 */}
            <div>
                <h3 className="text-sm font-medium text-gray-700 mb-4">最近更新</h3>
                <div className="bg-white rounded-lg border border-gray-200">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-xs text-gray-500 border-b">
                                <th className="px-4 py-3 font-medium">名称</th>
                                <th className="px-4 py-3 font-medium">更新时间</th>
                                <th className="px-4 py-3 font-medium w-10"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentDocs.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-4 py-4">
                                        <EmptyState
                                            title="还没有文档"
                                            description="创建第一个文档开始记录知识，或从 Word 文件导入"
                                            size="small"
                                            actions={[
                                                { label: '新建文档', onClick: onCreateDoc, variant: 'primary' },
                                                { label: '新建表格', onClick: onCreateSpreadsheet, variant: 'secondary' }
                                            ]}
                                        />
                                    </td>
                                </tr>
                            ) : (
                                recentDocs.map(doc => (
                                    <tr
                                        key={doc.id}
                                        onClick={() => onOpenDoc(doc.id)}
                                        className="hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 group"
                                    >
                                        <td className="px-4 py-3 flex items-center gap-2">
                                            <FileText size={16} className="text-gray-400" />
                                            <span className="font-medium text-gray-900">{doc.title}</span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {formatDate(doc.updatedAt)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={(e) => onDeleteDoc(doc.id, e)}
                                                className="p-1 text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-600"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
