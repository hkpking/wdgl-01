import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import ClauseBlock from '../components/Editor/ClauseBlock';

export default Node.create({
    name: 'clause',

    group: 'block',

    content: 'block+', // Can contain other blocks (like paragraphs)

    draggable: true,

    addAttributes() {
        return {
            id: {
                default: null,
            },
            type: {
                default: 'standard', // standard, mandatory, risk, suggested
            },
            responsibility: {
                default: '',
            },
            dept: {
                default: '',
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-type="clause"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'clause' }), 0];
    },

    addNodeView() {
        return ReactNodeViewRenderer(ClauseBlock);
    },

    addKeyboardShortcuts() {
        return {
            Enter: () => {
                // If we are in a clause, create a new one below
                return this.editor.commands.insertContent({
                    type: 'clause',
                    attrs: { id: `c_${Date.now().toString().slice(-4)}`, type: 'standard' },
                    content: [{ type: 'paragraph' }]
                });
            },
        };
    },
});
