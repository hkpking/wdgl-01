/**
 * Mention 扩展配置
 * 配置 @ 提及功能
 */
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import Mention from '@tiptap/extension-mention';
import MentionList from '../components/shared/MentionList';

/**
 * 创建 Mention 扩展
 * @param {function} fetchUsers - 获取用户列表的函数 (query) => Promise<User[]>
 */
export const createMentionExtension = (fetchUsers) => {
    return Mention.configure({
        HTMLAttributes: {
            class: 'mention',
        },
        suggestion: {
            items: async ({ query }) => {
                // 获取用户列表
                const users = await fetchUsers(query);
                return users.slice(0, 5); // 最多显示 5 个
            },
            render: () => {
                let component;
                let popup;

                return {
                    onStart: (props) => {
                        component = new ReactRenderer(MentionList, {
                            props,
                            editor: props.editor,
                        });

                        if (!props.clientRect) {
                            return;
                        }

                        popup = tippy('body', {
                            getReferenceClientRect: props.clientRect,
                            appendTo: () => document.body,
                            content: component.element,
                            showOnCreate: true,
                            interactive: true,
                            trigger: 'manual',
                            placement: 'bottom-start',
                        });
                    },
                    onUpdate(props) {
                        component.updateProps(props);

                        if (!props.clientRect) {
                            return;
                        }

                        popup[0].setProps({
                            getReferenceClientRect: props.clientRect,
                        });
                    },
                    onKeyDown(props) {
                        if (props.event.key === 'Escape') {
                            popup[0].hide();
                            return true;
                        }
                        return component.ref?.onKeyDown(props);
                    },
                    onExit() {
                        popup[0].destroy();
                        component.destroy();
                    },
                };
            },
        },
    });
};

export default createMentionExtension;
