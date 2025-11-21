import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import TextStyle from '@tiptap/extension-text-style';
import FontFamily from '@tiptap/extension-font-family';
import { FontSize } from '../extensions/FontSize';
import { LineHeight } from '../extensions/LineHeight';
import TextAlign from '@tiptap/extension-text-align';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Flowchart from '../extensions/FlowchartExtension';
import MenuBar from './MenuBar';
import TableContextMenu from './TableContextMenu';
import './editor.css';

export default function RichTextEditor({ content, onChange, placeholder = '开始输入...', editable = true }) {
    const [menuPosition, setMenuPosition] = useState(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4, 5, 6],
                },
                link: false,
            }),
            Placeholder.configure({
                placeholder,
            }),
            Image.configure({
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
        ],
        content,
        editable,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html);
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none',
            },
        },
    });

    // Update content when prop changes
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [content, editor]);

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
            <MenuBar editor={editor} />
            <EditorContent editor={editor} className="editor-content" />

            {menuPosition && (
                <TableContextMenu
                    editor={editor}
                    position={menuPosition}
                    onClose={() => setMenuPosition(null)}
                />
            )}
        </div>
    );
}
