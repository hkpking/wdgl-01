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

                // Determine active type (paragraph or heading)
                let activeType = null;
                for (const type of this.options.types) {
                    if (editor.isActive(type)) {
                        activeType = type;
                        break;
                    }
                }

                if (!activeType) return false; // Not in a supported block

                // Logic: Always increase indent (marginLeft) for Tab, 
                // unless we want to support First Line Indent specifically.
                // User complaint: "Whole document indents" -> likely means they want simple block indentation.
                // Let's stick to standard block indentation (marginLeft) for consistency with Google Docs behavior on Tab.
                // Google Docs: Tab increases Left Indent.

                const currentMargin = editor.getAttributes(activeType).marginLeft || 0;
                return editor.chain().focus().setMarginLeft(currentMargin + 32).run();
            },
            'Shift-Tab': () => {
                const { editor } = this;

                if (editor.isActive('bulletList') || editor.isActive('orderedList') || editor.isActive('taskList')) {
                    return editor.chain().focus().liftListItem('listItem').run();
                }

                let activeType = null;
                for (const type of this.options.types) {
                    if (editor.isActive(type)) {
                        activeType = type;
                        break;
                    }
                }

                if (!activeType) return false;

                const currentMargin = editor.getAttributes(activeType).marginLeft || 0;
                const newMargin = Math.max(0, currentMargin - 32);
                return editor.chain().focus().setMarginLeft(newMargin).run();
            },
            'Backspace': () => {
                const { editor } = this;
                const { selection } = editor.state;
                const { $from, empty } = selection;

                // Only handle if cursor is at the start of the block and selection is empty
                if (!empty || $from.parentOffset !== 0) {
                    return false;
                }

                let activeType = null;
                for (const type of this.options.types) {
                    if (editor.isActive(type)) {
                        activeType = type;
                        break;
                    }
                }

                if (!activeType) return false;

                // Check indentation
                const currentMargin = editor.getAttributes(activeType).marginLeft || 0;
                const currentTextIndent = editor.getAttributes(activeType).textIndent || 0;

                if (currentMargin > 0) {
                    // Decrease indent
                    return editor.chain().focus().setMarginLeft(Math.max(0, currentMargin - 32)).run();
                }

                if (currentTextIndent > 0) {
                    // Remove text indent
                    return editor.chain().focus().setTextIndent(0).run();
                }

                return false; // Default backspace behavior (merge)
            }
        };
    },
});
