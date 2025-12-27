/**
 * 历史操作按钮组件 (撤销/重做)
 */
import React from 'react';
import { Undo, Redo } from 'lucide-react';
import { ToolbarButton as Button } from '../shared';

export function HistoryButtons({ editor }) {
    if (!editor) return null;

    // 确保编辑器视图已完全初始化
    if (!editor.view || !editor.view.dom || editor.isDestroyed) {
        return null;
    }

    // 安全的 undo/redo 检查 - 避免在视图未完全就绪时调用 focus()
    let canUndo = false;
    let canRedo = false;
    try {
        canUndo = editor.can().undo();
        canRedo = editor.can().redo();
    } catch {
        // 编辑器视图未就绪时忽略错误
    }

    return (
        <div className="flex gap-1 border-r border-gray-300 pr-2">
            <Button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!canUndo}
                title="撤销"
            >
                <Undo size={18} />
            </Button>
            <Button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!canRedo}
                title="重做"
            >
                <Redo size={18} />
            </Button>
        </div>
    );
}
