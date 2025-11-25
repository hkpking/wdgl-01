import { Extension } from '@tiptap/core';

export const Indent = Extension.create({
    name: 'indent',

    addOptions() {
        return {
            types: ['paragraph', 'heading'],
        };
    },

    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    marginLeft: {
                        default: 0,
                        parseHTML: element => parseInt(element.style.marginLeft) || 0,
                        renderHTML: attributes => {
                            if (!attributes.marginLeft) return {};
                            return { style: `margin-left: ${attributes.marginLeft}px` };
                        },
                    },
                    textIndent: {
                        default: 0,
                        parseHTML: element => parseInt(element.style.textIndent) || 0,
                        renderHTML: attributes => {
                            if (!attributes.textIndent) return {};
                            return { style: `text-indent: ${attributes.textIndent}px` };
                        },
                    },
                },
            },
        ];
    },

    addCommands() {
        return {
            setMarginLeft: (px) => ({ commands }) => {
                let applied = false;
                this.options.types.forEach(type => {
                    if (commands.updateAttributes(type, { marginLeft: px })) {
                        applied = true;
                    }
                });
                return applied;
            },
            setTextIndent: (px) => ({ commands }) => {
                let applied = false;
                this.options.types.forEach(type => {
                    if (commands.updateAttributes(type, { textIndent: px })) {
                        applied = true;
                    }
                });
                return applied;
            },
        };
    },
    addKeyboardShortcuts() {
        return {
            'Tab': () => {
                const { editor } = this;

                // If inside a list, sink the list item
                if (editor.isActive('bulletList') || editor.isActive('orderedList') || editor.isActive('taskList')) {
                    return editor.chain().focus().sinkListItem('listItem').run();
                }

                // For paragraphs, prioritize First Line Indent (Standard Chinese typesetting)
                // If textIndent is 0, set it to 32px (approx 2 chars)
                const currentTextIndent = editor.getAttributes('paragraph').textIndent || 0;
                if (currentTextIndent === 0) {
                    return editor.chain().focus().setTextIndent(32).run();
                }

                // If already has first line indent, increase block indent (margin-left)
                const currentMargin = editor.getAttributes('paragraph').marginLeft || 0;
                return editor.chain().focus().setMarginLeft(currentMargin + 20).run();
            },
            'Shift-Tab': () => {
                const { editor } = this;

                // If inside a list, lift the list item
                if (editor.isActive('bulletList') || editor.isActive('orderedList') || editor.isActive('taskList')) {
                    return editor.chain().focus().liftListItem('listItem').run();
                }

                // For paragraphs, check textIndent first
                const currentTextIndent = editor.getAttributes('paragraph').textIndent || 0;
                if (currentTextIndent > 0) {
                    return editor.chain().focus().setTextIndent(0).run();
                }

                // Otherwise, decrease block indent
                const currentMargin = editor.getAttributes('paragraph').marginLeft || 0;
                const newMargin = Math.max(0, currentMargin - 20);
                return editor.chain().focus().setMarginLeft(newMargin).run();
            },
        };
    },
});
