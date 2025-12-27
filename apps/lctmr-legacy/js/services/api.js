/**
 * @file api.js
 * @description Encapsulates all interactions with the Supabase backend.
 * [v3.0.0] 重构为 Supabase 直连，使用 lctmr_ 表前缀
 */

// 导入数据库配置
import { getApiConfig, getApiConfigSync, useApiServer, useApiServerSync, validateConfig, validateConfigSync, initializeConfig } from '../config/database-config.js';
import { cacheService } from './cache.js';

// 表名映射 (旧表名 -> 新表名 with lctmr_ prefix)
const TABLE_MAPPING = {
    'factions': 'lctmr_factions',
    'categories': 'lctmr_categories',
    'chapters': 'lctmr_chapters',
    'sections': 'lctmr_sections',
    'blocks': 'lctmr_blocks',
    'profiles': 'lctmr_profiles',
    'user_progress': 'lctmr_user_progress',
    'scores': 'lctmr_profiles',
    'achievements': 'lctmr_achievements',
    'user_achievements': 'lctmr_user_achievements',
    'user_points_history': 'lctmr_points_history',
    'challenges': 'lctmr_challenges',
};

// 获取映射后的表名
function getMappedTableName(originalName) {
    return TABLE_MAPPING[originalName] || originalName;
}

// 先声明变量，稍后初始化
let db;
let API_BASE_URL;
let USE_API_SERVER;
let isInitialized = false;


// 配置初始化Promise，用于跟踪配置加载状态
let configInitializationPromise = null;

// API服务器客户端类
class ApiServerClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.token = localStorage.getItem('auth_token');
    }

    setToken(token) {
        this.token = token;
        if (token) {
            localStorage.setItem('auth_token', token);
        } else {
            localStorage.removeItem('auth_token');
        }
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const method = options.method || 'GET';

        // 只对GET请求使用缓存
        if (method === 'GET') {
            const cacheKey = cacheService.generateKey(endpoint, options.params);
            const cachedData = cacheService.get(cacheKey);

            if (cachedData) {
                return cachedData;
            }
        }

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(url, {
            ...options,
            headers
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ error: '网络错误' }));
            throw new Error(error.error || `HTTP ${response.status}`);
        }

        const data = await response.json();

        // 存储到缓存
        if (method === 'GET') {
            const cacheKey = cacheService.generateKey(endpoint, options.params);
            const strategy = cacheService.getCacheStrategy(endpoint);
            cacheService.set(cacheKey, data, strategy.ttl);
        }

        return data;
    }

    // 模拟Supabase的auth方法
    get auth() {
        return {
            signUp: async ({ email, password, fullName }) => {
                const raw = await this.request('/auth/signup', {
                    method: 'POST',
                    body: JSON.stringify({ email, password, fullName })
                });

                // 支持后端返回 { data: { token, user } } 或 { token, user }
                const token = raw?.data?.token ?? raw?.token ?? null;
                const user = raw?.data?.user ?? raw?.user ?? null;
                if (token) {
                    this.setToken(token);
                }

                return { data: { token, user }, error: raw?.error ?? null };
            },
            signInWithPassword: async ({ email, password }) => {
                const raw = await this.request('/auth/signin', {
                    method: 'POST',
                    body: JSON.stringify({ email, password })
                });

                // 统一响应结构
                const token = raw?.data?.token ?? raw?.token ?? null;
                const user = raw?.data?.user ?? raw?.user ?? null;
                if (token) {
                    this.setToken(token);
                }

                return { data: { token, user }, error: raw?.error ?? null };
            },
            signOut: async () => {
                this.setToken(null);
                // 兼容清理可能的本地存储键名
                try {
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('lctmr-auth-token');
                } catch (e) { }
                return { error: null };
            },
            getSession: async () => {
                if (!this.token) {
                    return { data: { session: null }, error: null };
                }

                try {
                    const result = await this.request('/auth/verify', {
                        method: 'POST'
                    });
                    return { data: { session: { user: result.user } }, error: null };
                } catch (error) {
                    this.setToken(null);
                    return { data: { session: null }, error: null };
                }
            },
            onAuthStateChange: (callback) => {
                // API 服务器不需要实时监听认证状态变化
                // 可以通过轮询或其他方式实现
                // 可以在这里实现轮询逻辑
                return () => {
                };
            }
        };
    }

    // 模拟Supabase的from方法
    from(tableName) {
        return {
            select: (columns = '*') => ({
                eq: (column, value) => ({
                    single: async () => {
                        const result = await this.request(`/${tableName}?${column}=${encodeURIComponent(value)}&limit=1`);
                        return { data: result.data[0] || null, error: null };
                    },
                    then: async (resolve) => {
                        const result = await this.request(`/${tableName}?${column}=${encodeURIComponent(value)}`);
                        return resolve(result);
                    }
                }),
                order: (orderBy, options = {}) => ({
                    then: async (resolve) => {
                        const result = await this.request(`/${tableName}?order=${orderBy}&asc=${options.ascending || false}`);
                        return resolve(result);
                    }
                }),
                then: async (resolve) => {
                    const result = await this.request(`/${tableName}`);
                    return resolve(result);
                }
            }),
            insert: (data) => ({
                then: async (resolve) => {
                    const result = await this.request(`/${tableName}`, {
                        method: 'POST',
                        body: JSON.stringify(data)
                    });
                    return resolve(result);
                }
            }),
            update: (data) => ({
                eq: (column, value) => ({
                    select: (columns = '*') => ({
                        single: async () => {
                            const result = await this.request(`/${tableName}`, {
                                method: 'PUT',
                                body: JSON.stringify({ ...data, [column]: value })
                            });
                            return result;
                        }
                    })
                })
            }),
            delete: () => ({
                eq: (column, value) => ({
                    then: async (resolve) => {
                        const result = await this.request(`/${tableName}?${column}=${encodeURIComponent(value)}`, {
                            method: 'DELETE'
                        });
                        return resolve(result);
                    }
                })
            }),
            upsert: (data, options = {}) => ({
                then: async (resolve) => {
                    const result = await this.request(`/${tableName}`, {
                        method: 'POST',
                        body: JSON.stringify({ ...data, upsert: true })
                    });
                    return resolve(result);
                }
            })
        };
    }

    // 模拟Supabase的rpc方法
    rpc(functionName, params = {}) {
        return {
            limit: async (count) => {
                const result = await this.request(`/rpc/${functionName}`, {
                    method: 'POST',
                    body: JSON.stringify({ ...params, limit: count })
                });
                return { data: result.data, error: null };
            },
            then: async (resolve) => {
                const result = await this.request(`/rpc/${functionName}`, {
                    method: 'POST',
                    body: JSON.stringify(params)
                });
                return resolve(result);
            }
        };
    }

    // 特殊方法：获取学习地图
    async fetchLearningMap() {
        const result = await this.request('/learning/map');
        return { data: result.data, error: null };
    }

    // 特殊方法：获取排行榜
    async fetchLeaderboard() {
        const result = await this.request('/learning/leaderboard');
        return { data: result.data, error: null };
    }
}

// 根据请求类型设置不同的超时时间
const getTimeoutForRequest = (url, options = {}) => {
    // 从URL或options中判断请求类型
    if (url.includes('/auth/')) return 30000; // 认证请求30秒（进一步增加）
    if (options.timeoutType) {
        const timeoutMap = {
            'auth': 30000,      // 认证请求30秒
            'user_progress': 8000,  // 用户进度8秒
            'learning_map': 12000,  // 学习地图12秒
            'leaderboard': 6000,    // 排行榜6秒
            'challenges': 8000,     // 挑战数据8秒
            'profile': 6000,        // 用户档案6秒
            'default': 10000        // 默认10秒
        };
        return timeoutMap[options.timeoutType] || timeoutMap.default;
    }
    return 10000; // 默认10秒
};

// 数据库客户端初始化逻辑已移至initDbClient和initDbClientSync函数中

// 初始化配置和API客户端
async function initializeConfigAndClient() {
    try {
        // 确保配置已初始化
        await initializeConfig();

        // 验证配置
        await validateConfig();

        // 获取API配置
        const apiConfig = await getApiConfig();
        API_BASE_URL = apiConfig.apiBaseUrl;
        USE_API_SERVER = await useApiServer();

        // 初始化数据库客户端
        await initDbClient();

        isInitialized = true;
    } catch (error) {
        console.error('❌ API服务初始化失败:', error.message);

        // 尝试使用同步版本作为备用
        try {
            validateConfigSync();

            const apiConfig = getApiConfigSync();
            API_BASE_URL = apiConfig.apiBaseUrl;
            USE_API_SERVER = useApiServerSync();

            initDbClientSync();

            isInitialized = true;
        } catch (syncError) {
            console.error('❌ API服务同步初始化也失败:', syncError.message);
            // 继续抛出错误，让调用者知道初始化失败
            throw new Error(`API服务初始化失败: ${syncError.message}`);
        }
    }
}

// 创建表名映射包装器
function wrapSupabaseClientWithTableMapping(originalClient) {
    const originalFrom = originalClient.from.bind(originalClient);

    // 重写 from 方法，自动转换表名
    originalClient.from = function (tableName) {
        const mappedName = getMappedTableName(tableName);
        if (mappedName !== tableName) {
        }
        return originalFrom(mappedName);
    };

    return originalClient;
}

// 初始化数据库客户端（异步版本）
async function initDbClient() {
    if (USE_API_SERVER) {
        // 使用API服务器客户端
        db = new ApiServerClient(API_BASE_URL);
    } else {
        try {
            // 使用全局 Supabase 客户端（从 supabase-client.js 加载）
            const supabase = window.supabase || {};
            const { createClient } = supabase;

            // 从配置获取 Supabase 凭证
            const config = await getApiConfig();
            const SUPABASE_URL = config.supabaseUrl || 'https://nwyvgeoeqkoupqwjsghk.supabase.co';
            const SUPABASE_KEY = config.supabaseKey || window.APP_CONFIG?.SUPABASE_KEY;

            if (!createClient) {
                console.error("Supabase createClient is not available.");
                throw new Error("Supabase library not loaded.");
            }

            const rawClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
                auth: {
                    autoRefreshToken: true,
                    persistSession: true,
                    detectSessionInUrl: true
                },
                global: {
                    fetch: (url, options = {}) => {
                        const timeout = getTimeoutForRequest(url, options);
                        const controller = new AbortController();
                        const timeoutId = setTimeout(() => {
                            console.warn(`请求超时 (${timeout}ms):`, url);
                            controller.abort();
                        }, timeout);

                        return fetch(url, {
                            ...options,
                            signal: controller.signal
                        }).finally(() => {
                            clearTimeout(timeoutId);
                        });
                    }
                }
            });

            // 应用表名映射包装器
            db = wrapSupabaseClientWithTableMapping(rawClient);
        } catch (error) {
            console.error("❌ Supabase客户端初始化失败:", error);
            throw error;
        }
    }
}

// 初始化数据库客户端（同步版本，作为备用）
function initDbClientSync() {
    try {
        if (USE_API_SERVER) {
            // 使用API服务器客户端
            db = new ApiServerClient(API_BASE_URL);
        } else {
            // 使用Supabase客户端
            const supabase = window.supabase || {};
            const { createClient } = supabase;

            // 从配置获取 Supabase 凭证
            const config = getApiConfigSync();
            const SUPABASE_URL = config.supabaseUrl || 'https://nwyvgeoeqkoupqwjsghk.supabase.co';
            const SUPABASE_KEY = config.supabaseKey || window.APP_CONFIG?.SUPABASE_KEY;

            if (!createClient) {
                console.error("Supabase client is not available.");
                throw new Error("Supabase library not loaded.");
            }

            const rawClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
                auth: {
                    autoRefreshToken: true,
                    persistSession: true,
                    detectSessionInUrl: true
                }
            });

            // 应用表名映射包装器
            db = wrapSupabaseClientWithTableMapping(rawClient);
        }
    } catch (error) {
        console.error("❌ 同步数据库客户端初始化失败:", error);
        throw error;
    }

}

// 确保API服务已初始化
async function ensureInitialized() {
    if (!isInitialized) {
        if (!configInitializationPromise) {
            // 第一次初始化，创建Promise
            configInitializationPromise = initializeConfigAndClient();
        }
        // 等待初始化完成
        await configInitializationPromise;
    }
}

// 重试机制工具函数
async function withRetry(fn, maxRetries = 3, delay = 1000, operationName = '操作') {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === maxRetries - 1) {
                console.error(`${operationName} 重试 ${maxRetries} 次后仍然失败:`, error);
                throw error;
            }

            console.warn(`${operationName} 失败，${delay}ms后重试 (${i + 1}/${maxRetries}):`, error.message);
            await new Promise(resolve => setTimeout(resolve, delay));
            delay *= 2; // 指数退避
        }
    }
}

// 简单的内存缓存
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5分钟缓存

function getCachedData(key) {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data;
    }
    return null;
}

function setCachedData(key, data) {
    cache.set(key, {
        data,
        timestamp: Date.now()
    });
}

export const ApiService = {
    // 使用getter延迟获取db实例，确保配置已初始化
    get db() {
        if (!isInitialized && !configInitializationPromise) {
            console.warn('⚠️ API服务尚未初始化，正在自动初始化...');
            // 自动触发初始化，但不等待完成（因为getter不能是异步的）
            configInitializationPromise = initializeConfigAndClient();
        }
        return db;
    },

    // 检查API服务是否可用
    isAvailable() {
        return isInitialized && !!db;
    },

    // ==================== 对话学习相关API ====================

    /**
     * 获取对话学习进度
     * @param {string} userId - 用户ID
     * @param {string} blockId - 内容块ID
     * @returns {Promise<Object>} 进度数据
     */
    async getConversationProgress(userId, blockId) {
        try {
            await ensureInitialized();
            const response = await this.db.request(
                `/conversation/progress/${blockId}`,
                { method: 'GET' }
            );
            return response;
        } catch (error) {
            console.error('获取对话学习进度失败:', error);
            throw error;
        }
    },

    /**
     * 保存对话学习进度
     * @param {string} userId - 用户ID
     * @param {Object} progressData - 进度数据
     * @returns {Promise<Object>} 保存结果
     */
    async saveConversationProgress(userId, progressData) {
        try {
            await ensureInitialized();
            const response = await this.db.request(
                '/conversation/progress',
                {
                    method: 'POST',
                    body: JSON.stringify(progressData)
                }
            );
            return response;
        } catch (error) {
            console.error('保存对话学习进度失败:', error);
            throw error;
        }
    },

    /**
     * 获取对话学习统计信息
     * @returns {Promise<Object>} 统计数据
     */
    async getConversationStats() {
        try {
            await ensureInitialized();
            const response = await this.db.request(
                '/conversation/stats',
                { method: 'GET' }
            );
            return response;
        } catch (error) {
            console.error('获取对话学习统计失败:', error);
            throw error;
        }
    },

    /**
     * 删除对话学习进度
     * @param {string} userId - 用户ID
     * @param {string} blockId - 内容块ID
     * @returns {Promise<Object>} 删除结果
     */
    async deleteConversationProgress(userId, blockId) {
        try {
            await ensureInitialized();
            const response = await this.db.request(
                `/conversation/progress/${blockId}`,
                { method: 'DELETE' }
            );
            return response;
        } catch (error) {
            console.error('删除对话学习进度失败:', error);
            // 即使服务器删除失败，也不抛出错误，以免影响用户体验
            console.warn('服务器端删除进度失败，但不影响本地操作');
            return { success: true, message: '本地进度已清除' };
        }
    },

    /**
     * 重置对话学习进度（兼容性方法）
     * @param {string} blockId - 内容块ID
     * @returns {Promise<Object>} 重置结果
     */
    async resetConversationProgress(blockId) {
        return this.deleteConversationProgress(null, blockId);
    },

    // 异步初始化方法
    async initialize() {
        await ensureInitialized();

        if (USE_API_SERVER) {
            // API 服务器客户端的 auth 属性已经通过 getter 定义
            // 不需要额外设置
        } else {
        }

        // 返回初始化后的API服务，方便链式调用
        return this;
    },

    // 移除预检函数以提升性能

    async awardAchievement(achievementKey) {
        // 确保配置已初始化
        await ensureInitialized();

        if (USE_API_SERVER) {
            // API 服务器方式
            try {
                await ApiService.db.request('/rpc/award_achievement', {
                    method: 'POST',
                    body: JSON.stringify({ achievement_key: achievementKey })
                });
            } catch (error) {
                console.error(`Failed to award achievement [${achievementKey}]:`, error);
            }
        } else {
            // Supabase 方式
            const { error } = await ApiService.db.rpc('award_achievement', { achievement_key: achievementKey });
            if (error) { console.error(`Failed to award achievement [${achievementKey}]:`, error); }
        }
    },

    async fetchUserAchievements(userId) {
        // 确保配置已初始化
        await ensureInitialized();

        if (USE_API_SERVER) {
            // 使用 API 服务器获取用户成就
            const response = await ApiService.db.request('/learning/user_achievements', {
                method: 'GET'
            });
            return response.data || [];
        } else {
            // Supabase 方式
            // 使用 lctmr_achievements 表
            const { data, error } = await ApiService.db.from('user_achievements').select(`earned_at, lctmr_achievements (name, description, icon_url)`).eq('user_id', userId).order('earned_at', { ascending: false });
            if (error) { console.error('Error fetching user achievements:', error); throw new Error('获取用户成就失败。'); }
            return data?.map(ua => ({ ...ua.lctmr_achievements, earned_at: ua.earned_at })) || [];
        }
    },

    async signUp(email, password, fullName) {
        // 确保配置已初始化
        await ensureInitialized();

        if (USE_API_SERVER) {
            // API 服务器方式
            const { data: authData, error: authError } = await ApiService.db.auth.signUp({ email, password, fullName });
            if (authError) throw authError;
            return authData;
        } else {
            // Supabase 方式
            const { data: authData, error: authError } = await ApiService.db.auth.signUp({ email, password, });
            if (authError) throw authError;
            if (!authData.user) throw new Error('用户注册失败，无法获取新用户信息。');
            const userId = authData.user.id;
            const { error: scoreError } = await ApiService.db.from('scores').insert({ user_id: userId, username: fullName });
            if (scoreError) { console.error(`User and profile created, but failed to create score entry: ${scoreError.message}`); throw new Error('用户分数记录创建失败，请联系管理员。'); }
            return authData;
        }
    },

    async updateUsername(userId, newUsername) {
        // 确保配置已初始化
        await ensureInitialized();

        const { data, error } = await ApiService.db.from('scores').update({ username: newUsername }).eq('user_id', userId).select().single();
        if (error) {
            if (error.code === 'PGRST116') {
                const { data: insertData, error: insertError } = await ApiService.db.from('scores').insert({ user_id: userId, username: newUsername }).select().single();
                if (insertError) throw new Error(`创建用户名失败: ${insertError.message}`);
                return insertData;
            }
            throw new Error(`更新用户名失败: ${error.message}`);
        }
        return data;
    },

    async fetchLearningMap() {
        // 确保配置已初始化
        await ensureInitialized();

        const cacheKey = 'learning_map';
        const cached = getCachedData(cacheKey);
        if (cached) return cached;

        return withRetry(async () => {
            const startTime = Date.now();

            // 如果使用API服务器，使用特殊方法
            if (USE_API_SERVER && ApiService.db.fetchLearningMap) {
                const { data, error } = await ApiService.db.fetchLearningMap();
                if (error) throw error;

                const duration = Date.now() - startTime;

                setCachedData(cacheKey, data);
                return data;
            } else {
                // 使用Supabase方式 - 使用正确的 lctmr_ 前缀表名
                // 注意：categories/chapters/sections 使用 order_index，blocks 使用 sort_order
                const { data, error } = await ApiService.db.from("categories")
                    .select("*, lctmr_chapters(*, lctmr_sections(*, lctmr_blocks(*)))")
                    .order("order_index")
                    .order("order_index", { foreignTable: "lctmr_chapters" })
                    .order("order_index", { foreignTable: "lctmr_chapters.lctmr_sections" })
                    .order("sort_order", { foreignTable: "lctmr_chapters.lctmr_sections.lctmr_blocks" });
                if (error) throw error;

                // 转换数据结构以兼容前端
                const transformedData = data?.map(cat => ({
                    ...cat,
                    chapters: cat.lctmr_chapters?.map(ch => ({
                        ...ch,
                        sections: ch.lctmr_sections?.map(sec => ({
                            ...sec,
                            blocks: sec.lctmr_blocks || []
                        })) || []
                    })) || []
                })) || [];

                const duration = Date.now() - startTime;

                setCachedData(cacheKey, transformedData);
                return transformedData;
            }
        }, 3, 1000, '获取学习地图');
    },
    async fetchAllCategoriesForAdmin() {
        if (USE_API_SERVER) {
            // 使用 API 服务器获取所有篇章
            const response = await ApiService.db.request('/admin/categories', {
                method: 'GET'
            });
            return response.data || [];
        } else {
            // Supabase 方式
            // 使用 lctmr_ 前缀表名进行关联查询
            // 注意：categories/chapters/sections 使用 order_index
            const { data, error } = await ApiService.db.from('categories')
                .select('*, lctmr_chapters(id, title, description, order_index, lctmr_sections(id, title, order_index, lctmr_blocks(*)))')
                .order('order_index');
            // 转换数据结构以兼容前端
            const transformedData = data?.map(cat => ({
                ...cat,
                chapters: cat.lctmr_chapters?.map(ch => ({
                    ...ch,
                    order: ch.order_index,
                    sections: ch.lctmr_sections?.map(sec => ({
                        ...sec,
                        order: sec.order_index,
                        blocks: sec.lctmr_blocks || []
                    })) || []
                })) || []
            })) || [];
            if (error) throw error;
            return transformedData;
        }
    },
    async upsertCategory(d) {
        if (USE_API_SERVER) {
            const response = await ApiService.db.request('/admin/categories', {
                method: 'POST',
                body: JSON.stringify(d)
            });
            return response;
        } else {
            const { error } = await ApiService.db.from('categories').upsert(d, { onConflict: 'id' });
            if (error) throw error;
        }
    },
    async deleteCategory(id) {
        if (USE_API_SERVER) {
            const response = await ApiService.db.request(`/admin/categories/${id}`, {
                method: 'DELETE'
            });
            return response;
        } else {
            const { error } = await ApiService.db.from('categories').delete().eq('id', id);
            if (error) throw error;
        }
    },
    async upsertChapter(d) {
        if (USE_API_SERVER) {
            const response = await ApiService.db.request('/admin/chapters', {
                method: 'POST',
                body: JSON.stringify(d)
            });
            return response;
        } else {
            const { error } = await ApiService.db.from('chapters').upsert(d, { onConflict: 'id' });
            if (error) throw error;
        }
    },
    async deleteChapter(id) {
        if (USE_API_SERVER) {
            const response = await ApiService.db.request(`/admin/chapters/${id}`, {
                method: 'DELETE'
            });
            return response;
        } else {
            const { error } = await ApiService.db.from('chapters').delete().eq('id', id);
            if (error) throw error;
        }
    },
    async upsertSection(d) {
        if (USE_API_SERVER) {
            const response = await ApiService.db.request('/admin/sections', {
                method: 'POST',
                body: JSON.stringify(d)
            });
            return response;
        } else {
            const { error } = await ApiService.db.from('sections').upsert(d, { onConflict: 'id' });
            if (error) throw error;
        }
    },
    async deleteSection(id) {
        if (USE_API_SERVER) {
            const response = await ApiService.db.request(`/admin/sections/${id}`, {
                method: 'DELETE'
            });
            return response;
        } else {
            const { error } = await ApiService.db.from('sections').delete().eq('id', id);
            if (error) throw error;
        }
    },
    async upsertBlock(d) {
        if (USE_API_SERVER) {
            const response = await ApiService.db.request('/admin/blocks', {
                method: 'POST',
                body: JSON.stringify(d)
            });
            return response;
        } else {
            const { error } = await ApiService.db.from('blocks').upsert(d, { onConflict: 'id' });
            if (error) throw error;
        }
    },
    async deleteBlock(id) {
        if (USE_API_SERVER) {
            const response = await ApiService.db.request(`/admin/blocks/${id}`, {
                method: 'DELETE'
            });
            return response;
        } else {
            const { error } = await ApiService.db.from('blocks').delete().eq('id', id);
            if (error) throw error;
        }
    },

    async fetchLeaderboard() {
        await ensureInitialized();
        const cacheKey = 'leaderboard';
        const cached = getCachedData(cacheKey);
        if (cached) return cached;

        return withRetry(async () => {
            const startTime = Date.now();

            // 如果使用API服务器，使用特殊方法
            if (USE_API_SERVER && ApiService.db.fetchLeaderboard) {
                const { data, error } = await ApiService.db.fetchLeaderboard();
                if (error) { console.error("Error fetching leaderboard:", error); throw new Error("获取排行榜失败。"); }

                const duration = Date.now() - startTime;

                setCachedData(cacheKey, data);
                return data;
            } else {
                // 使用Supabase RPC方式
                const { data, error } = await ApiService.db.rpc('get_leaderboard_with_names').limit(10);
                if (error) { console.error("Error fetching leaderboard:", error); throw new Error("获取排行榜失败。"); }

                const duration = Date.now() - startTime;

                setCachedData(cacheKey, data);
                return data;
            }
        }, 2, 1000, '获取排行榜');
    },

    async getScoreInfo(userId) {
        await ensureInitialized();
        if (USE_API_SERVER) {
            try {
                const response = await fetch(`${API_BASE_URL}/user/profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${db.token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const result = await response.json();
                return {
                    username: result.data.username,
                    points: result.data.points || 0
                };
            } catch (error) {
                console.error("Error fetching score info:", error);
                throw new Error('获取用户分数信息时出错。');
            }
        } else {
            const { data, error } = await ApiService.db.from('scores').select('username, points').eq('user_id', userId).single();
            if (error && error.code !== 'PGRST116') { console.error("Error fetching score info:", error); throw new Error('获取用户分数信息时出错。'); }
            return data;
        }
    },

    async fetchFactionLeaderboard() {
        await ensureInitialized();
        if (USE_API_SERVER) {
            try {
                const response = await fetch(`${API_BASE_URL}/learning/faction-leaderboard`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${db.token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const result = await response.json();
                return result.data;
            } catch (error) {
                console.error("Error fetching faction leaderboard:", error);
                throw new Error("获取阵营排名失败。");
            }
        } else {
            const { data, error } = await ApiService.db.rpc('get_faction_leaderboard');
            if (error) { console.error("Error fetching faction leaderboard:", error); throw new Error("获取阵营排名失败。"); }
            return data;
        }
    },

    async fetchActiveChallenges() {
        await ensureInitialized();
        if (USE_API_SERVER) {
            const response = await ApiService.db.request('/learning/challenges', {
                method: 'GET'
            });
            return response.data;
        } else {
            // 使用 lctmr_challenges 表
            const { data, error } = await ApiService.db
                .from('challenges')
                .select('*, target_category:lctmr_categories(title)')
                .eq('is_active', true);
            if (error) {
                console.warn('获取挑战数据失败:', error);
                return [];
            }
            return data?.map(c => ({ ...c, target_category_title: c.target_category?.title })) || [];
        }
    },

    // =================================================================
    // NEW CHALLENGE PROGRESS FUNCTION
    // =================================================================
    async fetchFactionChallengeProgress(challengeId, faction) {
        await ensureInitialized();
        if (USE_API_SERVER) {
            try {
                const response = await ApiService.db.request('/learning/rpc/get_single_faction_challenge_progress', {
                    method: 'POST',
                    body: JSON.stringify({
                        challenge_id_param: challengeId,
                        faction_param: faction
                    })
                });
                return response.data;
            } catch (error) {
                console.error(`Error fetching challenge progress for faction ${faction}:`, error);
                return 0; // Return 0 as a fallback to prevent breaking the UI
            }
        } else {
            const { data, error } = await ApiService.db.rpc('get_single_faction_challenge_progress', {
                challenge_id_param: challengeId,
                faction_param: faction
            });
            if (error) {
                console.error(`Error fetching challenge progress for faction ${faction}:`, error);
                return 0; // Return 0 as a fallback to prevent breaking the UI
            }
            return data;
        }
    },
    // =================================================================

    async fetchChallengesForAdmin() {
        await ensureInitialized();
        if (USE_API_SERVER) {
            // 使用 API 服务器获取挑战列表
            const response = await ApiService.db.request('/admin/challenges', {
                method: 'GET'
            });
            return response.data || [];
        } else {
            // 使用 lctmr_categories 表关联
            const { data, error } = await ApiService.db.from('challenges').select('*, target_category:lctmr_categories(title)').order('created_at', { ascending: false });
            if (error) {
                console.warn('获取挑战列表失败:', error);
                return [];
            }
            return data?.map(c => ({ ...c, target_category_title: c.target_category?.title })) || [];
        }
    },
    async upsertChallenge(d) {
        if (USE_API_SERVER) {
            const response = await ApiService.db.request('/admin/challenges', {
                method: 'POST',
                body: JSON.stringify(d)
            });
            return response;
        } else {
            const { error } = await ApiService.db.from('challenges').upsert(d, { onConflict: 'id' });
            if (error) throw error;
        }
    },
    async deleteChallenge(id) {
        if (USE_API_SERVER) {
            const response = await ApiService.db.request(`/admin/challenges/${id}`, {
                method: 'DELETE'
            });
            return response;
        } else {
            const { error } = await ApiService.db.from('challenges').delete().eq('id', id);
            if (error) throw error;
        }
    },

    // 阵营管理方法
    async getFactions() {
        await ensureInitialized();
        if (USE_API_SERVER) {
            const response = await ApiService.db.request('/admin/factions', {
                method: 'GET'
            });
            return response.data;
        } else {
            const { data, error } = await ApiService.db.from('factions').select('*').order('sort_order', { ascending: true });
            if (error) throw error;
            return data;
        }
    },

    // 获取公开阵营列表（用于注册时选择）
    async getPublicFactions() {
        await ensureInitialized();
        if (USE_API_SERVER) {
            const response = await ApiService.db.request('/learning/factions', {
                method: 'GET'
            });
            return response.data;
        } else {
            const { data, error } = await ApiService.db.from('factions').select('id, code, name, description, color, sort_order').eq('is_active', true).order('sort_order', { ascending: true });
            if (error) throw error;
            return data;
        }
    },

    async upsertFaction(d) {
        await ensureInitialized();
        if (USE_API_SERVER) {
            const response = await ApiService.db.request('/admin/factions', {
                method: 'POST',
                body: JSON.stringify(d)
            });
            return response;
        } else {
            const { error } = await ApiService.db.from('factions').upsert(d, { onConflict: 'id' });
            if (error) throw error;
        }
    },

    async deleteFaction(id) {
        await ensureInitialized();
        if (USE_API_SERVER) {
            const response = await ApiService.db.request(`/admin/factions/${id}`, {
                method: 'DELETE'
            });
            return response;
        } else {
            const { error } = await ApiService.db.from('factions').delete().eq('id', id);
            if (error) throw error;
        }
    },

    async finishChallenge(challengeId) {
        await ensureInitialized();
        const { error } = await ApiService.db.rpc('finish_challenge', { challenge_id_param: challengeId });
        if (error) { console.error('Error finishing challenge:', error); throw new Error(`挑战结算失败: ${error.message}`); }
    },

    async getProfile(userId) {
        await ensureInitialized();
        if (USE_API_SERVER) {
            try {
                const response = await fetch(`${API_BASE_URL}/user/profile`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${db.token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const result = await response.json();
                return result.data;
            } catch (error) {
                console.error("Error fetching profile:", error);
                throw new Error('获取用户档案时出错。');
            }
        } else {
            const { data, error } = await ApiService.db.from('profiles').select('role, faction').eq('id', userId).single();
            if (error && error.code === 'PGRST116') { return null; }
            if (error) { console.error("Error fetching profile:", error); throw new Error('获取用户档案时出错。'); }
            return data;
        }
    },

    async updateProfileFaction(userId, faction) {
        await ensureInitialized();
        if (USE_API_SERVER) {
            try {
                const response = await fetch(`${API_BASE_URL}/user/profile`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${db.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ faction })
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const result = await response.json();
                return result.data;
            } catch (error) {
                throw new Error(`阵营选择失败: ${error.message}`);
            }
        } else {
            const { data, error } = await ApiService.db.from('profiles').update({ faction: faction, updated_at: new Date() }).eq('id', userId).select('role, faction').single();
            if (error) throw new Error(`阵营选择失败: ${error.message}`);
            if (!data) throw new Error(`阵营更新失败：未找到用户档案。`);
            return data;
        }
    },

    async updateProfile(userId, profileData) {
        await ensureInitialized();
        if (USE_API_SERVER) {
            try {
                const response = await fetch(`${API_BASE_URL}/user/profile`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${db.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(profileData)
                });

                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }

                const result = await response.json();
                return result.data;
            } catch (error) {
                throw new Error(`Failed to update profile: ${error.message}`);
            }
        } else {
            const { data, error } = await ApiService.db.from('profiles').update({ ...profileData, updated_at: new Date() }).eq('id', userId).select('*').single();
            if (error) throw new Error(`Failed to update profile: ${error.message}`);
            return data;
        }
    },

    async getUserProgress(userId) {
        await ensureInitialized();
        return withRetry(async () => {
            if (USE_API_SERVER) {
                try {
                    const response = await fetch(`${API_BASE_URL}/learning/progress`, {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${db.token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                    }

                    const result = await response.json();
                    return {
                        completed: result.data.completed || [],
                        awarded: result.data.awarded || []
                    };
                } catch (error) {
                    console.error('Error fetching user progress:', error);
                    throw new Error('获取用户进度失败');
                }
            } else {
                // Supabase 方式 - 直接查询 block_id
                // 架构统一后，数据库和前端都使用 block_id 跟踪进度
                const { data, error } = await ApiService.db
                    .from('user_progress')
                    .select('block_id, is_completed, points_earned')
                    .eq('user_id', userId)
                    .not('block_id', 'is', null);  // 只查询有 block_id 的记录

                if (error) {
                    console.warn('获取用户进度失败，返回空数据:', error);
                    return { completed: [], awarded: [] };
                }

                // 直接返回 block_ids，无需转换
                const completed = data?.filter(p => p.is_completed).map(p => p.block_id) || [];
                const awarded = data?.filter(p => p.points_earned > 0).map(p => p.block_id) || [];

                return { completed, awarded };
            }
        }, 3, 1000, '获取用户进度');
    },

    async saveUserProgress(userId, progressData) {
        await ensureInitialized();
        if (USE_API_SERVER) {
            // 使用 API 服务器保存用户进度
            const response = await ApiService.db.request('/learning/user_progress', {
                method: 'POST',
                body: JSON.stringify({
                    completed: progressData.completed,
                    awarded: progressData.awarded
                })
            });
            // 检查响应是否包含成功消息
            if (!response.message || !response.message.includes('成功')) {
                throw new Error('进度保存失败');
            }
        } else {
            // Supabase 方式 - 直接使用 block_id 保存
            // 架构统一后，数据库和前端都使用 block_id 跟踪进度

            const blockIds = progressData.completed || [];
            if (blockIds.length === 0) return;

            // 查询 blocks 获取 section_id（作为冗余字段）
            const { data: blocks, error: blocksError } = await ApiService.db
                .from('blocks')
                .select('id, section_id')
                .in('id', blockIds);

            if (blocksError) {
                console.error('查询 blocks 失败:', blocksError);
                // 即使查询失败，也可以只使用 block_id 保存
            }

            // 创建 block_id -> section_id 映射
            const blockToSection = {};
            (blocks || []).forEach(b => {
                if (b.section_id) blockToSection[b.id] = b.section_id;
            });

            // 直接使用 block_id 保存进度
            const completedRecords = blockIds.map(blockId => ({
                user_id: userId,
                block_id: blockId,
                section_id: blockToSection[blockId] || null,  // 冗余字段
                is_completed: true
            }));

            // 批量 upsert 完成记录（使用 block_id 约束）
            if (completedRecords.length > 0) {
                const { error: completedError } = await ApiService.db
                    .from('user_progress')
                    .upsert(completedRecords, {
                        onConflict: 'user_id,block_id',
                        ignoreDuplicates: false
                    });
                if (completedError) throw new Error(`保存完成进度失败: ${completedError.message}`);
            }

            // 处理积分记录
            const awardedBlockIds = progressData.awarded || [];
            if (awardedBlockIds.length > 0) {
                const awardedRecords = awardedBlockIds.map(blockId => ({
                    user_id: userId,
                    block_id: blockId,
                    section_id: blockToSection[blockId] || null,
                    points_earned: 10
                }));

                if (awardedRecords.length > 0) {
                    const { error: awardedError } = await ApiService.db
                        .from('user_progress')
                        .upsert(awardedRecords, {
                            onConflict: 'user_id,block_id',
                            ignoreDuplicates: false
                        });
                    if (awardedError) throw new Error(`保存积分进度失败: ${awardedError.message}`);
                }
            }
        }
    },
    async resetUserProgress() {
        await ensureInitialized();
        if (USE_API_SERVER) {
            // 使用 API 服务器重置用户进度
            const response = await ApiService.db.request('/learning/rpc/reset_user_progress', {
                method: 'POST'
            });
            if (!response.message) throw new Error('重置进度失败');
        } else {
            // Supabase 方式
            const { error } = await ApiService.db.rpc('reset_user_progress');
            if (error) throw new Error('重置进度失败');
        }
    },

    async addPoints(userId, points) {
        await ensureInitialized();
        if (USE_API_SERVER) {
            // 使用 API 服务器更新积分
            const response = await ApiService.db.request('/learning/add-points', {
                method: 'POST',
                body: JSON.stringify({ userId, points })
            });
            return response;
        } else {
            const { error } = await ApiService.db.rpc('upsert_score', { user_id_input: userId, points_to_add: points });
            if (error) { console.error("RPC 'upsert_score' failed:", error); throw new Error(`积分更新失败: ${error.message}`); }
        }
    },

    async signIn(email, password) {
        await ensureInitialized();
        if (USE_API_SERVER) {
            // API 服务器方式
            return withRetry(async () => {
                try {
                    const startTime = Date.now();

                    const { data, error } = await this.db.auth.signInWithPassword({
                        email,
                        password
                    });

                    const duration = Date.now() - startTime;

                    if (error) {
                        console.error('Login error:', error);
                        throw error;
                    }

                    return data;
                } catch (error) {
                    console.error('Network or authentication error:', error);
                    throw error;
                }
            }, 2, 1000, '用户登录');
        } else {
            // Supabase 方式
            return withRetry(async () => {
                try {
                    const startTime = Date.now();

                    // 尝试使用更短的超时时间进行快速登录
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20秒超时

                    const { data, error } = await this.db.auth.signInWithPassword({
                        email,
                        password
                    });

                    clearTimeout(timeoutId);

                    const duration = Date.now() - startTime;

                    if (error) {
                        console.error('Login error:', error);
                        throw error;
                    }

                    return data;
                } catch (error) {
                    console.error('Network or authentication error:', error);
                    if (error.name === 'AbortError') {
                        throw new Error('登录超时，认证服务响应缓慢，请稍后重试');
                    } else if (error.message.includes('ERR_CONNECTION_TIMED_OUT')) {
                        throw new Error('网络连接超时，请检查网络连接');
                    } else if (error.message.includes('Failed to fetch')) {
                        throw new Error('网络连接失败，请检查网络连接');
                    } else if (error.message.includes('signal is aborted')) {
                        throw new Error('认证服务响应超时，请稍后重试');
                    }
                    throw error;
                }
            }, 2, 5000, '用户登录'); // 减少重试次数到2次，增加间隔到5秒
        }
    },
    async signOut() {
        await ensureInitialized();
        try {

            // 第一步：检查当前会话状态
            const { data: { session }, error: sessionError } = await this.db.auth.getSession();

            if (sessionError) {
                console.warn('获取会话状态失败:', sessionError);
            }

            if (session) {
                try {
                    // 只有在存在有效会话时才调用服务器端退出
                    const { error } = await this.db.auth.signOut();
                    if (error) {
                        console.error("服务器端退出失败:", error);
                        // 即使服务器端退出失败，也继续执行本地清理
                    } else {
                    }
                } catch (signOutError) {
                    console.error("退出请求异常:", signOutError);
                    // 继续执行本地清理
                }
            } else {
                console.warn("⚠️ 未发现有效会话，跳过服务器端退出");
            }

            // 第二步：无论如何都执行本地清理
            this.clearCache();

            // 第三步：清理本地存储中的认证数据
            try {
                if (USE_API_SERVER) {
                    // API 服务器模式：清理通用认证数据
                    localStorage.removeItem('lctmr-auth-token');
                    localStorage.removeItem('auth_token');
                    localStorage.removeItem('lctmr-user-data');
                    sessionStorage.clear();
                } else {
                    // Supabase 模式：清理 Supabase 特定数据
                    const { SUPABASE_URL } = window.APP_CONFIG || {};
                    if (SUPABASE_URL) {
                        localStorage.removeItem('sb-' + SUPABASE_URL.split('//')[1].split('.')[0] + '-auth-token');
                    }
                    sessionStorage.clear();
                }
            } catch (storageError) {
                console.warn('本地存储清理失败:', storageError);
            }

            // 第四步：触发全局退出事件
            this.triggerSignOutEvent();


        } catch (error) {
            console.error('退出流程异常:', error);
            // 即使出现异常，也要确保本地状态被清理
            this.clearCache();
            this.triggerSignOutEvent();
        }
    },

    // 新增：触发退出事件的方法
    triggerSignOutEvent() {
        try {
            // 触发自定义事件，通知应用其他部分用户已退出
            const signOutEvent = new CustomEvent('userSignOut', {
                detail: { timestamp: Date.now() }
            });
            window.dispatchEvent(signOutEvent);
        } catch (error) {
            console.warn('触发退出事件失败:', error);
        }
    },

    // 清除所有缓存
    clearCache() {
        cache.clear();
    },

    // 清除特定缓存
    clearCacheKey(key) {
        cache.delete(key);
    },
};
