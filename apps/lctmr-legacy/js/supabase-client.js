/**
 * 流程天命人 - Supabase 直连配置
 * 替代原有 Express 后端，前端直接调用 Supabase
 * 
 * 使用方式：在 index.html 中引入此文件
 * <script src="js/supabase-client.js"></script>
 */

// Supabase 配置（与 WDGL 共享同一数据库）
const SUPABASE_URL = 'https://nwyvgeoeqkoupqwjsghk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53eXZnZW9lcWtvdXBxd2pzZ2hrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzA4MzUsImV4cCI6MjA4MDUwNjgzNX0.Iz0v_ZzRoJEmYxq8fFaxjBXC5qMREZbncwbC8FS8OGw';

// 初始化 Supabase 客户端（使用全局 supabase 对象）
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================
// 认证服务（替代 auth.js 路由）
// ============================================

const AuthService = {
    /**
     * 用户注册
     */
    async signUp(email, password, displayName) {
        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password,
            options: {
                data: { display_name: displayName }
            }
        });

        if (error) throw error;

        // 创建 LCTMR 用户档案
        if (data.user) {
            await supabaseClient.from('lctmr_profiles').insert({
                id: data.user.id,
                display_name: displayName,
            });
        }

        return data;
    },

    /**
     * 用户登录
     */
    async signIn(email, password) {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password,
        });

        if (error) throw error;
        return data;
    },

    /**
     * 退出登录
     */
    async signOut() {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
    },

    /**
     * 获取当前用户
     */
    async getCurrentUser() {
        const { data: { user } } = await supabaseClient.auth.getUser();
        return user;
    },

    /**
     * 获取用户档案（包含 LCTMR 特有数据）
     */
    async getProfile(userId) {
        const { data, error } = await supabaseClient
            .from('lctmr_profiles')
            .select(`
                *,
                faction:lctmr_factions(*)
            `)
            .eq('id', userId)
            .single();

        if (error) {
            console.error('获取用户档案失败:', error);
            return null;
        }
        return data;
    },

    /**
     * SSO 登录（从门户跳转）
     */
    async ssoLogin(token) {
        // 验证门户传来的 token
        const { data: { user }, error } = await supabaseClient.auth.getUser(token);

        if (error || !user) {
            throw new Error('SSO 认证失败');
        }

        // 检查/创建 LCTMR 档案
        let profile = await this.getProfile(user.id);
        if (!profile) {
            const { data } = await supabaseClient.from('lctmr_profiles').insert({
                id: user.id,
                display_name: user.user_metadata?.display_name || user.email?.split('@')[0],
            }).select().single();
            profile = data;
        }

        return { user, profile };
    },

    /**
     * 监听认证状态变化
     */
    onAuthStateChange(callback) {
        return supabaseClient.auth.onAuthStateChange((event, session) => {
            callback(event, session?.user ?? null);
        });
    },
};

// ============================================
// 用户档案服务（替代 user.js 路由）
// ============================================

const ProfileService = {
    /**
     * 更新用户档案
     */
    async updateProfile(userId, updates) {
        const { data, error } = await supabaseClient
            .from('lctmr_profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * 选择阵营
     */
    async selectFaction(userId, factionId) {
        return this.updateProfile(userId, { faction_id: factionId });
    },

    /**
     * 获取所有阵营
     */
    async getFactions() {
        const { data, error } = await supabaseClient
            .from('lctmr_factions')
            .select('*')
            .eq('is_active', true)
            .order('name');

        if (error) throw error;
        return data || [];
    },
};

// ============================================
// 学习服务（替代 learning.js 路由）
// ============================================

const LearningService = {
    /**
     * 获取分类列表
     */
    async getCategories() {
        const { data, error } = await supabaseClient
            .from('lctmr_categories')
            .select('*')
            .eq('is_active', true)
            .order('order_index');

        if (error) throw error;
        return data || [];
    },

    /**
     * 获取章节列表
     */
    async getChapters(categoryId) {
        const { data, error } = await supabaseClient
            .from('lctmr_chapters')
            .select('*')
            .eq('category_id', categoryId)
            .eq('is_active', true)
            .order('order_index');

        if (error) throw error;
        return data || [];
    },

    /**
     * 获取小节列表
     */
    async getSections(chapterId) {
        const { data, error } = await supabaseClient
            .from('lctmr_sections')
            .select('*')
            .eq('chapter_id', chapterId)
            .eq('is_active', true)
            .order('order_index');

        if (error) throw error;
        return data || [];
    },

    /**
     * 获取学习进度
     */
    async getProgress(userId) {
        const { data, error } = await supabaseClient
            .from('lctmr_user_progress')
            .select('*')
            .eq('user_id', userId);

        if (error) throw error;
        return data || [];
    },

    /**
     * 更新学习进度
     */
    async updateProgress(userId, sectionId, progress) {
        const { data, error } = await supabaseClient
            .from('lctmr_user_progress')
            .upsert({
                user_id: userId,
                section_id: sectionId,
                ...progress,
                updated_at: new Date().toISOString(),
            }, {
                onConflict: 'user_id,section_id',
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    /**
     * 完成学习并获得积分
     */
    async completeSection(userId, sectionId, pointsEarned) {
        // 更新进度
        await this.updateProgress(userId, sectionId, {
            progress_percent: 100,
            is_completed: true,
            points_earned: pointsEarned,
            completed_at: new Date().toISOString(),
        });

        // 记录积分
        await supabaseClient.from('lctmr_points_history').insert({
            user_id: userId,
            points: pointsEarned,
            source_type: 'learning',
            source_id: sectionId,
            description: '完成学习内容',
        });

        // 更新用户总积分（使用 RPC 或直接更新）
        const { data: profile } = await supabaseClient
            .from('lctmr_profiles')
            .select('total_points')
            .eq('id', userId)
            .single();

        await supabaseClient
            .from('lctmr_profiles')
            .update({ total_points: (profile?.total_points || 0) + pointsEarned })
            .eq('id', userId);
    },
};

// ============================================
// 排行榜服务
// ============================================

const RankingService = {
    /**
     * 获取用户排行榜
     */
    async getTopUsers(limit = 10) {
        const { data, error } = await supabaseClient
            .from('lctmr_profiles')
            .select(`
                id,
                display_name,
                total_points,
                level,
                faction:lctmr_factions(name, icon, color)
            `)
            .order('total_points', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return data || [];
    },
};

// ============================================
// 兼容层：将新服务映射到原有 ApiService 接口
// ============================================

window.SupabaseServices = {
    auth: AuthService,
    profile: ProfileService,
    learning: LearningService,
    ranking: RankingService,
    client: supabaseClient,
};

// 替换原有 ApiService（如果需要渐进式迁移）
window.ApiService = window.ApiService || {};
window.ApiService.supabase = window.SupabaseServices;

