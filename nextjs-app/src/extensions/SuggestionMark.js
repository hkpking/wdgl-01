/**
 * 建议标记扩展
 * 用于实现类似 Google Docs 的建议编辑模式
 * 
 * 建议类型：
 * - insert: 新增内容（绿色高亮）
 * - delete: 删除内容（红色删除线）
 */
import { Mark, mergeAttributes } from '@tiptap/core';

export const SuggestionMark = Mark.create({
    name: 'suggestion',

    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },

    addAttributes() {
        return {
            // 建议类型: 'insert' | 'delete'
            type: {
                default: 'insert',
                parseHTML: element => element.getAttribute('data-suggestion-type'),
                renderHTML: attributes => ({
                    'data-suggestion-type': attributes.type,
                }),
            },
            // 建议 ID
            id: {
                default: null,
                parseHTML: element => element.getAttribute('data-suggestion-id'),
                renderHTML: attributes => ({
                    'data-suggestion-id': attributes.id,
                }),
            },
            // 建议者信息
            authorId: {
                default: null,
                parseHTML: element => element.getAttribute('data-author-id'),
                renderHTML: attributes => ({
                    'data-author-id': attributes.authorId,
                }),
            },
            authorName: {
                default: null,
                parseHTML: element => element.getAttribute('data-author-name'),
                renderHTML: attributes => ({
                    'data-author-name': attributes.authorName,
                }),
            },
            // 建议时间
            createdAt: {
                default: null,
                parseHTML: element => element.getAttribute('data-created-at'),
                renderHTML: attributes => ({
                    'data-created-at': attributes.createdAt,
                }),
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'span[data-suggestion-id]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        const type = HTMLAttributes['data-suggestion-type'] || 'insert';
        const classes = type === 'delete'
            ? 'suggestion suggestion-delete'
            : 'suggestion suggestion-insert';

        return ['span', mergeAttributes(
            this.options.HTMLAttributes,
            HTMLAttributes,
            { class: classes }
        ), 0];
    },

    addCommands() {
        return {
            // 添加建议（新增内容）
            setSuggestionInsert: (attributes) => ({ commands }) => {
                return commands.setMark(this.name, {
                    ...attributes,
                    type: 'insert',
                    id: attributes.id || `sug_${Date.now()}`,
                    createdAt: attributes.createdAt || new Date().toISOString()
                });
            },

            // 添加建议（删除内容）
            setSuggestionDelete: (attributes) => ({ commands }) => {
                return commands.setMark(this.name, {
                    ...attributes,
                    type: 'delete',
                    id: attributes.id || `sug_${Date.now()}`,
                    createdAt: attributes.createdAt || new Date().toISOString()
                });
            },

            // 接受建议
            acceptSuggestion: (suggestionId) => ({ tr, state, dispatch }) => {
                if (!dispatch) return false;

                let found = false;
                state.doc.descendants((node, pos) => {
                    node.marks.forEach(mark => {
                        if (mark.type.name === 'suggestion' && mark.attrs.id === suggestionId) {
                            found = true;
                            const type = mark.attrs.type;

                            if (type === 'delete') {
                                // 删除建议被接受：移除这段文本
                                tr.delete(pos, pos + node.nodeSize);
                            } else {
                                // 新增建议被接受：移除标记保留文本
                                tr.removeMark(pos, pos + node.nodeSize, mark.type);
                            }
                        }
                    });
                });

                return found;
            },

            // 拒绝建议
            rejectSuggestion: (suggestionId) => ({ tr, state, dispatch }) => {
                if (!dispatch) return false;

                let found = false;
                state.doc.descendants((node, pos) => {
                    node.marks.forEach(mark => {
                        if (mark.type.name === 'suggestion' && mark.attrs.id === suggestionId) {
                            found = true;
                            const type = mark.attrs.type;

                            if (type === 'insert') {
                                // 新增建议被拒绝：移除这段文本
                                tr.delete(pos, pos + node.nodeSize);
                            } else {
                                // 删除建议被拒绝：移除标记保留文本
                                tr.removeMark(pos, pos + node.nodeSize, mark.type);
                            }
                        }
                    });
                });

                return found;
            },

            // 移除建议标记
            unsetSuggestion: () => ({ commands }) => {
                return commands.unsetMark(this.name);
            },
        };
    },
});

export default SuggestionMark;
