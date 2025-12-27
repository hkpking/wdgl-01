/**
 * @file simple-ai-generator.js
 * @description 简化版AI内容生成器 - 一键生成统一样式的学习内容
 * @version 1.0.0
 */

import { AIService, initGlobalAIService } from '../services/ai-service.js';
import { SimpleAIPrompts } from '../config/simple-ai-prompts.js';

/**
 * 简化版AI生成器
 * 管理员只需要输入基本信息，AI自动生成标准化学习内容
 */
export class SimpleAIGenerator {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            onGenerated: null,
            onError: null,
            defaultTemplate: 'standard',
            ...options
        };
        
        this.aiService = window.AIService || initGlobalAIService();
        this.isGenerating = false;
        this.isSaving = false;
        this.generatedContent = null;
        
        this.init();
    }

    init() {
        this.render();
        this.bindEvents();
    }

    /**
     * 渲染简化的生成器界面
     */
    render() {
        this.container.innerHTML = `
            <div class="simple-ai-generator">
                <!-- 头部说明 -->
                <div class="generator-header">
                    <div class="header-icon">✨</div>
                    <div class="header-content">
                        <h3>AI智能生成学习内容</h3>
                        <p>只需提供基本信息，AI为您生成标准化的对话式学习内容</p>
                    </div>
                </div>

                <!-- 生成表单 -->
                <form class="generator-form" id="aiForm">
                    <!-- 内容标题 -->
                    <div class="form-group">
                        <label class="form-label">
                            <span class="label-icon">📝</span>
                            学习主题
                        </label>
                        <input 
                            type="text" 
                            name="title" 
                            class="form-input" 
                            placeholder="例如：BPMN网关使用指南"
                            required
                        >
                        <div class="form-hint">简洁明确的学习主题</div>
                    </div>

                    <!-- 学习目标 -->
                    <div class="form-group">
                        <label class="form-label">
                            <span class="label-icon">🎯</span>
                            学习目标
                        </label>
                        <textarea 
                            name="objectives" 
                            class="form-textarea" 
                            rows="3"
                            placeholder="学完本内容后，学员能够：&#10;1. 理解BPMN网关的基本概念&#10;2. 掌握不同类型网关的使用场景&#10;3. 能够在实际工作中正确应用"
                            required
                        ></textarea>
                        <div class="form-hint">每行一个学习目标，3-5个为宜</div>
                    </div>

                    <!-- 核心内容 -->
                    <div class="form-group">
                        <label class="form-label">
                            <span class="label-icon">📚</span>
                            核心知识点
                        </label>
                        <textarea 
                            name="content" 
                            class="form-textarea" 
                            rows="6"
                            placeholder="请按以下格式提供内容：&#10;&#10;## 什么是BPMN网关&#10;网关用于控制流程的流向...&#10;&#10;## 排他网关（XOR）&#10;排他网关只允许一个输出路径...&#10;&#10;## 实际案例&#10;在请假审批流程中..."
                            required
                        ></textarea>
                        <div class="form-hint">使用Markdown格式，## 表示知识点标题</div>
                    </div>

                    <!-- 快速模板选择 -->
                    <div class="form-group">
                        <label class="form-label">
                            <span class="label-icon">⚡</span>
                            内容类型
                        </label>
                        <div class="template-options">
                            <label class="template-option">
                                <input type="radio" name="template" value="concept" checked>
                                <div class="option-content">
                                    <div class="option-title">📖 概念学习</div>
                                    <div class="option-desc">理论知识、概念解释</div>
                                </div>
                            </label>
                            <label class="template-option">
                                <input type="radio" name="template" value="process">
                                <div class="option-content">
                                    <div class="option-title">🔄 流程指导</div>
                                    <div class="option-desc">操作步骤、流程说明</div>
                                </div>
                            </label>
                            <label class="template-option">
                                <input type="radio" name="template" value="case">
                                <div class="option-content">
                                    <div class="option-title">💡 案例分析</div>
                                    <div class="option-desc">实际案例、经验分享</div>
                                </div>
                            </label>
                        </div>
                    </div>

                    <!-- 生成选项 -->
                    <div class="form-group">
                        <label class="form-label">
                            <span class="label-icon">⚙️</span>
                            生成选项
                        </label>
                        <div class="generation-options">
                            <label class="checkbox-option">
                                <input type="checkbox" name="includeTest" checked>
                                <span class="checkmark"></span>
                                <span class="option-text">包含测试题（推荐）</span>
                            </label>
                            <label class="checkbox-option">
                                <input type="checkbox" name="includeImages" checked>
                                <span class="checkmark"></span>
                                <span class="option-text">添加配图说明</span>
                            </label>
                            <label class="checkbox-option">
                                <input type="checkbox" name="conversationalStyle" checked>
                                <span class="checkmark"></span>
                                <span class="option-text">对话式风格</span>
                            </label>
                        </div>
                    </div>

                    <!-- 生成按钮 -->
                    <div class="form-actions">
                        <button type="submit" class="generate-btn" id="generateBtn">
                            <span class="btn-icon">🚀</span>
                            <span class="btn-text">一键生成学习内容</span>
                            <span class="btn-loader hidden">⏳</span>
                        </button>
                    </div>
                </form>

                <!-- 生成状态 -->
                <div class="generation-status hidden" id="generationStatus">
                    <div class="status-content">
                        <div class="status-spinner"></div>
                        <div class="status-text">
                            <div class="status-title">AI正在创作中...</div>
                            <div class="status-steps">
                                <div class="step active" data-step="1">🧠 理解内容</div>
                                <div class="step" data-step="2">✍️ 生成对话</div>
                                <div class="step" data-step="3">🎨 优化样式</div>
                                <div class="step" data-step="4">✅ 完成</div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 生成结果 -->
                <div class="generation-result hidden" id="generationResult">
                    <div class="result-header">
                        <div class="result-icon">🎉</div>
                        <div class="result-title">生成完成！</div>
                        <div class="result-actions">
                            <button class="result-btn preview-btn" id="previewBtn">
                                👀 预览效果
                            </button>
                            <button class="result-btn apply-btn" id="applyBtn">
                                ✅ 应用到编辑器
                            </button>
                            <button class="result-btn regenerate-btn" id="regenerateBtn">
                                🔄 重新生成
                            </button>
                        </div>
                    </div>
                    <div class="result-stats" id="resultStats">
                        <!-- 生成统计信息 -->
                    </div>
                </div>

                <!-- 预览模态框 -->
                <div class="preview-modal hidden" id="previewModal">
                    <div class="modal-backdrop" id="modalBackdrop"></div>
                    <div class="modal-container">
                        <div class="modal-header">
                            <h3>📱 学习内容预览</h3>
                            <button class="modal-close" id="closePreview">×</button>
                        </div>
                        <div class="modal-body">
                            <div class="preview-container" id="previewContainer">
                                <!-- 预览内容 -->
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="modal-btn secondary" id="closePreviewBtn">关闭</button>
                            <button class="modal-btn primary" id="applyFromPreview">应用内容</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.cacheElements();
        this.addStyles();
    }

    /**
     * 缓存DOM元素
     */
    cacheElements() {
        this.elements = {
            form: this.container.querySelector('#aiForm'),
            generateBtn: this.container.querySelector('#generateBtn'),
            generationStatus: this.container.querySelector('#generationStatus'),
            generationResult: this.container.querySelector('#generationResult'),
            previewModal: this.container.querySelector('#previewModal'),
            previewContainer: this.container.querySelector('#previewContainer'),
            resultStats: this.container.querySelector('#resultStats'),
            statusSteps: this.container.querySelectorAll('.step')
        };
    }

    /**
     * 绑定事件
     */
    bindEvents() {
        // 表单提交
        this.elements.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleGenerate();
        });

        // 预览按钮
        this.container.querySelector('#previewBtn')?.addEventListener('click', () => {
            this.showPreview();
        });

        // 应用按钮
        this.container.querySelector('#applyBtn')?.addEventListener('click', () => {
            this.applyContent();
        });

        // 重新生成按钮
        this.container.querySelector('#regenerateBtn')?.addEventListener('click', () => {
            this.resetAndRegenerate();
        });

        // 关闭预览
        this.container.querySelector('#closePreview')?.addEventListener('click', () => {
            this.hidePreview();
        });

        this.container.querySelector('#closePreviewBtn')?.addEventListener('click', () => {
            this.hidePreview();
        });

        this.container.querySelector('#modalBackdrop')?.addEventListener('click', () => {
            this.hidePreview();
        });

        // 从预览应用
        this.container.querySelector('#applyFromPreview')?.addEventListener('click', () => {
            this.applyContent();
            this.hidePreview();
        });
    }

    /**
     * 处理生成请求
     */
    async handleGenerate() {
        if (this.isGenerating) return;
        
        try {
            this.isGenerating = true;
            this.showGenerationStatus();
            
            // 收集表单数据
            const formData = new FormData(this.elements.form);
            const inputData = this.collectFormData(formData);
            
            // 生成内容
            const result = await this.generateContent(inputData);
            
            // 显示结果
            this.showResult(result);
            
        } catch (error) {
            console.error('生成失败:', error);
            this.showError(error.message);
        } finally {
            this.isGenerating = false;
            this.hideGenerationStatus();
        }
    }

    /**
     * 收集表单数据
     */
    collectFormData(formData) {
        const data = {
            title: formData.get('title'),
            objectives: formData.get('objectives'),
            content: formData.get('content'),
            template: formData.get('template'),
            options: {
                includeTest: formData.has('includeTest'),
                includeImages: formData.has('includeImages'),
                conversationalStyle: formData.has('conversationalStyle')
            }
        };

        // 解析学习目标
        data.objectivesList = data.objectives.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0)
            .map(line => line.replace(/^\d+\.\s*/, ''));

        return data;
    }

    /**
     * 生成内容
     */
    async generateContent(inputData) {
        const prompt = this.buildPrompt(inputData);
        
        // 模拟生成步骤
        this.updateGenerationStep(1);
        await this.delay(1000);
        
        this.updateGenerationStep(2);
        const generatedContent = await this.aiService.generateContent(prompt, {
            temperature: 0.7,
            maxTokens: 3000
        });
        
        this.updateGenerationStep(3);
        await this.delay(500);
        
        this.updateGenerationStep(4);
        await this.delay(500);
        
        return this.parseGeneratedContent(generatedContent, inputData);
    }
    /**
     * 构建 AI提示词
     */
    buildPrompt(inputData) {
        return SimpleAIPrompts.buildPrompt(inputData);
    }

    /**
     * 解析生成的内容
     */
    parseGeneratedContent(rawContent, inputData) {
        try {
            // 清理可能的markdown代码块
            let cleanContent = rawContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            
            // 使用简化提示词的验证方法
            const validation = SimpleAIPrompts.validateResult(cleanContent);
            if (!validation.valid) {
                throw new Error(validation.error);
            }
            
            const parsed = JSON.parse(cleanContent);
            
            // 补充数据
            parsed.sourceData = inputData;
            parsed.generatedAt = new Date().toISOString();
            parsed.wordCount = this.countWords(rawContent);
            
            // 确保必需字段
            if (!parsed.totalSteps) {
                parsed.totalSteps = parsed.conversations.length;
            }
            if (!parsed.estimatedTime) {
                parsed.estimatedTime = parsed.conversations.length <= 10 ? '5-8分钟' : '10-15分钟';
            }
            
            return parsed;
        } catch (error) {
            throw new Error('AI生成的内容格式有误: ' + error.message);
        }
    }

    /**
     * 显示生成状态
     */
    showGenerationStatus() {
        this.elements.generateBtn.disabled = true;
        this.elements.generateBtn.querySelector('.btn-text').textContent = '生成中...';
        this.elements.generateBtn.querySelector('.btn-loader').classList.remove('hidden');
        this.elements.generationStatus.classList.remove('hidden');
    }

    /**
     * 隐藏生成状态
     */
    hideGenerationStatus() {
        this.elements.generateBtn.disabled = false;
        this.elements.generateBtn.querySelector('.btn-text').textContent = '一键生成学习内容';
        this.elements.generateBtn.querySelector('.btn-loader').classList.add('hidden');
        this.elements.generationStatus.classList.add('hidden');
    }

    /**
     * 更新生成步骤
     */
    updateGenerationStep(step) {
        this.elements.statusSteps.forEach((stepEl, index) => {
            if (index + 1 <= step) {
                stepEl.classList.add('active');
                if (index + 1 === step) {
                    stepEl.classList.add('current');
                } else {
                    stepEl.classList.remove('current');
                }
            } else {
                stepEl.classList.remove('active', 'current');
            }
        });
    }

    /**
     * 显示结果
     */
    showResult(result) {
        this.generatedContent = result;
        
        // 更新统计信息
        this.elements.resultStats.innerHTML = `
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-value">${result.totalSteps || result.conversations.length}</div>
                    <div class="stat-label">学习步骤</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${result.estimatedTime || '5-10分钟'}</div>
                    <div class="stat-label">预计时长</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${result.wordCount || 0}</div>
                    <div class="stat-label">字数</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${result.conversations.filter(c => c.type === 'test').length}</div>
                    <div class="stat-label">测试题</div>
                </div>
            </div>
        `;

        this.elements.generationResult.classList.remove('hidden');
    }

    /**
     * 应用内容
     */
    async applyContent() {
        if (!this.generatedContent || this.isSaving) return;
        
        try {
            // 设置保存状态
            this.isSaving = true;
            this.showSavingStatus();
            
            const htmlContent = this.convertToHTML(this.generatedContent);
            
            if (this.options.onGenerated) {
                await this.options.onGenerated({
                    html: htmlContent,
                    data: this.generatedContent
                });
            }
            
            // 显示成功状态
            this.showSaveSuccess();
            
        } catch (error) {
            console.error('保存失败:', error);
            this.showSaveError(error.message);
        } finally {
            // 重置保存状态
            this.isSaving = false;
            setTimeout(() => this.hideSavingStatus(), 2000);
        }
    }

    /**
     * 转换为HTML格式
     */
    convertToHTML(data) {
        return `<div class="conversation-learning-container">
    <div class="conversation-header">
        <h2>${data.title}</h2>
        <p>${data.description}</p>
    </div>
    
    <!-- 对话数据 -->
    <script type="application/json" data-conversation>
${JSON.stringify(data, null, 4)}
    </script>

    <!-- 对话学习组件容器 -->
    <div id="conversationContainer"></div>

    <!-- 加载对话学习组件 -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof ConversationLearning !== 'undefined') {
                const conversationScript = document.querySelector('script[data-conversation]');
                if (conversationScript) {
                    try {
                        const conversationData = JSON.parse(conversationScript.textContent);
                        new ConversationLearning({
                            containerId: 'conversationContainer',
                            blockId: 'conversation-' + Date.now(),
                            conversationData: conversationData
                        });
                    } catch (error) {
                        console.error('对话组件初始化失败:', error);
                    }
                }
            }
        });
    </script>
</div>`;
    }

    /**
     * 工具函数
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    countWords(text) {
        return text.replace(/[^\u4e00-\u9fa5]/g, '').length;
    }

    showError(message) {
        console.error('AI生成错误:', message);
        if (this.options.onError) {
            this.options.onError(message);
        }
    }

    showPreview() {
        if (!this.generatedContent) return;
        
        // 渲染预览内容
        this.elements.previewContainer.innerHTML = this.renderPreviewContent(this.generatedContent);
        this.elements.previewModal.classList.remove('hidden');
    }

    hidePreview() {
        this.elements.previewModal.classList.add('hidden');
    }

    renderPreviewContent(data) {
        return `
            <div class="conversation-preview">
                <div class="preview-header">
                    <h3>${data.title}</h3>
                    <p>${data.description}</p>
                </div>
                <div class="preview-steps">
                    ${data.conversations.map((conv, index) => `
                        <div class="preview-step" data-type="${conv.type}">
                            <div class="step-number">${index + 1}</div>
                            <div class="step-content">
                                ${this.renderStepContent(conv)}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    renderStepContent(conv) {
        switch (conv.type) {
            case 'text':
                return `<div class="text-content">${conv.content}</div>`;
            case 'image':
                return `
                    <div class="image-content">
                        <div class="image-placeholder">🖼️ ${conv.imageAlt || '图片'}</div>
                        <div class="image-caption">${conv.content}</div>
                    </div>
                `;
            case 'test':
                return `
                    <div class="test-content">
                        <div class="test-question">${conv.question}</div>
                        <div class="test-options">
                            ${conv.options.map((option, i) => `
                                <div class="test-option ${i === conv.correctAnswer ? 'correct' : ''}">
                                    ${String.fromCharCode(65 + i)}. ${option}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            default:
                return `<div class="unknown-content">${conv.content || '未知内容类型'}</div>`;
        }
    }

    resetAndRegenerate() {
        this.elements.generationResult.classList.add('hidden');
        this.generatedContent = null;
    }
    
    /**
     * 显示保存状态
     */
    showSavingStatus() {
        // 更新按钮状态
        const applyBtn = this.container.querySelector('.apply-btn');
        if (applyBtn) {
            applyBtn.disabled = true;
            applyBtn.innerHTML = '<span class="btn-loader"></span>保存中...';
        }
        
        // 显示状态消息
        this.showStatusMessage('正在保存内容...', 'saving');
    }
    
    /**
     * 显示保存成功
     */
    showSaveSuccess() {
        this.showStatusMessage('✅ 保存成功!', 'success');
    }
    
    /**
     * 显示保存错误
     */
    showSaveError(message) {
        this.showStatusMessage(`❌ 保存失败: ${message}`, 'error');
    }
    
    /**
     * 隐藏保存状态
     */
    hideSavingStatus() {
        // 重置按钮状态
        const applyBtn = this.container.querySelector('.apply-btn');
        if (applyBtn) {
            applyBtn.disabled = false;
            applyBtn.innerHTML = '应用到系统';
        }
        
        // 隐藏状态消息
        this.hideStatusMessage();
    }
    
    /**
     * 显示状态消息
     */
    showStatusMessage(message, type = 'info') {
        let statusEl = this.container.querySelector('.save-status');
        if (!statusEl) {
            statusEl = document.createElement('div');
            statusEl.className = 'save-status';
            const resultSection = this.container.querySelector('.generation-result');
            if (resultSection) {
                resultSection.appendChild(statusEl);
            }
        }
        
        statusEl.className = `save-status ${type}`;
        statusEl.textContent = message;
        statusEl.style.display = 'block';
    }
    
    /**
     * 隐藏状态消息
     */
    hideStatusMessage() {
        const statusEl = this.container.querySelector('.save-status');
        if (statusEl) {
            statusEl.style.display = 'none';
        }
    }

    /**
     * 添加样式
     */
    addStyles() {
        if (document.getElementById('simple-ai-generator-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'simple-ai-generator-styles';
        styles.textContent = `
            .simple-ai-generator {
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                max-height: calc(100vh - 120px);
                overflow-y: auto;
                position: relative;
                box-sizing: border-box;
            }
            
            /* 滚动条样式 */
            .simple-ai-generator::-webkit-scrollbar {
                width: 8px;
            }
            
            .simple-ai-generator::-webkit-scrollbar-track {
                background: #f1f5f9;
                border-radius: 4px;
            }
            
            .simple-ai-generator::-webkit-scrollbar-thumb {
                background: #cbd5e1;
                border-radius: 4px;
            }
            
            .simple-ai-generator::-webkit-scrollbar-thumb:hover {
                background: #94a3b8;
            }
            
            /* 移动端适配 */
            @media (max-width: 768px) {
                .simple-ai-generator {
                    max-width: 100%;
                    padding: 16px;
                    max-height: calc(100vh - 80px);
                }
                
                .generator-header {
                    flex-direction: column;
                    text-align: center;
                    padding: 20px;
                }
                
                .template-options {
                    grid-template-columns: 1fr;
                }
                
                .stats-grid {
                    grid-template-columns: repeat(2, 1fr);
                }
                
                .form-input, .form-textarea {
                    font-size: 16px; /* 防止移动端自动缩放 */
                }
            }

            .generator-header {
                display: flex;
                align-items: center;
                gap: 16px;
                margin-bottom: 32px;
                padding: 24px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 16px;
                color: white;
            }

            .header-icon {
                font-size: 48px;
                flex-shrink: 0;
            }

            .header-content h3 {
                margin: 0 0 8px 0;
                font-size: 24px;
                font-weight: 600;
            }

            .header-content p {
                margin: 0;
                opacity: 0.9;
                font-size: 16px;
            }

            .form-group {
                margin-bottom: 24px;
            }

            .form-label {
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 600;
                margin-bottom: 8px;
                color: #374151;
            }

            .label-icon {
                font-size: 18px;
            }

            .form-input, .form-textarea {
                width: 100%;
                padding: 12px 16px;
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                font-size: 16px;
                transition: border-color 0.2s;
            }

            .form-input:focus, .form-textarea:focus {
                outline: none;
                border-color: #667eea;
            }

            .form-hint {
                margin-top: 6px;
                font-size: 14px;
                color: #6b7280;
            }

            .template-options {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 12px;
            }

            .template-option {
                display: block;
                cursor: pointer;
            }

            .template-option input[type="radio"] {
                display: none;
            }

            .option-content {
                padding: 16px;
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                transition: all 0.2s;
            }

            .template-option input[type="radio"]:checked + .option-content {
                border-color: #667eea;
                background: #f0f4ff;
            }

            .option-title {
                font-weight: 600;
                margin-bottom: 4px;
            }

            .option-desc {
                font-size: 14px;
                color: #6b7280;
            }

            .generation-options {
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .checkbox-option {
                display: flex;
                align-items: center;
                gap: 12px;
                cursor: pointer;
                padding: 8px;
                border-radius: 8px;
                transition: background-color 0.2s;
            }

            .checkbox-option:hover {
                background: #f9fafb;
            }

            .checkmark {
                width: 20px;
                height: 20px;
                border: 2px solid #d1d5db;
                border-radius: 4px;
                position: relative;
                flex-shrink: 0;
            }

            .checkbox-option input[type="checkbox"]:checked + .checkmark {
                background: #667eea;
                border-color: #667eea;
            }

            .checkbox-option input[type="checkbox"]:checked + .checkmark::after {
                content: '✓';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: white;
                font-size: 14px;
            }

            .checkbox-option input[type="checkbox"] {
                display: none;
            }

            .generate-btn {
                width: 100%;
                padding: 16px 32px;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                border: none;
                border-radius: 12px;
                font-size: 18px;
                font-weight: 600;
                cursor: pointer;
                transition: transform 0.2s;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 12px;
            }

            .generate-btn:hover {
                transform: translateY(-2px);
            }

            .generate-btn:disabled {
                opacity: 0.7;
                cursor: not-allowed;
                transform: none;
            }

            .generation-status {
                margin-top: 24px;
                padding: 24px;
                background: #f0f4ff;
                border-radius: 16px;
                text-align: center;
            }

            .status-spinner {
                width: 40px;
                height: 40px;
                border: 4px solid #e5e7eb;
                border-top: 4px solid #667eea;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 16px;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .status-steps {
                display: flex;
                justify-content: center;
                gap: 16px;
                margin-top: 16px;
            }

            .step {
                padding: 8px 16px;
                background: #e5e7eb;
                border-radius: 20px;
                font-size: 14px;
                opacity: 0.5;
                transition: all 0.3s;
            }

            .step.active {
                background: #667eea;
                color: white;
                opacity: 1;
            }

            .generation-result {
                margin-top: 24px;
                padding: 24px;
                background: #f0fdf4;
                border-radius: 16px;
            }

            .result-header {
                display: flex;
                align-items: center;
                gap: 16px;
                margin-bottom: 16px;
            }

            .result-icon {
                font-size: 32px;
            }

            .result-title {
                font-size: 20px;
                font-weight: 600;
                color: #065f46;
            }

            .result-actions {
                display: flex;
                gap: 8px;
                margin-left: auto;
            }

            .result-btn {
                padding: 8px 16px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.2s;
            }

            .preview-btn {
                background: #e0e7ff;
                color: #3730a3;
            }

            .apply-btn {
                background: #dcfce7;
                color: #14532d;
            }

            .regenerate-btn {
                background: #fef3c7;
                color: #92400e;
            }

            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                gap: 16px;
            }

            .stat-item {
                text-align: center;
                padding: 16px;
                background: white;
                border-radius: 12px;
            }

            .stat-value {
                font-size: 24px;
                font-weight: 700;
                color: #059669;
            }

            .stat-label {
                font-size: 14px;
                color: #6b7280;
                margin-top: 4px;
            }

            .preview-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .modal-backdrop {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
            }

            .modal-container {
                position: relative;
                background: white;
                border-radius: 16px;
                width: 90%;
                max-width: 800px;
                max-height: 90%;
                display: flex;
                flex-direction: column;
            }

            .modal-header {
                padding: 20px;
                border-bottom: 1px solid #e5e7eb;
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            .modal-close {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                padding: 4px;
            }

            .modal-body {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
            }

            .modal-footer {
                padding: 20px;
                border-top: 1px solid #e5e7eb;
                display: flex;
                justify-content: flex-end;
                gap: 12px;
            }

            .modal-btn {
                padding: 8px 16px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
            }

            .modal-btn.secondary {
                background: #f3f4f6;
                color: #374151;
            }

            .modal-btn.primary {
                background: #667eea;
                color: white;
            }

            .save-status {
                margin-top: 16px;
                padding: 12px 20px;
                border-radius: 8px;
                text-align: center;
                font-weight: 500;
                display: none;
                animation: fadeIn 0.3s ease-in-out;
            }
            
            .save-status.saving {
                background: #e0f2fe;
                color: #01579b;
                border: 1px solid #81d4fa;
            }
            
            .save-status.success {
                background: #e8f5e8;
                color: #2e7d32;
                border: 1px solid #4caf50;
            }
            
            .save-status.error {
                background: #ffebee;
                color: #c62828;
                border: 1px solid #f44336;
            }
            
            .btn-loader {
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid #ffffff;
                border-radius: 50%;
                border-top-color: transparent;
                animation: spin 1s ease-in-out infinite;
                margin-right: 8px;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .hidden {
                display: none !important;
            }
        `;
        
        document.head.appendChild(styles);
    }
}

export default SimpleAIGenerator;