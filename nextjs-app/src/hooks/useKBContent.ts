/**
 * useKBContent Hook
 * 使用 React Query 从 all_content_items 视图获取知识库内容
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/services/supabase";
import { ContentItem, transformContentItem } from "@/types/content";

// Query Key 工厂函数
export const contentKeys = {
    all: ["content"] as const,
    lists: () => [...contentKeys.all, "list"] as const,
    list: (filters: { kbId?: string; folderId?: string | null }) =>
        [...contentKeys.lists(), filters] as const,
    detail: (id: string, type: "document" | "spreadsheet") =>
        [...contentKeys.all, "detail", type, id] as const,
};

interface UseKBContentOptions {
    knowledgeBaseId: string;
    folderId?: string | null;
    enabled?: boolean;
}

/**
 * 获取知识库内容列表 (文档 + 表格混合)
 */
export function useKBContent({
    knowledgeBaseId,
    folderId,
    enabled = true,
}: UseKBContentOptions) {
    return useQuery({
        queryKey: contentKeys.list({ kbId: knowledgeBaseId, folderId }),
        queryFn: async (): Promise<ContentItem[]> => {
            let query = supabase
                .from("all_content_items")
                .select("*")
                .eq("knowledge_base_id", knowledgeBaseId)
                .order("updated_at", { ascending: false });

            // 文件夹过滤
            if (folderId === null) {
                query = query.is("folder_id", null);
            } else if (folderId) {
                query = query.eq("folder_id", folderId);
            }

            const { data, error } = await query;

            if (error) {
                console.error("[useKBContent] 获取内容失败:", error);
                throw error;
            }

            return (data || []).map(transformContentItem);
        },
        enabled: enabled && !!knowledgeBaseId,
    });
}

/**
 * 失效指定知识库的内容缓存
 * 用于在创建/更新/删除内容后刷新列表
 */
export function useInvalidateKBContent() {
    const queryClient = useQueryClient();

    return (knowledgeBaseId: string) => {
        // Invalidate all lists to ensure we catch the one with folderId: null/undefined
        queryClient.invalidateQueries({
            queryKey: contentKeys.lists(),
        });
    };
}

/**
 * 批量失效所有 content 相关缓存
 */
export function useInvalidateAllContent() {
    const queryClient = useQueryClient();

    return () => {
        queryClient.invalidateQueries({
            queryKey: contentKeys.all,
        });
    };
}
