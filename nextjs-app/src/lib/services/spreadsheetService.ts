/**
 * 电子表格服务 - CRUD 操作
 */
import { supabase } from './supabase';

// ============================================
// 类型定义
// ============================================

export interface Spreadsheet {
    id: string;
    title: string;
    data: any[];  // FortuneSheet 格式
    folderId: string | null;
    teamId: string | null;
    knowledgeBaseId: string | null;
    userId: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateSpreadsheetInput {
    title?: string;
    folderId?: string | null;
    teamId?: string | null;
    knowledgeBaseId?: string | null;
}

export interface UpdateSpreadsheetInput {
    title?: string;
    data?: any[];
    folderId?: string | null;
    status?: string;
}

// FortuneSheet 的 sheet 数据结构
export interface SheetData {
    name: string;
    celldata?: any[];
    data?: any[][];
    row?: number;
    column?: number;
    order?: number;
    status?: number;
    [key: string]: any;
}

// ============================================
// 辅助函数
// ============================================

/**
 * 深度比较两个值是否相等（忽略对象属性顺序）
 */
function deepEqual(a: unknown, b: unknown): boolean {
    if (a === b) return true;
    if (a === null || b === null) return a === b;
    if (typeof a !== 'object' || typeof b !== 'object') return false;

    const keysA = Object.keys(a as object);
    const keysB = Object.keys(b as object);
    if (keysA.length !== keysB.length) return false;

    for (const key of keysA) {
        if (!keysB.includes(key)) return false;
        if (!deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])) {
            return false;
        }
    }
    return true;
}

// ============================================
// 转换函数
// ============================================

function transformSpreadsheet(row: any): Spreadsheet {
    return {
        id: row.id,
        title: row.title,
        data: row.data || [],
        folderId: row.folder_id,
        teamId: row.team_id,
        knowledgeBaseId: row.knowledge_base_id,
        userId: row.user_id,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
    };
}

// ============================================
// CRUD 操作
// ============================================

/**
 * 创建表格
 */
export async function createSpreadsheet(
    userId: string,
    input: CreateSpreadsheetInput = {}
): Promise<Spreadsheet | null> {
    const { data, error } = await supabase
        .from('spreadsheets')
        .insert({
            title: input.title || '无标题表格',
            data: [{ name: 'Sheet1', celldata: [], row: 50, column: 26 }],
            folder_id: input.folderId || null,
            team_id: input.teamId || null,
            knowledge_base_id: input.knowledgeBaseId || null,
            user_id: userId,
            status: 'draft',
        })
        .select()
        .single();

    if (error) {
        console.error('[spreadsheetService] 创建表格失败:', error);
        return null;
    }

    return transformSpreadsheet(data);
}

/**
 * 获取表格详情
 */
export async function getSpreadsheet(id: string): Promise<Spreadsheet | null> {
    const { data, error } = await supabase
        .from('spreadsheets')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('[spreadsheetService] 获取表格失败:', error);
        return null;
    }

    // 调试日志 - 详细检查数据内容
    const firstSheet = data?.data?.[0];

    // 检查非空单元格
    let nonNullCount = 0;
    let firstNonNullCell = null;
    if (firstSheet?.data) {
        for (let r = 0; r < firstSheet.data.length && !firstNonNullCell; r++) {
            const row = firstSheet.data[r];
            if (row) {
                for (let c = 0; c < row.length; c++) {
                    if (row[c] !== null && row[c] !== undefined) {
                        nonNullCount++;
                        if (!firstNonNullCell) {
                            firstNonNullCell = { row: r, col: c, value: row[c] };
                        }
                    }
                }
            }
        }
        // 继续计数剩余的非空单元格
        for (let r = firstNonNullCell?.row || 0; r < firstSheet.data.length; r++) {
            const row = firstSheet.data[r];
            if (row) {
                for (const cell of row) {
                    if (cell !== null && cell !== undefined) {
                        nonNullCount++;
                    }
                }
            }
        }
        if (firstNonNullCell) nonNullCount--; // 修正重复计数
    }

    console.log('[spreadsheetService] 获取表格成功:', {
        id: data?.id,
        title: data?.title,
        sheetCount: data?.data?.length,
        sheetKeys: firstSheet ? Object.keys(firstSheet) : [],
        dataRows: firstSheet?.data?.length || 0,
        celldataLength: firstSheet?.celldata?.length || 0,
        nonNullCellCount: nonNullCount,
        firstNonNullCell: firstNonNullCell
    });

    return transformSpreadsheet(data);
}

/**
 * 更新表格
 */
export async function updateSpreadsheet(
    id: string,
    input: UpdateSpreadsheetInput
): Promise<Spreadsheet | null> {
    const updates: Record<string, unknown> = {};
    if (input.title !== undefined) updates.title = input.title;
    if (input.data !== undefined) updates.data = input.data;
    if (input.folderId !== undefined) updates.folder_id = input.folderId;
    if (input.status !== undefined) updates.status = input.status;

    // 诊断日志
    const dataToSave = updates.data as any[] | undefined;
    const firstSheet = dataToSave?.[0];
    console.log('[spreadsheetService] 更新表格请求:', {
        id,
        title: updates.title,
        hasData: !!dataToSave,
        sheetCount: dataToSave?.length,
        // 检查两种数据格式
        celldataLength: firstSheet?.celldata?.length || 0,
        dataRows: firstSheet?.data?.length || 0,
        dataFirstRow: firstSheet?.data?.[0]?.slice(0, 3),  // data 二维数组格式
        firstThreeCelldata: firstSheet?.celldata?.slice(0, 3)?.map((c: any) => ({
            r: c.r, c: c.c, v: c.v?.v || c.v?.m
        })),
        sheetKeys: firstSheet ? Object.keys(firstSheet) : []  // 查看 sheet 有哪些字段
    });

    // 🛡️ 服务层空数据保护：防止意外保存空数据覆盖已有内容
    if (input.data !== undefined) {
        const hasDataContent = firstSheet?.data?.some((row: any[]) =>
            row?.some((cell: any) => cell !== null && cell !== undefined)
        );
        const hasCelldataContent = (firstSheet?.celldata?.length || 0) > 0;

        if (dataToSave?.length === 0 || (!hasDataContent && !hasCelldataContent)) {
            console.warn('[spreadsheetService] ⚠️ 检测到保存空数据 (data:', hasDataContent, 'celldata:', hasCelldataContent, ')');
            // 🚨 修正：不再强制拦截，而是允许保存。
            // 因为 FortuneSheet 可能在某些操作后返回的数据结构被误判为空，
            // 或者用户确实想清空表格。前端应该负责主要的空数据拦截。
            console.log('[spreadsheetService] 继续执行保存操作...');
        }

        // 🛡️ 数据清洗：如果只有 data 而没有 celldata，自动转换
        // FortuneSheet 需要 celldata 才能正确再次加载
        if (dataToSave && dataToSave.length > 0) {
            updates.data = dataToSave.map(sheet => {
                if (sheet.data && (!sheet.celldata || sheet.celldata.length === 0)) {
                    console.log(`[spreadsheetService] ⚠️ 发现 sheet "${sheet.name}" 缺少 celldata，正在从 data 自动生成...`);
                    const celldata: any[] = [];
                    // 遍历二维数组
                    for (let r = 0; r < sheet.data.length; r++) {
                        const row = sheet.data[r];
                        if (!row) continue;
                        for (let c = 0; c < row.length; c++) {
                            const cell = row[c];
                            if (cell !== null && cell !== undefined) {
                                celldata.push({
                                    r,
                                    c,
                                    v: cell
                                });
                            }
                        }
                    }
                    console.log(`[spreadsheetService] ✅ 以为 "${sheet.name}" 生成 ${celldata.length} 个 celldata`);
                    return {
                        ...sheet,
                        celldata
                    };
                }
                return sheet;
            });
        }
    }


    // 检查认证状态
    const { data: sessionData } = await supabase.auth.getSession();
    console.log('[spreadsheetService] 当前用户:', sessionData?.session?.user?.id || '未登录');

    const { data, error } = await supabase
        .from('spreadsheets')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('[spreadsheetService] 更新表格失败:', error);
        console.error('[spreadsheetService] 错误详情:', JSON.stringify(error, null, 2));
        return null;
    }

    console.log('[spreadsheetService] 更新成功，返回数据:', {
        id: data?.id,
        title: data?.title,
        dataLength: data?.data?.length,
        returnedDataRows: data?.data?.[0]?.data?.length || 0,
        returnedFirstCell: data?.data?.[0]?.data?.[0]?.[0],  // 返回的第一个单元格
        sentFirstCell: firstSheet?.data?.[0]?.[0]  // 发送的第一个单元格
    });

    // 🔍 显式 re-fetch 验证数据是否真正写入
    // 只有在更新了 data 时才进行深度数据验证，避免只更新标题时误报
    if (updates.data) {
        const { data: verifyData, error: verifyError } = await supabase
            .from('spreadsheets')
            .select('data')
            .eq('id', id)
            .single();

        if (verifyError) {
            console.error('[spreadsheetService] ⚠️ 验证查询失败:', verifyError);
        } else {
            const verifyFirstCell = verifyData?.data?.[0]?.data?.[0]?.[0];
            const sentCell = firstSheet?.data?.[0]?.[0]; // 此时 firstSheet 肯定存在

            if (!deepEqual(sentCell, verifyFirstCell)) {
                console.error('[spreadsheetService] ❌ 数据未真正写入数据库！RLS 策略可能阻止了更新！');
                console.log('[spreadsheetService] 🔍 差异对比:', {
                    sent: JSON.stringify(sentCell)?.slice(0, 50),
                    verified: JSON.stringify(verifyFirstCell)?.slice(0, 50)
                });
            } else {
                console.log('[spreadsheetService] ✅ 数据已确认写入数据库');
            }
        }
    } else if (updates.title) {
        // 如果只更新了标题，简单验证标题
        if (data?.title !== updates.title) {
            console.error(`[spreadsheetService] ❌ 标题更新看似成功但返回值不匹配: 期望 "${updates.title}", 实际 "${data?.title}"`);
        } else {
            console.log(`[spreadsheetService] ✅ 标题已更新: "${updates.title}"`);
        }
    }


    const result = transformSpreadsheet(data);

    // 异步触发向量化（不阻塞保存）
    if (input.data && input.data.length > 0) {
        triggerEmbedding(id, result.userId, input.data, input.title || result.title);
    }

    return result;
}

/**
 * 异步触发表格向量化
 */
async function triggerEmbedding(
    spreadsheetId: string,
    userId: string,
    data: any[],
    title: string
): Promise<void> {
    try {
        const response = await fetch('/api/spreadsheet/embeddings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                spreadsheetId,
                userId,
                data,
                title,
            }),
        });

        if (!response.ok) {
            console.error('[spreadsheetService] 向量化请求失败:', await response.text());
        } else {
            console.log('[spreadsheetService] 向量化请求已发送');
        }
    } catch (err) {
        console.error('[spreadsheetService] 向量化请求异常:', err);
    }
}

/**
 * 删除表格
 */
export async function deleteSpreadsheet(id: string): Promise<boolean> {
    const { error } = await supabase
        .from('spreadsheets')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('[spreadsheetService] 删除表格失败:', error);
        return false;
    }

    return true;
}

/**
 * 获取用户的表格列表
 */
export async function listSpreadsheets(
    userId: string,
    options?: { folderId?: string | null; teamId?: string; knowledgeBaseId?: string }
): Promise<Spreadsheet[]> {
    let query = supabase
        .from('spreadsheets')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

    if (options?.folderId !== undefined) {
        query = query.eq('folder_id', options.folderId);
    }
    if (options?.teamId) {
        query = query.eq('team_id', options.teamId);
    }
    if (options?.knowledgeBaseId) {
        query = query.eq('knowledge_base_id', options.knowledgeBaseId);
    }

    const { data, error } = await query;

    if (error) {
        console.error('[spreadsheetService] 获取表格列表失败:', error);
        return [];
    }

    return (data || []).map(transformSpreadsheet);
}

/**
 * 移动表格到文件夹
 */
export async function moveSpreadsheet(
    id: string,
    folderId: string | null
): Promise<boolean> {
    const { error } = await supabase
        .from('spreadsheets')
        .update({ folder_id: folderId })
        .eq('id', id);

    if (error) {
        console.error('[spreadsheetService] 移动表格失败:', error);
        return false;
    }

    return true;
}

/**
 * 保存表格 (创建或更新) - 参照 saveDocument 逻辑
 */
export async function saveSpreadsheet(
    userId: string,
    id: string | null,
    data: {
        title: string;
        data?: SheetData[];
        folderId?: string | null;
        status?: Spreadsheet['status'];
    }
): Promise<Spreadsheet | null> {

    // 1. 准备 Payload
    const payload: any = {
        title: data.title,
        user_id: userId, // 确保归属
        updated_at: new Date().toISOString(),
    };

    // 仅当定义了这些字段时才更新/设置
    if (data.folderId !== undefined) payload.folder_id = data.folderId;
    if (data.status !== undefined) payload.status = data.status;

    // 2. 数据处理与清洗 (参照 updateSpreadsheet 中的逻辑)
    if (data.data) {
        let cleanData = data.data;
        const firstSheet = cleanData?.[0];

        // 空数据保护
        const hasDataContent = firstSheet?.data?.some((row: any[]) =>
            row?.some((cell: any) => cell !== null && cell !== undefined)
        );
        const hasCelldataContent = (firstSheet?.celldata?.length || 0) > 0;

        // 如果只有 data 没有 celldata，自动转换
        if (cleanData && cleanData.length > 0) {
            cleanData = cleanData.map(sheet => {
                // 判断是否需要补充 celldata
                if (sheet.data && (!sheet.celldata || sheet.celldata.length === 0)) {
                    console.log(`[saveSpreadsheet] Auto-generating celldata for "${sheet.name}"`);
                    const celldata: any[] = [];
                    for (let r = 0; r < sheet.data.length; r++) {
                        const row = sheet.data[r];
                        if (!row) continue;
                        for (let c = 0; c < row.length; c++) {
                            const cell = row[c];
                            if (cell !== null && cell !== undefined) {
                                celldata.push({ r, c, v: cell });
                            }
                        }
                    }
                    return { ...sheet, celldata };
                }
                return sheet;
            });
        }

        payload.data = cleanData;
    }

    // 3. Upsert 逻辑
    let result;
    if (id) {
        // Update - 让 RLS 策略处理权限（团队成员可编辑团队/知识库表格）
        const { data: updated, error } = await supabase
            .from('spreadsheets')
            .update(payload)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('[saveSpreadsheet] Update failed:', error);
            return null;
        }
        result = updated;
    } else {
        // Create (Insert)
        // 创建时必须有 data 字段
        if (!payload.data) {
            payload.data = [{ name: 'Sheet1', celldata: [], row: 50, column: 26 }];
        }

        const { data: created, error } = await supabase
            .from('spreadsheets')
            .insert({
                ...payload,
                status: payload.status || 'draft'
            })
            .select()
            .single();

        if (error) {
            console.error('[saveSpreadsheet] Create failed:', error);
            return null;
        }
        result = created;
    }

    return result;
}
