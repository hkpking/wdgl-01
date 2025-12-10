import { Mark, mergeAttributes } from '@tiptap/core';

/**
 * 评论标记扩展
 * 
 * 设计说明（对标 Google Docs）：
 * - inclusive: false - 在标记边界输入的新文本不会继承评论样式
 * - exitable: true - 光标可以从标记中移出
 * - 这确保评论只标记原始选中的文本，后续输入不受影响
 */
export const CommentMark = Mark.create({
    name: 'comment',

    // 关键配置：新输入的文本不继承评论标记
    inclusive: false,

    // 允许光标从标记中退出
    exitable: true,

    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },

    addAttributes() {
        return {
            commentId: {
                default: null,
                parseHTML: element => element.getAttribute('data-comment-id'),
                renderHTML: attributes => {
                    if (!attributes.commentId) {
                        return {};
                    }
                    return {
                        'data-comment-id': attributes.commentId,
                    };
                },
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'span[data-comment-id]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
    },

    addCommands() {
        return {
            setComment: attributes => ({ commands }) => {
                return commands.setMark(this.name, attributes);
            },
            unsetComment: () => ({ commands }) => {
                return commands.unsetMark(this.name);
            },
        };
    },
});
