/**
 * SWR 数据缓存 Hooks
 * 提供数据获取、缓存、自动刷新功能
 */

import useSWR, { mutate } from 'swr';
import * as kbService from '@/lib/services/kbService';
import * as teamService from '@/lib/services/teamService';
import * as documentService from '@/lib/services/api/documentService';
import { listSpreadsheets, type Spreadsheet } from '@/lib/services/spreadsheetService';
import type { KnowledgeBase, KBFolder, Team } from '@/types/team';

// ============================================
// 通用 Fetcher
// ============================================

/**
 * SWR 配置选项
 */
export const swrConfig = {
    revalidateOnFocus: false,  // 聚焦时不自动刷新
    revalidateOnReconnect: true,  // 网络恢复时刷新
    dedupingInterval: 5000,  // 5秒内相同请求去重
    errorRetryCount: 3,  // 错误重试次数
};

// ============================================
// 团队相关 Hooks
// ============================================

/**
 * 获取可见团队列表
 */
export function useTeams(userId: string | undefined) {
    return useSWR(
        userId ? ['teams', userId] : null,
        () => teamService.getVisibleTeams(userId!),
        {
            ...swrConfig,
            revalidateOnMount: true,
        }
    );
}

/**
 * 获取单个团队
 */
export function useTeam(teamId: string | undefined) {
    return useSWR(
        teamId ? ['team', teamId] : null,
        () => teamService.getTeam(teamId!),
        swrConfig
    );
}

// ============================================
// 知识库相关 Hooks
// ============================================

/**
 * 获取团队的知识库列表
 */
export function useKnowledgeBases(teamId: string | undefined) {
    return useSWR(
        teamId ? ['knowledgeBases', teamId] : null,
        () => kbService.getKnowledgeBases(teamId!),
        swrConfig
    );
}

/**
 * 获取单个知识库
 */
export function useKnowledgeBase(kbId: string | undefined) {
    return useSWR<KnowledgeBase | null>(
        kbId ? ['knowledgeBase', kbId] : null,
        () => kbService.getKnowledgeBase(kbId!),
        swrConfig
    );
}

/**
 * 获取知识库文件夹
 */
export function useKBFolders(kbId: string | undefined) {
    return useSWR<KBFolder[]>(
        kbId ? ['kbFolders', kbId] : null,
        () => kbService.getKBFolders(kbId!),
        swrConfig
    );
}

/**
 * 获取知识库文档 - 统一使用 documents 表
 */
export function useKBDocuments(kbId: string | undefined) {
    return useSWR(
        kbId ? ['kbDocuments', kbId] : null,
        () => documentService.getKBDocuments(kbId!),
        swrConfig
    );
}

/**
 * 获取知识库表格
 */
export function useKBSpreadsheets(userId: string | undefined, kbId: string | undefined) {
    return useSWR<Spreadsheet[]>(
        userId && kbId ? ['kbSpreadsheets', userId, kbId] : null,
        () => listSpreadsheets(userId!, { knowledgeBaseId: kbId }),
        swrConfig
    );
}

// ============================================
// 缓存刷新函数
// ============================================

/**
 * 刷新团队数据
 */
export function refreshTeams(userId: string) {
    mutate(['teams', userId]);
}

/**
 * 刷新知识库数据
 */
export function refreshKnowledgeBase(kbId: string) {
    mutate(['knowledgeBase', kbId]);
    mutate(['kbFolders', kbId]);
    mutate(['kbDocuments', kbId]);
}

/**
 * 刷新知识库文档
 */
export function refreshKBDocuments(kbId: string) {
    mutate(['kbDocuments', kbId]);
}

/**
 * 刷新知识库表格
 */
export function refreshKBSpreadsheets(userId: string, kbId: string) {
    mutate(['kbSpreadsheets', userId, kbId]);
}

// ============================================
// 组合 Hook（获取知识库完整数据）
// ============================================

export interface KBData {
    kb: KnowledgeBase | null | undefined;
    folders: KBFolder[] | undefined;
    documents: any[] | undefined;
    spreadsheets: Spreadsheet[] | undefined;
    isLoading: boolean;
    error: any;
}

/**
 * 一次性获取知识库所有数据
 */
export function useKBData(kbId: string | undefined, userId: string | undefined): KBData {
    const { data: kb, error: kbError } = useKnowledgeBase(kbId);
    const { data: folders } = useKBFolders(kbId);
    const { data: documents } = useKBDocuments(kbId);
    const { data: spreadsheets } = useKBSpreadsheets(userId, kbId);

    const isLoading = !kb && !kbError;

    return {
        kb,
        folders,
        documents,
        spreadsheets,
        isLoading,
        error: kbError,
    };
}
