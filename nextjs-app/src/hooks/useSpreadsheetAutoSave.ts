import { useState, useEffect, useCallback } from 'react';
import { saveSpreadsheet, type SheetData } from '@/lib/services/spreadsheetService';

/**
 * useSpreadsheetAutoSave - 表格自动保存 Hook
 * 参照 useAutoSave.js 实现，但适配表格的 Ref 数据结构
 */
export const useSpreadsheetAutoSave = (
    id: string | null,
    currentUser: any,
    title: string,
    dataRef: React.MutableRefObject<any[]>,
    isInitialized: boolean,
    onSaveStatusChange: (status: 'saved' | 'saving' | 'error' | 'unsaved') => void
) => {
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [isDirty, setIsDirty] = useState(false);

    // 触发保存的函数
    const handleSave = useCallback(async () => {
        if (!id || !title.trim() || !currentUser) return;

        setSaving(true);
        onSaveStatusChange('saving');

        try {
            const data = dataRef.current;
            // 简单的空数据检查
            if (!data || data.length === 0) {
                console.warn('[AutoSave] Data empty, skipping save');
                setSaving(false);
                onSaveStatusChange('saved');
                return;
            }

            console.log('[AutoSave] Saving spreadsheet:', id);
            await saveSpreadsheet(currentUser.uid, id, {
                title,
                data
            });

            setLastSaved(new Date());
            setIsDirty(false);
            onSaveStatusChange('saved');
            console.log('[AutoSave] Save success');
        } catch (error) {
            console.error('[AutoSave] Save failed:', error);
            onSaveStatusChange('error');
        } finally {
            setSaving(false);
        }
    }, [id, currentUser, title, dataRef, onSaveStatusChange]);

    // 标记为需要保存 (Dirty)
    const markDirty = useCallback(() => {
        if (isInitialized) {
            setIsDirty(true);
            onSaveStatusChange('unsaved');
        }
    }, [isInitialized, onSaveStatusChange]);

    // 自动保存定时器
    useEffect(() => {
        if (!id || !isDirty) return;

        const timer = setTimeout(() => {
            handleSave();
        }, 3000); // 3秒后自动保存

        return () => clearTimeout(timer);
    }, [id, isDirty, handleSave]);

    // 浏览器关闭警告
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    return { saving, lastSaved, handleSave, markDirty, isDirty };
};
