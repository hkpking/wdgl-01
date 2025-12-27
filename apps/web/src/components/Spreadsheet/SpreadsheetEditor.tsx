'use client';

import React, { useRef, useCallback, forwardRef, useImperativeHandle, useMemo } from 'react';
import { Workbook } from '@fortune-sheet/react';
import '@fortune-sheet/react/dist/index.css';

interface SpreadsheetEditorProps {
    /** 表格 ID，用于强制重新渲染 */
    sheetId?: string;
    initialData: any[];
    onChange?: (data: any[]) => void;
    readOnly?: boolean;
}

export interface SpreadsheetEditorHandle {
    /** 获取所有 sheet 的完整数据（包含最新编辑）。失败返回 null */
    getAllSheets: () => any[] | null;
}

/**
 * FortuneSheet 封装组件
 * 使用 forwardRef 暴露 getAllSheets 方法让父组件在保存时获取最新数据
 * 
 * 注意：FortuneSheet 的 Workbook 组件不会响应 data prop 的动态变化
 * 因此需要通过 key 属性强制重新创建组件来切换表格
 */
const SpreadsheetEditor = forwardRef<SpreadsheetEditorHandle, SpreadsheetEditorProps>(({
    sheetId,
    initialData,
    onChange,
    readOnly = false,
}, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const workbookRef = useRef<any>(null);

    // 确保初始数据格式正确 - 使用 useMemo 避免每次渲染都创建新对象
    const sheets = useMemo(() => {
        if (Array.isArray(initialData) && initialData.length > 0) {
            return initialData;
        }
        // 默认空表格
        return [{
            name: 'Sheet1',
            celldata: [],
            row: 100,
            column: 26,
            order: 0,
            status: 1,
        }];
    }, [initialData]);

    // 暴露 getAllSheets 方法给父组件
    useImperativeHandle(ref, () => ({
        getAllSheets: () => {
            if (workbookRef.current) {
                try {
                    const sheets = workbookRef.current.getAllSheets?.();
                    return sheets || null;
                } catch (error) {
                    console.error('[SpreadsheetEditor] getAllSheets 失败:', error);
                    return null;
                }
            }
            console.warn('[SpreadsheetEditor] workbookRef 未初始化');
            return null;
        }
    }), []);

    // 处理数据变化 - 仅通知父组件有变化
    const handleChange = useCallback((data: any[]) => {
        if (onChange) {
            onChange(data);
        }
    }, [onChange]);

    // 使用 sheetId 作为 key，当 sheetId 变化时强制重新创建 Workbook 组件
    const workbookKey = sheetId || 'default';

    return (
        <div ref={containerRef} className="w-full h-full">
            <Workbook
                key={workbookKey}
                ref={workbookRef}
                data={sheets}
                onChange={handleChange}
                lang="zh"
                showToolbar={true}
                showFormulaBar={true}
                showSheetTabs={true}
                allowEdit={!readOnly}
                row={100}
                column={26}
            />
        </div>
    );
});

SpreadsheetEditor.displayName = 'SpreadsheetEditor';

export default SpreadsheetEditor;

