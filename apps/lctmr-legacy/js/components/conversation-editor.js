/**
 * @file conversation-editor.js
 * @description 后台对话内容可视化编辑器
 * @version 1.0.0
 * @author LCTMR Team
 */

/**
 * 对话编辑器组件 - 用于后台管理创建和编辑对话式学习内容
 */
class ConversationEditor {
    constructor(options = {}) {
        // 兼容旧/新两种调用方式：
        // - new ConversationEditor({ containerId, ... })
        // - new ConversationEditor(containerElement, { ... })
        if (options instanceof HTMLElement) {
            this.container = options;
            options = arguments[1] || {};
        } else {
            const containerId = options.containerId || 'conversationEditorContainer';
            this.container = document.getElementById(containerId);
        }
        this.options = {
            autoPreview: true,
            maxSteps: 50,
            defaultPointsPerStep: 2,
            testPointsBonus: 5,
            ...options
        };

        // 对话数据
        this.conversationData = {
            title: '',
            description: '',
            conversations: []
        };

        // 当前编辑的对话ID
        this.currentEditingId = null;

        // 拖拽相关状态
        this.dragState = {
            isDragging: false,
            draggedElement: null,
            draggedIndex: -1
        };

        // 初始化编辑器
        this.init();
    }

    /**
     * 初始化编辑器
     */
    init() {
        this.createEditorUI();
        this.bindEvents();
        this.loadTemplate();
    }

    /**
     * 创建编辑器UI
     */
    createEditorUI() {
        const editorHTML = `
            <div class="conversation-editor-wrapper">
                <!-- 工具栏 -->
                <div class="editor-toolbar">
                    <div class="toolbar-left">
                        <h3 class="editor-title">🎯 对话内容编辑器</h3>
                        <button class="btn-secondary" id="loadTemplate">
                            📋 加载模板
                        </button>
                        <button class="btn-secondary" id="saveTemplate">
                            💾 保存模板
                        </button>
                    </div>
                    <div class="toolbar-right">
                        <button class="btn-primary" id="previewConversation">
                            👀 预览对话
                        </button>
                        <button class="btn-success" id="saveConversation">
                            ✅ 保存内容
                        </button>
                    </div>
                </div>

                <!-- 主编辑区域 -->
                <div class="editor-main">
                    <!-- 左侧：对话列表编辑 -->
                    <div class="editor-left">
                        <!-- 基本信息 -->
                        <div class="section-card">
                            <h4 class="section-title">📝 基本信息</h4>
                            <div class="form-group">
                                <label>标题</label>
                                <input type="text" id="conversationTitle" 
                                       placeholder="输入对话学习标题" 
                                       class="form-input">
                            </div>
                            <div class="form-group">
                                <label>描述</label>
                                <textarea id="conversationDescription" 
                                         placeholder="简短描述学习内容"
                                         rows="2" class="form-textarea"></textarea>
                            </div>
                        </div>

                        <!-- 对话步骤列表 -->
                        <div class="section-card">
                            <div class="section-header">
                                <h4 class="section-title">💬 对话步骤</h4>
                                <div class="step-controls">
                                    <span class="step-counter">共 <strong id="stepCount">0</strong> 步</span>
                                    <button class="btn-add" id="addTextStep">+ 文本</button>
                                    <button class="btn-add" id="addImageStep">+ 图片</button>
                                    <button class="btn-add" id="addTestStep">+ 测试</button>
                                </div>
                            </div>
                            
                            <div class="conversation-steps" id="conversationSteps">
                                <div class="empty-state">
                                    <div class="empty-icon">📝</div>
                                    <p>还没有对话步骤</p>
                                    <p class="empty-hint">点击上方按钮添加文本、图片或测试内容</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- 右侧：当前步骤编辑 -->
                    <div class="editor-right">
                        <div class="section-card">
                            <h4 class="section-title">⚙️ 步骤编辑</h4>
                            <div id="stepEditor">
                                <div class="no-selection">
                                    <div class="no-selection-icon">👈</div>
                                    <p>请从左侧选择一个对话步骤进行编辑</p>
                                </div>
                            </div>
                        </div>

                        <!-- 预览区域 -->
                        <div class="section-card">
                            <h4 class="section-title">👀 实时预览</h4>
                            <div id="conversationPreview" class="preview-container">
                                <div class="preview-placeholder">
                                    <div class="preview-icon">🎭</div>
                                    <p>保存后可在此预览对话效果</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 对话步骤模板 -->
            <template id="textStepTemplate">
                <div class="step-item" data-type="text">
                    <div class="step-header">
                        <div class="step-icon text-icon">💬</div>
                        <div class="step-info">
                            <div class="step-title">文本对话</div>
                            <div class="step-summary"></div>
                        </div>
                        <div class="step-controls">
                            <button class="btn-icon edit-step" title="编辑">✏️</button>
                            <button class="btn-icon duplicate-step" title="复制">📋</button>
                            <button class="btn-icon delete-step" title="删除">🗑️</button>
                            <div class="drag-handle" title="拖拽排序">⋮⋮</div>
                        </div>
                    </div>
                </div>
            </template>

            <template id="imageStepTemplate">
                <div class="step-item" data-type="image">
                    <div class="step-header">
                        <div class="step-icon image-icon">🖼️</div>
                        <div class="step-info">
                            <div class="step-title">图片对话</div>
                            <div class="step-summary"></div>
                        </div>
                        <div class="step-controls">
                            <button class="btn-icon edit-step" title="编辑">✏️</button>
                            <button class="btn-icon duplicate-step" title="复制">📋</button>
                            <button class="btn-icon delete-step" title="删除">🗑️</button>
                            <div class="drag-handle" title="拖拽排序">⋮⋮</div>
                        </div>
                    </div>
                </div>
            </template>

            <template id="testStepTemplate">
                <div class="step-item" data-type="test">
                    <div class="step-header">
                        <div class="step-icon test-icon">📝</div>
                        <div class="step-info">
                            <div class="step-title">测试题</div>
                            <div class="step-summary"></div>
                        </div>
                        <div class="step-controls">
                            <button class="btn-icon edit-step" title="编辑">✏️</button>
                            <button class="btn-icon duplicate-step" title="复制">📋</button>
                            <button class="btn-icon delete-step" title="删除">🗑️</button>
                            <div class="drag-handle" title="拖拽排序">⋮⋮</div>
                        </div>
                    </div>
                </div>
            </template>
        `;

        if (!this.container) {
            throw new Error('ConversationEditor: container not found.');
        }
        this.container.innerHTML = editorHTML;

        // 获取DOM引用
        this.elements = {
            title: this.container.querySelector('#conversationTitle'),
            description: this.container.querySelector('#conversationDescription'),
            stepsList: this.container.querySelector('#conversationSteps'),
            stepEditor: this.container.querySelector('#stepEditor'),
            preview: this.container.querySelector('#conversationPreview'),
            stepCount: this.container.querySelector('#stepCount'),
            
            // 按钮
            addTextBtn: this.container.querySelector('#addTextStep'),
            addImageBtn: this.container.querySelector('#addImageStep'),
            addTestBtn: this.container.querySelector('#addTestStep'),
            saveBtn: this.container.querySelector('#saveConversation'),
            previewBtn: this.container.querySelector('#previewConversation'),
            loadTemplateBtn: this.container.querySelector('#loadTemplate'),
            saveTemplateBtn: this.container.querySelector('#saveTemplate')
        };
    }

    /**
     * 绑定事件处理器
     */
    bindEvents() {
        // 基本信息变更
        this.elements.title.addEventListener('input', (e) => {
            this.conversationData.title = e.target.value;
            this.updatePreview();
        });

        this.elements.description.addEventListener('input', (e) => {
            this.conversationData.description = e.target.value;
        });

        // 添加步骤按钮
        this.elements.addTextBtn.addEventListener('click', () => this.addStep('text'));
        this.elements.addImageBtn.addEventListener('click', () => this.addStep('image'));
        this.elements.addTestBtn.addEventListener('click', () => this.addStep('test'));

        // 保存和预览
        this.elements.saveBtn.addEventListener('click', () => this.saveConversation());
        this.elements.previewBtn.addEventListener('click', () => this.showPreview());

        // 模板管理
        this.elements.loadTemplateBtn.addEventListener('click', () => this.showTemplateSelector());
        this.elements.saveTemplateBtn.addEventListener('click', () => this.saveAsTemplate());

        // 步骤列表事件委托
        this.elements.stepsList.addEventListener('click', (e) => {
            this.handleStepAction(e);
        });

        // 拖拽排序
        this.initDragAndDrop();
    }

    /**
     * 添加对话步骤
     */
    addStep(type, data = null) {
        const id = Date.now() + Math.random();
        
        let stepData = {
            id,
            type,
            points: this.options.defaultPointsPerStep
        };

        switch (type) {
            case 'text':
                stepData = {
                    ...stepData,
                    content: data?.content || '新的文本对话...'
                };
                break;
            
            case 'image':
                stepData = {
                    ...stepData,
                    content: data?.content || '配图说明文字...',
                    imageUrl: data?.imageUrl || '',
                    imageAlt: data?.imageAlt || '图片描述',
                    points: 3
                };
                break;
            
            case 'test':
                stepData = {
                    ...stepData,
                    content: data?.content || '来做个小测试！',
                    question: data?.question || '测试问题...',
                    options: data?.options || ['选项A', '选项B', '选项C', '选项D'],
                    correctAnswer: data?.correctAnswer || 0,
                    explanation: data?.explanation || '答案解释...',
                    points: this.options.testPointsBonus
                };
                break;
        }

        this.conversationData.conversations.push(stepData);
        this.renderStepsList();
        this.updateStepNumbers();
        
        // 自动选中新添加的步骤
        this.selectStep(id);
        
    }

    /**
     * 渲染步骤列表
     */
    renderStepsList() {
        const conversations = this.conversationData.conversations;
        
        if (conversations.length === 0) {
            this.elements.stepsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📝</div>
                    <p>还没有对话步骤</p>
                    <p class="empty-hint">点击上方按钮添加文本、图片或测试内容</p>
                </div>
            `;
            return;
        }

        this.elements.stepsList.innerHTML = conversations.map((conv, index) => {
            return this.createStepElement(conv, index);
        }).join('');

        this.updateStepCount();
    }

    /**
     * 创建步骤元素
     */
    createStepElement(conversation, index) {
        const { id, type, content, question } = conversation;
        const stepNumber = index + 1;
        
        let icon, title, summary;
        
        switch (type) {
            case 'text':
                icon = '💬';
                title = '文本对话';
                summary = content.substring(0, 30) + (content.length > 30 ? '...' : '');
                break;
            case 'image':
                icon = '🖼️';
                title = '图片对话';
                summary = content.substring(0, 30) + (content.length > 30 ? '...' : '');
                break;
            case 'test':
                icon = '📝';
                title = '测试题';
                summary = question?.substring(0, 30) + (question?.length > 30 ? '...' : '') || '测试问题...';
                break;
            default:
                icon = '❓';
                title = '未知类型';
                summary = '无法识别的步骤类型';
        }

        return `
            <div class="step-item ${this.currentEditingId === id ? 'active' : ''}" 
                 data-type="${type}" data-id="${id}" data-index="${index}">
                <div class="step-header">
                    <div class="step-number">${stepNumber}</div>
                    <div class="step-icon ${type}-icon">${icon}</div>
                    <div class="step-info">
                        <div class="step-title">${title}</div>
                        <div class="step-summary">${this.escapeHtml(summary)}</div>
                        <div class="step-meta">${conversation.points} 积分</div>
                    </div>
                    <div class="step-controls">
                        <button class="btn-icon edit-step" title="编辑" data-action="edit" data-id="${id}">✏️</button>
                        <button class="btn-icon duplicate-step" title="复制" data-action="duplicate" data-id="${id}">📋</button>
                        <button class="btn-icon delete-step" title="删除" data-action="delete" data-id="${id}">🗑️</button>
                        <div class="drag-handle" title="拖拽排序">⋮⋮</div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * 处理步骤操作
     */
    handleStepAction(e) {
        const action = e.target.dataset.action;
        const stepId = e.target.dataset.id;
        
        if (!action || !stepId) {
            // 如果点击的是步骤本身（非按钮），则选中该步骤
            const stepElement = e.target.closest('.step-item');
            if (stepElement) {
                const id = parseInt(stepElement.dataset.id);
                this.selectStep(id);
            }
            return;
        }

        const stepData = this.conversationData.conversations.find(conv => conv.id == stepId);
        if (!stepData) return;

        switch (action) {
            case 'edit':
                this.selectStep(parseInt(stepId));
                break;
            case 'duplicate':
                this.duplicateStep(stepData);
                break;
            case 'delete':
                this.deleteStep(parseInt(stepId));
                break;
        }
    }

    /**
     * 选中步骤进行编辑
     */
    selectStep(stepId) {
        this.currentEditingId = stepId;
        const stepData = this.conversationData.conversations.find(conv => conv.id === stepId);
        
        if (!stepData) return;

        // 更新步骤列表的选中状态
        this.elements.stepsList.querySelectorAll('.step-item').forEach(item => {
            item.classList.toggle('active', item.dataset.id == stepId);
        });

        // 渲染步骤编辑器
        this.renderStepEditor(stepData);
    }

    /**
     * 渲染步骤编辑器
     */
    renderStepEditor(stepData) {
        const { id, type } = stepData;
        
        let editorHTML = '';
        
        switch (type) {
            case 'text':
                editorHTML = this.createTextStepEditor(stepData);
                break;
            case 'image':
                editorHTML = this.createImageStepEditor(stepData);
                break;
            case 'test':
                editorHTML = this.createTestStepEditor(stepData);
                break;
        }

        this.elements.stepEditor.innerHTML = editorHTML;
        this.bindStepEditorEvents(stepData);
    }

    /**
     * 创建文本步骤编辑器
     */
    createTextStepEditor(stepData) {
        return `
            <div class="step-editor text-step-editor">
                <div class="editor-header">
                    <h5>💬 编辑文本对话</h5>
                </div>
                
                <div class="form-group">
                    <label>内容 *</label>
                    <textarea class="form-textarea" rows="4" 
                              placeholder="输入对话内容..."
                              data-field="content">${this.escapeHtml(stepData.content)}</textarea>
                </div>
                
                
                <div class="editor-actions">
                    <button class="btn-primary" onclick="conversationEditor.updateStep(${stepData.id})">
                        保存修改
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * 创建图片步骤编辑器
     */
    createImageStepEditor(stepData) {
        return `
            <div class="step-editor image-step-editor">
                <div class="editor-header">
                    <h5>🖼️ 编辑图片对话</h5>
                </div>
                
                <div class="form-group">
                    <label>描述文字 *</label>
                    <textarea class="form-textarea" rows="3"
                              placeholder="图片的描述文字..."
                              data-field="content">${this.escapeHtml(stepData.content)}</textarea>
                </div>
                
                <div class="form-group">
                    <label>图片URL *</label>
                    <input type="url" class="form-input"
                           placeholder="https://example.com/image.png"
                           value="${stepData.imageUrl || ''}" data-field="imageUrl">
                </div>
                
                <div class="form-group">
                    <label>图片描述</label>
                    <input type="text" class="form-input"
                           placeholder="图片的alt描述"
                           value="${stepData.imageAlt || ''}" data-field="imageAlt">
                </div>
                
                
                ${stepData.imageUrl ? `
                <div class="image-preview">
                    <label>预览</label>
                    <img src="${stepData.imageUrl}" alt="${stepData.imageAlt}" 
                         style="max-width: 100%; max-height: 200px; border-radius: 8px;">
                </div>
                ` : ''}
                
                <div class="editor-actions">
                    <button class="btn-primary" onclick="conversationEditor.updateStep(${stepData.id})">
                        保存修改
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * 创建测试步骤编辑器
     */
    createTestStepEditor(stepData) {
        const options = stepData.options || ['', '', '', ''];
        const correctAnswer = stepData.correctAnswer || 0;

        return `
            <div class="step-editor test-step-editor">
                <div class="editor-header">
                    <h5>📝 编辑测试题</h5>
                </div>
                
                <div class="form-group">
                    <label>引导语</label>
                    <input type="text" class="form-input"
                           placeholder="来做个小测试！"
                           value="${this.escapeHtml(stepData.content)}" data-field="content">
                </div>
                
                <div class="form-group">
                    <label>题目 *</label>
                    <textarea class="form-textarea" rows="3"
                              placeholder="输入测试题目..."
                              data-field="question">${this.escapeHtml(stepData.question)}</textarea>
                </div>
                
                <div class="form-group">
                    <label>选项 *</label>
                    <div class="options-editor">
                        ${options.map((option, index) => `
                            <div class="option-item">
                                <label class="option-label">
                                    <input type="radio" name="correctAnswer" value="${index}"
                                           ${correctAnswer === index ? 'checked' : ''}>
                                    选项 ${String.fromCharCode(65 + index)}:
                                </label>
                                <input type="text" class="form-input option-input"
                                       placeholder="输入选项内容..."
                                       value="${this.escapeHtml(option)}"
                                       data-option-index="${index}">
                            </div>
                        `).join('')}
                    </div>
                    <small>选择正确答案，并填写各选项内容</small>
                </div>
                
                <div class="form-group">
                    <label>答案解释</label>
                    <textarea class="form-textarea" rows="3"
                              placeholder="解释为什么这个答案是正确的..."
                              data-field="explanation">${this.escapeHtml(stepData.explanation || '')}</textarea>
                </div>
                
                
                <div class="editor-actions">
                    <button class="btn-primary" onclick="conversationEditor.updateStep(${stepData.id})">
                        保存修改
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * 绑定步骤编辑器事件
     */
    bindStepEditorEvents(stepData) {
        const editor = this.elements.stepEditor;
        
        // 实时预览更新
        const inputs = editor.querySelectorAll('[data-field]');
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                if (this.options.autoPreview) {
                    // 实时更新步骤数据用于预览
                    const field = input.dataset.field;
                    const value = input.value;
                    
                    // 临时更新用于预览（不保存到正式数据）
                    const tempData = {...stepData, [field]: value};
                    this.updateStepPreview(tempData);
                }
            });
        });
        
        // 选项编辑（仅测试题）
        if (stepData.type === 'test') {
            const optionInputs = editor.querySelectorAll('.option-input');
            optionInputs.forEach(input => {
                input.addEventListener('input', () => {
                    if (this.options.autoPreview) {
                        this.updateTestStepPreview(stepData);
                    }
                });
            });
        }
    }

    /**
     * 更新步骤数据
     */
    updateStep(stepId) {
        const stepData = this.conversationData.conversations.find(conv => conv.id === stepId);
        if (!stepData) return;

        const editor = this.elements.stepEditor;
        const inputs = editor.querySelectorAll('[data-field]');
        
        // 更新基本字段
        inputs.forEach(input => {
            const field = input.dataset.field;
            let value = input.value;
            
            // 类型转换
            if (field === 'points' || field === 'correctAnswer') {
                value = parseInt(value) || 0;
            }
            
            stepData[field] = value;
        });
        
        // 处理测试题的特殊字段
        if (stepData.type === 'test') {
            // 更新选项
            const optionInputs = editor.querySelectorAll('.option-input');
            stepData.options = Array.from(optionInputs).map(input => input.value);
            
            // 更新正确答案
            const correctAnswerRadio = editor.querySelector('input[name="correctAnswer"]:checked');
            if (correctAnswerRadio) {
                stepData.correctAnswer = parseInt(correctAnswerRadio.value);
            }
        }

        // 重新渲染步骤列表以更新摘要
        this.renderStepsList();
        
        // 重新选中当前步骤
        this.selectStep(stepId);
        
        // 更新预览
        this.updatePreview();
        
        // 显示成功提示
        this.showNotification('步骤已保存', 'success');
        
    }

    /**
     * 复制步骤
     */
    duplicateStep(originalStep) {
        const duplicatedStep = {
            ...originalStep,
            id: Date.now() + Math.random(),
            content: originalStep.content + ' (副本)'
};
        
        // 找到原步骤的索引，在其后插入副本
        const originalIndex = this.conversationData.conversations.findIndex(
            conv => conv.id === originalStep.id
        );
        
        this.conversationData.conversations.splice(originalIndex + 1, 0, duplicatedStep);
        
        this.renderStepsList();
        this.updateStepNumbers();
        this.selectStep(duplicatedStep.id);
        
        this.showNotification('步骤已复制', 'success');
    }

    /**
     * 删除步骤
     */
    deleteStep(stepId) {
        if (!confirm('确定要删除这个对话步骤吗？')) {
            return;
        }
        
        const index = this.conversationData.conversations.findIndex(conv => conv.id === stepId);
        if (index === -1) return;
        
        this.conversationData.conversations.splice(index, 1);
        
        // 如果删除的是当前编辑的步骤，清空编辑器
        if (this.currentEditingId === stepId) {
            this.currentEditingId = null;
            this.elements.stepEditor.innerHTML = `
                <div class="no-selection">
                    <div class="no-selection-icon">👈</div>
                    <p>请从左侧选择一个对话步骤进行编辑</p>
                </div>
            `;
        }
        
        this.renderStepsList();
        this.updateStepNumbers();
        this.updatePreview();
        
        this.showNotification('步骤已删除', 'info');
    }

    /**
     * 更新步骤计数
     */
    updateStepCount() {
        this.elements.stepCount.textContent = this.conversationData.conversations.length;
    }

    /**
     * 更新步骤编号
     */
    updateStepNumbers() {
        this.conversationData.conversations.forEach((conv, index) => {
            conv.id = index + 1; // 重新分配ID保持顺序
        });
    }

    /**
     * 保存对话内容
     */
    saveConversation() {
        // 验证数据
        if (!this.validateConversationData()) {
            return;
        }

        // 生成最终的对话数据
        const finalData = {
            title: this.conversationData.title,
            description: this.conversationData.description,
            conversations: this.conversationData.conversations.map((conv, index) => ({
                id: index + 1,
                type: conv.type,
                content: conv.content,
                ...(conv.type === 'image' && {
                    imageUrl: conv.imageUrl,
                    imageAlt: conv.imageAlt
                }),
                ...(conv.type === 'test' && {
                    question: conv.question,
                    options: conv.options,
                    correctAnswer: conv.correctAnswer,
                    explanation: conv.explanation
                }),
                points: conv.points
            }))
        };

        // 触发保存事件
        const saveEvent = new CustomEvent('conversationSave', {
            detail: {
                conversationData: finalData,
                htmlContent: this.generateHTMLContent(finalData)
            }
        });

        document.dispatchEvent(saveEvent);
        
        this.showNotification('对话内容已保存', 'success');
        
    }

    /**
     * 验证对话数据
     */
    validateConversationData() {
        const { title, conversations } = this.conversationData;
        
        if (!title.trim()) {
            this.showNotification('请输入对话标题', 'error');
            this.elements.title.focus();
            return false;
        }
        
        if (conversations.length === 0) {
            this.showNotification('请至少添加一个对话步骤', 'error');
            return false;
        }
        
        // 验证每个步骤
        for (let i = 0; i < conversations.length; i++) {
            const conv = conversations[i];
            
            if (!conv.content?.trim()) {
                this.showNotification(`第 ${i + 1} 步的内容不能为空`, 'error');
                return false;
            }
            
            if (conv.type === 'image' && !conv.imageUrl?.trim()) {
                this.showNotification(`第 ${i + 1} 步的图片URL不能为空`, 'error');
                return false;
            }
            
            if (conv.type === 'test') {
                if (!conv.question?.trim()) {
                    this.showNotification(`第 ${i + 1} 步的测试问题不能为空`, 'error');
                    return false;
                }
                
                const validOptions = conv.options?.filter(opt => opt?.trim()) || [];
                if (validOptions.length < 2) {
                    this.showNotification(`第 ${i + 1} 步至少需要2个有效选项`, 'error');
                    return false;
                }
            }
        }
        
        return true;
    }

    /**
     * 生成HTML内容
     */
    generateHTMLContent(conversationData) {
        return `<script type="application/json" data-conversation>
${JSON.stringify(conversationData, null, 4)}
</script>

<div class="conversation-placeholder">
    <h3>${conversationData.title}</h3>
    <p>${conversationData.description}</p>
    <p>此内容将以对话学习方式展现，包含 ${conversationData.conversations.length} 个学习步骤。</p>
</div>`;
    }

    /**
     * 显示预览
     */
    showPreview() {
        if (!this.validateConversationData()) {
            return;
        }

        // 这里可以集成实际的预览功能
        this.updatePreview();
        
        // 可以打开一个模态框显示完整预览
        this.showNotification('预览功能开发中...', 'info');
    }

    /**
     * 更新预览
     */
    updatePreview() {
        const previewHTML = `
            <div class="mini-preview">
                <h5>${this.conversationData.title || '未命名对话'}</h5>
                <div class="preview-stats">
                    📊 ${this.conversationData.conversations.length} 个步骤
                    | 🎯 ${this.calculateTotalPoints()} 积分
                </div>
            </div>
        `;
        
        this.elements.preview.innerHTML = previewHTML;
    }

    /**
     * 计算总积分
     */
    calculateTotalPoints() {
        return this.conversationData.conversations.reduce((total, conv) => {
            return total + (conv.points || 0);
        }, 0);
    }

    /**
     * 初始化拖拽排序
     */
    initDragAndDrop() {
        // 拖拽功能实现
        // 这里可以集成 SortableJS 或自实现拖拽排序
    }

    /**
     * 加载模板
     */
    loadTemplate() {
        // 模板加载功能
        const templates = [
            {
                name: 'BPMN基础模板',
                data: {
                    title: 'BPMN流程建模基础',
                    description: '学习业务流程建模的基本概念',
                    conversations: [
                        { id: 1, type: 'text', content: '欢迎学习BPMN！', points: 2 }
                    ]
                }
            }
        ];
        
        // 显示模板选择器
        this.showNotification('模板功能开发中...', 'info');
    }

    /**
     * 显示模板选择器
     */
    showTemplateSelector() {
        this.showNotification('模板选择器开发中...', 'info');
    }

    /**
     * 保存为模板
     */
    saveAsTemplate() {
        this.showNotification('保存模板功能开发中...', 'info');
    }

    /**
     * 显示通知
     */
    showNotification(message, type = 'info') {
        // 可以集成现有的通知系统
        if (window.UI && window.UI.showNotification) {
            window.UI.showNotification(message, type);
        } else {
        }
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
     * 加载对话数据
     */
    loadConversationData(data) {
        if (data && data.conversations) {
            this.conversationData = {
                title: data.title || '',
                description: data.description || '',
                conversations: data.conversations.map(conv => ({
                    ...conv,
                    id: Date.now() + Math.random() + conv.id // 确保唯一ID
                }))
            };
            
            // 更新UI
            this.elements.title.value = this.conversationData.title;
            this.elements.description.value = this.conversationData.description;
            
            this.renderStepsList();
            this.updatePreview();
            
        }
    }

    /**
     * 获取对话数据
     */
    getConversationData() {
        return this.conversationData;
    }
}

// 全局实例引用
window.ConversationEditor = ConversationEditor;