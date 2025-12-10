import React from 'react';
import Link from 'next/link';
import { Folder, FolderInput, Edit, Trash2 } from 'lucide-react';
import { STATUS_LABELS, STATUS_COLORS } from '@/lib/constants';
import { getTextContent } from '@/lib/editor-utils';
import { getFolderPath } from './Breadcrumbs';
import DraggableItem from './DraggableItem';

const DocumentList = ({
    documents,
    viewMode,
    folders,
    searchTerm,
    onDelete,
    onMove
}) => {

    if (documents.length === 0) {
        return (
            <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                <p className="text-gray-500 mb-2">此文件夹为空</p>
                {/* Parent handles creation button if needed, or we check if readonly */}
            </div>
        );
    }

    if (viewMode === 'grid') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documents.map(doc => (
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
                                    <button onClick={() => onMove(doc.id)} className="hover:text-blue-600" title="移动到..."><FolderInput size={14} /></button>
                                    <Link href={`/editor/${doc.id}`} className="hover:text-blue-600"><Edit size={14} /></Link>
                                    <button onClick={() => onDelete(doc.id)} className="hover:text-red-600"><Trash2 size={14} /></button>
                                </div>
                            </div>
                        </div>
                    </DraggableItem>
                ))}
            </div>
        );
    }

    // List View
    return (
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
                    {documents.map(doc => (
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
                                        <button onClick={() => onMove(doc.id)} className="text-gray-400 hover:text-blue-600" title="移动到..."><FolderInput size={16} /></button>
                                        <Link href={`/editor/${doc.id}`} className="text-gray-400 hover:text-blue-600"><Edit size={16} /></Link>
                                        <button onClick={() => onDelete(doc.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        </DraggableItem>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DocumentList;
