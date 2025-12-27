import React from 'react';
import { FileText, AlertTriangle, Shield, GitGraph, Layout } from 'lucide-react';

export default function LeftSidebar({ blocks, selectedId, onSelect, isOpen, onToggle }) {

    const renderTreeNode = (block) => {
        const isSelected = block.id === selectedId;
        let icon = <div className="w-2 h-2 rounded-full bg-slate-300" />;

        if (block.type === 'heading') icon = <FileText size={14} className="text-slate-500" />;
        if (block.type === 'risk') icon = <AlertTriangle size={14} className="text-amber-500" />;
        if (block.type === 'rule') icon = <Shield size={14} className="text-red-500" />;
        if (block.type === 'process_link') icon = <GitGraph size={14} className="text-purple-500" />;

        return (
            <div
                key={block.id}
                onClick={() => onSelect(block.id)}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm cursor-pointer rounded transition-colors ${isSelected ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-600 hover:bg-slate-100'
                    }`}
                style={{ paddingLeft: block.type === 'heading' ? '0.75rem' : '2rem' }}
            >
                {icon}
                <span className="truncate">{block.type === 'heading' ? block.content : block.id}</span>
            </div>
        );
    };

    return (
        <div className={`${isOpen ? 'w-64' : 'w-12'} flex-shrink-0 bg-white border-r border-slate-200 transition-all duration-300 flex flex-col`}>
            <div className="h-14 border-b border-slate-100 flex items-center px-4 justify-between">
                {isOpen && <span className="font-semibold text-slate-700">文档结构</span>}
                <button onClick={onToggle} className="p-1 hover:bg-slate-100 rounded text-slate-400">
                    <Layout size={18} />
                </button>
            </div>

            {isOpen && (
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                    {blocks.map(renderTreeNode)}
                </div>
            )}
        </div>
    );
}
