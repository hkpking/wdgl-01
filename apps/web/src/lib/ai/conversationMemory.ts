/**
 * 多轮对话记忆管理器
 * 管理会话历史，支持滑动窗口和摘要策略
 */

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
    metadata?: {
        intent?: string;
        sources?: string[];
    };
}

export interface ConversationContext {
    sessionId: string;
    userId: string;
    messages: ChatMessage[];
    summary?: string;
    metadata: {
        documentsReferenced: string[];
        topicsDiscussed: string[];
        startTime: number;
        lastActiveTime: number;
    };
}

// 内存存储（生产环境应使用 Redis 或数据库）
const conversationStore: Map<string, ConversationContext> = new Map();

// 配置
const CONFIG = {
    maxMessages: 10,           // 最大消息数（超过后触发摘要）
    summarizeThreshold: 8,     // 触发摘要的消息数
    contextWindowSize: 6,      // 发送给 LLM 的上下文消息数
    sessionTTL: 30 * 60 * 1000, // 会话过期时间（30分钟）
};

/**
 * 生成会话ID
 */
export function generateSessionId(userId: string): string {
    return `${userId}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * 获取或创建会话上下文
 */
export function getOrCreateContext(sessionId: string, userId: string): ConversationContext {
    let context = conversationStore.get(sessionId);

    if (!context) {
        context = {
            sessionId,
            userId,
            messages: [],
            metadata: {
                documentsReferenced: [],
                topicsDiscussed: [],
                startTime: Date.now(),
                lastActiveTime: Date.now()
            }
        };
        conversationStore.set(sessionId, context);
    } else {
        context.metadata.lastActiveTime = Date.now();
    }

    return context;
}

/**
 * 添加消息到会话
 */
export function addMessage(
    sessionId: string,
    message: Omit<ChatMessage, 'timestamp'>
): void {
    const context = conversationStore.get(sessionId);
    if (!context) {
        console.warn(`[ConversationMemory] 会话不存在: ${sessionId}`);
        return;
    }

    context.messages.push({
        ...message,
        timestamp: Date.now()
    });

    // 更新元数据
    if (message.metadata?.sources) {
        context.metadata.documentsReferenced.push(...message.metadata.sources);
        // 去重
        context.metadata.documentsReferenced = Array.from(new Set(context.metadata.documentsReferenced));
    }

    context.metadata.lastActiveTime = Date.now();

    // 检查是否需要压缩历史
    if (context.messages.length > CONFIG.maxMessages) {
        compressHistory(sessionId);
    }
}

/**
 * 压缩历史消息（生成摘要）
 */
function compressHistory(sessionId: string): void {
    const context = conversationStore.get(sessionId);
    if (!context) return;

    // 取出前一半的消息生成摘要
    const messagesToSummarize = context.messages.splice(0, Math.floor(context.messages.length / 2));

    // 生成简单摘要（实际应用中可以调用 LLM）
    const summary = generateSimpleSummary(messagesToSummarize);

    // 合并到现有摘要
    if (context.summary) {
        context.summary = `${context.summary}\n\n${summary}`;
    } else {
        context.summary = summary;
    }

    console.log(`[ConversationMemory] 压缩历史: ${messagesToSummarize.length} 条消息 -> 摘要`);
}

/**
 * 生成简单摘要（基于规则）
 */
function generateSimpleSummary(messages: ChatMessage[]): string {
    const userQuestions = messages
        .filter(m => m.role === 'user')
        .map(m => m.content.slice(0, 50))
        .join('; ');

    const topics = messages
        .filter(m => m.metadata?.intent)
        .map(m => m.metadata!.intent)
        .filter((v, i, a) => a.indexOf(v) === i);

    return `之前的对话涉及以下问题: ${userQuestions}。讨论的主题包括: ${topics.join(', ') || '一般问答'}。`;
}

/**
 * 构建发送给 LLM 的上下文
 */
export function buildPromptContext(sessionId: string): string {
    const context = conversationStore.get(sessionId);
    if (!context) return '';

    let promptContext = '';

    // 添加摘要（如果有）
    if (context.summary) {
        promptContext += `【对话历史摘要】\n${context.summary}\n\n`;
    }

    // 添加最近的消息
    const recentMessages = context.messages.slice(-CONFIG.contextWindowSize);
    if (recentMessages.length > 0) {
        promptContext += '【最近对话】\n';
        promptContext += recentMessages
            .map(m => `${m.role === 'user' ? '用户' : 'AI'}: ${m.content}`)
            .join('\n');
    }

    return promptContext;
}

/**
 * 获取会话的消息历史
 */
export function getMessages(sessionId: string): ChatMessage[] {
    const context = conversationStore.get(sessionId);
    return context?.messages || [];
}

/**
 * 获取会话元数据
 */
export function getSessionMetadata(sessionId: string): ConversationContext['metadata'] | null {
    const context = conversationStore.get(sessionId);
    return context?.metadata || null;
}

/**
 * 清除会话
 */
export function clearSession(sessionId: string): void {
    conversationStore.delete(sessionId);
    console.log(`[ConversationMemory] 会话已清除: ${sessionId}`);
}

/**
 * 清理过期会话
 */
export function cleanupExpiredSessions(): number {
    const now = Date.now();
    let cleaned = 0;

    conversationStore.forEach((context, sessionId) => {
        if (now - context.metadata.lastActiveTime > CONFIG.sessionTTL) {
            conversationStore.delete(sessionId);
            cleaned++;
        }
    });

    if (cleaned > 0) {
        console.log(`[ConversationMemory] 清理了 ${cleaned} 个过期会话`);
    }

    return cleaned;
}

/**
 * 获取所有活跃会话数
 */
export function getActiveSessionCount(): number {
    cleanupExpiredSessions();
    return conversationStore.size;
}

// 定期清理过期会话（每5分钟）
if (typeof setInterval !== 'undefined') {
    setInterval(cleanupExpiredSessions, 5 * 60 * 1000);
}
