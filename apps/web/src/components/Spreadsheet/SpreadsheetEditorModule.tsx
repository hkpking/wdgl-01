"use client";

/**
 * SpreadsheetEditorModule - 表格编辑器独立模块
 * 
 * 这是一个完整的、可复用的表格编辑器模块。
 * 可以被独立编辑页和知识库页面共同使用。
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, FileSpreadsheet, MoreVertical, Sparkles, Check, Cloud, CloudOff, MessageSquare, History } from 'lucide-react';
import dynamic from 'next/dynamic';
import { getSpreadsheet, updateSpreadsheet, saveSpreadsheet, type Spreadsheet } from '@/lib/services/spreadsheetService';
import { type SpreadsheetEditorHandle } from '@/components/Spreadsheet/SpreadsheetEditor';
import { useUnifiedComments } from '@/hooks/useUnifiedComments';
import { useVersionHistory } from '@/hooks/useVersionHistory';

// 动态导入 FortuneSheet（禁用 SSR）
const SpreadsheetEditor = dynamic(
    () => import('@/components/Spreadsheet/SpreadsheetEditor'),
    { ssr: false, loading: () => <div className="flex-1 flex items-center justify-center">加载表格编辑器...</div> }
);

const AIAnalysisPanel = dynamic(
    () => import('@/components/Spreadsheet/AIAnalysisPanel'),
    { ssr: false }
);

const CommentSidebar = dynamic(
    () => import('@/components/shared/Comments/CommentSidebar'),
    { ssr: false }
);

const VersionHistorySidebar = dynamic(
    () => import('@/components/shared/VersionHistorySidebar'),
    { ssr: false }
);

// 类型定义
type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';

export interface SpreadsheetEditorModuleProps {
    /** 表格 ID */
    spreadsheetId: string;
    /** 初始表格数据（可选，如果不传则自动加载） */
    initialSpreadsheet?: Spreadsheet;
    /** 当前用户 ID */
    userId: string;
    /** 当前用户信息 */
    currentUser?: { uid: string; displayName?: string; email?: string };
    /** 显示模式 */
    mode?: 'standalone' | 'embedded';
    /** 返回按钮回调 */
    onBack?: () => void;
    /** 是否显示返回按钮 */
    showBackButton?: boolean;
    /** 是否显示头部工具栏 */
    showHeader?: boolean;
    /** 标题变化回调 */
    onTitleChange?: (title: string) => void;
    /** 保存成功回调 */
    onSaveSuccess?: (data?: { id: string; title: string; updatedAt: string }) => void;
    /** 编辑状态变化回调（用于同步父组件的 dirty 状态） */
    onDirtyChange?: (isDirty: boolean) => void;
}

export default function SpreadsheetEditorModule({
    spreadsheetId,
    initialSpreadsheet,
    userId,
    currentUser,
    mode = 'standalone',
    onBack,
    showBackButton = true,
    showHeader = true,
    onTitleChange,
    onSaveSuccess,
    onDirtyChange,
}: SpreadsheetEditorModuleProps) {
    const router = useRouter();

    // 表格状态
    const [spreadsheet, setSpreadsheet] = useState<Spreadsheet | null>(initialSpreadsheet || null);
    const [title, setTitle] = useState(initialSpreadsheet?.title || '');
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const dataRef = useRef<any[]>(initialSpreadsheet?.data || []);
    const spreadsheetEditorRef = useRef<SpreadsheetEditorHandle>(null);
    const isInitializedRef = useRef(false);

    // AI 面板状态
    const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);

    // 评论和版本历史状态
    const [isCommentSidebarOpen, setIsCommentSidebarOpen] = useState(false);
    const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
    const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
    const [newCommentDraft, setNewCommentDraft] = useState<any>(null);

    // 使用通用评论 Hook
    const commentTarget = { type: 'spreadsheet' as const, id: spreadsheetId };
    const userInfo = currentUser || { uid: userId, displayName: '用户' };
    const {
        comments,
        addComment: addCommentToDb,
        replyToComment,
        resolveComment,
        deleteComment: deleteCommentFromDb,
        loadComments
    } = useUnifiedComments(commentTarget, userInfo, { autoLoad: true });

    // 监听 props 中的 title 变化（例如侧边栏重命名）
    useEffect(() => {
        if (initialSpreadsheet?.title && initialSpreadsheet.title !== title) {
            setTitle(initialSpreadsheet.title);
        }
    }, [initialSpreadsheet?.title]);

    // 评论操作处理函数
    const handleSubmitComment = useCallback(async (content: string, mentions: any[] = []) => {
        if (!newCommentDraft) return;
        const result = await addCommentToDb(content, {
            cellRow: newCommentDraft.cellRow,
            cellCol: newCommentDraft.cellCol,
            quote: newCommentDraft.quote
        }, mentions.map(m => m.id));
        if (result) {
            setActiveCommentId(result.id);
        }
        setNewCommentDraft(null);
    }, [newCommentDraft, addCommentToDb]);

    const handleReplyComment = useCallback(async (commentId: string, content: string) => {
        await replyToComment(commentId, content);
    }, [replyToComment]);

    const handleResolveComment = useCallback(async (commentId: string) => {
        await resolveComment(commentId);
    }, [resolveComment]);

    const handleDeleteComment = useCallback(async (commentId: string) => {
        if (!window.confirm('确定要删除这条评论吗？')) return;
        await deleteCommentFromDb(commentId);
    }, [deleteCommentFromDb]);

    const handleSelectComment = useCallback((commentId: string) => {
        setActiveCommentId(commentId);
        // TODO: 滚动到对应单元格
    }, []);

    // 添加评论（从单元格）
    const handleAddComment = useCallback(() => {
        // 表格评论：允许不选择具体单元格直接添加
        setIsCommentSidebarOpen(true);
        setIsAIPanelOpen(false);
        setNewCommentDraft({ quote: '表格评论' });
    }, []);

    // 加载表格数据（如果没有初始数据或 ID 变化）
    useEffect(() => {
        if (initialSpreadsheet && initialSpreadsheet.id === spreadsheetId) {
            setSpreadsheet(initialSpreadsheet);
            setTitle(initialSpreadsheet.title);
            dataRef.current = initialSpreadsheet.data || [];
            // 如果提供了初始数据，标记为已初始化，防止空数据覆盖
            isInitializedRef.current = true;
            return;
        }

        const loadSpreadsheet = async () => {
            if (!spreadsheetId) return;
            // 如果已经有正确的表格数据（比如从 props 传入的），就不重复加载
            if (spreadsheet?.id === spreadsheetId) return;

            const data = await getSpreadsheet(spreadsheetId);
            if (data) {
                setSpreadsheet(data);
                setTitle(data.title);
                dataRef.current = data.data || [];
                isInitializedRef.current = true;
            } else if (mode === 'standalone') {
                router.push('/wdgl/dashboard');
            }
        };
        loadSpreadsheet();
    }, [spreadsheetId, initialSpreadsheet, mode, router]);

    // 同步 dirty 状态到父组件
    useEffect(() => {
        if (onDirtyChange) {
            const isDirty = saveStatus === 'unsaved' || saveStatus === 'error';
            onDirtyChange(isDirty);
        }
    }, [saveStatus, onDirtyChange]);

    // 保存表格
    const handleSave = useCallback(async (showIndicator = true) => {
        if (!spreadsheetId || !userId) return;

        if (showIndicator) setSaveStatus('saving');
        try {
            const latestData = spreadsheetEditorRef.current?.getAllSheets() || dataRef.current;

            // 验证数据有效性
            const firstSheet = latestData?.[0];
            const hasDataContent = firstSheet?.data?.some((row: any[]) =>
                row?.some((cell: any) => cell !== null && cell !== undefined)
            );
            const hasCelldataContent = (firstSheet?.celldata?.length || 0) > 0;

            if (!latestData || latestData.length === 0 || (!hasDataContent && !hasCelldataContent)) {
                console.warn('[Spreadsheet] 数据为空，跳过保存');
                setSaveStatus('saved');
                return;
            }

            await saveSpreadsheet(userId, spreadsheetId, { title, data: latestData });
            setLastSaved(new Date());
            setSaveStatus('saved');
            onSaveSuccess?.({
                id: spreadsheetId,
                title,
                updatedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error('[Spreadsheet] 保存失败:', error);
            setSaveStatus('error');
        }
    }, [spreadsheetId, userId, title, onSaveSuccess]);

    // 处理数据变化
    const handleDataChange = useCallback((data: any[]) => {
        if (!isInitializedRef.current) {
            const firstSheet = data?.[0];
            const hasDataContent = firstSheet?.data?.some((row: any[]) =>
                row?.some((cell: any) => cell !== null && cell !== undefined)
            );
            const hasCelldataContent = (firstSheet?.celldata?.length || 0) > 0;

            if (!hasDataContent && !hasCelldataContent) {
                return;
            }
            isInitializedRef.current = true;
        }
        dataRef.current = data;
        setSaveStatus('unsaved');
    }, []);

    // 标题变化
    const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        setSaveStatus('unsaved');
        onTitleChange?.(newTitle);
    }, [onTitleChange]);

    // 返回
    const handleBack = useCallback(() => {
        if (onBack) {
            onBack();
        } else {
            router.push('/wdgl/dashboard');
        }
    }, [onBack, router]);

    // 快捷键保存
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleSave]);

    // 获取选中区域数据（用于 AI 分析）
    const getSelectionData = useCallback((): any[][] | null => {
        const sheets = dataRef.current;
        if (!sheets || sheets.length === 0) return null;

        const sheet = sheets[0];
        if (!sheet.celldata || sheet.celldata.length === 0) return null;

        const rowMap = new Map<number, Map<number, any>>();
        let maxRow = 0;
        let maxCol = 0;

        for (const cell of sheet.celldata) {
            if (cell.v?.v !== undefined || cell.v?.m !== undefined) {
                const value = cell.v?.m ?? cell.v?.v ?? '';
                if (!rowMap.has(cell.r)) {
                    rowMap.set(cell.r, new Map());
                }
                rowMap.get(cell.r)!.set(cell.c, value);
                maxRow = Math.max(maxRow, cell.r);
                maxCol = Math.max(maxCol, cell.c);
            }
        }

        const result: any[][] = [];
        for (let r = 0; r <= Math.min(maxRow, 50); r++) {
            const row: any[] = [];
            for (let c = 0; c <= Math.min(maxCol, 20); c++) {
                row.push(rowMap.get(r)?.get(c) ?? '');
            }
            result.push(row);
        }

        return result.length > 0 ? result : null;
    }, []);

    if (!spreadsheet) {
        return (
            <div className="h-full flex items-center justify-center bg-gray-50">
                <div className="text-gray-500">加载中...</div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col bg-white">
            {/* 顶部工具栏 */}
            {showHeader && (
                <header className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-white shrink-0">
                    <div className="flex items-center gap-3">
                        {showBackButton && (
                            <button
                                onClick={handleBack}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="返回"
                            >
                                <ArrowLeft size={20} className="text-gray-600" />
                            </button>
                        )}

                        <FileSpreadsheet size={20} className="text-green-600" />

                        <input
                            type="text"
                            value={title}
                            onChange={handleTitleChange}
                            onBlur={() => handleSave()}
                            className="text-lg font-medium bg-transparent border-none outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 min-w-[200px]"
                            placeholder="无标题表格"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        {/* 保存状态指示器 */}
                        <div className="flex items-center gap-1.5 text-xs">
                            {saveStatus === 'saved' && (
                                <>
                                    <Cloud size={14} className="text-green-500" />
                                    <span className="text-gray-400">
                                        {lastSaved ? `已保存 ${lastSaved.toLocaleTimeString()}` : '已保存'}
                                    </span>
                                </>
                            )}
                            {saveStatus === 'saving' && (
                                <>
                                    <Cloud size={14} className="text-blue-500 animate-pulse" />
                                    <span className="text-blue-500">保存中...</span>
                                </>
                            )}
                            {saveStatus === 'unsaved' && (
                                <>
                                    <CloudOff size={14} className="text-orange-500" />
                                    <span className="text-orange-500">未保存</span>
                                </>
                            )}
                            {saveStatus === 'error' && (
                                <>
                                    <CloudOff size={14} className="text-red-500" />
                                    <span className="text-red-500">保存失败</span>
                                </>
                            )}
                        </div>

                        <button
                            onClick={() => handleSave()}
                            disabled={saveStatus === 'saving'}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            {saveStatus === 'saving' ? (
                                <Cloud size={16} className="animate-pulse" />
                            ) : saveStatus === 'saved' ? (
                                <Check size={16} />
                            ) : (
                                <Save size={16} />
                            )}
                            {saveStatus === 'saving' ? '保存中...' : '保存'}
                        </button>

                        <button
                            onClick={() => setIsAIPanelOpen(!isAIPanelOpen)}
                            className={`p-2 rounded-lg transition-colors ${isAIPanelOpen ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'}`}
                            title="AI 分析"
                        >
                            <Sparkles size={20} className="text-purple-600" />
                        </button>

                        <button
                            onClick={handleAddComment}
                            className={`p-2 rounded-lg transition-colors ${isCommentSidebarOpen ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                            title="评论"
                        >
                            <MessageSquare size={20} className={isCommentSidebarOpen ? 'text-blue-600' : 'text-gray-600'} />
                        </button>

                        <button
                            onClick={() => setIsVersionHistoryOpen(!isVersionHistoryOpen)}
                            className={`p-2 rounded-lg transition-colors ${isVersionHistoryOpen ? 'bg-amber-100 text-amber-600' : 'hover:bg-gray-100'}`}
                            title="版本历史"
                        >
                            <History size={20} className={isVersionHistoryOpen ? 'text-amber-600' : 'text-gray-600'} />
                        </button>

                        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreVertical size={20} className="text-gray-600" />
                        </button>
                    </div>
                </header>
            )}

            {/* 主体区域 */}
            <div className="flex-1 flex overflow-hidden">
                {/* 编辑器主体 */}
                <main className={`flex-1 overflow-hidden`}>
                    <SpreadsheetEditor
                        ref={spreadsheetEditorRef}
                        sheetId={`${spreadsheetId}-${spreadsheet.data?.length || 0}`}
                        initialData={spreadsheet.data}
                        onChange={handleDataChange}
                    />
                </main>

                {/* 评论侧边栏 */}
                {isCommentSidebarOpen && (
                    <div className="w-80 border-l border-gray-200 flex-shrink-0">
                        <CommentSidebar
                            comments={comments}
                            currentUser={userInfo}
                            activeCommentId={activeCommentId}
                            onAddComment={handleAddComment}
                            onSubmitDraft={handleSubmitComment}
                            onReply={handleReplyComment}
                            onResolve={handleResolveComment}
                            onDelete={handleDeleteComment}
                            onSelectComment={handleSelectComment}
                            onClose={() => setIsCommentSidebarOpen(false)}
                            newCommentDraft={newCommentDraft}
                            onCancelDraft={() => setNewCommentDraft(null)}
                            users={[]}
                        />
                    </div>
                )}

                {/* 版本历史侧边栏 */}
                {isVersionHistoryOpen && (
                    <div className="w-80 border-l border-gray-200 flex-shrink-0">
                        <VersionHistorySidebar
                            docId={spreadsheetId}
                            currentUser={userInfo}
                            currentVersionId={null}
                            onSelectVersion={(version: any) => {
                                // TODO: 恢复版本
                                console.log('选择版本:', version);
                            }}
                            onClose={() => setIsVersionHistoryOpen(false)}
                        />
                    </div>
                )}
            </div>

            {/* AI 分析面板 */}
            <AIAnalysisPanel
                isOpen={isAIPanelOpen}
                onClose={() => setIsAIPanelOpen(false)}
                onGetSelection={getSelectionData}
            />
        </div>
    );
}
