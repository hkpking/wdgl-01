import { AppState } from '../state.js';
import { UI } from '../ui.js';
import { ApiService } from '../services/api.js';
import { getFactionInfo } from '../constants.js';
import { LearningHistory } from '../components/learning-history.js';

export const ProfileView = {
    async showProfileView() {
        UI.switchTopLevelView('profile');
        const container = UI.elements.profile.content;
        UI.renderLoading(container); // [FIXED] Corrected the function call

        try {
            const userId = AppState.user.id;
            
            const [profile, scoreData, achievements] = await Promise.all([
                ApiService.getProfile(userId),
                ApiService.getScoreInfo(userId),
                ApiService.fetchUserAchievements(userId)
            ]);

            AppState.profile = { 
                ...AppState.profile, 
                ...profile, 
                points: scoreData ? scoreData.points : AppState.profile.points,
                username: scoreData ? scoreData.username : AppState.profile.username
            };
            
            const points = AppState.profile.points || 0;
            const totalBlocks = AppState.learningMap.flatStructure.length;
            const completedBlocks = AppState.userProgress.completedBlocks.size;
            const progressPercentage = totalBlocks > 0 ? ((completedBlocks / totalBlocks) * 100).toFixed(0) : 0;

            container.innerHTML = `
                <div class="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                    <div class="md:col-span-1 text-center" id="profile-identity"></div>
                    <div class="md:col-span-2">
                        <h3 class="text-xl font-bold text-gray-300 mb-6">学习统计</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div class="bg-slate-800/50 p-6 rounded-lg text-center transform hover:scale-105 transition-transform">
                                <p class="text-4xl font-bold text-amber-400">${points}</p>
                                <p class="text-gray-400 mt-2">总学分</p>
                            </div>
                            <div class="bg-slate-800/50 p-6 rounded-lg text-center transform hover:scale-105 transition-transform">
                                <p class="text-4xl font-bold text-emerald-400">${completedBlocks}</p>
                                <p class="text-gray-400 mt-2">已完成内容块</p>
                            </div>
                        </div>
                        <div class="mt-8">
                            <h4 class="font-semibold text-gray-300 mb-2">总学习进度</h4>
                            <div class="w-full bg-slate-700 rounded-full h-4">
                                <div class="bg-gradient-to-r from-sky-500 to-indigo-500 h-4 rounded-full flex items-center justify-end text-xs font-bold pr-2" style="width: ${progressPercentage}%">
                                    <span class="text-white">${progressPercentage}%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- 标签页导航 -->
                <div class="mt-12">
                    <div class="flex border-b border-slate-700/50">
                        <button class="tab-btn active" data-tab="achievements" onclick="ProfileView.switchTab('achievements')">
                            🏆 成就殿堂
                        </button>
                        <button class="tab-btn" data-tab="history" onclick="ProfileView.switchTab('history')">
                            📚 学习历史
                        </button>
                    </div>
                </div>
                
                <!-- 成就殿堂 -->
                <div id="tab-achievements" class="tab-content active mt-8">
                    <div id="achievements-grid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"></div>
                </div>
                
                <!-- 学习历史 -->
                <div id="tab-history" class="tab-content hidden mt-8">
                    <div id="learning-history-container"></div>
                </div>
            `;

            this.renderIdentitySection();
            this.renderAchievements(achievements);
            this.initLearningHistory();

        } catch (error) {
            console.error("Failed to load profile data:", error);
            UI.renderError(container, '无法加载个人主页数据。');
        }
    },
    
    renderAchievements(achievements) {
        const grid = document.getElementById('achievements-grid');
        if (!grid) return;

        if (!achievements || achievements.length === 0) {
            grid.innerHTML = `<p class="col-span-full text-center text-gray-500">暂未获得任何成就，继续努力吧！</p>`;
            return;
        }

        grid.innerHTML = achievements.map(ach => `
            <div class="text-center group" title="${ach.description}\n获得于: ${new Date(ach.earned_at).toLocaleDateString()}">
                <div class="w-24 h-24 mx-auto bg-slate-800/50 rounded-full flex items-center justify-center p-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-amber-500/20 border-2 border-slate-700 group-hover:border-amber-400">
                    <img src="${ach.icon_url}" alt="${ach.name}" class="w-full h-full object-contain">
                </div>
                <p class="mt-3 font-semibold text-white group-hover:text-amber-300 transition-colors">${ach.name}</p>
            </div>
        `).join('');
    },

    renderIdentitySection() {
        const container = document.getElementById('profile-identity');
        if (!container) return;

        const profile = AppState.profile;
        const factionInfo = getFactionInfo(profile.faction);
        const emailPrefix = AppState.user.email.split('@')[0];
        const avatarChar = (profile.username || emailPrefix).charAt(0).toUpperCase();

        let nameHtml;
        if (profile.username) {
            nameHtml = `<h2 class="text-2xl font-bold text-white">${profile.username}</h2><p class="text-sm text-gray-400">(${AppState.user.email})</p>`;
        } else {
            nameHtml = `<form id="profile-name-form"><p class="text-gray-400 mb-2">请设置您的显示姓名：</p><input type="text" id="profile-name-input" placeholder="请输入姓名" class="input-field text-center w-full p-2 rounded-lg" required><button type="submit" class="w-full mt-2 btn btn-primary text-sm py-2 px-4 rounded-lg">保存姓名</button></form>`;
        }

        container.innerHTML = `
            <div class="w-32 h-32 mx-auto rounded-full bg-slate-700/50 flex items-center justify-center mb-4 border-2 border-${factionInfo.color}-500 shadow-lg">
                <span class="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-${factionInfo.color}-400 to-white">${avatarChar}</span>
            </div>
            <div id="name-display-area">${nameHtml}</div>
            <p class="text-lg text-${factionInfo.color}-400 font-semibold mt-2">${factionInfo.name}</p>
        `;

        this.bindIdentityEvents();
    },

    bindIdentityEvents() {
        const nameForm = document.getElementById('profile-name-form');
        if (nameForm) {
            nameForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const input = document.getElementById('profile-name-input');
                const newName = input.value.trim();
                if (!newName) return;

                try {
                    const updatedScoreInfo = await ApiService.updateUsername(AppState.user.id, newName);
                    AppState.profile.username = updatedScoreInfo.username;
                    UI.showNotification('姓名更新成功！', 'success');
                    this.renderIdentitySection();
                    UI.elements.mainApp.userGreeting.textContent = `欢迎, ${updatedScoreInfo.username}`;
                } catch (error) {
                    UI.showNotification(error.message, 'error');
                }
            });
        }
    },
    
    switchTab(tabName) {
        // 更新按钮状态
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // 更新内容显示
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
            content.classList.add('hidden');
        });
        document.getElementById(`tab-${tabName}`).classList.remove('hidden');
        document.getElementById(`tab-${tabName}`).classList.add('active');
    },
    
    initLearningHistory() {
        const historyContainer = document.getElementById('learning-history-container');
        if (historyContainer) {
            // 创建学习历史组件实例
            this.learningHistory = new LearningHistory(historyContainer, {
                itemsPerPage: 5,
                showStats: true
            });
        }
    }
};

// 添加样式
const addProfileStyles = () => {
    if (document.getElementById('profile-tabs-styles')) return;
    
    const styles = document.createElement('style');
    styles.id = 'profile-tabs-styles';
    styles.textContent = `
        .tab-btn {
            padding: 12px 24px;
            border: none;
            background: transparent;
            color: #9ca3af;
            cursor: pointer;
            border-bottom: 3px solid transparent;
            transition: all 0.2s;
            font-size: 16px;
            font-weight: 500;
        }
        
        .tab-btn.active {
            color: #f59e0b;
            border-bottom-color: #f59e0b;
        }
        
        .tab-btn:hover {
            color: #d1d5db;
        }
        
        .tab-content {
            min-height: 300px;
        }
        
        .tab-content.hidden {
            display: none;
        }
        
        .tab-content.active {
            display: block;
        }
    `;
    
    document.head.appendChild(styles);
};

// 初始化时添加样式
addProfileStyles();
