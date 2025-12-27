import React from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { AlertTriangle } from 'lucide-react';

export default function RiskNodeView() {
    return (
        <NodeViewWrapper className="block-item group relative mb-0.5 transition-all duration-200">
            <div className="relative pl-3">
                <div className="bg-red-50/50 text-slate-800 border-red-100 pl-10 relative outline-none px-1 py-0.5 rounded border border-transparent transition-colors min-h-[24px]">
                    <div className="absolute left-3 top-2.5 text-red-500 select-none" contentEditable={false}>
                        <AlertTriangle size={18} />
                    </div>
                    <NodeViewContent className="outline-none" />
                </div>
            </div>
        </NodeViewWrapper>
    );
}
