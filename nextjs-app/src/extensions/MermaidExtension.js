import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import MermaidNodeView from '../components/MermaidNodeView';

export const MermaidExtension = Node.create({
    name: 'mermaid',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
            code: {
                default: 'graph TD\nA[Start] --> B[End]',
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'mermaid-diagram',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['mermaid-diagram', mergeAttributes(HTMLAttributes)];
    },

    addNodeView() {
        return ReactNodeViewRenderer(MermaidNodeView);
    },
});
