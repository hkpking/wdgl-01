/**
 * 表格向量化服务
 * 将表格数据转换为文本并生成 embedding
 */
import { supabase } from '../supabase';

// ============================================
// 表格转文本
// ============================================

interface CellData {
    r: number;  // row
    c: number;  // column
    v?: {
        v?: string | number;  // value
        m?: string;           // formatted value
        ct?: { fa?: string }; // cell type
    };
}

interface SheetData {
    name?: string;
    celldata?: CellData[];
    data?: any[][];
}

/**
 * 将 FortuneSheet 数据转换为可索引的文本
 */
export function spreadsheetToText(sheets: SheetData[], title: string = ''): string {
    const lines: string[] = [];

    if (title) {
        lines.push(`表格标题: ${title}`);
        lines.push('');
    }

    for (const sheet of sheets) {
        const sheetName = sheet.name || 'Sheet';

        // 处理 celldata 格式 (FortuneSheet)
        if (sheet.celldata && sheet.celldata.length > 0) {
            // 构建行数据映射
            const rowMap = new Map<number, Map<number, string>>();
            let maxRow = 0;
            let maxCol = 0;

            for (const cell of sheet.celldata) {
                if (cell.v?.v !== undefined || cell.v?.m !== undefined) {
                    const value = String(cell.v?.m || cell.v?.v || '');
                    if (value.trim()) {
                        if (!rowMap.has(cell.r)) {
                            rowMap.set(cell.r, new Map());
                        }
                        rowMap.get(cell.r)!.set(cell.c, value);
                        maxRow = Math.max(maxRow, cell.r);
                        maxCol = Math.max(maxCol, cell.c);
                    }
                }
            }

            // 转换为文本行
            if (rowMap.size > 0) {
                lines.push(`[${sheetName}]`);

                // 获取表头（第一行）
                const headers: string[] = [];
                const headerRow = rowMap.get(0);
                if (headerRow) {
                    for (let c = 0; c <= maxCol; c++) {
                        headers.push(headerRow.get(c) || `列${c + 1}`);
                    }
                }

                // 输出数据行
                for (let r = 0; r <= maxRow; r++) {
                    const row = rowMap.get(r);
                    if (row && row.size > 0) {
                        const cells: string[] = [];
                        for (let c = 0; c <= maxCol; c++) {
                            const value = row.get(c);
                            if (value) {
                                const header = headers[c] || `列${c + 1}`;
                                cells.push(`${header}=${value}`);
                            }
                        }
                        if (cells.length > 0) {
                            lines.push(`行${r + 1}: ${cells.join(', ')}`);
                        }
                    }
                }
                lines.push('');
            }
        }

        // 处理 data 格式（二维数组）
        if (sheet.data && Array.isArray(sheet.data)) {
            lines.push(`[${sheetName}]`);
            const headers = sheet.data[0] || [];

            for (let r = 0; r < sheet.data.length; r++) {
                const row = sheet.data[r];
                if (row && row.some(cell => cell !== null && cell !== undefined && cell !== '')) {
                    const cells: string[] = [];
                    for (let c = 0; c < row.length; c++) {
                        if (row[c] !== null && row[c] !== undefined && row[c] !== '') {
                            const header = String(headers[c] || `列${c + 1}`);
                            cells.push(`${header}=${row[c]}`);
                        }
                    }
                    if (cells.length > 0) {
                        lines.push(`行${r + 1}: ${cells.join(', ')}`);
                    }
                }
            }
            lines.push('');
        }
    }

    return lines.join('\n').trim();
}

/**
 * 将文本分块（用于 embedding）
 */
export function chunkSpreadsheetText(text: string, maxChunkSize: number = 500): string[] {
    const lines = text.split('\n');
    const chunks: string[] = [];
    let currentChunk: string[] = [];
    let currentSize = 0;

    for (const line of lines) {
        if (currentSize + line.length > maxChunkSize && currentChunk.length > 0) {
            chunks.push(currentChunk.join('\n'));
            currentChunk = [];
            currentSize = 0;
        }
        currentChunk.push(line);
        currentSize += line.length + 1;
    }

    if (currentChunk.length > 0) {
        chunks.push(currentChunk.join('\n'));
    }

    return chunks;
}

// ============================================
// AI 分析
// ============================================

export interface AnalysisRequest {
    data: any[][];  // 选区数据
    prompt?: string;
    analysisType?: 'summary' | 'trend' | 'anomaly' | 'formula';
}

export interface AnalysisResult {
    summary: string;
    insights: string[];
    suggestions?: string[];
    chartRecommendation?: {
        type: 'bar' | 'line' | 'pie';
        reason: string;
    };
}

/**
 * 将选区数据格式化为分析文本
 */
export function formatSelectionForAnalysis(data: any[][]): string {
    const lines: string[] = [];

    // 假设第一行是表头
    const headers = data[0] || [];

    for (let r = 1; r < data.length; r++) {
        const row = data[r];
        const cells: string[] = [];
        for (let c = 0; c < row.length; c++) {
            if (row[c] !== null && row[c] !== undefined && row[c] !== '') {
                cells.push(`${headers[c] || `列${c + 1}`}: ${row[c]}`);
            }
        }
        if (cells.length > 0) {
            lines.push(cells.join(', '));
        }
    }

    return lines.join('\n');
}

/**
 * 生成 AI 分析 prompt
 */
export function buildAnalysisPrompt(data: string, userPrompt?: string, type?: string): string {
    const basePrompt = `你是一个专业的数据分析师。请分析以下表格数据：

${data}

`;

    if (userPrompt) {
        return basePrompt + `用户问题: ${userPrompt}\n\n请用中文回答。`;
    }

    switch (type) {
        case 'summary':
            return basePrompt + '请提供数据的概要统计（总计、平均值、最大最小值等）。用中文回答。';
        case 'trend':
            return basePrompt + '请分析数据的趋势和变化规律。用中文回答。';
        case 'anomaly':
            return basePrompt + '请检测数据中的异常值或异常模式。用中文回答。';
        case 'formula':
            return basePrompt + '请推荐适合这些数据的公式或计算方法。用中文回答。';
        default:
            return basePrompt + '请提供全面的数据分析，包括概要统计、趋势和建议。用中文回答。';
    }
}
