import React from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { GitGraph } from 'lucide-react';

export default function ProcessLinkNodeView({ node }) {
    return (
        <NodeViewWrapper className="block-item group relative mb-0.5 transition-all duration-200">
            <div className="relative pl-3">
                <div className="bg-purple-50 text-purple-900 font-medium flex items-center gap-3 border border-purple-100 py-2 my-2 rounded outline-none px-1">
                    <GitGraph size={18} className="text-purple-500 flex-shrink-0" />
                    <div className="flex-1">
                        {node.attrs.processName || '关联流程'}
                    </div>
                    <span className="text-xs bg-purple-200 text-purple-700 px-2 py-0.5 rounded-full ml-auto select-none cursor-pointer">
                        跳转
                    </span>
                </div>
            </div>
        </NodeViewWrapper>
    );
}
