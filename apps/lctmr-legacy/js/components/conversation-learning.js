/**
 * @file conversation-learning.js
 * @description 微信式对话学习组件 - 核心功能实现
 * @version 2.0.0 - 支持碎片式学习和数据持久化
 * @author LCTMR Team
 */

/**
 * 对话学习管理器 - 负责对话式学习的核心逻辑
 */
export class ConversationLearningManager {
    constructor(options = {}) {
        // 配置参数
        this.config = {
            autoSave: true,
            saveInterval: 5000, // 5秒自动保存
            animationSpeed: 300,
            ...options
        };

        // 学习状态
        this.state = {
            blockId: null,
            conversationData: null,
            currentStep: 0,
            totalSteps: 0,
            progress: 0,
            completedTests: new Set(),
            isInitialized: false,
            isPaused: false,
            lastSaveTime: null,
            lastServerSync: null, // 上次服务器同步时间
            hasNotified: false // 是否已通知完成（防止重复通知）
        };

        // DOM元素引用
        this.elements = {
            container: null,
            chatArea: null,
            continueButton: null,
            progressBar: null
        };

        // 事件处理器
        this.eventHandlers = new Map();
        
        // 自动保存定时器
        this.autoSaveTimer = null;
        
        // 错误处理
        this.errorHandler = this.createErrorHandler();
        
    }

    /**
     * 初始化对话学习系统
     * @param {string} blockId - 内容块ID
     * @param {HTMLElement} container - 容器元素
     * @param {Object} conversationData - 对话数据
     * @returns {Promise<boolean>} 初始化是否成功
     */
    async initialize(blockId, container, conversationData) {
        try {
            this.validateInitParams(blockId, container, conversationData);
            
            this.state.blockId = blockId;
            this.state.conversationData = conversationData;
            this.state.totalSteps = conversationData.conversations?.length || 0;
            this.elements.container = container;

            // 创建UI结构
            await this.createUI();
            
            // 加载保存的进度
            await this.loadProgress();
            
            // 尝试同步待上传的数据
            await this.syncPendingData();
            
            // 绑定事件
            this.bindEvents();
            
            // 渲染历史对话（如果有进度的话）
            if (this.state.currentStep > 0) {
                await this.renderHistoryConversations();
            }
            
            // 渲染当前对话
            await this.renderCurrentStep();
            
            // 确保学习状态正确（不是暂停状态）
            this.state.isPaused = false;
            
            // 启动自动保存
            this.startAutoSave();
            
            this.state.isInitialized = true;
            
            return true;
            
        } catch (error) {
            this.errorHandler.handleError('初始化失败', error);
            return false;
        }
    }

    /**
     * 验证初始化参数
     */
    validateInitParams(blockId, container, conversationData) {
        if (!blockId || typeof blockId !== 'string') {
            throw new Error('无效的内容块ID');
        }
        
        if (!container || !container.nodeType) {
            throw new Error('无效的容器元素');
        }
        
        if (!conversationData || !conversationData.conversations || !Array.isArray(conversationData.conversations)) {
            throw new Error('无效的对话数据结构');
        }
        
        if (conversationData.conversations.length === 0) {
            throw new Error('对话数据为空');
        }
    }

    /**
     * 创建UI结构
     */
    async createUI() {
        const uiHTML = `
            <div class="conversation-learning-wrapper" data-block-id="${this.state.blockId}">
                <!-- 进度条 -->
                <div class="conversation-progress">
                    <div class="progress-info">
                        <span class="progress-text">学习进度</span>
                        <span class="progress-percentage">0%</span>
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: 0%"></div>
                    </div>
                </div>

                <!-- 对话区域 -->
                <div class="conversation-chat-area">
                    <div class="chat-messages" id="chatMessages">
                        <!-- 对话消息将在这里动态添加 -->
                    </div>
                </div>

                <!-- 控制区域 -->
                <div class="conversation-controls">
                    <button class="continue-btn" id="continueBtn" disabled>
                        <span class="btn-text">开始学习</span>
                        <span class="btn-icon">▶</span>
                    </button>
                </div>

                <!-- 测试弹窗容器 -->
                <div class="test-modal-backdrop hidden" id="testModal">
                    <div class="test-modal">
                        <div class="test-content">
                            <!-- 测试内容将在这里动态生成 -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.elements.container.innerHTML = uiHTML;
        
        // 获取DOM元素引用
        this.elements.chatArea = this.elements.container.querySelector('#chatMessages');
        this.elements.continueButton = this.elements.container.querySelector('#continueBtn');
        this.elements.progressBar = this.elements.container.querySelector('.progress-bar');
        this.elements.progressText = this.elements.container.querySelector('.progress-percentage');
        this.elements.testModal = this.elements.container.querySelector('#testModal');
        
    }

    /**
     * 绑定事件处理器
     */
    bindEvents() {
        // 继续按钮点击事件
        if (this.elements.continueButton) {
            const continueHandler = this.debounce(async () => {
                await this.handleContinueClick();
            }, 300);
            
            this.elements.continueButton.addEventListener('click', continueHandler);
            this.eventHandlers.set('continue', continueHandler);
        }

        // 键盘事件（空格键继续）
        const keyHandler = (e) => {
            if (e.code === 'Space' && !this.state.isPaused) {
                e.preventDefault();
                this.handleContinueClick();
            }
        };
        
        document.addEventListener('keydown', keyHandler);
        this.eventHandlers.set('keyboard', keyHandler);

        // 页面离开前保存进度
        const beforeUnloadHandler = () => {
            this.saveProgress();
        };
        
        window.addEventListener('beforeunload', beforeUnloadHandler);
        this.eventHandlers.set('beforeunload', beforeUnloadHandler);

    }

    /**
     * 处理继续按钮点击
     */
    async handleContinueClick() {
        try {
            if (this.state.isPaused || !this.state.isInitialized) {
                return;
            }

            // 检查是否已完成（只有在真正完成学习时才跳转）
            if (this.state.currentStep > 0 && this.state.currentStep >= this.state.totalSteps) {
                await this.handleLearningComplete();
                return;
            }

            // 进入下一步
            await this.nextStep();
            
        } catch (error) {
            this.errorHandler.handleError('处理继续操作失败', error);
        }
    }

    /**
     * 进入下一步对话 - 优化版本，提升流畅性
     */
    async nextStep() {
        if (this.state.isPaused) {
            return;
        }

        if (this.state.currentStep >= this.state.totalSteps) {
            return;
        }

        // 1. 立即更新状态（提升响应性）
        this.state.currentStep++;
        this.state.progress = Math.round((this.state.currentStep / this.state.totalSteps) * 100);
        
        // 2. 立即更新进度显示（不等待异步操作）
        this.updateProgressDisplay();
        
        // 3. 异步渲染和保存（不阻塞用户操作）
        this.renderAndSaveAsync();

    }

    /**
     * 异步渲染和保存（提升流畅性）
     */
    async renderAndSaveAsync() {
        try {
            // 并行执行渲染和保存，提升性能
            await Promise.all([
                this.renderCurrentStep(),
                this.saveProgress()
            ]);
        } catch (error) {
            console.error('异步渲染和保存失败:', error);
        }
    }

    /**
     * 渲染历史对话
     */
    async renderHistoryConversations() {
        try {
            
            if (!this.state.conversationData?.conversations) {
                console.warn('⚠️ 没有对话数据');
                return;
            }
            
            const conversations = this.state.conversationData.conversations;
            
            // 渲染从第1步到当前步骤的所有对话
            for (let i = 1; i <= this.state.currentStep; i++) {
                const conversation = conversations[i - 1];
                if (!conversation) continue;
                
                // 标记为历史对话
                const isHistoryStep = i < this.state.currentStep;
                
                // 根据对话类型渲染
                switch (conversation.type) {
                    case 'text':
                        this.renderTextMessage(conversation, i, isHistoryStep);
                        break;
                    case 'image':
                        await this.renderImageMessage(conversation, i, isHistoryStep);
                        break;
                    case 'test':
                        await this.renderTestMessage(conversation, i, isHistoryStep);
                        break;
                    default:
                        this.renderTextMessage(conversation, i, isHistoryStep);
                }
                
                // 添加小延迟，让渲染更流畅
                if (i % 3 === 0) {
                    await new Promise(resolve => setTimeout(resolve, 50));
                }
            }
            
            
        } catch (error) {
            console.error('渲染历史对话失败:', error);
        }
    }

    /**
     * 渲染当前步骤 - 修复版本
     */
    async renderCurrentStep() {
        try {
            // 检查是否已完成学习
            if (this.state.currentStep > 0 && this.state.currentStep >= this.state.totalSteps) {
                await this.handleLearningComplete();
                return;
            }
            
            // 获取下一步的对话（currentStep表示已完成的步骤，下一步是currentStep+1）
            const nextStepIndex = this.state.currentStep; // 下一步的索引
            const nextConversation = this.getConversationByIndex(nextStepIndex);
            
            if (!nextConversation) {
                return;
            }


            // 根据对话类型渲染
            switch (nextConversation.type) {
                case 'text':
                    this.renderTextMessage(nextConversation);
                    break;
                case 'image':
                    await this.renderImageMessage(nextConversation);
                    break;
                case 'test':
                    await this.renderTestMessage(nextConversation);
                    return; // 测试时不更新继续按钮
                default:
                    console.warn(`未知的对话类型: ${nextConversation.type}`);
                    this.renderTextMessage(nextConversation);
            }

            // 更新继续按钮状态
            this.updateContinueButton();
            
            // 滚动到底部
            this.scrollToBottom();
            
        } catch (error) {
            this.errorHandler.handleError('渲染步骤失败', error);
        }
    }

    /**
     * 获取指定索引的对话数据
     */
    getConversationByIndex(index) {
        if (!this.state.conversationData?.conversations) {
            return null;
        }
        
        const conversations = this.state.conversationData.conversations;
        return conversations[index] || null;
    }

    /**
     * 获取当前对话数据（已废弃，使用getConversationByIndex）
     */
    getCurrentConversation() {
        if (!this.state.conversationData?.conversations || this.state.currentStep <= 0) {
            return null;
        }
        
        const conversations = this.state.conversationData.conversations;
        const index = this.state.currentStep - 1;
        
        return conversations[index] || null;
    }

    /**
     * 渲染文本消息
     */
    renderTextMessage(conversation, stepNumber = null, isHistory = false) {
        const content = conversation?.content || '无文本内容';
        const currentStep = stepNumber || this.state.currentStep;
        const messageClass = isHistory ? 'chat-message system-message history-message' : 'chat-message system-message';
        // 移除步骤指示器显示
        const stepIndicator = '';
        
        const messageHTML = `
            <div class="${messageClass}" data-step="${currentStep}" data-type="text">
                <div class="message-avatar">
                    <div class="avatar-icon">🤖</div>
                </div>
                <div class="message-bubble">
                    ${stepIndicator}
                    <div class="message-content">${this.escapeHtml(content)}</div>
                    <div class="message-time">${this.getCurrentTime()}</div>
                </div>
            </div>
        `;
        
        this.elements.chatArea.insertAdjacentHTML('beforeend', messageHTML);
        const logContent = conversation.content || '未知内容';
        const logPrefix = isHistory ? '📚 历史' : '💬 当前';
    }

    /**
     * 渲染图片消息
     */
    async renderImageMessage(conversation) {
        const imageUrl = conversation.imageUrl || conversation.image;
        const imageAlt = conversation.imageAlt || conversation.content || '学习图片';
        
        const messageHTML = `
            <div class="chat-message system-message" data-step="${this.state.currentStep}" data-type="image">
                <div class="message-avatar">
                    <div class="avatar-icon">🤖</div>
                </div>
                <div class="message-bubble">
                    <div class="message-content">${this.escapeHtml(conversation.content)}</div>
                    <div class="message-image">
                        <img src="${this.escapeHtml(imageUrl)}" 
                             alt="${this.escapeHtml(imageAlt)}"
                             class="conversation-image"
                             onclick="ConversationLearningManager.showImageModal(this)"
                             loading="lazy">
                    </div>
                    <div class="message-time">${this.getCurrentTime()}</div>
                </div>
            </div>
        `;
        
        this.elements.chatArea.insertAdjacentHTML('beforeend', messageHTML);
    }

    /**
     * 渲染测试消息
     */
    async renderTestMessage(conversation, stepNumber = null, isHistory = false) {
        // 先添加测试介绍消息
        const introHTML = `
            <div class="chat-message system-message" data-step="${stepNumber || this.state.currentStep}" data-type="test-intro">
                <div class="message-avatar">
                    <div class="avatar-icon">📝</div>
                </div>
                <div class="message-bubble">
                    <div class="message-content">${this.escapeHtml(conversation.content || '来做个小测试吧！')}</div>
                    <div class="message-time">${this.getCurrentTime()}</div>
                </div>
            </div>
        `;
        
        this.elements.chatArea.insertAdjacentHTML('beforeend', introHTML);
        
        if (isHistory) {
            // 历史测试：只显示测试内容，不显示弹窗
        } else {
            // 当前测试：显示测试弹窗
            await this.showTestModal(conversation);
        }
    }

    /**
     * 显示测试弹窗
     */
    async showTestModal(testData) {
        this.state.isPaused = true;
        
        const optionsHTML = testData.options.map((option, index) => `
            <label class="test-option" data-index="${index}">
                <input type="radio" name="testAnswer" value="${index}" class="test-radio">
                <span class="option-text">${this.escapeHtml(option)}</span>
            </label>
        `).join('');
        
        const modalHTML = `
            <div class="test-header">
                <h3>📝 测试题</h3>
            </div>
            <div class="test-question">
                <p>${this.escapeHtml(testData.question)}</p>
            </div>
            <div class="test-options">
                ${optionsHTML}
            </div>
            <div class="test-actions">
                <button class="test-submit-btn" onclick="window.conversationLearning.handleTestSubmit()">
                    提交答案
                </button>
            </div>
        `;
        
        this.elements.testModal.querySelector('.test-content').innerHTML = modalHTML;
        this.elements.testModal.classList.remove('hidden');
        
        // 临时存储测试数据
        this._currentTestData = testData;
    }

    /**
     * 处理测试提交
     */
    async handleTestSubmit() {
        try {
            const selectedOption = this.elements.testModal.querySelector('input[name="testAnswer"]:checked');
            
            if (!selectedOption) {
                this.showNotification('请选择一个答案', 'warning');
                return;
            }
            
            const selectedIndex = parseInt(selectedOption.value);
            const testData = this._currentTestData;
            const isCorrect = selectedIndex === testData.correctAnswer;
            
            // 显示结果
            await this.showTestResult(isCorrect, testData);
            
            // 记录测试完成
            this.state.completedTests.add(this.state.currentStep);
            
            
        } catch (error) {
            this.errorHandler.handleError('处理测试提交失败', error);
        }
    }

    /**
     * 显示测试结果
     */
    async showTestResult(isCorrect, testData) {
        const resultHTML = `
            <div class="test-result ${isCorrect ? 'correct' : 'incorrect'}">
                <div class="result-icon">${isCorrect ? '✅' : '❌'}</div>
                <div class="result-text">${isCorrect ? '回答正确！' : '回答错误'}</div>
                ${testData.explanation ? `<div class="result-explanation">${this.escapeHtml(testData.explanation)}</div>` : ''}
                <button class="test-continue-btn" onclick="window.conversationLearning.closeTestModal()">
                    继续学习
                </button>
            </div>
        `;
        
        this.elements.testModal.querySelector('.test-content').innerHTML = resultHTML;
        
        // 添加测试结果到聊天区域
        const resultMessageHTML = `
            <div class="chat-message test-result-message ${isCorrect ? 'correct' : 'incorrect'}" data-step="${this.state.currentStep}">
                <div class="message-avatar">
                    <div class="avatar-icon">${isCorrect ? '✅' : '❌'}</div>
                </div>
                <div class="message-bubble">
                    <div class="message-content">
                        ${isCorrect ? '回答正确！' : '回答错误，正确答案是：' + testData.options[testData.correctAnswer]}
                    </div>
                    <div class="message-time">${this.getCurrentTime()}</div>
                </div>
            </div>
        `;
        
        this.elements.chatArea.insertAdjacentHTML('beforeend', resultMessageHTML);
        this.scrollToBottom();
    }

    /**
     * 关闭测试弹窗
     */
    closeTestModal() {
        this.elements.testModal.classList.add('hidden');
        this.state.isPaused = false;
        this.updateContinueButton();
        delete this._currentTestData;
    }

    /**
     * 更新学习进度
     */
    updateProgress() {
        if (this.state.totalSteps === 0) return;
        
        const newProgress = Math.floor((this.state.currentStep / this.state.totalSteps) * 100);
        this.state.progress = newProgress;
        
        
        // 更新UI显示
        this.updateProgressDisplay();
    }

    /**
     * 更新进度显示
     */
    updateProgressDisplay() {
        // 更新进度条
        if (this.elements.progressBar) {
            this.elements.progressBar.style.width = `${this.state.progress}%`;
        } else {
            console.warn('⚠️ 进度条元素未找到');
        }
        
        // 更新进度百分比显示
        if (this.elements.progressText) {
            this.elements.progressText.textContent = `${this.state.progress}%`;
        } else {
            console.warn('⚠️ 进度文本元素未找到');
        }
    }


    /**
     * 更新继续按钮状态
     */
    updateContinueButton() {
        if (!this.elements.continueButton) {
            console.warn('⚠️ 继续按钮元素未找到');
            return;
        }
        
        const btnText = this.elements.continueButton.querySelector('.btn-text');
        
            isPaused: this.state.isPaused,
            currentStep: this.state.currentStep,
            totalSteps: this.state.totalSteps,
            isInitialized: this.state.isInitialized
        });
        
        if (this.state.isPaused) {
            this.elements.continueButton.disabled = true;
            return;
        }
        
        if (this.state.currentStep === 0) {
            btnText.textContent = '开始学习';
            this.elements.continueButton.disabled = false;
        } else if (this.state.currentStep >= this.state.totalSteps) {
            btnText.textContent = '学习完成';
            this.elements.continueButton.disabled = true;
        } else {
            btnText.textContent = '继续';
            this.elements.continueButton.disabled = false;
        }
    }

    /**
     * 处理学习完成
     */
    async handleLearningComplete() {
        try {
            // 确保进度为100%
            this.state.progress = 100;
            
            
            // 立即更新显示
            this.updateProgressDisplay();
            
            // 添加完成消息
            const completeHTML = `
                <div class="chat-message system-message completion-message">
                    <div class="message-avatar">
                        <div class="avatar-icon">🎉</div>
                    </div>
                    <div class="message-bubble">
                        <div class="message-content">
                            <strong>恭喜完成学习！</strong><br>
                            学习进度：100%
                        </div>
                        <div class="message-time">${this.getCurrentTime()}</div>
                    </div>
                </div>
            `;
            
            this.elements.chatArea.insertAdjacentHTML('beforeend', completeHTML);
            this.scrollToBottom();
            
            // 保存最终进度
            await this.saveProgress(true);
            
            
            // 停止自动保存
            this.stopAutoSave();
            
            // 更新UI状态
            this.updateProgressDisplay();
            this.updateContinueButton();
            
            // 通知父组件学习完成
            this.notifyCompletion();
            
        } catch (error) {
            this.errorHandler.handleError('处理学习完成失败', error);
        }
    }

    
    /**
     * 通知学习完成
     */
    notifyCompletion() {
        // 防止重复通知
        if (this.state.hasNotified) {
            return;
        }
        
        this.state.hasNotified = true;
        
        const completionData = {
            blockId: this.state.blockId,
            completedSteps: this.state.currentStep,
            completedTests: Array.from(this.state.completedTests),
            totalSteps: this.state.totalSteps
        };
        
        
        // 优先使用回调函数（直接通信）
        if (this.config.onComplete && typeof this.config.onComplete === 'function') {
            this.config.onComplete(completionData);
        } else {
            // 如果没有回调函数，才使用事件系统
            const event = new CustomEvent('conversationLearningComplete', {
                detail: completionData
            });
            document.dispatchEvent(event);
        }
    }

    /**
     * 加载保存的进度
     */
    async loadProgress() {
        try {
            // 首先检查内容块是否已在系统中标记为完成
            if (window.AppState && window.AppState.userProgress && 
                window.AppState.userProgress.completedBlocks && 
                window.AppState.userProgress.completedBlocks.has(this.state.blockId)) {
                await this.showCompletedState();
                return; // 直接显示完成状态，不继续学习流程
            }

            const savedProgress = await this.getStoredProgress();
            
            if (savedProgress && savedProgress.blockId === this.state.blockId) {
                // 检查数据一致性：如果 currentStep = 0 但标记为完成，说明数据有问题
                if (savedProgress.currentStep === 0 && 
                    (savedProgress.isComplete || savedProgress.progress > 0)) {
                    console.warn('⚠️ 检测到不一致的进度数据，重置为初始状态');
                    // 清除不一致的数据
                    await this.clearProgress();
                    return; // 从头开始
                }
                
                this.state.currentStep = savedProgress.currentStep || 0;
                this.state.progress = savedProgress.progress || 0;
                this.state.completedTests = new Set(savedProgress.completedTests || []);
                
                // 检查是否已经完成学习（严格检查）
                if (savedProgress.isComplete && 
                    savedProgress.currentStep > 0 && 
                    savedProgress.currentStep >= this.state.totalSteps &&
                    savedProgress.progress === 100) {
                    // 确保进度为100%
                    this.state.progress = 100;
                    
                    // 同步到系统完成状态（如果还没有的话）
                    if (window.AppState && window.AppState.userProgress && 
                        !window.AppState.userProgress.completedBlocks.has(this.state.blockId)) {
                        window.AppState.userProgress.completedBlocks.add(this.state.blockId);
                        // 保存到服务器
                        if (window.ApiService && window.AppState.user) {
                            try {
                                await window.ApiService.saveUserProgress(window.AppState.user.id, {
                                    completed: Array.from(window.AppState.userProgress.completedBlocks),
                                    awarded: Array.from(window.AppState.userProgress.awardedPointsBlocks)
                                });
                            } catch (error) {
                                console.warn('同步完成状态到服务器失败:', error);
                            }
                        }
                    }
                    
                    await this.showCompletedState();
                    return; // 直接返回，不继续正常的学习流程
                }
                
                
                // 立即更新进度显示
                this.updateProgressDisplay();
            }
            
        } catch (error) {
            console.warn('加载进度失败，将从头开始:', error);
        }
    }

    /**
     * 显示已完成状态
     */
    async showCompletedState() {
        try {
            // 更新进度显示
            this.updateProgressDisplay();
            
            // 显示完成消息
            const completeHTML = `
                <div class="chat-message system-message completion-message already-completed">
                    <div class="message-avatar">
                        <div class="avatar-icon">✅</div>
                    </div>
                    <div class="message-bubble">
                        <div class="message-content">
                            <strong>🎉 您已经完成了这个学习内容！</strong><br>
                            学习进度：100%<br><br>
                            <div class="completion-actions">
                                <button class="review-btn" onclick="conversationLearning.reviewContent()">
                                    👁️ 查看学习内容
                                </button>
                                <button class="restart-btn" onclick="conversationLearning.restartLearning()">
                                    🔄 重新学习
                                </button>
                                <button class="history-btn" onclick="conversationLearning.goToHistory()">
                                    📚 查看学习历史
                                </button>
                            </div>
                        </div>
                        <div class="message-time">${this.getCurrentTime()}</div>
                    </div>
                </div>
            `;
            
            this.elements.chatArea.innerHTML = completeHTML;
            
            // 禁用继续按钮并更新文本
            if (this.elements.continueButton) {
                this.elements.continueButton.disabled = true;
                const btnText = this.elements.continueButton.querySelector('.btn-text');
                if (btnText) {
                    btnText.textContent = '已完成学习';
                }
            }
            
            // 停止自动保存
            this.stopAutoSave();
            
            // 全局暴露实例，方便按钮调用
            window.conversationLearning = this;
            
            
        } catch (error) {
            console.error('显示完成状态失败:', error);
        }
    }
    
    /**
     * 查看学习内容（回顾模式）
     */
    reviewContent() {
        // 清空聊天区域
        this.elements.chatArea.innerHTML = '';
        
        // 显示所有对话内容供回顾
        this.renderAllConversations();
        
        // 更新按钮
        if (this.elements.continueButton) {
            const btnText = this.elements.continueButton.querySelector('.btn-text');
            if (btnText) {
                btnText.textContent = '返回完成状态';
            }
            this.elements.continueButton.disabled = false;
            this.elements.continueButton.onclick = () => this.showCompletedState();
        }
    }
    
    /**
     * 重新开始学习
     */
    restartLearning() {
        if (confirm('确定要重新开始学习吗？之前的学习进度将被清除。')) {
            // 清除存储的进度
            this.clearProgress();
            
            // 重置状态
            this.state.currentStep = 0;
            this.state.progress = 0;
            this.state.completedTests.clear();
            this.state.hasNotified = false; // 重置通知标志
            
            // 清空聊天区域
            this.elements.chatArea.innerHTML = '';
            
            // 更新进度显示
            this.updateProgressDisplay();
            
            // 重新渲染初始步骤
            this.renderCurrentStep();
            
            // 重新启动自动保存
            this.startAutoSave();
            
            // 更新继续按钮
            this.updateContinueButton();
            
        }
    }
    
    /**
     * 清除进度数据
     */
    async clearProgress() {
        // 清除本地存储
        const localKey = `conversation_progress_${this.state.blockId}`;
        const syncKey = `sync_pending_${this.state.blockId}`;
        localStorage.removeItem(localKey);
        localStorage.removeItem(syncKey);
        
        // 尝试从服务器删除
        if (window.ApiService && window.AppState?.user?.id) {
            try {
                await window.ApiService.deleteConversationProgress(
                    window.AppState.user.id,
                    this.state.blockId
                );
            } catch (error) {
                console.warn('删除服务器端进度失败:', error);
            }
        }
        
    }
    
    /**
     * 跳转到学习历史
     */
    goToHistory() {
        // 触发跳转到个人主页的学习历史标签页
        if (window.ProfileView && window.ProfileView.switchTab) {
            // 先跳转到个人主页
            if (window.UI && window.UI.switchTopLevelView) {
                window.UI.switchTopLevelView('profile');
                // 稍微延迟再切换标签页
                setTimeout(() => {
                    window.ProfileView.switchTab('history');
                }, 500);
            }
        } else {
            alert('请在个人主页查看学习历史');
        }
    }
    
    /**
     * 渲染所有对话内容（回顾模式）
     */
    async renderAllConversations() {
        if (!this.state.conversationData?.conversations) return;
        
        for (let i = 0; i < this.state.conversationData.conversations.length; i++) {
            const conversation = this.state.conversationData.conversations[i];
            
            // 渲染每个对话
            switch (conversation.type) {
                case 'text':
                    this.renderTextMessage(conversation);
                    break;
                case 'image':
                    await this.renderImageMessage(conversation);
                    break;
                case 'test':
                    // 在回顾模式下显示测试结果
                    this.renderTestReview(conversation, i + 1);
                    break;
            }
        }
        
        this.scrollToBottom();
    }
    
    /**
     * 渲染测试回顾
     */
    renderTestReview(testData, stepNumber) {
        const wasCorrect = this.state.completedTests.has(stepNumber);
        const resultHTML = `
            <div class="chat-message test-result-message review-mode ${wasCorrect ? 'correct' : 'incomplete'}">
                <div class="message-avatar">
                    <div class="avatar-icon">${wasCorrect ? '✅' : '📝'}</div>
                </div>
                <div class="message-bubble">
                    <div class="message-content">
                        <div class="test-question"><strong>测试题：</strong>${testData.question}</div>
                        <div class="test-answer"><strong>正确答案：</strong>${testData.options[testData.correctAnswer]}</div>
                        ${testData.explanation ? `<div class="test-explanation"><strong>解释：</strong>${testData.explanation}</div>` : ''}
                        <div class="test-status">${wasCorrect ? '✅ 已正确完成' : '🔄 当时未完成'}</div>
                    </div>
                    <div class="message-time">${this.getCurrentTime()}</div>
                </div>
            </div>
        `;
        
        this.elements.chatArea.insertAdjacentHTML('beforeend', resultHTML);
    }
    
    /**
     * 获取存储的进度数据 - 优化版本，优先使用本地缓存
     */
    async getStoredProgress() {
        try {
            // 1. 优先从本地缓存获取（最新、最可靠）
            const localKey = `conversation_progress_${this.state.blockId}`;
            const localData = localStorage.getItem(localKey);
            
            if (localData) {
                const progress = JSON.parse(localData);
                    currentStep: progress.currentStep,
                    progress: progress.progress,
                    isComplete: progress.isComplete
                });
                return progress;
            }
            
            // 2. 本地缓存不存在时，从服务器获取
            if (window.ApiService && window.AppState?.user?.id) {
                const response = await window.ApiService.getConversationProgress(
                    window.AppState.user.id, 
                    this.state.blockId
                );
                
                if (response && response.success && response.data) {
                    
                    // 将服务器数据保存到本地缓存
                    localStorage.setItem(localKey, JSON.stringify(response.data));
                    
                    return response.data;
                }
            }
        } catch (error) {
            console.warn('获取进度数据失败:', error);
        }
        
        return null;
    }

    /**
     * 保存学习进度（优化版）
     * @param {boolean} isComplete - 是否完成学习
     * @param {boolean} forceServerSync - 是否强制同步到服务器
     */
    async saveProgress(isComplete = false, forceServerSync = false) {
        try {
            const progressData = {
                blockId: this.state.blockId,
                currentStep: this.state.currentStep,
                progress: this.state.progress,
                completedTests: Array.from(this.state.completedTests),
                isComplete: isComplete,
                lastSaveTime: new Date().toISOString()
            };
            
            // 1. 立即保存到本地缓存（用户离开再进入时使用）
            await this.saveToLocalCache(progressData);
            
            // 2. 异步同步到数据库（不阻塞用户操作）
            this.syncToDatabase(progressData, isComplete, forceServerSync);
            
            
            this.state.lastSaveTime = new Date();
            
        } catch (error) {
            this.errorHandler.handleError('保存进度失败', error);
        }
    }

    /**
     * 保存到本地缓存
     */
    async saveToLocalCache(progressData) {
        try {
            const localKey = `conversation_progress_${this.state.blockId}`;
            localStorage.setItem(localKey, JSON.stringify(progressData));
        } catch (error) {
            console.warn('本地缓存保存失败:', error);
        }
    }

    /**
     * 异步同步到数据库
     */
    async syncToDatabase(progressData, isComplete = false, forceServerSync = false) {
        // 判断是否需要同步到数据库
        const shouldSyncToServer = 
            isComplete ||                                      // 学习完成时必须同步
            forceServerSync ||                                 // 强制同步
            this.state.currentStep % 3 === 0 ||               // 每3步同步一次（平衡性能和及时性）
            !this.state.lastServerSync ||                     // 首次保存
            (Date.now() - this.state.lastServerSync) > 60000; // 距上次同步超过60秒
        
        if (!shouldSyncToServer) {
            return;
        }

        // 检查API服务和用户信息
        if (!window.ApiService) {
            console.warn('⚠️ API服务不可用，跳过数据库同步');
                hasWindow: typeof window !== 'undefined',
                hasApiService: !!window.ApiService,
                apiServiceType: typeof window.ApiService
            });
            
            // 尝试等待API服务初始化
            if (!this.state.apiRetryCount) {
                this.state.apiRetryCount = 0;
            }
            
            if (this.state.apiRetryCount < 3) {
                this.state.apiRetryCount++;
                
                // 延迟重试
                setTimeout(() => {
                    this.syncToDatabase(progressData, isComplete, true);
                }, 2000);
            }
            
            return;
        }
        
        if (!window.AppState?.user?.id) {
            console.warn('⚠️ 用户信息不可用，跳过数据库同步');
                hasAppState: !!window.AppState,
                hasUser: !!window.AppState?.user,
                userId: window.AppState?.user?.id,
                userObject: window.AppState?.user
            });
            
            // 尝试从localStorage恢复用户信息
            try {
                const savedUser = localStorage.getItem('user');
                if (savedUser) {
                    const user = JSON.parse(savedUser);
                    if (user && user.id) {
                        if (!window.AppState) {
                            window.AppState = {};
                        }
                        window.AppState.user = user;
                        
                        // 恢复后重试同步
                        setTimeout(() => {
                            this.syncToDatabase(progressData, isComplete, true);
                        }, 100);
                        return;
                    }
                }
            } catch (error) {
                console.error('❌ 恢复用户信息失败:', error);
            }
            
            return;
        }
        
        // 重置重试计数
        this.state.apiRetryCount = 0;

        try {
            // 异步同步，不阻塞用户操作
            const syncPromise = window.ApiService.saveConversationProgress(
                window.AppState.user.id,
                progressData
            );
            
            // 设置超时保护
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('数据库同步超时')), 8000)
            );
            
            await Promise.race([syncPromise, timeoutPromise]);
            
            this.state.lastServerSync = Date.now();
            
            // 同步成功后，清除待同步标记
            const syncKey = `sync_pending_${this.state.blockId}`;
            localStorage.removeItem(syncKey);
            
        } catch (error) {
            console.warn('数据库同步失败，数据已保存在本地缓存:', error);
            
            // 标记为待同步，网络恢复时重试
            this.markPendingSync(progressData);
        }
    }

    /**
     * 标记待同步数据
     */
    markPendingSync(progressData) {
        const syncKey = `sync_pending_${this.state.blockId}`;
        const pendingData = {
            ...progressData,
            syncTimestamp: Date.now(),
            retryCount: 0
        };
        localStorage.setItem(syncKey, JSON.stringify(pendingData));
    }
    
    /**
     * 同步待上传数据（在网络恢复时调用）
     */
    async syncPendingData() {
        const syncKey = `sync_pending_${this.state.blockId}`;
        const pendingDataStr = localStorage.getItem(syncKey);
        
        if (!pendingDataStr) return;
        
        try {
            const pendingData = JSON.parse(pendingDataStr);
            
            // 检查重试次数
            if (pendingData.retryCount >= 3) {
                console.warn('⚠️ 待同步数据重试次数已达上限，跳过同步');
                return;
            }
            
            await window.ApiService.saveConversationProgress(
                window.AppState.user.id,
                pendingData
            );
            
            // 同步成功，删除待同步标记
            localStorage.removeItem(syncKey);
            this.state.lastServerSync = Date.now();
            
        } catch (error) {
            console.error('同步待上传数据失败:', error);
            
            // 增加重试次数
            try {
                const pendingData = JSON.parse(pendingDataStr);
                pendingData.retryCount = (pendingData.retryCount || 0) + 1;
                localStorage.setItem(syncKey, JSON.stringify(pendingData));
            } catch (e) {
                console.error('更新重试次数失败:', e);
            }
        }
    }

    /**
     * 启动自动保存
     */
    startAutoSave() {
        if (!this.config.autoSave) return;
        
        this.stopAutoSave(); // 确保没有重复的定时器
        
        // 初始化自动保存状态追踪
        this.state.lastAutoSaveState = null;
        
        // 智能自动保存：本地缓存 + 数据库同步
        this.autoSaveTimer = setInterval(async () => {
            // 只在学习进行中且有进度时才保存
            if (this.state.isInitialized && 
                !this.state.isPaused && 
                this.state.currentStep > 0) {
                
                // 检查用户状态和API服务
                const hasApiService = !!window.ApiService;
                const hasUser = !!(window.AppState?.user?.id);
                const canSyncToDb = hasApiService && hasUser;
                
                // 避免重复日志：只在状态改变时才打印
                const currentState = `${canSyncToDb ? 'db' : 'local'}_${this.state.currentStep}`;
                const shouldLog = this.state.lastAutoSaveState !== currentState;
                
                if (canSyncToDb) {
                    // 强制同步到数据库（确保数据不丢失）
                    await this.saveProgress(false, true);
                    
                    if (shouldLog) {
                        this.state.lastAutoSaveState = currentState;
                    }
                } else {
                    // 只保存到本地缓存
                    await this.saveToLocalCache({
                        blockId: this.state.blockId,
                        currentStep: this.state.currentStep,
                        progress: this.state.progress,
                        completedTests: Array.from(this.state.completedTests),
                        isComplete: false,
                        lastSaveTime: new Date().toISOString()
                    });
                    
                    if (shouldLog) {
                            hasApiService,
                            hasUser,
                            userId: window.AppState?.user?.id
                        });
                        this.state.lastAutoSaveState = currentState;
                    }
                }
            }
        }, 30000); // 每30秒自动保存一次（平衡性能和安全性）
        
    }

    /**
     * 停止自动保存
     */
    stopAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
            this.autoSaveTimer = null;
        }
    }

    /**
     * 滚动到聊天区域底部
     */
    scrollToBottom() {
        if (this.elements.chatArea) {
            const scrollOptions = { behavior: 'smooth', block: 'end' };
            
            // 使用requestAnimationFrame确保DOM更新完成
            requestAnimationFrame(() => {
                const lastMessage = this.elements.chatArea.lastElementChild;
                if (lastMessage) {
                    lastMessage.scrollIntoView(scrollOptions);
                }
            });
        }
    }

    /**
     * 显示通知消息
     */
    showNotification(message, type = 'info') {
        if (window.UI && window.UI.showNotification) {
            window.UI.showNotification(message, type);
        } else {
        }
    }

    /**
     * 销毁组件
     */
    destroy() {
        try {
            // 保存最终进度
            if (this.state.isInitialized) {
                this.saveProgress();
            }
            
            // 清理定时器
            this.stopAutoSave();
            
            // 移除事件监听器
            this.eventHandlers.forEach((handler, eventType) => {
                switch (eventType) {
                    case 'keyboard':
                        document.removeEventListener('keydown', handler);
                        break;
                    case 'beforeunload':
                        window.removeEventListener('beforeunload', handler);
                        break;
                }
            });
            this.eventHandlers.clear();
            
            // 清理DOM
            if (this.elements.container) {
                this.elements.container.innerHTML = '';
            }
            
            // 重置状态
            this.state.isInitialized = false;
            this.elements = {};
            
            
        } catch (error) {
            console.error('销毁组件时出错:', error);
        }
    }

    // ==================== 工具方法 ====================

    /**
     * 创建错误处理器
     */
    createErrorHandler() {
        return {
            handleError: (message, error) => {
                console.error(`❌ ${message}:`, error);
                
                // 显示用户友好的错误消息
                const userMessage = this.getUserFriendlyErrorMessage(error);
                this.showNotification(userMessage, 'error');
                
                // 可以在这里添加错误上报逻辑
                if (this.config.errorReporting) {
                    this.reportError(message, error);
                }
            }
        };
    }

    /**
     * 获取用户友好的错误消息
     */
    getUserFriendlyErrorMessage(error) {
        if (error.message.includes('网络')) {
            return '网络连接异常，请检查网络后重试';
        } else if (error.message.includes('数据')) {
            return '数据加载失败，请刷新页面重试';
        } else if (error.message.includes('权限')) {
            return '操作权限不足，请联系管理员';
        } else {
            return '操作失败，请稍后重试';
        }
    }

    /**
     * 防抖函数
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * HTML转义
     */
    escapeHtml(text) {
        if (typeof text !== 'string') return '';
        
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * 获取当前时间字符串
     */
    getCurrentTime() {
        return new Date().toLocaleTimeString('zh-CN', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    /**
     * 静态方法：显示图片放大弹窗
     */
    static showImageModal(imgElement) {
        // 创建图片查看弹窗
        const modal = document.createElement('div');
        modal.className = 'image-modal-backdrop';
        modal.innerHTML = `
            <div class="image-modal">
                <div class="image-modal-header">
                    <button class="close-btn" onclick="this.closest('.image-modal-backdrop').remove()">×</button>
                </div>
                <div class="image-modal-content">
                    <img src="${imgElement.src}" alt="${imgElement.alt}" class="modal-image">
                </div>
            </div>
        `;
        
        // 点击背景关闭
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        document.body.appendChild(modal);
    }
}

// 全局引用，便于HTML内联事件调用
window.ConversationLearningManager = ConversationLearningManager;