import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import FlowchartNodeView from '../components/FlowchartNodeView';

export default Node.create({
    name: 'flowchart',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
            data: {
                default: { cells: [] },
            },
            width: {
                default: '100%',
            },
            height: {
                default: '500px',
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'flowchart-component',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['flowchart-component', mergeAttributes(HTMLAttributes)];
    },

    addNodeView() {
        return ReactNodeViewRenderer(FlowchartNodeView);
    },
});
