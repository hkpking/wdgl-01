"use client";

/**
 * KBHomePanel - 知识库首页面板
 * 
 * 显示知识库信息和最近更新的文档/表格列表。
 * 从 page.tsx 拆分出来，遵循单一职责原则。
 */

import React from 'react';
import { Star, Share2, Settings, FileText, Trash2, GitBranch } from 'lucide-react';
import EmptyState from '@/components/shared/EmptyState';
import type { KnowledgeBase } from '@/types/team';

interface RecentItem {
    id: string;
    title: string;
    type: 'document' | 'spreadsheet' | 'flowchart';
    contentType?: string; // 'html' | 'flowchart' etc.
    updatedAt: string;
}

interface KBHomePanelProps {
    kb: KnowledgeBase;
    recentItems: RecentItem[];
    onOpenDoc: (docId: string) => void;
    onOpenSheet: (sheetId: string) => void;
    onDeleteDoc: (docId: string, e: React.MouseEvent) => void;
    onDeleteSheet: (sheetId: string, e: React.MouseEvent) => void;
    onCreateDoc: () => void;
    onCreateSpreadsheet: () => void;
    formatDate: (dateStr: string) => string;
}

export default function KBHomePanel({
    kb,
    recentItems,
    onOpenDoc,
    onOpenSheet,
    onDeleteDoc,
    onDeleteSheet,
    onCreateDoc,
    onCreateSpreadsheet,
    formatDate,
}: KBHomePanelProps) {
    return (
        <>
            <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
                <span className="text-sm text-gray-500">知识库主页</span>
                <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600"><Star size={16} /></button>
                    <button className="p-2 text-gray-400 hover:text-gray-600"><Share2 size={16} /></button>
                    <button className="p-2 text-gray-400 hover:text-gray-600"><Settings size={16} /></button>
                </div>
            </header>

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
                                {recentItems.length === 0 ? (
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
                                    recentItems.map(item => (
                                        <tr
                                            key={item.id}
                                            onClick={() => item.type === 'spreadsheet' ? onOpenSheet(item.id) : onOpenDoc(item.id)}
                                            className="hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 group"
                                        >
                                            <td className="px-4 py-3 flex items-center gap-2">
                                                {item.type === 'spreadsheet' ? (
                                                    <span className="text-green-500">📊</span>
                                                ) : item.contentType === 'flowchart' || item.type === 'flowchart' ? (
                                                    <GitBranch size={16} className="text-purple-500" />
                                                ) : (
                                                    <FileText size={16} className="text-gray-400" />
                                                )}
                                                <span className="font-medium text-gray-900">{item.title}</span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-500">
                                                {formatDate(item.updatedAt)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <button
                                                    onClick={(e) => item.type === 'spreadsheet' ? onDeleteSheet(item.id, e) : onDeleteDoc(item.id, e)}
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
        </>
    );
}
