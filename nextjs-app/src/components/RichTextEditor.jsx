import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useEditor, EditorContent, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extension-placeholder';
import ImageExtension from '../extensions/ImageExtension';
import { Link } from '@tiptap/extension-link';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { TextStyle } from '@tiptap/extension-text-style';
import { FontFamily } from '@tiptap/extension-font-family';
import { FontSize } from '../extensions/FontSize';
import { LineHeight } from '../extensions/LineHeight';
import { TextAlign } from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import { Highlight } from '@tiptap/extension-highlight';
import GlobalDragHandle from 'tiptap-extension-global-drag-handle';
import Flowchart from '../extensions/FlowchartExtension';
import { Indent } from '../extensions/Indent';
import { CommentMark } from '../extensions/CommentMark';
import { GhostText } from '../extensions/GhostTextExtension';
import { SuggestionMark } from '../extensions/SuggestionMark';
import { RiskNode, RuleNode, ProcessLinkNode, ProcessCardNode, ArchitectureMatrixNode } from '../extensions/ModuleExtensions';
import { MermaidExtension } from '../extensions/MermaidExtension';
import { SearchReplaceExtension } from '../extensions/SearchReplaceExtension';
import TableContextMenu from './TableContextMenu';
import SearchReplace from './SearchReplace';
import SelectionMenu from './SelectionMenu';
import { Collaboration } from '@tiptap/extension-collaboration';
import { CollaborationCursor } from '@tiptap/extension-collaboration-cursor';
import './editor.css';

/**
 * RichTextEditor 组件
 * @param {string} content - HTML 内容 (非协作模式使用)
 * @param {function} onChange - 内容变化回调
 * @param {string} placeholder - 占位文本
 * @param {boolean} editable - 是否可编辑
 * @param {function} onEditorReady - 编辑器就绪回调
 * @param {function} onMagicCommand - Magic Command 快捷键回调
 * @param {object} collaboration - 协作配置 { ydoc, provider, user }
 */
export default function RichTextEditor({
    content,
    onChange,
    placeholder = '开始输入...',
    editable = true,
    onEditorReady,
    onMagicCommand,
    collaboration
}) {
    const [menuPosition, setMenuPosition] = useState(null);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchMode, setSearchMode] = useState('search'); // 'search' or 'replace'

    // 使用 ref 存储 onMagicCommand，避免作为 useMemo 依赖导致编辑器重建
    const onMagicCommandRef = useRef(onMagicCommand);
    onMagicCommandRef.current = onMagicCommand;

    // 使用 ref 存储协作配置，避免作为 useMemo 依赖导致编辑器重建
    const collaborationRef = useRef(collaboration);
    collaborationRef.current = collaboration;

    // 判断是否为协作模式
    const isCollaborationMode = !!(collaboration?.ydoc && collaboration?.provider);

    // 构建扩展列表
    const extensions = useMemo(() => {
        const baseExtensions = [
            GlobalDragHandle,
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4, 5, 6],
                },
                link: false,
                // 协作模式下禁用 history (由 Yjs 管理)
                history: isCollaborationMode ? false : undefined,
            }),
            Placeholder.configure({
                placeholder,
            }),
            ImageExtension.configure({
                inline: true,
                allowBase64: true,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    target: '_blank',
                    rel: 'noopener noreferrer',
                },
            }),
            TaskList,
            TaskItem.configure({
                nested: true,
            }),
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: 'tiptap-table',
                },
            }),
            TableRow,
            TableHeader,
            TableCell,
            TextStyle,
            FontFamily,
            FontSize,
            LineHeight,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Color,
            Highlight.configure({ multicolor: true }),
            Flowchart,
            Indent,
            CommentMark,
            SuggestionMark,
            GhostText,
            RiskNode,
            RuleNode,
            ProcessLinkNode,
            ProcessCardNode,
            ArchitectureMatrixNode,
            MermaidExtension,
            SearchReplaceExtension.configure({
                onOpenSearch: () => {
                    setIsSearchOpen(true);
                    setSearchMode('search');
                },
                onOpenReplace: () => {
                    setIsSearchOpen(true);
                    setSearchMode('replace');
                },
                onCloseSearch: () => {
                    setIsSearchOpen(false);
                },
            }),
            Extension.create({
                name: 'HeadingEnterHandler',
                addKeyboardShortcuts() {
                    return {
                        Enter: ({ editor }) => {
                            const { selection } = editor.state;
                            const { $from, empty } = selection;

                            if (!empty || $from.parent.type.name !== 'heading') {
                                return false;
                            }

                            const isAtEnd = $from.parentOffset === $from.parent.content.size;

                            if (isAtEnd) {
                                return editor.chain().insertContent({ type: 'paragraph' }).run();
                            }

                            return false;
                        },
                    };
                },
            }),
            Extension.create({
                name: 'customKeyboardShortcuts',
                addKeyboardShortcuts() {
                    return {
                        // Magic Command: Ctrl+K
                        'Mod-k': () => {
                            if (onMagicCommandRef.current) {
                                onMagicCommandRef.current();
                                return true;
                            }
                            return false;
                        },
                        // 标题快捷键: Ctrl+1~6
                        'Mod-1': () => this.editor.chain().focus().toggleHeading({ level: 1 }).run(),
                        'Mod-2': () => this.editor.chain().focus().toggleHeading({ level: 2 }).run(),
                        'Mod-3': () => this.editor.chain().focus().toggleHeading({ level: 3 }).run(),
                        'Mod-4': () => this.editor.chain().focus().toggleHeading({ level: 4 }).run(),
                        'Mod-5': () => this.editor.chain().focus().toggleHeading({ level: 5 }).run(),
                        'Mod-6': () => this.editor.chain().focus().toggleHeading({ level: 6 }).run(),
                        // 正文: Ctrl+0
                        'Mod-0': () => this.editor.chain().focus().setParagraph().run(),
                        // 有序列表: Ctrl+Shift+7
                        'Mod-Shift-7': () => this.editor.chain().focus().toggleOrderedList().run(),
                        // 无序列表: Ctrl+Shift+8
                        'Mod-Shift-8': () => this.editor.chain().focus().toggleBulletList().run(),
                    }
                },
            }),
        ];

        // 协作模式扩展
        if (isCollaborationMode) {
            baseExtensions.push(
                Collaboration.configure({
                    document: collaborationRef.current.ydoc,
                }),
                CollaborationCursor.configure({
                    provider: collaborationRef.current.provider,
                    user: collaborationRef.current.user || {
                        name: '匿名用户',
                        color: '#6B7280'
                    },
                })
            );
        }

        return baseExtensions;
    }, [placeholder, isCollaborationMode]);

    const editor = useEditor({
        extensions,
        content: isCollaborationMode ? undefined : content, // 协作模式下内容由 Yjs 管理
        editable,
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            // 协作模式下仍然触发 onChange 以便本地状态同步
            const html = editor.getHTML();
            onChange(html);
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none w-full focus:outline-none min-h-[900px] px-8 py-10',
            },
        },
    }, [extensions]); // 当 extensions 变化时重新创建编辑器

    // Expose editor instance
    useEffect(() => {
        if (editor && onEditorReady) {
            onEditorReady(editor);
        }
    }, [editor, onEditorReady]);

    // Update content when prop changes (非协作模式)
    useEffect(() => {
        if (!isCollaborationMode && editor && content !== editor.getHTML()) {
            // 仅在编辑器未聚焦时同步内容，避免输入冲突
            if (!editor.isFocused) {
                // 使用 queueMicrotask 避免在 React 渲染周期内触发 flushSync
                queueMicrotask(() => {
                    if (editor && !editor.isDestroyed) {
                        editor.commands.setContent(content);
                    }
                });
            }
        }
    }, [content, editor, isCollaborationMode]);

    // Update editable state when prop changes
    useEffect(() => {
        if (editor) {
            editor.setEditable(editable);
        }
    }, [editor, editable]);

    // Handle Context Menu
    const handleContextMenu = (e) => {
        if (!editor) return;

        // Check if we clicked inside a table
        const isTable = e.target.closest('table');

        if (isTable) {
            e.preventDefault();
            setMenuPosition({ x: e.clientX, y: e.clientY });
        } else {
            setMenuPosition(null);
        }
    };

    if (!editor) {
        return null;
    }

    return (
        <div
            className="rich-text-editor relative"
            onContextMenu={handleContextMenu}
        >
            <EditorContent editor={editor} className="editor-content" />

            {menuPosition && (
                <TableContextMenu
                    editor={editor}
                    position={menuPosition}
                    onClose={() => setMenuPosition(null)}
                />
            )}

            {/* 查找替换浮层 */}
            <SearchReplace
                editor={editor}
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
                mode={searchMode}
            />

            {/* AI 选中文本浮动菜单 */}
            <SelectionMenu editor={editor} />
        </div>
    );
}
