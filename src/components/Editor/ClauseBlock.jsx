import React from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { GripVertical, Shield, AlertTriangle, Info, CheckCircle } from 'lucide-react';

export default function ClauseBlock({ node, updateAttributes, getPos, editor }) {
    const { id, type, responsibility, dept } = node.attrs;

    // Visual styles based on type
    const getTypeStyles = () => {
        switch (type) {
            case 'mandatory':
                return { icon: <Shield size={14} className="text-red-600" />, label: '强制', bg: 'bg-red-50' };
            case 'risk':
                return { icon: <AlertTriangle size={14} className="text-orange-600" />, label: '风险', bg: 'bg-orange-50' };
            case 'suggested':
                return { icon: <Info size={14} className="text-blue-600" />, label: '建议', bg: 'bg-blue-50' };
            default:
                return { icon: null, label: '', bg: '' };
        }
    };

    const styles = getTypeStyles();

    return (
        <NodeViewWrapper className={`clause-item-content group relative flex items-start my-1`}>
            {/* Drag Handle (visible on hover) */}
            <div className="absolute -left-6 top-1 opacity-0 group-hover:opacity-100 cursor-grab p-0.5 rounded hover:bg-gray-200" contentEditable={false} data-drag-handle>
                <GripVertical size={14} className="text-gray-400" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <NodeViewContent className="outline-none" />
            </div>

            {/* Metadata Badges (Right aligned) */}
            {(type !== 'standard' || responsibility) && (
                <div className="flex items-center gap-2 ml-4 select-none" contentEditable={false}>
                    {type !== 'standard' && (
                        <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium ${styles.bg}`}>
                            {styles.icon}
                            <span>{styles.label}</span>
                        </div>
                    )}
                    {responsibility && (
                        <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded border border-gray-200">
                            {responsibility}
                        </span>
                    )}
                    {/* ID for debug/reference */}
                    <span className="text-[10px] text-gray-300 font-mono">#{id}</span>
                </div>
            )}
        </NodeViewWrapper>
    );
}
