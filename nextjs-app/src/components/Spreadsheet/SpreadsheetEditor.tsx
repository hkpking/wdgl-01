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
            console.log('[SpreadsheetEditor] 使用传入数据:', initialData.length, '个 sheet');
            return initialData;
        }
        // 默认空表格
        console.log('[SpreadsheetEditor] 使用默认空表格');
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
                    console.log('[SpreadsheetEditor] getAllSheets 返回:', sheets?.length, '个 sheet');

                    // 详细的数据结构诊断
                    if (sheets?.length > 0) {
                        const firstSheet = sheets[0];
                        console.log('[SpreadsheetEditor] 第一个 sheet 的 keys:', Object.keys(firstSheet || {}));
                        console.log('[SpreadsheetEditor] celldata 长度:', firstSheet?.celldata?.length || 0);
                        console.log('[SpreadsheetEditor] data 行数:', firstSheet?.data?.length || 0);

                        // 检查 data 数组中的实际非空数据
                        if (firstSheet?.data) {
                            let nonNullCount = 0;
                            for (const row of firstSheet.data) {
                                if (row) {
                                    for (const cell of row) {
                                        if (cell !== null && cell !== undefined) {
                                            nonNullCount++;
                                            if (nonNullCount <= 3) {
                                                console.log('[SpreadsheetEditor] 发现非空单元格:', JSON.stringify(cell).slice(0, 100));
                                            }
                                        }
                                    }
                                }
                            }
                            console.log('[SpreadsheetEditor] data 中非空单元格总数:', nonNullCount);
                        }

                        // 检查 celldata 中的数据
                        if (firstSheet?.celldata?.length > 0) {
                            console.log('[SpreadsheetEditor] celldata 前3项:', firstSheet.celldata.slice(0, 3));
                        }
                    }

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
        console.log('[SpreadsheetEditor] onChange 触发');
        if (onChange) {
            onChange(data);
        }
    }, [onChange]);

    // 使用 sheetId 作为 key，当 sheetId 变化时强制重新创建 Workbook 组件
    const workbookKey = sheetId || 'default';
    console.log('[SpreadsheetEditor] 渲染, key:', workbookKey);

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

