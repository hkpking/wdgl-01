import React from 'react';
import { Shield, AlertTriangle, Info, CheckCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react'; // Added useState and useEffect

export default function MetadataSidebar({ editor, isOpen, onClose }) {
    const [selectedNode, setSelectedNode] = useState(null); // Added state for selected node

    useEffect(() => {
        if (!editor) return;

        const updateSelection = () => {
            const { state } = editor;
            const { selection } = state;
            const current = selection.$head.parent; // Get the parent of the current selection

            let clauseNode = null;

            // Simple check: is the parent a clause?
            if (current.type.name === 'clause') {
                clauseNode = current;
            } else {
                // Check depth to find clause parent
                const $pos = selection.$from;
                for (let d = $pos.depth; d > 0; d--) {
                    const node = $pos.node(d);
                    if (node.type.name === 'clause') {
                        clauseNode = node;
                        break;
                    }
                }
            }

            if (clauseNode) {
                setSelectedNode({ ...clauseNode.attrs, typeName: clauseNode.type.name });
            } else {
                setSelectedNode(null);
            }
        };

        editor.on('selectionUpdate', updateSelection);
        editor.on('update', updateSelection); // Also update on content changes

        // Initial check
        updateSelection();

        return () => {
            editor.off('selectionUpdate', updateSelection);
            editor.off('update', updateSelection);
        };
    }, [editor]);

    if (!editor || !isOpen) return null;

    if (!selectedNode) {
        return (
            <div className="w-80 bg-white border-l border-gray-200 h-full flex flex-col shadow-xl z-30">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="font-semibold text-gray-700">属性面板</h2>
                    <button onClick={onClose}><X size={18} /></button>
                </div>
                <div className="p-8 text-center text-gray-400 text-sm">
                    请选择一个条款以编辑属性
                </div>
            </div>
        );
    }

    const { id, type, responsibility, dept } = selectedNode;

    const updateAttribute = (key, value) => {
        editor.commands.updateAttributes('clause', { [key]: value });
        // Optimistic update
        setSelectedNode(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="w-80 bg-white border-l border-gray-200 h-full flex flex-col shadow-xl z-30">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                <h2 className="font-semibold text-gray-700">条款属性</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700"><X size={18} /></button>
            </div>

            <div className="p-4 space-y-6">
                {/* ID Field */}
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">条款编号 (ID)</label>
                    <input
                        type="text"
                        value={id || ''}
                        onChange={(e) => updateAttribute('id', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Type Selection */}
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-2">条款类型</label>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => updateAttribute('type', 'mandatory')}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm border ${type === 'mandatory' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                        >
                            <Shield size={14} /> 强制
                        </button>
                        <button
                            onClick={() => updateAttribute('type', 'risk')}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm border ${type === 'risk' ? 'bg-orange-50 border-orange-500 text-orange-700' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                        >
                            <AlertTriangle size={14} /> 风险
                        </button>
                        <button
                            onClick={() => updateAttribute('type', 'suggested')}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm border ${type === 'suggested' ? 'bg-blue-50 border-blue-500 text-blue-700' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                        >
                            <Info size={14} /> 建议
                        </button>
                        <button
                            onClick={() => updateAttribute('type', 'standard')}
                            className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm border ${type === 'standard' ? 'bg-gray-100 border-gray-400 text-gray-700' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                        >
                            <CheckCircle size={14} /> 普通
                        </button>
                    </div>
                </div>

                {/* Responsibility */}
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">责任主体</label>
                    <input
                        type="text"
                        value={responsibility || ''}
                        onChange={(e) => updateAttribute('responsibility', e.target.value)}
                        placeholder="例如：财务部、全员"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Dept */}
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">适用部门</label>
                    <input
                        type="text"
                        value={dept || ''}
                        onChange={(e) => updateAttribute('dept', e.target.value)}
                        placeholder="例如：研发中心"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>
        </div>
    );
}
