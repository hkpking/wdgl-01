/**
 * 表格导入导出工具
 */
import * as XLSX from 'xlsx';

// ============================================
// 导出功能
// ============================================

interface SheetData {
    name?: string;
    celldata?: Array<{
        r: number;
        c: number;
        v?: { v?: any; m?: string };
    }>;
}

/**
 * 将 FortuneSheet 数据导出为 Excel 文件
 */
export function exportToExcel(sheets: SheetData[], filename: string = '表格'): void {
    const workbook = XLSX.utils.book_new();

    for (const sheet of sheets) {
        const sheetName = sheet.name || 'Sheet1';

        // 将 celldata 转换为二维数组
        const data: any[][] = [];
        if (sheet.celldata) {
            let maxRow = 0;
            let maxCol = 0;

            for (const cell of sheet.celldata) {
                maxRow = Math.max(maxRow, cell.r);
                maxCol = Math.max(maxCol, cell.c);
            }

            for (let r = 0; r <= maxRow; r++) {
                data[r] = [];
                for (let c = 0; c <= maxCol; c++) {
                    data[r][c] = '';
                }
            }

            for (const cell of sheet.celldata) {
                const value = cell.v?.m ?? cell.v?.v ?? '';
                data[cell.r][cell.c] = value;
            }
        }

        const worksheet = XLSX.utils.aoa_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.substring(0, 31));
    }

    XLSX.writeFile(workbook, `${filename}.xlsx`);
}

/**
 * 将 FortuneSheet 数据导出为 CSV 文件
 */
export function exportToCSV(sheets: SheetData[], filename: string = '表格'): void {
    if (sheets.length === 0) return;

    const sheet = sheets[0];
    const data: any[][] = [];

    if (sheet.celldata) {
        let maxRow = 0;
        let maxCol = 0;

        for (const cell of sheet.celldata) {
            maxRow = Math.max(maxRow, cell.r);
            maxCol = Math.max(maxCol, cell.c);
        }

        for (let r = 0; r <= maxRow; r++) {
            data[r] = [];
            for (let c = 0; c <= maxCol; c++) {
                data[r][c] = '';
            }
        }

        for (const cell of sheet.celldata) {
            const value = cell.v?.m ?? cell.v?.v ?? '';
            data[cell.r][cell.c] = value;
        }
    }

    const worksheet = XLSX.utils.aoa_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
}

// ============================================
// 导入功能
// ============================================

/**
 * 从 Excel 文件导入数据
 */
export async function importFromExcel(file: File): Promise<SheetData[]> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });

                const sheets: SheetData[] = workbook.SheetNames.map((name, idx) => {
                    const worksheet = workbook.Sheets[name];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

                    // 转换为 FortuneSheet celldata 格式
                    const celldata: SheetData['celldata'] = [];
                    for (let r = 0; r < jsonData.length; r++) {
                        for (let c = 0; c < (jsonData[r]?.length || 0); c++) {
                            const value = jsonData[r][c];
                            if (value !== undefined && value !== null && value !== '') {
                                celldata.push({
                                    r,
                                    c,
                                    v: { v: value, m: String(value) },
                                });
                            }
                        }
                    }

                    return {
                        name,
                        celldata,
                        order: idx,
                        status: idx === 0 ? 1 : 0,
                        row: Math.max(jsonData.length + 10, 50),
                        column: Math.max((jsonData[0]?.length || 0) + 5, 26),
                    } as any;
                });

                resolve(sheets);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => reject(new Error('文件读取失败'));
        reader.readAsArrayBuffer(file);
    });
}

/**
 * 从 CSV 文件导入数据
 */
export async function importFromCSV(file: File): Promise<SheetData[]> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const csv = e.target?.result as string;
                const workbook = XLSX.read(csv, { type: 'string' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

                // 转换为 FortuneSheet celldata 格式
                const celldata: SheetData['celldata'] = [];
                for (let r = 0; r < jsonData.length; r++) {
                    for (let c = 0; c < (jsonData[r]?.length || 0); c++) {
                        const value = jsonData[r][c];
                        if (value !== undefined && value !== null && value !== '') {
                            celldata.push({
                                r,
                                c,
                                v: { v: value, m: String(value) },
                            });
                        }
                    }
                }

                resolve([{
                    name: 'Sheet1',
                    celldata,
                    order: 0,
                    status: 1,
                    row: Math.max(jsonData.length + 10, 50),
                    column: Math.max((jsonData[0]?.length || 0) + 5, 26),
                } as any]);
            } catch (error) {
                reject(error);
            }
        };

        reader.onerror = () => reject(new Error('文件读取失败'));
        reader.readAsText(file);
    });
}
