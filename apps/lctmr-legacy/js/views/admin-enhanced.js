/**
 * @file admin-enhanced.js
 * @description 增强的管理后台视图，支持AI对话生成器和HTML编辑器
 */
import { AppState } from '../state.js';
import { UI } from '../ui.js';
import { ApiService } from '../services/api.js';
import { clearFactionCache } from '../constants.js';
import { HTMLEditor } from '../components/html-editor.js';
import { ConversationAIGenerator } from '../components/conversation-ai-generator.js';

// 增强的AdminView，专门处理block类型
export const AdminViewEnhanced = {
    // HTML编辑器实例
    currentHtmlEditor: null,
    
    // AI对话生成器实例
    currentAIGenerator: null,

    // 增强的openModal方法
    openModal(type, item = null) {
        // 只处理block类型
        if (type !== 'block') {
            return;
        }
        
        AppState.admin.editingItem = item; 
        AppState.admin.editingType = type;
        const { modal } = UI.elements.admin; 
        modal.form.innerHTML = '';
        const v = (key, def = '') => item ? (item[key] !== null && item[key] !== undefined ? item[key] : def) : def;

        modal.title.textContent = item ? '编辑内容块' : '新增内容块';
        modal.form.innerHTML = this.getFormHtml(v);
        modal.backdrop.classList.remove('hidden');
        modal.backdrop.classList.add('flex');
        
        // 初始化增强功能
        this.setupContentFormatToggle();
        this.initBlockEnhancement();
    },

    // 获取增强的表单HTML
    getFormHtml(v) {
        const opts = v('quiz_options', ['','','','']);
        const correctIdx = v('correct_answer_index', 0);
        const contentFormat = v('content_format', 'markdown');
        
        return `
            <p class="text-sm text-gray-500 mb-4">提示：一个内容块可以同时包含视频、文档和内容文本（支持Markdown或HTML格式）。</p>
            
            <!-- 基本信息 -->
            <div class="mb-4">
                <label class="admin-label">标题</label>
                <input name="title" class="admin-input" value="${v('title')}" required>
            </div>
            <div class="mb-4">
                <label class="admin-label">顺序</label>
                <input name="order" type="number" class="admin-input" value="${v('order', 0)}" required>
            </div>
            
            <hr class="my-4">
            <h4 class="text-lg font-semibold mb-2">内容选项</h4>
            
            <!-- 媒体内容 -->
            <div class="mb-4">
                <label class="admin-label">视频URL</label>
                <input name="video_url" class="admin-input" value="${v('video_url')}" placeholder="https://example.com/video.mp4">
            </div>
            <div class="mb-4">
                <label class="admin-label">在线文档URL</label>
                <input name="document_url" class="admin-input" value="${v('document_url')}" placeholder="https://kdocs.cn/l/...">
                <p class="text-xs text-gray-500 mt-1">请粘贴"公开分享"或"嵌入"链接。</p>
            </div>
            
            <!-- 内容格式选择 -->
            <div class="mb-4">
                <label class="admin-label">内容格式</label>
                <select name="content_format" class="admin-select" id="contentFormatSelect">
                    <option value="markdown" ${contentFormat === 'markdown' ? 'selected' : ''}>Markdown</option>
                    <option value="html" ${contentFormat === 'html' ? 'selected' : ''}>HTML（支持交互式内容）</option>
                </select>
            </div>
            
            <!-- Markdown编辑器 -->
            <div id="markdownEditor" class="mb-4" style="display: ${contentFormat === 'markdown' ? 'block' : 'none'}">
                <label class="admin-label">内容 (Markdown)</label>
                <textarea name="content_markdown" class="admin-textarea" rows="8">${v('content_markdown')}</textarea>
            </div>
            
            <!-- HTML编辑器（增强版 - 支持AI生成） -->
            <div id="htmlEditor" class="mb-4" style="display: ${contentFormat === 'html' ? 'block' : 'none'}">
                <label class="admin-label">内容 (HTML) - AI辅助生成</label>
                <p class="text-xs text-gray-500 mb-3">💡 使用左侧AI生成器快速创建对话式学习内容，或直接在右侧编辑HTML</p>
                
                <!-- AI生成器和编辑器布局 -->
                <div class="html-editor-layout" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 12px;">
                    <!-- 左侧：AI对话生成器 -->
                    <div class="ai-generator-section" style="border: 2px dashed #667eea; border-radius: 12px; padding: 16px; background: #f8f9ff;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                            <span style="font-size: 24px;">🤖</span>
                            <div>
                                <h4 style="margin: 0; color: #667eea; font-size: 16px;">AI对话生成器</h4>
                                <p style="margin: 0; color: #7f8c8d; font-size: 12px;">描述需求，AI自动生成</p>
                            </div>
                        </div>
                        <div id="aiGeneratorContainer"></div>
                    </div>
                    
                    <!-- 右侧：HTML编辑器 -->
                    <div class="html-editor-section" style="border: 2px solid #e0e6ed; border-radius: 12px; padding: 16px; background: white;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">
                            <span style="font-size: 24px;">📝</span>
                            <div>
                                <h4 style="margin: 0; color: #2c3e50; font-size: 16px;">HTML编辑器</h4>
                                <p style="margin: 0; color: #7f8c8d; font-size: 12px;">实时编辑和预览</p>
                            </div>
                        </div>
                        <div id="htmlEditorContainer" style="min-height: 500px;"></div>
                    </div>
                </div>
                
                <!-- 响应式布局样式 -->
                <style>
                    @media (max-width: 1200px) {
                        .html-editor-layout {
                            grid-template-columns: 1fr !important;
                        }
                        .ai-generator-section {
                            margin-bottom: 16px;
                        }
                    }
                </style>
                
                <input type="hidden" name="content_html" value="${v('content_html')}">
            </div>
            
            <hr class="my-4">
            <h4 class="text-lg font-semibold mb-2">测验 (可选)</h4>
            <p class="text-sm text-gray-500 mb-4">填写问题后，此内容块将变为测验。</p>
            
            <div class="mb-4">
                <label class="admin-label">问题</label>
                <input name="quiz_question" class="admin-input" value="${v('quiz_question')}">
            </div>
            <div class="mb-4">
                <label class="admin-label">选项</label>
                <input name="quiz_options_0" class="admin-input mb-2" placeholder="选项 A" value="${opts[0] || ''}">
                <input name="quiz_options_1" class="admin-input mb-2" placeholder="选项 B" value="${opts[1] || ''}">
                <input name="quiz_options_2" class="admin-input mb-2" placeholder="选项 C" value="${opts[2] || ''}">
                <input name="quiz_options_3" class="admin-input" placeholder="选项 D" value="${opts[3] || ''}">
            </div>
            <div class="mb-4">
                <label class="admin-label">正确答案</label>
                <select name="correct_answer_index" class="admin-select">
                    <option value="0" ${correctIdx == 0 ? 'selected' : ''}>选项 A</option>
                    <option value="1" ${correctIdx == 1 ? 'selected' : ''}>选项 B</option>
                    <option value="2" ${correctIdx == 2 ? 'selected' : ''}>选项 C</option>
                    <option value="3" ${correctIdx == 3 ? 'selected' : ''}>选项 D</option>
                </select>
            </div>
        `;
    },

    // 设置内容格式切换功能
    setupContentFormatToggle() {
        const formatSelect = document.getElementById('contentFormatSelect');
        const markdownEditor = document.getElementById('markdownEditor');
        const htmlEditor = document.getElementById('htmlEditor');
        
        if (formatSelect && markdownEditor && htmlEditor) {
            formatSelect.addEventListener('change', (e) => {
                const format = e.target.value;
                if (format === 'markdown') {
                    markdownEditor.style.display = 'block';
                    htmlEditor.style.display = 'none';
                    this.cleanupHtmlEditor();
                } else if (format === 'html') {
                    markdownEditor.style.display = 'none';
                    htmlEditor.style.display = 'block';
                    this.initBlockEnhancement();
                }
            });
        }
    },

    // 初始化内容块增强功能
    async initBlockEnhancement() {
        try {
            const formatSelect = document.getElementById('contentFormatSelect');
            if (formatSelect && formatSelect.value === 'html') {
                await this.initHtmlEditor();
                await this.initAIGenerator();
            }
        } catch (error) {
            console.error('初始化内容块增强功能失败:', error);
        }
    },

    // 初始化HTML编辑器
    async initHtmlEditor() {
        try {
            const container = document.getElementById('htmlEditorContainer');
            if (!container) return;

            // 清理现有编辑器
            this.cleanupHtmlEditor();

            // 创建新的HTML编辑器
            this.currentHtmlEditor = new HTMLEditor(container, {
                height: '500px',
                mode: 'split', // 默认分屏模式
                placeholder: '在此输入HTML代码，包括完整的HTML标签、CSS样式和JavaScript脚本...'
            });

            // 设置初始内容
            const contentInput = document.querySelector('input[name="content_html"]');
            if (contentInput && contentInput.value) {
                this.currentHtmlEditor.setValue(contentInput.value);
            }

        } catch (error) {
            console.error('HTML编辑器初始化失败:', error);
        }
    },

    // 初始化AI生成器
    async initAIGenerator() {
        try {
            const container = document.getElementById('aiGeneratorContainer');
            if (!container) return;

            // 清理现有生成器
            this.cleanupAIGenerator();

            // 创建新的AI生成器
            this.currentAIGenerator = new ConversationAIGenerator(container, {
                onGenerate: (result) => {
                    // 生成成功，显示结果
                },
                onError: (error) => {
                    console.error('AI生成错误:', error);
                    UI.showNotification(`AI生成失败: ${error.message}`, 'error');
                },
                onInsert: (htmlContent) => {
                    // 插入到HTML编辑器
                    if (this.currentHtmlEditor) {
                        this.currentHtmlEditor.setValue(htmlContent);
                        UI.showNotification('内容已插入到HTML编辑器', 'success');
                    }
                }
            });

        } catch (error) {
            console.error('AI生成器初始化失败:', error);
        }
    },

    // 清理HTML编辑器
    cleanupHtmlEditor() {
        if (this.currentHtmlEditor) {
            try {
                this.currentHtmlEditor.destroy();
            } catch (error) {
                console.warn('清理HTML编辑器时出错:', error);
            }
            this.currentHtmlEditor = null;
        }
    },

    // 清理AI生成器
    cleanupAIGenerator() {
        if (this.currentAIGenerator) {
            try {
                this.currentAIGenerator.destroy();
            } catch (error) {
                console.warn('清理AI生成器时出错:', error);
            }
            this.currentAIGenerator = null;
        }
    },

    // 增强的保存方法
    async handleSave() {
        try {
            const { modal } = UI.elements.admin;
            const formData = new FormData(modal.form);
            
            // 如果是HTML格式，从编辑器获取内容
            const formatSelect = document.getElementById('contentFormatSelect');
            if (formatSelect && formatSelect.value === 'html' && this.currentHtmlEditor) {
                const htmlContent = this.currentHtmlEditor.getValue();
                formData.set('content_html', htmlContent);
            }
            
            // 转换FormData为对象
            const data = Object.fromEntries(formData.entries());
            
            // 处理数组字段
            if (data.quiz_options_0 || data.quiz_options_1 || data.quiz_options_2 || data.quiz_options_3) {
                data.quiz_options = [
                    data.quiz_options_0 || '',
                    data.quiz_options_1 || '',
                    data.quiz_options_2 || '',
                    data.quiz_options_3 || ''
                ];
                delete data.quiz_options_0;
                delete data.quiz_options_1;
                delete data.quiz_options_2;
                delete data.quiz_options_3;
            }
            
            // 添加父级ID
            const parentType = AppState.admin.currentView;
            if (parentType === 'sections') {
                data.section_id = AppState.admin.selectedSection?.id;
            } else if (parentType === 'chapters') {
                data.chapter_id = AppState.admin.selectedChapter?.id;
            }
            
            const editingType = AppState.admin.editingType;
            const editingItem = AppState.admin.editingItem;
            
            if (editingItem) {
                await ApiService.updateContent(editingType, editingItem.id, data);
            } else {
                await ApiService.createContent(editingType, data);
            }
            
            UI.showNotification('保存成功', 'success');
            this.closeModal();
            await this.refreshAdminViewAfterSave();
        } catch (error) {
            UI.showNotification(`保存失败: ${error.message}`, 'error');
        }
    },

    // 清理方法
    closeModal() {
        // 清理HTML编辑器
        this.cleanupHtmlEditor();
        
        // 清理AI生成器
        this.cleanupAIGenerator();
        
        const { modal } = UI.elements.admin;
        modal.backdrop.classList.add('hidden');
        modal.backdrop.classList.remove('flex');
        AppState.admin.editingItem = null;
        AppState.admin.editingType = null;
    },

    // 刷新管理视图
    async refreshAdminViewAfterSave() {
        try {
            const currentView = AppState.admin.currentView;
            switch (currentView) {
                case 'categories':
                    await AdminView.loadCategories();
                    break;
                case 'chapters':
                    await AdminView.loadChapters();
                    break;
                case 'sections':
                    await AdminView.loadSections();
                    break;
                case 'blocks':
                    await AdminView.loadBlocks();
                    break;
                case 'challenges':
                    await AdminView.loadChallenges();
                    break;
                case 'factions':
                    await AdminView.loadFactions();
                    break;
            }
        } catch (error) {
            console.error('刷新管理视图失败:', error);
        }
    }
};

// 扩展原有的AdminView
function enhanceAdminView() {
    if (window.AdminView) {
        
        // 保存原有的openModal方法
        const originalOpenModal = window.AdminView.openModal;
        
        // 重写openModal方法，只针对block类型使用我们的增强版本
        window.AdminView.openModal = function(type, item = null) {
            if (type === 'block') {
                // 使用增强版本
                AdminViewEnhanced.openModal.call(this, type, item);
            } else {
                // 使用原始版本
                originalOpenModal.call(this, type, item);
            }
        };
        
        // 保存原始方法引用
        window.AdminView._originalOpenModal = originalOpenModal;
        
        // 添加其他增强方法
        Object.assign(window.AdminView, {
            initBlockEnhancement: AdminViewEnhanced.initBlockEnhancement,
            setupContentFormatToggle: AdminViewEnhanced.setupContentFormatToggle,
            initHtmlEditor: AdminViewEnhanced.initHtmlEditor,
            initAIGenerator: AdminViewEnhanced.initAIGenerator,
            currentHtmlEditor: null,
            currentAIGenerator: null
        });
        
        return true;
    } else {
        console.warn('⚠️ AdminView不存在，稍后重试...');
        return false;
    }
}

// 尝试立即扩展
if (!enhanceAdminView()) {
    // 如果AdminView还未加载，等待DOM ready后再试
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(enhanceAdminView, 500);
        });
    } else {
        setTimeout(enhanceAdminView, 500);
    }
}
