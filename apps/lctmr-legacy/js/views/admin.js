/**
 * @file admin.js
 * @description Manages all logic for the admin panel.
 * @version 5.0.1 - [CRITICAL FIX] Refactored event handling to be more specific and robust, fixing unresponsive buttons and navigation.
 */
import { AppState } from '../state.js';
import { UI } from '../ui.js';
import { ApiService } from '../services/api.js';
import { clearFactionCache } from '../constants.js';
import { HTMLEditor } from '../components/html-editor.js';

export const AdminView = {
    _isInitialized: false,
    _currentDeletion: { type: null, id: null },

    init() {
        if (this._isInitialized) return;
        
        const { admin, deleteConfirmModal } = UI.elements;
        
        // --- Main Navigation & Back Button ---
        admin.backToLobbyBtn?.addEventListener('click', () => UI.switchTopLevelView('game-lobby'));
        admin.adminNav?.addEventListener('click', (e) => {
            const button = e.target.closest('button[data-admin-view]');
            if (button) {
                this.handleAdminNav(button.dataset.adminView, button);
            }
        });

        // --- "Add New" Buttons ---
        admin.addCategoryBtn?.addEventListener('click', () => this.openModal('category'));
        admin.addChapterBtn?.addEventListener('click', () => this.openModal('chapter'));
        admin.addSectionBtn?.addEventListener('click', () => this.openModal('section'));
        admin.addNewBlockBtn?.addEventListener('click', () => this.openModal('block'));
        admin.addChallengeBtn?.addEventListener('click', () => this.openModal('challenge'));
        admin.addFactionBtn?.addEventListener('click', () => this.openModal('faction'));

        // --- Event Delegation for Dynamic List Content ---
        const setupListListener = (element, type) => {
            element?.addEventListener('click', (e) => this.handleListClick(e, type));
        };
        setupListListener(admin.categoriesTableContainer, 'category');
        setupListListener(admin.chaptersTableContainer, 'chapter');
        setupListListener(admin.sectionsTableContainer, 'section');
        setupListListener(admin.blocksList, 'block');
        setupListListener(admin.challengesTableContainer, 'challenge');
        setupListListener(admin.factionsTableContainer, 'faction');
        
        // --- Other Listeners ---
        admin.breadcrumb?.addEventListener('click', (e) => this.handleBreadcrumbClick(e));
        admin.modal.saveBtn?.addEventListener('click', () => this.handleSave());
        admin.modal.cancelBtn?.addEventListener('click', () => this.closeModal());
        deleteConfirmModal.confirmBtn?.addEventListener('click', () => this.confirmDeletion());
        deleteConfirmModal.cancelBtn?.addEventListener('click', () => this.hideDeleteConfirmation());

        this._isInitialized = true;
    },

    handleListClick(e, context) {
        const button = e.target.closest('button[data-action]');
        if (!button) return;
        const { action, id, type } = button.dataset;
        this.handleListAction(action, id, type || context);
    },

    handleAdminNav(view, button) {
        UI.elements.admin.adminNav.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        if (view === 'challenges') {
            this.showChallengesList();
        } else if (view === 'factions') {
            this.showFactionsList();
        } else {
            this.showCategoryList();
        }
    },

    handleListAction(action, id, type) {
        let item;
        switch(type) {
            case 'category': item = AppState.admin.categories.find(c => c.id === id); break;
            case 'chapter': item = AppState.admin.selectedCategory?.chapters.find(c => c.id === id); break;
            case 'section': item = AppState.admin.selectedChapter?.sections.find(s => s.id === id); break;
            case 'block': item = AppState.admin.selectedSection?.blocks.find(b => b.id === id); break;
            case 'challenge': item = AppState.admin.challenges.find(c => c.id === id); break;
            case 'faction': item = AppState.admin.factions.find(f => f.id === id); break;
        }

        switch(action) {
            case 'view-chapters': if(item) this.showChapterList(item); break;
            case 'view-sections': if(item) this.showSectionList(item); break;
            case 'view-blocks': if(item) this.showBlockEditor(item); break;
            case 'edit': if(item) this.openModal(type, item); break;
            case 'delete': if(item) this.showDeleteConfirmation(type, id, item.title || item.name); break;
            case 'end-challenge': if(item) this.handleEndChallenge(id, item.title); break;
        }
    },

    async showAdminView() { 
        // 检查用户是否已登录且具有管理员权限
        if (!AppState.user) {
            UI.showNotification('请先登录', 'error');
            UI.switchTopLevelView('landing');
            return;
        }
        
        if (!AppState.profile || AppState.profile.role !== 'admin') {
            UI.showNotification('您没有管理员权限', 'error');
            UI.switchTopLevelView('game-lobby');
            return;
        }
        
        this.init();
        UI.switchTopLevelView('admin'); 
        this.showCategoryList(); 
    },

    switchAdminSubView(view) {
        const { categoryListView, chapterListView, sectionListView, blockEditorView, challengesListView } = UI.elements.admin;
        [categoryListView, chapterListView, sectionListView, blockEditorView, challengesListView].forEach(v => v?.classList.add('hidden'));
        
        const viewToShow = UI.elements.admin[view];
        if(viewToShow) viewToShow.classList.remove('hidden');

        AppState.admin.view = view; 
        this.updateBreadcrumb();
    },

    async showCategoryList() {
        this.switchAdminSubView('categoryListView');
        AppState.admin.selectedCategory = null;
        AppState.admin.selectedChapter = null;
        AppState.admin.selectedSection = null;
        const container = UI.elements.admin.categoriesTableContainer;
        UI.renderLoading(container);
        try {
            AppState.admin.categories = await ApiService.fetchAllCategoriesForAdmin();
            this.renderCategoryList();
        } catch (error) { UI.renderError(container, error.message); }
    },
    renderCategoryList() {
        const container = UI.elements.admin.categoriesTableContainer;
        const cats = AppState.admin.categories;
        if (!cats || cats.length === 0) { UI.renderEmpty(container, '没有篇章。请添加一个新篇章。'); return; }
        container.innerHTML = `<table class="w-full text-sm text-left text-gray-500"><thead class="text-xs text-gray-700 uppercase bg-gray-50"><tr><th class="px-6 py-3">顺序</th><th class="px-6 py-3">标题</th><th class="px-6 py-3 text-right">操作</th></tr></thead><tbody>${cats.map(c => `<tr class="bg-white border-b hover:bg-gray-50"><td class="px-6 py-4">${c.order}</td><td class="px-6 py-4 font-medium text-gray-900">${c.title}</td><td class="px-6 py-4 text-right space-x-2"><button data-action="view-chapters" data-id="${c.id}" class="font-medium text-blue-600 hover:underline">管理章节</button><button data-action="edit" data-id="${c.id}" class="font-medium text-indigo-600 hover:underline">编辑</button><button data-action="delete" data-id="${c.id}" class="font-medium text-red-600 hover:underline">删除</button></td></tr>`).join('')}</tbody></table>`;
    },
    
    showChapterList(cat) { AppState.admin.selectedCategory = cat; this.switchAdminSubView('chapterListView'); UI.elements.admin.chapterListTitle.textContent = `章节管理: ${cat.title}`; this.renderChapterList(); },
    renderChapterList() {
        const container = UI.elements.admin.chaptersTableContainer;
        const chapters = AppState.admin.selectedCategory.chapters || [];
        if (chapters.length === 0) { UI.renderEmpty(container, '没有章节。'); return; }
        container.innerHTML = `<table class="w-full text-sm text-left text-gray-500"><thead class="text-xs text-gray-700 uppercase bg-gray-50"><tr><th class="px-6 py-3">顺序</th><th class="px-6 py-3">标题</th><th class="px-6 py-3 text-right">操作</th></tr></thead><tbody>${chapters.map(c => `<tr class="bg-white border-b hover:bg-gray-50"><td class="px-6 py-4">${c.order}</td><td class="px-6 py-4 font-medium text-gray-900">${c.title}</td><td class="px-6 py-4 text-right space-x-2"><button data-action="view-sections" data-id="${c.id}" class="font-medium text-blue-600 hover:underline">管理小节</button><button data-action="edit" data-id="${c.id}" class="font-medium text-indigo-600 hover:underline">编辑</button><button data-action="delete" data-id="${c.id}" class="font-medium text-red-600 hover:underline">删除</button></td></tr>`).join('')}</tbody></table>`;
    },

    showSectionList(chap) { AppState.admin.selectedChapter = chap; this.switchAdminSubView('sectionListView'); UI.elements.admin.sectionListTitle.textContent = `小节管理: ${chap.title}`; this.renderSectionList(); },
    renderSectionList() {
        const container = UI.elements.admin.sectionsTableContainer;
        const sections = AppState.admin.selectedChapter.sections || [];
        if (sections.length === 0) { UI.renderEmpty(container, '没有小节。'); return; }
        container.innerHTML = `<table class="w-full text-sm text-left text-gray-500"><thead class="text-xs text-gray-700 uppercase bg-gray-50"><tr><th class="px-6 py-3">顺序</th><th class="px-6 py-3">标题</th><th class="px-6 py-3 text-right">操作</th></tr></thead><tbody>${sections.map(s => `<tr class="bg-white border-b hover:bg-gray-50"><td class="px-6 py-4">${s.order}</td><td class="px-6 py-4 font-medium text-gray-900">${s.title}</td><td class="px-6 py-4 text-right space-x-2"><button data-action="view-blocks" data-id="${s.id}" class="font-medium text-blue-600 hover:underline">管理内容块</button><button data-action="edit" data-id="${s.id}" class="font-medium text-indigo-600 hover:underline">编辑</button><button data-action="delete" data-id="${s.id}" class="font-medium text-red-600 hover:underline">删除</button></td></tr>`).join('')}</tbody></table>`;
    },

    showBlockEditor(sec) { 
        AppState.admin.selectedSection = sec; 
        this.switchAdminSubView('blockEditorView'); 
        UI.elements.admin.editorSectionTitle.textContent = `内容块管理: ${sec.title}`; 
        this.renderBlockList(); 
    },
    renderBlockList() {
        const container = UI.elements.admin.blocksList;
        const blocks = AppState.admin.selectedSection.blocks || [];
        container.innerHTML = '';
        if (blocks.length === 0) { UI.renderEmpty(container, '没有内容块。'); return; }
        blocks.sort((a, b) => a.order - b.order).forEach(block => {
            const el = document.createElement('div');
            el.className = 'bg-white p-4 rounded-lg shadow flex justify-between items-start';
            let type = '内容';
            // 检查是否为对话学习内容
            if(block.content_html && block.content_html.includes('data-conversation')) {
                type = '💬 对话学习';
            } else if(block.quiz_question) {
                type = '🧠 测验'; 
            } else if(block.document_url) {
                type = '📄 文档'; 
            } else if(block.video_url) {
                type = '🎥 视频';
            }
            el.innerHTML = `<div><div class="font-bold text-lg text-gray-800">${block.order}. ${block.title}</div><div class="text-sm text-gray-500 mt-1">类型: ${type}</div></div><div class="flex-shrink-0 ml-4 space-x-2"><button data-action="edit" data-id="${block.id}" class="font-medium text-indigo-600 hover:underline">编辑</button><button data-action="delete" data-id="${block.id}" class="font-medium text-red-600 hover:underline">删除</button></div>`;
            container.appendChild(el);
        });
    },

    async showChallengesList() {
        this.switchAdminSubView('challengesListView');
        const container = UI.elements.admin.challengesTableContainer;
        UI.renderLoading(container);
        try {
            const challenges = await ApiService.fetchChallengesForAdmin();
            AppState.admin.challenges = challenges;
            this.renderChallengesList(challenges);
        } catch (error) { UI.renderError(container, error.message); }
    },
    renderChallengesList(challenges) {
        const container = UI.elements.admin.challengesTableContainer;
        if (!challenges || challenges.length === 0) { UI.renderEmpty(container, '没有挑战。请添加一个新挑战。'); return; }
        container.innerHTML = `<table class="w-full text-sm text-left text-gray-500"><thead class="text-xs text-gray-700 uppercase bg-gray-50"><tr><th class="px-6 py-3">标题</th><th class="px-6 py-3">目标篇章</th><th class="px-6 py-3">状态</th><th class="px-6 py-3">奖励</th><th class="px-6 py-3 text-right">操作</th></tr></thead><tbody>${challenges.map(c => `<tr class="bg-white border-b hover:bg-gray-50"><td class="px-6 py-4 font-medium text-gray-900">${c.title}</td><td class="px-6 py-4">${c.target_category_title || '无'}</td><td class="px-6 py-4"><span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${c.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}">${c.is_active ? '活跃中' : '已关闭'}</span></td><td class="px-6 py-4">${c.reward_points} 分</td><td class="px-6 py-4 text-right space-x-2">${c.is_active ? `<button data-action="end-challenge" data-id="${c.id}" class="font-medium text-green-600 hover:underline">结算</button>` : ''}<button data-action="edit" data-id="${c.id}" class="font-medium text-indigo-600 hover:underline">编辑</button><button data-action="delete" data-id="${c.id}" class="font-medium text-red-600 hover:underline">删除</button></td></tr>`).join('')}</tbody></table>`;
    },

    updateBreadcrumb() {
        const { breadcrumb } = UI.elements.admin;
        const { selectedCategory, selectedChapter, selectedSection, view } = AppState.admin;
        let html = '';
        if (view === 'challengesListView') {
            html = `<span class="font-semibold">部门挑战管理</span>`;
        } else {
            html = `<a href="#" data-nav="categories" class="hover:underline">内容管理</a>`;
            if (selectedCategory) html += ` <span class="mx-2">/</span> <a href="#" data-nav="chapters" data-id="${selectedCategory.id}" class="hover:underline">${selectedCategory.title}</a>`;
            if (selectedChapter) html += ` <span class="mx-2">/</span> <a href="#" data-nav="sections" data-id="${selectedChapter.id}" class="hover:underline">${selectedChapter.title}</a>`;
            if (selectedSection) html += ` <span class="mx-2">/</span> <span class="font-semibold">${selectedSection.title}</span>`;
        }
        breadcrumb.innerHTML = html;
    },

    openModal(type, item = null) {
        AppState.admin.editingItem = item; AppState.admin.editingType = type;
        const { modal } = UI.elements.admin; modal.form.innerHTML = '';
        const v = (key, def = '') => item ? (item[key] !== null && item[key] !== undefined ? item[key] : def) : def;
        let formHtml = '';
        switch (type) {
            case 'category': modal.title.textContent = item ? '编辑篇章' : '新增篇章'; formHtml = `<div><label class="admin-label">标题</label><input name="title" class="admin-input" value="${v('title')}" required></div><div><label class="admin-label">描述</label><textarea name="description" class="admin-textarea" rows="3">${v('description')}</textarea></div><div><label class="admin-label">顺序</label><input name="order" type="number" class="admin-input" value="${v('order', 0)}" required></div>`; break;
            case 'chapter': modal.title.textContent = item ? '编辑章节' : '新增章节'; formHtml = `<div><label class="admin-label">标题</label><input name="title" class="admin-input" value="${v('title')}" required></div><div><label class="admin-label">描述</label><textarea name="description" class="admin-textarea" rows="3">${v('description')}</textarea></div><div><label class="admin-label">封面图片URL</label><input name="image_url" class="admin-input" value="${v('image_url')}"></div><div><label class="admin-label">顺序</label><input name="order" type="number" class="admin-input" value="${v('order', 0)}" required></div>`; break;
            case 'section': modal.title.textContent = item ? '编辑小节' : '新增小节'; formHtml = `<div><label class="admin-label">标题</label><input name="title" class="admin-input" value="${v('title')}" required></div><div><label class="admin-label">顺序</label><input name="order" type="number" class="admin-input" value="${v('order', 0)}" required></div>`; break;
            case 'block':
                modal.title.textContent = item ? '编辑内容块' : '新增内容块';
                const opts = v('quiz_options', ['','','','']);
                const correctIdx = v('correct_answer_index', 0);
                const contentFormat = v('content_format', 'markdown');
                formHtml = `
                    <p class="text-sm text-gray-500 mb-4">提示：一个内容块可以同时包含视频、文档和文本内容（支持Markdown或HTML格式）。</p>
                    
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
                    
                    <div class="mb-4">
                        <label class="admin-label">视频URL</label>
                        <input name="video_url" class="admin-input" value="${v('video_url')}" placeholder="https://example.com/video.mp4">
                    </div>
                    
                    <div class="mb-4">
                        <label class="admin-label">在线文档URL</label>
                        <input name="document_url" class="admin-input" value="${v('document_url')}" placeholder="https://kdocs.cn/l/...">
                        <p class="text-xs text-gray-500 mt-1">请粘贴"公开分享"或"嵌入"链接。</p>
                    </div>
                    
                    <div class="mb-4">
                        <label class="admin-label">内容格式</label>
                        <select name="content_format" class="admin-select" id="contentFormatSelect">
                            <option value="markdown" ${contentFormat === 'markdown' ? 'selected' : ''}>Markdown</option>
                            <option value="html" ${contentFormat === 'html' ? 'selected' : ''}>HTML（支持完整HTML代码）</option>
                        </select>
                    </div>
                    
                    <div id="markdownEditor" class="mb-4" style="display: ${contentFormat === 'markdown' ? 'block' : 'none'}">
                        <label class="admin-label">内容 (Markdown)</label>
                        <textarea name="content_markdown" class="admin-textarea" rows="8" placeholder="在此输入Markdown内容...">${v('content_markdown')}</textarea>
                    </div>
                    
                    <div id="htmlEditor" class="mb-4" style="display: ${contentFormat === 'html' ? 'block' : 'none'}">
                        <label class="admin-label">内容 (HTML)</label>
                        
                        <!-- AI生成器选项 -->
                        <div class="mb-3 p-3 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
                            <div class="flex items-center justify-between mb-2">
                                <label class="text-sm font-semibold text-purple-800">🚀 AI智能生成</label>
                                <div class="flex items-center gap-2">
                                    <button type="button" id="openSimpleAIGenerator" class="text-xs bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow-sm transition-all duration-200 hover:scale-105">✨ 一键AI生成</button>
                                    <button type="button" id="openAdvancedEditor" class="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-md">高级编辑器</button>
                                </div>
                            </div>
                            <p class="text-xs text-purple-600">
                                💡 只需输入标题和知识点，AI自动生成标准化的对话式学习内容
                            </p>
                        </div>
                        
                        <textarea name="content_html" class="admin-textarea" rows="12" placeholder="在此输入HTML代码，包括完整的HTML标签、CSS样式和JavaScript脚本...或者点击上方【✨ 一键AI生成】按钮，让AI为您创建对话式学习内容">${v('content_html')}</textarea>
                        <p class="text-xs text-gray-500 mt-2">
                            💡 提示：您可以直接粘贴开发好的HTML代码，系统会完整显示您的网页内容。<br>
                            💬 对话学习：包含 <code>&lt;script data-conversation&gt;</code> 标签的HTML将被识别为对话学习内容
                        </p>
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
                break;
            case 'challenge':
                modal.title.textContent = item ? '编辑挑战' : '新增挑战';
                const categoryOptions = AppState.admin.categories.map(c => `<option value="${c.id}" ${v('target_category_id') === c.id ? 'selected' : ''}>${c.title}</option>`).join('');
                formHtml = `<div><label class="admin-label">标题</label><input name="title" class="admin-input" value="${v('title')}" required></div><div><label class="admin-label">描述</label><textarea name="description" class="admin-textarea" rows="3">${v('description')}</textarea></div><div><label class="admin-label">目标篇章</label><select name="target_category_id" class="admin-select" required><option value="">选择篇章</option>${categoryOptions}</select></div><div class="grid grid-cols-2 gap-4"><div><label class="admin-label">开始时间</label><input name="start_date" type="datetime-local" class="admin-input" value="${v('start_date', new Date().toISOString().substring(0, 16))}" required></div><div><label class="admin-label">结束时间</label><input name="end_date" type="datetime-local" class="admin-input" value="${v('end_date', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().substring(0, 16))}" required></div></div><div><label class="admin-label">奖励积分</label><input name="reward_points" type="number" class="admin-input" value="${v('reward_points', 0)}" required></div><div class="flex items-center space-x-2"><input id="is_active" name="is_active" type="checkbox" class="admin-checkbox" ${v('is_active', true) ? 'checked' : ''}><label for="is_active" class="admin-label">是否活跃</label></div>`;
                break;
            case 'faction':
                modal.title.textContent = item ? '编辑阵营' : '新增阵营';
                formHtml = `<div><label class="admin-label">阵营代码</label><input name="code" class="admin-input" value="${v('code')}" placeholder="如: it_dept" required></div><div><label class="admin-label">阵营名称</label><input name="name" class="admin-input" value="${v('name')}" placeholder="如: IT技术部" required></div><div><label class="admin-label">描述</label><textarea name="description" class="admin-textarea" rows="3" placeholder="阵营描述">${v('description')}</textarea></div><div><label class="admin-label">颜色</label><input name="color" type="color" class="admin-input w-20 h-10" value="${v('color', '#FF5733')}" required></div><div><label class="admin-label">排序</label><input name="sort_order" type="number" class="admin-input" value="${v('sort_order', 0)}" min="0"></div><div class="flex items-center space-x-2"><input id="faction_is_active" name="is_active" type="checkbox" class="admin-checkbox" ${v('is_active', true) ? 'checked' : ''}><label for="faction_is_active" class="admin-label">启用阵营</label></div>`;
                break;
        }
        modal.form.innerHTML = formHtml; 
        modal.backdrop.classList.remove('hidden');
        modal.backdrop.classList.add('flex');
        
        // 为内容块添加格式切换功能
        if (type === 'block') {
            this.setupContentFormatToggle();
            this.setupSimpleAIGenerator();
            this.setupConversationEditor();
        }
    },
    closeModal() { const { modal } = UI.elements.admin; modal.backdrop.classList.add('hidden'); modal.backdrop.classList.remove('flex'); AppState.admin.editingItem = null; AppState.admin.editingType = null; },
    async handleSave() {
        const { form } = UI.elements.admin.modal; const formData = new FormData(form); const data = {};
        for (let [key, value] of formData.entries()) {
            if (key.startsWith('quiz_options')) {
                if (!data.quiz_options) data.quiz_options = [];
                data.quiz_options[parseInt(key.split('_')[2])] = value;
            } else { data[key] = value; }
        }
        const type = AppState.admin.editingType; const item = AppState.admin.editingItem;
        try {
            switch (type) {
                case 'category': await ApiService.upsertCategory({ id: item?.id, ...data }); break;
                case 'chapter': await ApiService.upsertChapter({ id: item?.id, category_id: AppState.admin.selectedCategory.id, ...data }); break;
                case 'section': await ApiService.upsertSection({ id: item?.id, chapter_id: AppState.admin.selectedChapter.id, ...data }); break;
                case 'block':
                    data.correct_answer_index = data.quiz_question ? parseInt(data.correct_answer_index) : null;
                    data.quiz_options = data.quiz_question ? data.quiz_options.filter(o => o) : null;
                    
                    // 调试信息
                    
                    if (!AppState.admin.selectedSection || !AppState.admin.selectedSection.id) {
                        throw new Error('未选择节，无法保存内容块');
                    }
                    
                    await ApiService.upsertBlock({ id: item?.id, section_id: AppState.admin.selectedSection.id, ...data });
                    break;
                case 'challenge':
                    data.is_active = data.is_active === 'on';
                    await ApiService.upsertChallenge({ id: item?.id, ...data });
                    break;
                case 'faction':
                    data.is_active = data.is_active === 'on';
                    data.sort_order = parseInt(data.sort_order) || 0;
                    await ApiService.upsertFaction({ id: item?.id, ...data });
                    clearFactionCache(); // 清除阵营缓存
                    break;
            }
            UI.showNotification('保存成功', 'success'); this.closeModal();
            this.refreshAdminViewAfterSave();
        } catch (error) { UI.showNotification(`保存失败: ${error.message}`, 'error'); }
    },
    async refreshAdminViewAfterSave() {
        if (AppState.admin.view === 'challengesListView') {
            await this.showChallengesList();
        } else if (AppState.admin.view === 'factionsListView') {
            await this.showFactionsList();
        } else {
            const freshData = await ApiService.fetchAllCategoriesForAdmin(); 
            AppState.admin.categories = freshData;
            switch(AppState.admin.view) {
                case 'categoryListView': this.renderCategoryList(); break;
                case 'chapterListView': AppState.admin.selectedCategory = freshData.find(c => c.id === AppState.admin.selectedCategory.id); this.renderChapterList(); break;
                case 'sectionListView': AppState.admin.selectedCategory = freshData.find(c => c.id === AppState.admin.selectedCategory.id); AppState.admin.selectedChapter = AppState.admin.selectedCategory.chapters.find(ch => ch.id === AppState.admin.selectedChapter.id); this.renderSectionList(); break;
                case 'blockEditorView': AppState.admin.selectedCategory = freshData.find(c => c.id === AppState.admin.selectedCategory.id); AppState.admin.selectedChapter = AppState.admin.selectedCategory.chapters.find(ch => ch.id === AppState.admin.selectedChapter.id); AppState.admin.selectedSection = AppState.admin.selectedChapter.sections.find(s => s.id === AppState.admin.selectedSection.id); this.renderBlockList(); break;
            }
        }
    },
    showDeleteConfirmation(type, id, name) { this._currentDeletion = { type, id }; UI.elements.deleteConfirmModal.message.innerHTML = `您确定要删除 "${name}" 吗？<br><strong class="text-red-400">此操作不可撤销。</strong>`; UI.elements.deleteConfirmModal.container.classList.remove('hidden'); UI.elements.deleteConfirmModal.container.classList.add('flex'); },
    hideDeleteConfirmation() { UI.elements.deleteConfirmModal.container.classList.add('hidden'); },
    async confirmDeletion() {
        const { type, id } = this._currentDeletion; if (!type || !id) return; this.hideDeleteConfirmation();
        try {
            switch (type) { 
                case 'category': await ApiService.deleteCategory(id); break; 
                case 'chapter': await ApiService.deleteChapter(id); break; 
                case 'section': await ApiService.deleteSection(id); break; 
                case 'block': await ApiService.deleteBlock(id); break; 
                case 'challenge': await ApiService.deleteChallenge(id); break;
                case 'faction': 
                    await ApiService.deleteFaction(id); 
                    clearFactionCache(); // 清除阵营缓存
                    break;
            }
            UI.showNotification('删除成功', 'success');
            await this.refreshAdminViewAfterSave();
        } catch (error) { UI.showNotification(`删除失败: ${error.message}`, 'error'); }
    },
    
    async handleEndChallenge(challengeId, challengeTitle) {
        if (confirm(`您确定要结算挑战 "${challengeTitle}" 吗？此操作将分发奖励并结束挑战。`)) {
            try {
                UI.showNotification('正在结算挑战...', 'info');
                await ApiService.finishChallenge(challengeId);
                UI.showNotification('挑战结算成功！', 'success');
                await this.showChallengesList();
            } catch (error) {
                UI.showNotification(error.message, 'error');
            }
        }
    },
    handleBreadcrumbClick(e) {
        e.preventDefault(); const t = e.target.closest('a'); if (!t) return; const { nav, id } = t.dataset;
        switch (nav) {
            case 'categories': this.showCategoryList(); break;
            case 'chapters': this.showChapterList(AppState.admin.categories.find(c => c.id == id)); break;
            case 'sections': this.showSectionList(AppState.admin.selectedCategory.chapters.find(c => c.id == id)); break;
        }
    },

    async showFactionsList() {
        try {
            // 隐藏其他视图
            UI.elements.admin.categoryListView.classList.add('hidden');
            UI.elements.admin.chapterListView.classList.add('hidden');
            UI.elements.admin.sectionListView.classList.add('hidden');
            UI.elements.admin.blockEditorView.classList.add('hidden');
            UI.elements.admin.challengesListView.classList.add('hidden');
            UI.elements.admin.factionsListView.classList.remove('hidden');

            // 设置面包屑
            UI.elements.admin.breadcrumb.innerHTML = '<a href="#" data-nav="categories">篇章管理</a> / 阵营管理';

            // 加载阵营数据
            const factions = await ApiService.getFactions();
            AppState.admin.factions = factions;

            // 渲染阵营列表
            const container = UI.elements.admin.factionsTableContainer;
            if (factions.length === 0) {
                container.innerHTML = '<p class="text-gray-500 text-center py-8">暂无阵营数据</p>';
                return;
            }

            const tableHtml = `
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="border-b border-gray-200">
                                <th class="text-left py-3 px-4 font-semibold">阵营代码</th>
                                <th class="text-left py-3 px-4 font-semibold">阵营名称</th>
                                <th class="text-left py-3 px-4 font-semibold">描述</th>
                                <th class="text-left py-3 px-4 font-semibold">颜色</th>
                                <th class="text-left py-3 px-4 font-semibold">排序</th>
                                <th class="text-left py-3 px-4 font-semibold">状态</th>
                                <th class="text-left py-3 px-4 font-semibold">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${factions.map(faction => `
                                <tr class="border-b border-gray-100 hover:bg-gray-50">
                                    <td class="py-3 px-4 font-mono text-sm">${faction.code}</td>
                                    <td class="py-3 px-4 font-semibold">${faction.name}</td>
                                    <td class="py-3 px-4 text-gray-600">${faction.description || '-'}</td>
                                    <td class="py-3 px-4">
                                        <div class="flex items-center">
                                            <div class="w-4 h-4 rounded mr-2" style="background-color: ${faction.color}"></div>
                                            <span class="text-sm font-mono">${faction.color}</span>
                                        </div>
                                    </td>
                                    <td class="py-3 px-4">${faction.sort_order}</td>
                                    <td class="py-3 px-4">
                                        <span class="px-2 py-1 rounded-full text-xs ${faction.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}">
                                            ${faction.is_active ? '启用' : '禁用'}
                                        </span>
                                    </td>
                                    <td class="py-3 px-4">
                                        <div class="flex space-x-2">
                                            <button data-action="edit" data-id="${faction.id}" data-type="faction" class="text-blue-600 hover:text-blue-800 text-sm">编辑</button>
                                            <button data-action="delete" data-id="${faction.id}" data-type="faction" class="text-red-600 hover:text-red-800 text-sm">删除</button>
                                        </div>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `;
            container.innerHTML = tableHtml;

            AppState.admin.view = 'factionsListView';
        } catch (error) {
            console.error('加载阵营列表失败:', error);
            UI.showNotification('加载阵营列表失败', 'error');
        }
    },

    // 设置内容格式切换功能
    setupContentFormatToggle() {
        const formatSelect = document.getElementById('contentFormatSelect');
        const markdownEditor = document.getElementById('markdownEditor');
        const htmlEditor = document.getElementById('htmlEditor');

        if (formatSelect && markdownEditor && htmlEditor) {
            formatSelect.addEventListener('change', (e) => {
                const selectedFormat = e.target.value;
                
                if (selectedFormat === 'html') {
                    // 显示HTML编辑器，隐藏Markdown编辑器
                    markdownEditor.style.display = 'none';
                    htmlEditor.style.display = 'block';
                } else {
                    // 显示Markdown编辑器，隐藏HTML编辑器
                    markdownEditor.style.display = 'block';
                    htmlEditor.style.display = 'none';
                }
            });
        }
    },

    // 设置简化AI生成器功能
    setupSimpleAIGenerator() {
        const openSimpleAIBtn = document.getElementById('openSimpleAIGenerator');
        const htmlTextarea = document.querySelector('textarea[name="content_html"]');
        
        if (openSimpleAIBtn && htmlTextarea) {
            openSimpleAIBtn.addEventListener('click', async () => {
                try {
                    // 动态加载简化AI生成器组件
                    const { SimpleAIGenerator } = await import('../components/simple-ai-generator.js');
                    
                    // 创建模态框
                    const modal = this.createSimpleAIModal();
                    document.body.appendChild(modal);
                    
                    // 初始化生成器
                    const generatorContainer = modal.querySelector('#simpleAIContainer');
                    const generator = new SimpleAIGenerator(generatorContainer, {
                        onGenerated: (result) => {
                            // 将生成的HTML内容填入表单
                            htmlTextarea.value = result.html;
                            
                            // 显示成功提示
                            UI.showNotification('🎉 AI内容生成成功！已自动填入到编辑器', 'success');
                            
                            // 关闭模态框
                            this.closeSimpleAIModal();
                        },
                        onError: (error) => {
                            UI.showNotification('❗ AI生成失败: ' + error, 'error');
                        }
                    });
                    
                } catch (error) {
                    console.error('加载简化AI生成器失败:', error);
                    UI.showNotification('加载组件失败，请刷新页面后重试', 'error');
                }
            });
        }
    },

    // 创建简化AI生成器模态框
    createSimpleAIModal() {
        const modal = document.createElement('div');
        modal.id = 'simpleAIModal';
        modal.className = 'fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-xl shadow-2xl w-full max-w-6xl m-4 flex flex-col max-h-[95vh]">
                <div class="p-6 border-b flex-shrink-0 flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">✨</div>
                        <div>
                            <h2 class="text-2xl font-bold text-gray-800">AI智能内容生成器</h2>
                            <p class="text-gray-500 text-sm">简单、快速、标准化</p>
                        </div>
                    </div>
                    <button id="closeSimpleAIModal" class="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
                <div id="simpleAIContainer" class="flex-1 overflow-y-auto">
                    <!-- 简化AI生成器将在这里渲染 -->
                </div>
            </div>
        `;
        
        // 绑定关闭事件
        const closeBtn = modal.querySelector('#closeSimpleAIModal');
        const backdrop = modal;
        
        const closeModal = () => this.closeSimpleAIModal();
        
        closeBtn.addEventListener('click', closeModal);
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) closeModal();
        });
        
        return modal;
    },

    // 关闭简化AI生成器模态框
    closeSimpleAIModal() {
        const modal = document.getElementById('simpleAIModal');
        if (modal) {
            modal.remove();
        }
    },

    // 设置对话编辑器功能
    setupConversationEditor() {
        const openEditorBtn = document.getElementById('openConversationEditor');
        const htmlTextarea = document.querySelector('textarea[name="content_html"]');
        const htmlEditorWrapper = document.getElementById('htmlEditor');
        
        if (openEditorBtn) {
            // 强化按钮可见性
            openEditorBtn.classList.add('bg-purple-600','hover:bg-purple-700','text-white','font-bold');
            if (!openEditorBtn.textContent.includes('💬')) {
                openEditorBtn.textContent = '💬 可视化编辑器';
            }
        }

        // 在HTML编辑区域顶部插入引导提示
        if (htmlEditorWrapper && !htmlEditorWrapper.querySelector('.conversation-guide')) {
            const guide = document.createElement('div');
            guide.className = 'conversation-guide mb-3 p-3 rounded-lg bg-purple-50 border border-purple-200 text-purple-800 text-sm flex items-center justify-between';
            guide.innerHTML = `
                <div>此区域支持“对话学习”内容。包含 <code>data-conversation</code> 的JSON脚本会被自动识别与渲染。</div>
                <button type="button" class="ml-4 px-3 py-1 rounded bg-purple-600 text-white hover:bg-purple-700" id="quickOpenConversationEditor">立即开始</button>
            `;
            htmlEditorWrapper.prepend(guide);
            const quickBtn = guide.querySelector('#quickOpenConversationEditor');
            if (quickBtn && htmlTextarea) {
                quickBtn.addEventListener('click', () => window.open('/tools/conversation-generator.html', '_blank'));
            }
        }
        
        if (openEditorBtn && htmlTextarea) {
            // 将主按钮切换为AI生成器
            openEditorBtn.addEventListener('click', () => {
                window.open('/tools/conversation-generator.html', '_blank');
            });
        }

        // AI 生成器按钮：打开工具页
        const aiGenBtn = document.getElementById('openAIGenerator');
        if (aiGenBtn && htmlTextarea) {
            // 次按钮作为“高级可视化编辑器”入口
            aiGenBtn.addEventListener('click', () => {
                this.openConversationEditorModal(htmlTextarea);
            });
        }
    },

    // 打开对话编辑器模态框
    openConversationEditorModal(targetTextarea) {
        // 检查是否已加载对话编辑器组件
        if (typeof window.ConversationEditor === 'undefined') {
            // 动态加载对话编辑器组件
            const script = document.createElement('script');
            script.src = '/js/components/conversation-editor.js';
            script.onload = () => {
                this.initConversationEditor(targetTextarea);
            };
            script.onerror = () => {
                UI.showNotification('无法加载对话编辑器组件', 'error');
            };
            document.head.appendChild(script);
        } else {
            this.initConversationEditor(targetTextarea);
        }
    },

    // 初始化对话编辑器
    initConversationEditor(targetTextarea) {
        try {
            // 解析现有的HTML内容，提取对话数据
            let existingData = null;
            const existingHtml = targetTextarea.value;
            
            if (existingHtml && existingHtml.includes('data-conversation')) {
                const scriptMatch = existingHtml.match(/<script[^>]*data-conversation[^>]*>([\s\S]*?)<\/script>/);
                if (scriptMatch) {
                    try {
                        existingData = JSON.parse(scriptMatch[1]);
                    } catch (e) {
                        console.warn('无法解析现有的对话数据:', e);
                    }
                }
            }

            // 如果没有现有数据，提供入门模板
            if (!existingData) {
                existingData = this.getStarterConversationTemplate();
            }

            // 创建模态框
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50';
            modal.innerHTML = `
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-6xl m-4 flex flex-col max-h-[90vh]">
                    <div class="p-6 border-b flex-shrink-0 flex items-center justify-between">
                        <h2 class="text-2xl font-bold text-gray-800">💬 对话学习内容编辑器</h2>
                        <button id="closeConversationEditor" class="text-gray-500 hover:text-gray-700">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                    <div id="conversationEditorContainer" class="flex-1 p-6 overflow-y-auto">
                        <!-- 对话编辑器将在这里渲染 -->
                    </div>
                    <div class="p-6 bg-gray-50 border-t flex justify-end space-x-3 flex-shrink-0">
                        <button id="cancelConversationEditor" class="btn bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg">取消</button>
                        <button id="saveConversationEditor" class="btn bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg">保存到HTML</button>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);

            // 先绑定关闭事件，确保任何情况下都可关闭
            const closeBtn = modal.querySelector('#closeConversationEditor');
            const cancelBtn = modal.querySelector('#cancelConversationEditor');
            const saveBtn = modal.querySelector('#saveConversationEditor');
            const containerEl = modal.querySelector('#conversationEditorContainer');
            const safeClose = () => modal.remove();
            closeBtn.addEventListener('click', safeClose);
            cancelBtn.addEventListener('click', safeClose);
            modal.addEventListener('click', (e) => { if (e.target === modal) safeClose(); });

            // 尝试初始化对话编辑器
            let conversationEditor = null;
            try {
                conversationEditor = new window.ConversationEditor({
                    containerId: 'conversationEditorContainer',
                    initialData: existingData,
                    onSave: (conversationData) => {
                        // 校验数据结构
                        const valid = this.validateConversationData(conversationData);
                        if (!valid.ok) {
                            UI.showNotification(`保存失败：${valid.message}`, 'error');
                            return;
                        }
                        // 生成完整的HTML内容
                        const htmlContent = this.generateConversationHTML(conversationData);
                        targetTextarea.value = htmlContent;
                        
                        // 关闭模态框
                        safeClose();
                        
                        UI.showNotification('对话学习内容已保存到HTML编辑器', 'success');
                    }
                });

                // 保存事件
                saveBtn.addEventListener('click', () => conversationEditor.saveConversation());
            } catch (initErr) {
                console.error('初始化对话编辑器失败:', initErr);
                // 降级：在容器中显示错误提示，并禁用保存按钮
                if (containerEl) {
                    containerEl.innerHTML = '<div class="p-6 text-red-600">对话编辑器加载失败，请刷新页面后重试。</div>';
                }
                if (saveBtn) {
                    saveBtn.disabled = true;
                    saveBtn.classList.add('opacity-50','cursor-not-allowed');
                }
                UI.showNotification('对话编辑器初始化失败', 'error');
            }

        } catch (error) {
            console.error('初始化对话编辑器失败:', error);
            UI.showNotification('对话编辑器初始化失败', 'error');
        }
    },

    // 生成对话学习HTML内容
    generateConversationHTML(conversationData) {
        return `<div class="conversation-learning-container">
    <div class="conversation-header">
        <h2>${conversationData.title || '对话学习'}</h2>
        <p>${conversationData.description || ''}</p>
    </div>
    
    <!-- 对话数据 -->
    <script type="application/json" data-conversation>
${JSON.stringify(conversationData, null, 4)}
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
    },

    // 入门模板
    getStarterConversationTemplate() {
        return {
            title: '欢迎体验对话学习',
            description: '这是一个最小可用的示例，包含文本、图片与测试。',
            pointsPerPercent: 1,
            conversations: [
                { type: 'text', role: 'mentor', text: '你好，我是你的导师。我们将通过对话快速了解流程管理基础。' },
                { type: 'image', role: 'mentor', url: 'https://placehold.co/600x300/0f172a/fff?text=%E7%A4%BA%E4%BE%8B%E5%9B%BE%E7%89%87', caption: '示例图片' },
                { type: 'test', question: '流程改进的第一步是？', options: ['识别问题', '立刻执行变更', '忽略数据', '等待机会'], correct: [0], points: 5 }
            ]
        };
    },

    // 保存前校验
    validateConversationData(data) {
        if (!data || !Array.isArray(data.conversations) || data.conversations.length === 0) {
            return { ok: false, message: '对话内容为空，请至少添加一个步骤。' };
        }
        for (let i = 0; i < data.conversations.length; i++) {
            const step = data.conversations[i];
            if (!step.type) {
                return { ok: false, message: `第 ${i + 1} 步缺少类型(type)。` };
            }
            if (step.type === 'text' && (!step.text || !step.text.trim())) {
                return { ok: false, message: `第 ${i + 1} 步为文本，但内容为空。` };
            }
            if (step.type === 'image' && (!step.url || !/^https?:\/\//.test(step.url))) {
                return { ok: false, message: `第 ${i + 1} 步为图片，但图片URL无效。` };
            }
            if (step.type === 'test') {
                if (!step.question || !Array.isArray(step.options) || step.options.length < 2) {
                    return { ok: false, message: `第 ${i + 1} 步为测试题，题干或选项不完整。` };
                }
                if (!Array.isArray(step.correct) || step.correct.length === 0) {
                    return { ok: false, message: `第 ${i + 1} 步为测试题，请设置正确答案。` };
                }
            }
        }
        return { ok: true };
    }
};
