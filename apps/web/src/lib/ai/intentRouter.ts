/**
 * 意图识别器
 * 识别用户查询意图，优化搜索和回答策略
 */

export type Intent =
    | 'document_qa'      // 文档问答
    | 'policy_search'    // 制度/政策查询
    | 'workflow_guide'   // 流程指引
    | 'summarization'    // 总结摘要
    | 'comparison'       // 对比分析
    | 'definition'       // 定义解释
    | 'general_chat';    // 闲聊/其他

export interface IntentResult {
    intent: Intent;
    confidence: number;
    entities: Record<string, string>;
    suggestedFilters?: {
        documentType?: string;
        keywords?: string[];
    };
    searchStrategy: 'semantic' | 'keyword' | 'hybrid';
}

// 意图识别规则（基于关键词模式）
const INTENT_PATTERNS: { pattern: RegExp; intent: Intent; confidence: number }[] = [
    // 流程指引
    { pattern: /如何|怎么|怎样|步骤|流程|操作|方法/i, intent: 'workflow_guide', confidence: 0.85 },
    { pattern: /申请|办理|提交|审批|报销/i, intent: 'workflow_guide', confidence: 0.8 },

    // 制度/政策查询
    { pattern: /规定|制度|政策|标准|要求|规范|条例/i, intent: 'policy_search', confidence: 0.85 },
    { pattern: /是否允许|能不能|可不可以|有没有规定/i, intent: 'policy_search', confidence: 0.8 },

    // 总结摘要
    { pattern: /总结|概括|摘要|归纳|概述|要点/i, intent: 'summarization', confidence: 0.9 },
    { pattern: /主要内容|核心内容|关键点/i, intent: 'summarization', confidence: 0.85 },

    // 对比分析
    { pattern: /区别|不同|差异|对比|比较|和.*有什么/i, intent: 'comparison', confidence: 0.85 },
    { pattern: /哪个更|选择|优缺点/i, intent: 'comparison', confidence: 0.8 },

    // 定义解释
    { pattern: /什么是|是什么|定义|解释|含义|意思/i, intent: 'definition', confidence: 0.85 },
    { pattern: /指的是|是指|代表/i, intent: 'definition', confidence: 0.75 },
];

// 实体提取规则
const ENTITY_PATTERNS: { name: string; pattern: RegExp }[] = [
    { name: 'document_type', pattern: /制度|规定|流程|指南|手册|标准/g },
    { name: 'department', pattern: /人事|财务|行政|技术|市场|销售|研发/g },
    { name: 'action', pattern: /申请|审批|报销|采购|休假|出差/g },
];

/**
 * 识别用户查询意图
 * @param query - 用户查询文本
 * @returns 意图识别结果
 */
export function classifyIntent(query: string): IntentResult {
    const cleanQuery = query.trim().toLowerCase();

    // 默认结果
    const result: IntentResult = {
        intent: 'document_qa',
        confidence: 0.5,
        entities: {},
        searchStrategy: 'hybrid'
    };

    // 匹配意图模式
    for (const { pattern, intent, confidence } of INTENT_PATTERNS) {
        if (pattern.test(cleanQuery)) {
            if (confidence > result.confidence) {
                result.intent = intent;
                result.confidence = confidence;
            }
        }
    }

    // 提取实体
    for (const { name, pattern } of ENTITY_PATTERNS) {
        const matches = cleanQuery.match(pattern);
        if (matches && matches.length > 0) {
            result.entities[name] = matches[0];
        }
    }

    // 根据意图调整搜索策略
    switch (result.intent) {
        case 'policy_search':
        case 'definition':
            result.searchStrategy = 'hybrid'; // 政策查询需要精确匹配
            result.suggestedFilters = {
                documentType: result.entities['document_type'],
                keywords: Object.values(result.entities)
            };
            break;
        case 'workflow_guide':
            result.searchStrategy = 'semantic'; // 流程指引侧重语义理解
            break;
        case 'summarization':
            result.searchStrategy = 'semantic';
            break;
        case 'comparison':
            result.searchStrategy = 'hybrid';
            break;
        default:
            result.searchStrategy = 'hybrid';
    }

    console.log(`[IntentRouter] 意图: ${result.intent} (${(result.confidence * 100).toFixed(0)}%), 策略: ${result.searchStrategy}`);
    if (Object.keys(result.entities).length > 0) {
        console.log(`[IntentRouter] 实体:`, result.entities);
    }

    return result;
}

/**
 * 根据意图生成优化的搜索查询
 * @param query - 原始查询
 * @param intent - 识别的意图
 * @returns 优化后的查询
 */
export function optimizeSearchQuery(query: string, intent: IntentResult): string {
    let optimizedQuery = query;

    // 对于某些意图，可以增强查询
    switch (intent.intent) {
        case 'workflow_guide':
            // 添加流程相关的关键词增强
            if (!query.includes('流程') && !query.includes('步骤')) {
                optimizedQuery = `${query} 流程 步骤`;
            }
            break;
        case 'policy_search':
            // 添加制度相关的关键词增强
            if (!query.includes('制度') && !query.includes('规定')) {
                optimizedQuery = `${query} 制度 规定`;
            }
            break;
        case 'definition':
            // 定义类查询保持原样，语义搜索效果更好
            break;
    }

    return optimizedQuery;
}

/**
 * 根据意图生成回答提示词
 * @param intent - 识别的意图
 * @returns 针对该意图优化的系统提示词片段
 */
export function getIntentPromptHint(intent: Intent): string {
    switch (intent) {
        case 'workflow_guide':
            return '请以清晰的步骤形式回答，使用编号列表展示操作流程。';
        case 'policy_search':
            return '请准确引用相关制度条款，注明来源文档。';
        case 'summarization':
            return '请提供简洁的要点总结，使用项目符号列出关键信息。';
        case 'comparison':
            return '请以对比的形式组织回答，清晰展示异同点。';
        case 'definition':
            return '请给出准确定义，并提供必要的背景解释。';
        case 'general_chat':
            return '请友好地回应用户。';
        default:
            return '';
    }
}
