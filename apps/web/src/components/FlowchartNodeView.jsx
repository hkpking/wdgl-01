import React, { useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { Edit } from 'lucide-react';
import DrawioEditor from './DrawioEditor';

export default function FlowchartNodeView({ node, updateAttributes }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const { xml, previewUrl, width = '100%', height = '500px' } = node.attrs;

    const handleSave = (newXml, newPreviewUrl) => {
        updateAttributes({
            xml: newXml,
            previewUrl: newPreviewUrl,
        });
    };

    return (
        <NodeViewWrapper className="flowchart-node-view">
            <div
                className="relative border border-gray-300 rounded-lg overflow-hidden bg-white"
                style={{ width, height }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Preview Area */}
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            alt="Flowchart Preview"
                            className="max-w-full max-h-full object-contain"
                        />
                    ) : (
                        <div className="text-center text-gray-400 pointer-events-none">
                            <p className="text-sm">空白流程图</p>
                            <p className="text-xs mt-1">点击编辑开始创建</p>
                        </div>
                    )}
                </div>

                {/* Edit button overlay */}
                {isHovered && (
                    <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center z-10">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
                        >
                            <Edit size={18} />
                            编辑流程图 (Draw.io)
                        </button>
                    </div>
                )}
            </div>

            {/* Draw.io Editor Modal */}
            <DrawioEditor
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                initialXml={xml}
                onSave={handleSave}
            />
        </NodeViewWrapper>
    );
}
