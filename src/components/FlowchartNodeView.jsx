import React, { useEffect, useRef, useState } from 'react';
import { NodeViewWrapper } from '@tiptap/react';
import { Graph } from '@antv/x6';
import { Edit } from 'lucide-react';
import FlowchartEditor from './FlowchartEditor';

export default function FlowchartNodeView({ node, updateAttributes }) {
    const [isEditing, setIsEditing] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const containerRef = useRef(null);
    const graphRef = useRef(null);

    const { data = { cells: [] }, width = '100%', height = '500px' } = node.attrs;

    useEffect(() => {
        if (!containerRef.current) return;

        // Initialize Read-only Graph
        const graph = new Graph({
            container: containerRef.current,
            interactive: false, // Read-only
            grid: false,
            background: {
                color: '#f8f9fa',
            },
        });

        graphRef.current = graph;

        if (data && data.cells) {
            graph.fromJSON(data);
            graph.zoomToFit({ padding: 20 });
            graph.centerContent();
        }

        return () => {
            graph.dispose();
        };
    }, []); // Init once

    // Update graph when data changes (e.g. after save)
    useEffect(() => {
        if (graphRef.current && data && data.cells) {
            graphRef.current.fromJSON(data);
            graphRef.current.zoomToFit({ padding: 20 });
            graphRef.current.centerContent();
        }
    }, [data]);

    const handleSave = (newData) => {
        updateAttributes({
            data: newData,
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
                {/* Read-only preview */}
                <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

                {/* Edit button overlay */}
                {isHovered && (
                    <div className="absolute inset-0 bg-black bg-opacity-10 flex items-center justify-center z-10">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
                        >
                            <Edit size={18} />
                            编辑流程图
                        </button>
                    </div>
                )}

                {/* Empty state */}
                {(!data || !data.cells || data.cells.length === 0) && !isHovered && (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
                        <div className="text-center">
                            <p className="text-sm">空白流程图</p>
                            <p className="text-xs mt-1">点击编辑开始创建</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Editor Modal */}
            <FlowchartEditor
                isOpen={isEditing}
                onClose={() => setIsEditing(false)}
                initialData={data}
                onSave={handleSave}
            />
        </NodeViewWrapper>
    );
}
