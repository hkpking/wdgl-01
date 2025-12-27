/**
 * @file conversation-ai-generator.js
 * @description AI驱动的对话式学习内容生成组件
 * @version 1.0.0
 */

import { AIPromptTemplates, AIGeneratorConfig } from '../config/ai-prompts.js';

/**
 * AI对话生成器组件
 */
export class ConversationAIGenerator {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            onGenerate: null,
            onError: null,
            onInsert: null,
            ...options
        };

        this.state = {
            isGenerating: false,
            currentTemplate: null,
            lastGenerated: null
        };

        this.init();
    }

    /**
     * 初始化组件
     */
    init() {
        this.render();
        this.bindEvents();
    }

    /**
     * 渲染UI
     */
    render() {
        const templatesHTML = Object.entries(AIPromptTemplates.QUICK_TEMPLATES)
            .map(([key, template]) => `
                <option value="${key}">${template.name}</option>
            `).join('');

        this.container.innerHTML = `
            <div class="ai-generator-panel">
                <!-- 头部 -->
                <div class="ai-generator-header">
                    <h3 class="ai-generator-title">
                        <span class="icon">🤖</span>
                        AI对话生成器
                    </h3>
                    <p class="ai-generator-subtitle">用自然语言描述，AI自动生成规范的对话式学习内容</p>
                </div>

                <!-- 快速模板 -->
                <div class="ai-form-group">
                    <label class="ai-label">
                        <span class="label-icon">⚡</span>
                        快速模板
                    </label>
                    <select id="aiTemplateSelect" class="ai-select">
                        <option value="">自定义主题</option>
                        ${templatesHTML}
                    </select>
                    <p class="ai-hint">选择预设模板快速开始，或自定义主题</p>
                </div>

                <!-- 学习主题 -->
                <div class="ai-form-group">
                    <label class="ai-label">
                        <span class="label-icon">📚</span>
                        学习主题
                        <span class="required">*</span>
                    </label>
                    <input 
                        type="text" 
                        id="aiTopicInput" 
                        class="ai-input" 
                        placeholder="例如：BPMN网关详解、流程优化方法"
                        required
                    >
                </div>

                <!-- 知识点列表 -->
                <div class="ai-form-group">
                    <label class="ai-label">
                        <span class="label-icon">📝</span>
                        知识点列表
                        <span class="required">*</span>
                    </label>
                    <textarea 
                        id="aiKeyPointsInput" 
                        class="ai-textarea" 
                        rows="5"
                        placeholder="每行一个知识点，例如：&#10;1. 什么是BPMN网关&#10;2. 排他网关的使用场景&#10;3. 并行网关vs包容网关&#10;4. 实际案例分析"
                    ></textarea>
                    <p class="ai-hint">每行输入一个知识点，建议3-6个</p>
                </div>

                <!-- 高级选项 -->
                <div class="ai-advanced-options">
                    <button type="button" class="ai-toggle-btn" id="toggleAdvanced">
                        <span class="toggle-icon">▶</span>
                        高级选项
                    </button>
                    <div class="ai-advanced-content" id="advancedContent" style="display: none;">
                        <div class="ai-form-row">
                            <div class="ai-form-col">
                                <label class="ai-label">测试题数量</label>
                                <input 
                                    type="number" 
                                    id="aiTestCount" 
                                    class="ai-input-sm" 
                                    value="2" 
                                    min="0" 
                                    max="5"
                                >
                            </div>
                            <div class="ai-form-col">
                                <label class="ai-label">
                                    <input 
                                        type="checkbox" 
                                        id="aiIncludeImages" 
                                        checked
                                    >
                                    包含配图说明
                                </label>
                            </div>
                        </div>
                        <div class="ai-form-group">
                            <label class="ai-label">特殊要求</label>
                            <textarea 
                                id="aiSpecialRequirements" 
                                class="ai-textarea" 
                                rows="2"
                                placeholder="例如：语气要更专业、增加实际案例、避免使用专业术语"
                            ></textarea>
                        </div>
                    </div>
                </div>

                <!-- 生成按钮 -->
                <div class="ai-actions">
                    <button type="button" class="ai-btn ai-btn-primary" id="generateBtn">
                        <span class="btn-icon">✨</span>
                        <span class="btn-text">AI生成对话</span>
                    </button>
                    <button type="button" class="ai-btn ai-btn-secondary" id="viewExampleBtn">
                        <span class="btn-icon">👁️</span>
                        查看示例
                    </button>
                </div>

                <!-- 生成状态 -->
                <div class="ai-status" id="generatorStatus" style="display: none;">
                    <div class="status-content">
                        <div class="loading-spinner"></div>
                        <p class="status-text">AI正在生成内容，请稍候...</p>
                    </div>
                </div>

                <!-- 结果预览 -->
                <div class="ai-result-panel" id="resultPanel" style="display: none;">
                    <div class="result-header">
                        <h4 class="result-title">
                            <span class="icon">✅</span>
                            生成结果
                        </h4>
                        <div class="result-actions">
                            <button type="button" class="result-btn" id="editResultBtn" title="编辑">
                                <span>✏️</span>
                            </button>
                            <button type="button" class="result-btn" id="copyResultBtn" title="复制">
                                <span>📋</span>
                            </button>
                            <button type="button" class="result-btn" id="insertResultBtn" title="插入到编辑器">
                                <span>➕</span>
                            </button>
                        </div>
                    </div>
                    <div class="result-info" id="resultInfo"></div>
                    <div class="result-preview" id="resultPreview">
                        <pre><code id="resultCode"></code></pre>
                    </div>
                </div>
            </div>
        `;

        this.cacheElements();
    }

    /**
     * 缓存DOM元素
     */
    cacheElements() {
        this.elements = {
            templateSelect: this.container.querySelector('#aiTemplateSelect'),
            topicInput: this.container.querySelector('#aiTopicInput'),
            keyPointsInput: this.container.querySelector('#aiKeyPointsInput'),
            testCountInput: this.container.querySelector('#aiTestCount'),
            includeImagesCheckbox: this.container.querySelector('#aiIncludeImages'),
            specialRequirementsInput: this.container.querySelector('#aiSpecialRequirements'),
            
            toggleAdvancedBtn: this.container.querySelector('#toggleAdvanced'),
            advancedContent: this.container.querySelector('#advancedContent'),
            
            generateBtn: this.container.querySelector('#generateBtn'),
            viewExampleBtn: this.container.querySelector('#viewExampleBtn'),
            
            statusPanel: this.container.querySelector('#generatorStatus'),
            resultPanel: this.container.querySelector('#resultPanel'),
            resultInfo: this.container.querySelector('#resultInfo'),
            resultCode: this.container.querySelector('#resultCode'),
            
            editResultBtn: this.container.querySelector('#editResultBtn'),
            copyResultBtn: this.container.querySelector('#copyResultBtn'),
            insertResultBtn: this.container.querySelector('#insertResultBtn')
        };
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        // 模板选择
        this.elements.templateSelect.addEventListener('change', (e) => {
            this.handleTemplateChange(e.target.value);
        });

        // 高级选项切换
        this.elements.toggleAdvancedBtn.addEventListener('click', () => {
            this.toggleAdvancedOptions();
        });

        // 生成按钮
        this.elements.generateBtn.addEventListener('click', () => {
            this.handleGenerate();
        });

        // 查看示例
        this.elements.viewExampleBtn.addEventListener('click', () => {
            this.showExample();
        });

        // 结果操作按钮
        this.elements.editResultBtn?.addEventListener('click', () => {
            this.editResult();
        });

        this.elements.copyResultBtn?.addEventListener('click', () => {
            this.copyResult();
        });

        this.elements.insertResultBtn?.addEventListener('click', () => {
            this.insertResult();
        });
    }

    /**
     * 处理模板选择
     */
    handleTemplateChange(templateKey) {
        if (!templateKey) {
            this.clearForm();
            return;
        }

        const template = AIPromptTemplates.QUICK_TEMPLATES[templateKey];
        if (!template) return;

        this.elements.topicInput.value = template.name;
        this.elements.keyPointsInput.value = template.defaultKeyPoints
            .map((point, index) => `${index + 1}. ${point}`)
            .join('\n');
        this.elements.testCountInput.value = template.testCount;
        this.elements.includeImagesCheckbox.checked = template.includeImages;

        this.state.currentTemplate = templateKey;
    }

    /**
     * 切换高级选项
     */
    toggleAdvancedOptions() {
        const content = this.elements.advancedContent;
        const icon = this.elements.toggleAdvancedBtn.querySelector('.toggle-icon');
        const isHidden = content.style.display === 'none';

        content.style.display = isHidden ? 'block' : 'none';
        icon.textContent = isHidden ? '▼' : '▶';
    }

    /**
     * 处理生成请求
     */
    async handleGenerate() {
        // 验证输入
        const validation = this.validateInput();
        if (!validation.valid) {
            this.showError(validation.message);
            return;
        }

        // 收集用户输入
        const userInput = this.collectUserInput();

        // 显示生成状态
        this.showGenerating();

        try {
            // 生成对话内容
            const result = await this.generateConversation(userInput);

            // 验证结果
            const validation = AIPromptTemplates.validateConversationJSON(result);
            if (!validation.valid) {
                throw new Error('生成的内容格式不正确：' + validation.errors.join(', '));
            }

            // 保存结果
            this.state.lastGenerated = result;

            // 显示结果
            this.showResult(result);

            // 回调
            if (this.options.onGenerate) {
                this.options.onGenerate(result);
            }


        } catch (error) {
            this.showError('生成失败：' + error.message);
            
            if (this.options.onError) {
                this.options.onError(error);
            }

            console.error('❌ 生成失败:', error);
        }
    }

    /**
     * 验证用户输入
     */
    validateInput() {
        const topic = this.elements.topicInput.value.trim();
        const keyPoints = this.elements.keyPointsInput.value.trim();

        if (!topic) {
            return { valid: false, message: '请输入学习主题' };
        }

        if (!keyPoints) {
            return { valid: false, message: '请输入知识点列表' };
        }

        const keyPointsList = this.parseKeyPoints(keyPoints);
        if (keyPointsList.length === 0) {
            return { valid: false, message: '至少需要1个知识点' };
        }

        if (keyPointsList.length > 10) {
            return { valid: false, message: '知识点不要超过10个' };
        }

        return { valid: true };
    }

    /**
     * 收集用户输入
     */
    collectUserInput() {
        return {
            topic: this.elements.topicInput.value.trim(),
            keyPoints: this.parseKeyPoints(this.elements.keyPointsInput.value),
            testCount: parseInt(this.elements.testCountInput.value) || 2,
            includeImages: this.elements.includeImagesCheckbox.checked,
            specialRequirements: this.elements.specialRequirementsInput.value.trim()
        };
    }

    /**
     * 解析知识点列表
     */
    parseKeyPoints(text) {
        return text.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => line.replace(/^\d+[\.\、]\s*/, '')); // 移除序号
    }

    /**
     * 生成对话内容
     */
    async generateConversation(userInput) {
        // 生成prompt
        const prompt = AIPromptTemplates.generatePrompt(userInput);

        // 调用AI服务
        // 这里需要根据实际使用的AI服务进行调整
        // 示例：使用自定义API
        if (window.AIService && typeof window.AIService.generateContent === 'function') {
            const response = await window.AIService.generateContent(prompt, {
                temperature: AIGeneratorConfig.temperature,
                maxTokens: AIGeneratorConfig.maxTokens
            });
            return JSON.parse(response);
        }

        // 如果没有配置AI服务，使用模拟生成（开发测试用）
        console.warn('⚠️ 未配置AI服务，使用模拟数据');
        return this.mockGenerate(userInput);
    }

    /**
     * 模拟生成（用于开发测试）
     */
    mockGenerate(userInput) {
        // 模拟API延迟
        return new Promise((resolve) => {
            setTimeout(() => {
                const conversations = [];
                let id = 1;

                // 生成开场白
                conversations.push({
                    id: id++,
                    type: 'text',
                    content: `你好！今天我们来学习${userInput.topic}。`,
                    points: 2
                });

                // 根据知识点生成对话
                userInput.keyPoints.forEach((point, index) => {
                    conversations.push({
                        id: id++,
                        type: 'text',
                        content: point,
                        points: 2
                    });

                    // 添加图片说明
                    if (userInput.includeImages && index % 2 === 0) {
                        conversations.push({
                            id: id++,
                            type: 'image',
                            content: `让我们看看${point}的示意图：`,
                            imageUrl: `/assets/images/${userInput.topic.replace(/\s+/g, '-').toLowerCase()}-${index + 1}.png`,
                            imageAlt: `${point}示意图`,
                            points: 3
                        });
                    }

                    // 插入测试题
                    if ((index + 1) % Math.ceil(userInput.keyPoints.length / userInput.testCount) === 0 && 
                        conversations.filter(c => c.type === 'test').length < userInput.testCount) {
                        conversations.push({
                            id: id++,
                            type: 'test',
                            content: '来做个小测试！',
                            question: `关于${point}，以下说法正确的是？`,
                            options: [
                                '选项A（示例）',
                                '选项B（示例）',
                                '选项C（示例）',
                                '选项D（正确答案）'
                            ],
                            correctAnswer: 3,
                            explanation: `这是关于${point}的详细解释。在实际应用中，我们需要注意...`,
                            points: 5
                        });
                    }
                });

                // 生成总结
                conversations.push({
                    id: id++,
                    type: 'text',
                    content: `很好！你已经掌握了${userInput.topic}的核心要点。`,
                    points: 2
                });

                resolve({
                    title: userInput.topic,
                    description: `深入学习${userInput.topic}的核心概念和实践应用`,
                    conversations: conversations
                });
            }, 2000);
        });
    }

    /**
     * 显示生成中状态
     */
    showGenerating() {
        this.state.isGenerating = true;
        this.elements.generateBtn.disabled = true;
        this.elements.statusPanel.style.display = 'block';
        this.elements.resultPanel.style.display = 'none';
    }

    /**
     * 显示生成结果
     */
    showResult(result) {
        this.state.isGenerating = false;
        this.elements.generateBtn.disabled = false;
        this.elements.statusPanel.style.display = 'none';
        this.elements.resultPanel.style.display = 'block';

        // 显示结果信息
        const conversationCount = result.conversations.length;
        const testCount = result.conversations.filter(c => c.type === 'test').length;

        this.elements.resultInfo.innerHTML = `
            <div class="result-stats">
                <span class="stat-item">📝 ${conversationCount}个对话</span>
                <span class="stat-item">📊 ${testCount}个测试</span>
            </div>
        `;

        // 显示JSON代码
        const jsonString = JSON.stringify(result, null, 2);
        this.elements.resultCode.textContent = jsonString;

        // 滚动到结果区域
        this.elements.resultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    /**
     * 显示错误
     */
    showError(message) {
        this.state.isGenerating = false;
        this.elements.generateBtn.disabled = false;
        this.elements.statusPanel.style.display = 'none';

        // 使用系统通知
        if (window.UI && window.UI.showNotification) {
            window.UI.showNotification(message, 'error');
        } else {
            alert(message);
        }
    }

    /**
     * 显示示例
     */
    showExample() {
        const example = AIPromptTemplates.EXAMPLE_OUTPUT;
        this.state.lastGenerated = example;
        this.showResult(example);
    }

    /**
     * 编辑结果
     */
    editResult() {
        if (!this.state.lastGenerated) return;

        const jsonString = JSON.stringify(this.state.lastGenerated, null, 2);
        const newJson = prompt('编辑JSON内容：', jsonString);

        if (newJson) {
            try {
                const parsed = JSON.parse(newJson);
                this.state.lastGenerated = parsed;
                this.showResult(parsed);
            } catch (error) {
                this.showError('JSON格式错误：' + error.message);
            }
        }
    }

    /**
     * 复制结果
     */
    async copyResult() {
        if (!this.state.lastGenerated) return;

        const jsonString = JSON.stringify(this.state.lastGenerated, null, 2);

        try {
            await navigator.clipboard.writeText(jsonString);
            
            if (window.UI && window.UI.showNotification) {
                window.UI.showNotification('已复制到剪贴板', 'success');
            } else {
                alert('已复制到剪贴板');
            }
        } catch (error) {
            // 降级方案
            const textArea = document.createElement('textarea');
            textArea.value = jsonString;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            
            alert('已复制到剪贴板');
        }
    }

    /**
     * 插入结果到编辑器
     */
    insertResult() {
        if (!this.state.lastGenerated) return;

        // 生成完整的HTML结构
        const jsonString = JSON.stringify(this.state.lastGenerated, null, 2);
        const htmlContent = `<script type="application/json" data-conversation>
${jsonString}
</script>

<!-- 对话学习内容将在此处自动渲染 -->
<div class="conversation-learning-container">
    <p>正在加载对话学习内容...</p>
</div>`;

        // 回调通知父组件
        if (this.options.onInsert) {
            this.options.onInsert(htmlContent);
        }

        if (window.UI && window.UI.showNotification) {
            window.UI.showNotification('已插入到编辑器', 'success');
        }
    }

    /**
     * 清空表单
     */
    clearForm() {
        this.elements.topicInput.value = '';
        this.elements.keyPointsInput.value = '';
        this.elements.testCountInput.value = '2';
        this.elements.includeImagesCheckbox.checked = true;
        this.elements.specialRequirementsInput.value = '';
        this.state.currentTemplate = null;
    }

    /**
     * 获取最后生成的结果
     */
    getLastResult() {
        return this.state.lastGenerated;
    }

    /**
     * 销毁组件
     */
    destroy() {
        this.container.innerHTML = '';
        this.state = null;
        this.elements = null;
    }
}

