/**
 * 元数据过滤搜索
 * 支持按文档类型、时间范围、标签等过滤搜索结果
 */

export interface SearchFilters {
    documentType?: string;           // 文档类型: policy, workflow, manual, etc.
    dateRange?: {
        from?: Date | string;
        to?: Date | string;
    };
    tags?: string[];                 // 标签过滤
    status?: string;                 // 文档状态
    department?: string;             // 部门
    author?: string;                 // 作者
    minSimilarity?: number;          // 最小相似度阈值
}

export interface EnhancedSearchOptions {
    query: string;
    userId?: string;
    topK?: number;
    filters?: SearchFilters;
    enableRerank?: boolean;
    enableCache?: boolean;
}

/**
 * 文档类型映射
 */
export const DOCUMENT_TYPES = {
    policy: { label: '制度', keywords: ['制度', '规定', '政策', '条例'] },
    workflow: { label: '流程', keywords: ['流程', '步骤', '操作', '指南'] },
    manual: { label: '手册', keywords: ['手册', '说明书', '指南'] },
    template: { label: '模板', keywords: ['模板', '范本', '样例'] },
    report: { label: '报告', keywords: ['报告', '总结', '分析'] },
    notice: { label: '通知', keywords: ['通知', '公告', '通报'] },
} as const;

/**
 * 从查询中提取隐式过滤条件
 * @param query - 用户查询
 * @returns 提取的过滤条件
 */
export function extractImplicitFilters(query: string): Partial<SearchFilters> {
    const filters: Partial<SearchFilters> = {};
    const lowerQuery = query.toLowerCase();

    // 提取文档类型
    for (const [type, config] of Object.entries(DOCUMENT_TYPES)) {
        if (config.keywords.some(kw => lowerQuery.includes(kw))) {
            filters.documentType = type;
            break;
        }
    }

    // 提取时间范围
    const timePatterns: { pattern: RegExp; getRange: () => SearchFilters['dateRange'] }[] = [
        {
            pattern: /今年|本年度/,
            getRange: () => ({
                from: new Date(new Date().getFullYear(), 0, 1),
                to: new Date()
            })
        },
        {
            pattern: /今天/,
            getRange: () => {
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return { from: today, to: new Date() };
            }
        },
        {
            pattern: /本月|这个月/,
            getRange: () => ({
                from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                to: new Date()
            })
        },
        {
            pattern: /最近|近期/,
            getRange: () => ({
                from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30天内
                to: new Date()
            })
        },
    ];

    for (const { pattern, getRange } of timePatterns) {
        if (pattern.test(lowerQuery)) {
            filters.dateRange = getRange();
            break;
        }
    }

    // 提取部门
    const departments = ['人事', '财务', '行政', '技术', '市场', '销售', '研发', '法务'];
    for (const dept of departments) {
        if (lowerQuery.includes(dept)) {
            filters.department = dept;
            break;
        }
    }

    return filters;
}

/**
 * 构建 Supabase 查询条件
 * @param filters - 过滤条件
 * @returns SQL 片段和参数
 */
export function buildFilterConditions(filters: SearchFilters): {
    conditions: string[];
    params: Record<string, any>;
} {
    const conditions: string[] = [];
    const params: Record<string, any> = {};

    if (filters.documentType) {
        conditions.push(`metadata->>'documentType' = :documentType`);
        params.documentType = filters.documentType;
    }

    if (filters.dateRange?.from) {
        conditions.push(`created_at >= :dateFrom`);
        params.dateFrom = filters.dateRange.from instanceof Date
            ? filters.dateRange.from.toISOString()
            : filters.dateRange.from;
    }

    if (filters.dateRange?.to) {
        conditions.push(`created_at <= :dateTo`);
        params.dateTo = filters.dateRange.to instanceof Date
            ? filters.dateRange.to.toISOString()
            : filters.dateRange.to;
    }

    if (filters.status) {
        conditions.push(`metadata->>'status' = :status`);
        params.status = filters.status;
    }

    if (filters.department) {
        conditions.push(`metadata->>'department' = :department`);
        params.department = filters.department;
    }

    if (filters.tags && filters.tags.length > 0) {
        conditions.push(`metadata->'tags' ?| :tags`);
        params.tags = filters.tags;
    }

    return { conditions, params };
}

/**
 * 合并显式过滤器和隐式过滤器
 */
export function mergeFilters(
    explicit: SearchFilters | undefined,
    implicit: Partial<SearchFilters>
): SearchFilters {
    return {
        ...implicit,
        ...explicit,
        // 显式优先，但如果显式为空则使用隐式
        documentType: explicit?.documentType || implicit.documentType,
        dateRange: explicit?.dateRange || implicit.dateRange,
        department: explicit?.department || implicit.department,
    };
}

/**
 * 格式化过滤条件为可读字符串（用于日志）
 */
export function formatFiltersForLog(filters: SearchFilters): string {
    const parts: string[] = [];

    if (filters.documentType) {
        parts.push(`类型=${DOCUMENT_TYPES[filters.documentType as keyof typeof DOCUMENT_TYPES]?.label || filters.documentType}`);
    }

    if (filters.dateRange) {
        const from = filters.dateRange.from instanceof Date
            ? filters.dateRange.from.toLocaleDateString()
            : filters.dateRange.from;
        const to = filters.dateRange.to instanceof Date
            ? filters.dateRange.to.toLocaleDateString()
            : filters.dateRange.to;
        parts.push(`时间=${from || '?'}~${to || '?'}`);
    }

    if (filters.department) {
        parts.push(`部门=${filters.department}`);
    }

    if (filters.status) {
        parts.push(`状态=${filters.status}`);
    }

    return parts.length > 0 ? `[${parts.join(', ')}]` : '[无过滤]';
}
