/**
 * HTML编辑器组件 - 支持HTML内容编辑和实时预览
 */
export class HTMLEditor {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            height: '400px',
            showPreview: true,
            ...options
        };
        this.init();
    }

    init() {
        this.container.innerHTML = `
            <div class="html-editor">
                <div class="editor-toolbar mb-3">
                    <div class="btn-group" role="group">
                        <button type="button" class="btn btn-sm btn-outline-secondary" id="edit-tab">编辑</button>
                        <button type="button" class="btn btn-sm btn-outline-secondary active" id="preview-tab">预览</button>
                        <button type="button" class="btn btn-sm btn-outline-secondary" id="split-tab">分屏</button>
                    </div>
                </div>
                <div class="editor-content" style="height: ${this.options.height}">
                    <div class="editor-pane">
                        <textarea class="form-control html-textarea" 
                                  placeholder="在此输入HTML内容..."
                                  style="height: 100%; resize: none; font-family: 'Courier New', monospace;"></textarea>
                    </div>
                    <div class="preview-pane">
                        <div class="html-preview border rounded" style="height: 100%; overflow-y: auto; padding: 15px; background: white;"></div>
                    </div>
                </div>
            </div>
        `;

        this.textarea = this.container.querySelector('.html-textarea');
        this.preview = this.container.querySelector('.html-preview');
        this.editTab = this.container.querySelector('#edit-tab');
        this.previewTab = this.container.querySelector('#preview-tab');
        this.splitTab = this.container.querySelector('#split-tab');

        this.bindEvents();
        this.setMode('preview');
    }

    bindEvents() {
        // 标签页切换
        this.editTab.addEventListener('click', () => this.setMode('edit'));
        this.previewTab.addEventListener('click', () => this.setMode('preview'));
        this.splitTab.addEventListener('click', () => this.setMode('split'));

        // 实时预览
        this.textarea.addEventListener('input', () => {
            this.updatePreview();
        });
    }

    setMode(mode) {
        const editorContent = this.container.querySelector('.editor-content');
        
        // 更新标签状态
        [this.editTab, this.previewTab, this.splitTab].forEach(tab => {
            tab.classList.remove('active');
        });

        switch(mode) {
            case 'edit':
                this.editTab.classList.add('active');
                editorContent.style.display = 'block';
                editorContent.querySelector('.editor-pane').style.display = 'block';
                editorContent.querySelector('.preview-pane').style.display = 'none';
                break;
            case 'preview':
                this.previewTab.classList.add('active');
                editorContent.style.display = 'block';
                editorContent.querySelector('.editor-pane').style.display = 'none';
                editorContent.querySelector('.preview-pane').style.display = 'block';
                this.updatePreview();
                break;
            case 'split':
                this.splitTab.classList.add('active');
                editorContent.style.display = 'flex';
                editorContent.querySelector('.editor-pane').style.display = 'block';
                editorContent.querySelector('.preview-pane').style.display = 'block';
                editorContent.querySelector('.editor-pane').style.width = '50%';
                editorContent.querySelector('.preview-pane').style.width = '50%';
                editorContent.querySelector('.preview-pane').style.marginLeft = '10px';
                this.updatePreview();
                break;
        }
    }

    updatePreview() {
        const htmlContent = this.textarea.value;
        this.preview.innerHTML = htmlContent || '<p class="text-muted">预览区域</p>';
    }

    getValue() {
        return this.textarea.value;
    }

    setValue(value) {
        this.textarea.value = value;
        this.updatePreview();
    }
}