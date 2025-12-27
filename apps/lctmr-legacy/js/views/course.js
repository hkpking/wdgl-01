/**
 * @file course.js
 * @description Manages the views and logic for the main learning platform.
 * @version 5.0.1 - [FIX] Refactored achievement checking logic to be more robust and added a check for the first score achievement.
 */
import { AppState } from '../state.js';
import { UI } from '../ui.js';
import { ApiService } from '../services/api.js';
import { ComponentFactory } from '../components/factory.js';
import { ConversationLearningManager } from '../components/conversation-learning.js';

export const CourseView = {
    async showCategoryView() {
        UI.switchCourseView('category-selection');
        const grid = UI.elements.mainApp.categoryGrid;
        const categories = AppState.learningMap.categories;
        grid.innerHTML = '';
        if (!categories || categories.length === 0) { UI.renderEmpty(grid, '暂无课程篇章，敬请期待！'); return; }
        
        categories.forEach(c => grid.appendChild(ComponentFactory.createCategoryCard(c, !this.isCategoryUnlocked(c.id))));
    },
    isCategoryUnlocked(categoryId) {
        const cats = AppState.learningMap.categories;
        const catIdx = cats.findIndex(c => c.id === categoryId);
        if (catIdx <= 0) return true;
        const prevCat = cats[catIdx - 1];
        if (!prevCat) return true;
        const prevCatBlocks = AppState.learningMap.flatStructure.filter(b => b.categoryId === prevCat.id);
        if (prevCatBlocks.length === 0) return true; // An empty previous category should not block progress
        return prevCatBlocks.every(b => AppState.userProgress.completedBlocks.has(b.id));
    },
    showChapterView() {
        const cat = AppState.learningMap.categories.find(c => c.id === AppState.current.categoryId);
        if (!cat) return;
        UI.switchCourseView('chapter-selection');
        UI.elements.mainApp.chapterTitle.textContent = cat.title;
        UI.elements.mainApp.chapterDesc.textContent = cat.description;
        const grid = UI.elements.mainApp.chapterGrid;
        grid.innerHTML = '';
        if (!cat.chapters || cat.chapters.length === 0) { UI.renderEmpty(grid, '本篇章下暂无章节。'); return; }
        cat.chapters.forEach(ch => grid.appendChild(ComponentFactory.createChapterCard(ch)));
    },
    selectCategory(id) { AppState.current.categoryId = id; this.showChapterView(); },
    selectChapter(id) { AppState.current.chapterId = id; this.showDetailView(); },
    showDetailView() {
        UI.switchCourseView("chapter-detail");
        this.closeImmersiveViewer();
        const { contentArea, sidebarHeader, sidebarNav } = UI.elements.mainApp;
        UI.renderLoading(contentArea); sidebarNav.innerHTML = ""; sidebarHeader.innerHTML = "";
        try {
            const chap = AppState.learningMap.categories.find(c => c.id === AppState.current.categoryId)?.chapters.find(ch => ch.id === AppState.current.chapterId);
            if (!chap) throw new Error("章节未找到");
            sidebarHeader.innerHTML = `<h2 class="text-xl font-bold text-white">${chap.title}</h2><p class="text-sm text-gray-400 mt-1">${chap.description || ''}</p>`;
            if (!chap.sections || chap.sections.length === 0) { UI.renderEmpty(sidebarNav, "暂无小节"); UI.renderEmpty(contentArea, "本章节暂无内容！"); return; }
            chap.sections.forEach(sec => {
                const group = document.createElement('div');
                group.className = 'section-group';
                group.innerHTML = `<h3 class="section-group-title">${sec.title}</h3>`;
                const ul = document.createElement('ul');
                (sec.blocks || []).sort((a,b) => a.order - b.order).forEach(b => ul.appendChild(ComponentFactory.createBlockItem(b, !this.isBlockUnlocked(b.id), AppState.userProgress.completedBlocks.has(b.id))));
                group.appendChild(ul);
                sidebarNav.appendChild(group);
            });
            const firstUncompleted = AppState.learningMap.flatStructure.find(b => b.chapterId === AppState.current.chapterId && this.isBlockUnlocked(b.id) && !AppState.userProgress.completedBlocks.has(b.id));
            const firstBlock = AppState.learningMap.flatStructure.find(b => b.chapterId === AppState.current.chapterId);
            if (firstUncompleted || firstBlock) this.selectBlock((firstUncompleted || firstBlock).id);
            else UI.renderEmpty(contentArea, "恭喜你，已完成所有内容！");
        } catch (e) { console.error("Error loading detail view:", e); UI.renderError(contentArea, "加载章节内容失败: " + e.message); }
    },
    selectBlock(blockId) {
        this.closeImmersiveViewer();
        AppState.current.blockId = blockId;
        if (window.localStorage) {
            localStorage.setItem('lastViewedBlockId', blockId);
        }
        UI.elements.mainApp.sidebarNav.querySelectorAll("a.block-item").forEach(item => item.classList.toggle("active", item.dataset.blockId == blockId));
        this.renderBlockContent(blockId);
    },
    renderBlockContent(blockId) {
        const block = AppState.learningMap.flatStructure.find(b => b.id === blockId);
        if (!block) return;
        const area = UI.elements.mainApp.contentArea;
        area.innerHTML = "";
        let mediaRendered = false;
        if (block.video_url) { area.innerHTML += this.createMediaPlaceholder('video', block); mediaRendered = true; }
        if (block.document_url) { area.innerHTML += this.createMediaPlaceholder('document', block); mediaRendered = true; }
        if (block.content_html || block.content_markdown) {
            const contentDiv = document.createElement('div');
            contentDiv.className = `content-area ${mediaRendered ? 'mt-6' : ''}`;
            
            if (block.content_format === 'html' && block.content_html) {
                // HTML格式内容 - 支持交互式学习内容
                contentDiv.innerHTML = block.content_html;
                contentDiv.classList.add('html-content');
                
                // 初始化交互式学习功能
                setTimeout(() => this.initInteractiveLearning(contentDiv), 100);
            } else if (block.content_markdown) {
                // Markdown格式内容
                contentDiv.innerHTML = marked.parse(block.content_markdown);
                contentDiv.classList.add('markdown-content');
            }
            
            area.appendChild(contentDiv);
        }
        if (block.quiz_question) {
            if (area.innerHTML.trim() !== '') area.appendChild(document.createElement("hr")).className = "my-8 border-slate-700";
            area.appendChild(ComponentFactory.createQuiz(block, AppState.userProgress.completedBlocks.has(block.id)));
        } else {
            const btn = document.createElement('button');
            if (AppState.userProgress.completedBlocks.has(blockId)) { btn.textContent = '已完成'; btn.disabled = true; btn.className = 'mt-8 w-full md:w-auto px-8 py-3 rounded-lg btn bg-green-600 font-bold text-lg opacity-70'; }
            else { btn.textContent = '标记为已完成'; btn.className = 'mt-8 w-full md:w-auto px-8 py-3 rounded-lg btn btn-primary font-bold text-lg'; btn.onclick = () => this.completeBlock(blockId); }
            const div = document.createElement('div');
            div.className = 'mt-8 pt-8 border-t border-slate-700';
            div.appendChild(btn);
            area.appendChild(div);
        }
    },
    createMediaPlaceholder(type, block) {
        const icon = type === 'video' ? `<svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm8 6l-4 3V7l4 3z"></path></svg>` : `<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>`;
        return `<div onclick="CourseView.openImmersiveViewer('${type}', '${block[`${type}_url`]}', '${block.title.replace(/'/g, "\\'")}')" class="relative rounded-lg overflow-hidden cursor-pointer group mb-6"><div class="absolute inset-0 bg-black/50 group-hover:bg-black/70 transition-colors flex items-center justify-center"><div class="text-center"><div class="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">${icon}</div><h4 class="text-white text-xl font-bold">${block.title}</h4><p class="text-gray-300">${type === 'video' ? '点击播放视频' : '点击打开文档'}</p></div></div><img src="https://placehold.co/800x450/0f172a/38bdf8?text=${encodeURIComponent(block.title)}" alt="${block.title}" class="w-full h-auto"></div>`;
    },
    
    async completeBlock(blockId) {
        if (AppState.userProgress.completedBlocks.has(blockId)) return;
        const wasFirstCompletion = AppState.userProgress.completedBlocks.size === 0;
        AppState.userProgress.completedBlocks.add(blockId);
        
        try {
            await ApiService.saveUserProgress(AppState.user.id, { completed: Array.from(AppState.userProgress.completedBlocks), awarded: Array.from(AppState.userProgress.awardedPointsBlocks) });
            await this.checkAndAwardAchievements(blockId, wasFirstCompletion);
            this.showDetailView();
        } catch (e) { 
            UI.showNotification(e.message, "error"); 
            AppState.userProgress.completedBlocks.delete(blockId); 
        }
    },

    async checkAndAwardAchievements(completedBlockId, isFirstScore) {
        // [FIXED] This function now handles all achievement checks after a block is completed.
        const wasFirstBlockCompletion = AppState.userProgress.completedBlocks.size === 1;

        // --- 1. Check for "First Score" ---
        if (isFirstScore) {
            await ApiService.awardAchievement('SCORE_FIRST_POINTS');
            UI.showNotification("获得成就：点石成金！", "success");
        }

        // --- 2. Check for "Complete First Block" ---
        if (wasFirstBlockCompletion) {
            await ApiService.awardAchievement('COMPLETE_FIRST_BLOCK');
            UI.showNotification("获得成就：初窥门径！", "success");
        }

        // --- 3. Check for "Complete First Chapter" ---
        const block = AppState.learningMap.flatStructure.find(b => b.id === completedBlockId);
        if (!block) return;

        const chapterId = block.chapterId;
        const allBlocksInChapter = AppState.learningMap.flatStructure.filter(b => b.chapterId === chapterId);
        const allChapterBlocksCompleted = allBlocksInChapter.every(b => AppState.userProgress.completedBlocks.has(b.id));
        
        if (allChapterBlocksCompleted) {
            await ApiService.awardAchievement('COMPLETE_FIRST_CHAPTER');
            UI.showNotification("获得成就：学有所成！", "success");
        }
    },

    isBlockUnlocked(blockId) {
        const flat = AppState.learningMap.flatStructure;
        const idx = flat.findIndex(b => b.id === blockId);
        if (idx <= 0) return true;
        return AppState.userProgress.completedBlocks.has(flat[idx - 1].id);
    },
    openImmersiveViewer(type, url, title) {
        const { title: vTitle, content: vContent } = UI.elements.immersiveView;
        vTitle.textContent = title; vContent.innerHTML = '';
        if (type === 'document') vContent.innerHTML = `<iframe src="${url}" class="w-full h-full border-0" allowfullscreen loading="lazy" title="嵌入的在线文档"></iframe>`;
        else if (type === 'video') ComponentFactory.createVideoJsPlayer(vContent, url, { autoplay: true });
        UI.switchTopLevelView('immersive-viewer');
    },
    closeImmersiveViewer() {
        if (AppState.current.topLevelView !== 'immersive-viewer') return;
        if (AppState.current.activePlayer) {
            AppState.current.activePlayer.dispose();
            AppState.current.activePlayer = null;
        }
        UI.elements.immersiveView.content.innerHTML = ''; 
        UI.switchTopLevelView('main-app');
    },

    // 初始化交互式学习功能
    async initInteractiveLearning(container) {
        // 检查是否有对话学习数据
        const conversationData = this.extractConversationData(container);
        if (conversationData) {
            await this.initConversationLearning(container, conversationData);
            return;
        }

        // 回退到原有的交互式学习逻辑
        const learningContainer = container.querySelector('#interactiveLearning');
        if (!learningContainer) return;

        let currentStep = 1;
        const totalSteps = learningContainer.querySelectorAll('.learn-step').length;

        // 更新显示函数
        const updateDisplay = () => {
            // 更新步骤显示
            learningContainer.querySelectorAll('.learn-step').forEach((step, index) => {
                step.style.display = (index + 1) === currentStep ? 'block' : 'none';
            });

            // 更新进度条
            const progress = (currentStep / totalSteps) * 100;
            const progressBar = learningContainer.querySelector('.learn-progress');
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }

            // 更新步骤计数器
            const counter = learningContainer.querySelector('.learn-counter');
            if (counter) {
                counter.textContent = `步骤 ${currentStep} / ${totalSteps}`;
            }

            // 更新按钮
            const prevBtn = learningContainer.querySelector('.learn-prev');
            const nextBtn = learningContainer.querySelector('.learn-next');

            if (prevBtn) {
                prevBtn.disabled = currentStep === 1;
                prevBtn.style.opacity = currentStep === 1 ? '0.5' : '1';
                prevBtn.style.cursor = currentStep === 1 ? 'not-allowed' : 'pointer';
            }

            if (nextBtn) {
                if (currentStep === totalSteps) {
                    nextBtn.textContent = '完成学习 ✓';
                    nextBtn.style.background = '#10b981';
                } else {
                    nextBtn.textContent = '下一步 →';
                    nextBtn.style.background = '#4f46e5';
                }
            }
        };

        const changeStep = (direction) => {
            currentStep += direction;
            if (currentStep < 1) currentStep = 1;
            if (currentStep > totalSteps) currentStep = totalSteps;
            
            updateDisplay();

            if (currentStep === totalSteps && direction === 1) {
                setTimeout(() => {
                    alert('🎉 恭喜您完成了流程管理基础学习！');
                }, 500);
            }
        };

        // 绑定按钮事件
        const prevBtn = learningContainer.querySelector('.learn-prev');
        const nextBtn = learningContainer.querySelector('.learn-next');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => changeStep(-1));
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => changeStep(1));
        }

        // 初始化显示
        updateDisplay();

    },

    /**
     * 提取HTML内容中的对话学习数据
     */
    extractConversationData(container) {
        // 查找JSON格式的对话数据
        const scriptTag = container.querySelector('script[type="application/json"][data-conversation]');
        if (scriptTag) {
            try {
                return JSON.parse(scriptTag.textContent);
            } catch (error) {
                console.warn('解析对话数据失败:', error);
            }
        }

        // 查找data属性中的对话数据
        const conversationElement = container.querySelector('[data-conversation-data]');
        if (conversationElement) {
            try {
                const dataString = conversationElement.dataset.conversationData;
                return JSON.parse(dataString);
            } catch (error) {
                console.warn('解析data属性中的对话数据失败:', error);
            }
        }

        // 查找特定的对话容器
        const conversationContainer = container.querySelector('.conversation-learning-data');
        if (conversationContainer && conversationContainer.textContent.trim()) {
            try {
                return JSON.parse(conversationContainer.textContent);
            } catch (error) {
                console.warn('解析对话容器数据失败:', error);
            }
        }

        return null;
    },

    /**
     * 初始化对话学习
     */
    async initConversationLearning(container, conversationData) {
        try {
            const blockId = AppState.current.blockId;
            if (!blockId) {
                console.error('未找到当前内容块ID');
                return;
            }

            // 清空容器内容，为对话学习让路
            container.innerHTML = '';
            
            // 创建对话学习管理器
            const conversationManager = new ConversationLearningManager({
                autoSave: true,
                saveInterval: 60000, // 60秒检查间隔（实际只在必要时保存）
                onComplete: this.handleConversationComplete.bind(this)
            });

            // 初始化对话学习
            const success = await conversationManager.initialize(blockId, container, conversationData);
            
            if (success) {
                // 保存管理器引用以便后续清理
                this.currentConversationManager = conversationManager;
                
                // 设置全局引用以便HTML内联事件调用
                window.conversationLearning = conversationManager;
                
                
                // 使用回调函数传递，不需要单独设置事件监听器
            } else {
                console.error('❌ 对话学习初始化失败');
                // 回退到普通内容显示
                this.renderFallbackContent(container, conversationData);
            }
            
        } catch (error) {
            console.error('初始化对话学习时出错:', error);
            this.renderFallbackContent(container, conversationData);
        }
    },

    /**
     * 处理对话学习完成
     */
    async handleConversationComplete(completionData) {
        try {
            const blockId = completionData.blockId;
            
            // 防止重复处理同一个块的完成事件
            if (this.lastCompletedBlock === blockId) {
                return;
            }
            
            this.lastCompletedBlock = blockId;
            
            // 标记内容块为已完成
            await this.completeBlock(blockId);
            
            // 显示完成通知
            UI.showNotification(
                `恭喜完成学习！`, 
                'success'
            );
            
            // 清理重复标记（延迟清理以防止短时间内的重复调用）
            setTimeout(() => {
                this.lastCompletedBlock = null;
            }, 5000);
            
        } catch (error) {
            console.error('处理对话学习完成时出错:', error);
        }
    },


    /**
     * 渲染回退内容
     */
    renderFallbackContent(container, conversationData) {
        const fallbackHTML = `
            <div class="fallback-content">
                <div class="alert alert-warning mb-4">
                    <h4>⚠️ 对话学习加载失败</h4>
                    <p>系统无法加载交互式对话内容，请刷新页面重试。</p>
                </div>
                <div class="conversation-debug-info">
                    <details>
                        <summary>调试信息</summary>
                        <pre>${JSON.stringify(conversationData, null, 2)}</pre>
                    </details>
                </div>
            </div>
        `;
        
        container.innerHTML = fallbackHTML;
    },

    /**
     * 清理对话学习资源
     */
    cleanupConversationLearning() {
        // 清理管理器
        if (this.currentConversationManager) {
            this.currentConversationManager.destroy();
            this.currentConversationManager = null;
        }
        
        // 清理全局引用
        if (window.conversationLearning) {
            delete window.conversationLearning;
        }
    },

    /**
     * 重写completeBlock方法
     */
    async completeBlock(blockId) {
        if (AppState.userProgress.completedBlocks.has(blockId)) return;
        
        const wasFirstCompletion = AppState.userProgress.completedBlocks.size === 0;
        AppState.userProgress.completedBlocks.add(blockId);
        
        try {
            // 保存用户进度
            const progressData = {
                completed: Array.from(AppState.userProgress.completedBlocks),
                awarded: Array.from(AppState.userProgress.awardedPointsBlocks)
            };
            
            await ApiService.saveUserProgress(AppState.user.id, progressData);
            
            // 检查并奖励成就
            await this.checkAndAwardAchievements(blockId, wasFirstCompletion);
            
            // 刷新视图
            this.showDetailView();
            
        } catch (e) { 
            UI.showNotification(e.message, "error"); 
            AppState.userProgress.completedBlocks.delete(blockId); 
        }
    }
};
window.CourseView = CourseView;
