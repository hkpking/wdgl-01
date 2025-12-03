import React, { useEffect, useRef, useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import mermaid from 'mermaid';
import { Edit } from 'lucide-react';

mermaid.initialize({
    startOnLoad: false,
    theme: 'default',
    securityLevel: 'loose',
});

export default function MermaidNodeView({ node, updateAttributes }) {
    const { code } = node.attrs;
    const [svg, setSvg] = useState('');
    const [error, setError] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editCode, setEditCode] = useState(code);
    const containerRef = useRef(null);

    useEffect(() => {
        renderMermaid();
    }, [code]);

    const renderMermaid = async () => {
        try {
            const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
            const { svg } = await mermaid.render(id, code);
            setSvg(svg);
            setError(null);
        } catch (err) {
            console.error('Mermaid render error:', err);
            setError(err.message);
            setSvg('');
        }
    };

    const handleSave = () => {
        updateAttributes({ code: editCode });
        setIsEditing(false);
    };

    return (
        <NodeViewWrapper className="mermaid-node-view my-4">
            <div className="relative border border-gray-200 rounded-lg p-4 bg-white hover:shadow-sm transition-shadow group">
                {/* Render Area */}
                <div
                    className="flex justify-center overflow-x-auto"
                    dangerouslySetInnerHTML={{ __html: svg }}
                />

                {/* Error Message */}
                {error && (
                    <div className="text-red-500 text-sm p-2 bg-red-50 rounded mt-2">
                        Render Error: {error}
                    </div>
                )}

                {/* Controls */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={() => {
                            setEditCode(code);
                            setIsEditing(true);
                        }}
                        className="p-1.5 bg-white border border-gray-200 rounded shadow-sm hover:bg-gray-50 text-gray-600"
                        title="Edit Mermaid Code"
                    >
                        <Edit size={16} />
                    </button>
                </div>

                {/* Edit Modal */}
                {isEditing && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl flex flex-col max-h-[80vh]">
                            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                                <h3 className="font-semibold text-gray-800">Edit Diagram</h3>
                                <button onClick={() => setIsEditing(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                            </div>
                            <div className="p-4 flex-1 overflow-hidden flex flex-col">
                                <textarea
                                    className="flex-1 w-full p-3 font-mono text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none bg-gray-50"
                                    value={editCode}
                                    onChange={(e) => setEditCode(e.target.value)}
                                    spellCheck={false}
                                />
                            </div>
                            <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
                                <button
                                    onClick={() => setIsEditing(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Update Diagram
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </NodeViewWrapper>
    );
}
