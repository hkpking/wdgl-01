/**
 * 学习诊断工具
 * 用于诊断和修复学习内容无法开始的问题
 */

class LearningDiagnostic {
    constructor() {
        this.diagnosticResults = [];
    }

    /**
     * 运行完整诊断
     */
    async runFullDiagnostic() {
        
        this.diagnosticResults = [];
        
        // 1. 检查用户登录状态
        await this.checkUserLogin();
        
        // 2. 检查学习地图数据
        await this.checkLearningMap();
        
        // 3. 检查当前内容块
        await this.checkCurrentBlock();
        
        // 4. 检查对话学习数据
        await this.checkConversationData();
        
        // 5. 检查按钮状态
        await this.checkButtonState();
        
        // 6. 生成诊断报告
        this.generateReport();
        
        return this.diagnosticResults;
    }

    /**
     * 检查用户登录状态
     */
    async checkUserLogin() {
        const result = {
            test: '用户登录状态',
            status: 'unknown',
            details: [],
            suggestions: []
        };

        try {
            // 检查AppState
            if (window.AppState && window.AppState.user) {
                result.status = 'pass';
                result.details.push(`✅ 用户已登录: ${window.AppState.user.email || window.AppState.user.id}`);
                result.details.push(`✅ 用户ID: ${window.AppState.user.id}`);
            } else {
                result.status = 'fail';
                result.details.push('❌ 用户未登录或AppState.user不存在');
                result.suggestions.push('请先登录系统');
            }

            // 检查API服务
            if (window.ApiService) {
                result.details.push('✅ ApiService 已加载');
            } else {
                result.status = 'fail';
                result.details.push('❌ ApiService 未加载');
                result.suggestions.push('检查API服务是否正确初始化');
            }

        } catch (error) {
            result.status = 'error';
            result.details.push(`❌ 检查用户登录状态时出错: ${error.message}`);
        }

        this.diagnosticResults.push(result);
    }

    /**
     * 检查学习地图数据
     */
    async checkLearningMap() {
        const result = {
            test: '学习地图数据',
            status: 'unknown',
            details: [],
            suggestions: []
        };

        try {
            if (window.AppState && window.AppState.learningMap) {
                const map = window.AppState.learningMap;
                
                if (map.categories && map.categories.length > 0) {
                    result.status = 'pass';
                    result.details.push(`✅ 学习地图已加载，包含 ${map.categories.length} 个篇章`);
                    
                    // 检查当前篇章
                    if (window.AppState.current && window.AppState.current.categoryId) {
                        const category = map.categories.find(c => c.id === window.AppState.current.categoryId);
                        if (category) {
                            result.details.push(`✅ 当前篇章: ${category.title}`);
                            
                            if (category.chapters && category.chapters.length > 0) {
                                result.details.push(`✅ 篇章包含 ${category.chapters.length} 个章节`);
                                
                                // 检查当前章节
                                if (window.AppState.current.chapterId) {
                                    const chapter = category.chapters.find(ch => ch.id === window.AppState.current.chapterId);
                                    if (chapter) {
                                        result.details.push(`✅ 当前章节: ${chapter.title}`);
                                        
                                        if (chapter.sections && chapter.sections.length > 0) {
                                            result.details.push(`✅ 章节包含 ${chapter.sections.length} 个小节`);
                                        } else {
                                            result.status = 'warning';
                                            result.details.push('⚠️ 章节没有小节');
                                        }
                                    } else {
                                        result.status = 'fail';
                                        result.details.push('❌ 当前章节ID无效');
                                    }
                                }
                            } else {
                                result.status = 'warning';
                                result.details.push('⚠️ 篇章没有章节');
                            }
                        } else {
                            result.status = 'fail';
                            result.details.push('❌ 当前篇章ID无效');
                        }
                    }
                } else {
                    result.status = 'fail';
                    result.details.push('❌ 学习地图为空或未加载');
                    result.suggestions.push('刷新页面重新加载学习地图');
                }
            } else {
                result.status = 'fail';
                result.details.push('❌ 学习地图未加载');
                result.suggestions.push('检查网络连接或刷新页面');
            }

        } catch (error) {
            result.status = 'error';
            result.details.push(`❌ 检查学习地图时出错: ${error.message}`);
        }

        this.diagnosticResults.push(result);
    }

    /**
     * 检查当前内容块
     */
    async checkCurrentBlock() {
        const result = {
            test: '当前内容块',
            status: 'unknown',
            details: [],
            suggestions: []
        };

        try {
            if (window.AppState && window.AppState.current && window.AppState.current.blockId) {
                const blockId = window.AppState.current.blockId;
                result.details.push(`✅ 当前内容块ID: ${blockId}`);

                // 查找内容块
                const flatStructure = window.AppState.learningMap?.flatStructure;
                if (flatStructure) {
                    const block = flatStructure.find(b => b.id === blockId);
                    if (block) {
                        result.status = 'pass';
                        result.details.push(`✅ 内容块标题: ${block.title}`);
                        result.details.push(`✅ 内容格式: ${block.content_format || '未设置'}`);
                        
                        // 检查内容
                        if (block.content_html) {
                            result.details.push(`✅ 包含HTML内容 (${block.content_html.length} 字符)`);
                        } else if (block.content_markdown) {
                            result.details.push(`✅ 包含Markdown内容 (${block.content_markdown.length} 字符)`);
                        } else {
                            result.status = 'warning';
                            result.details.push('⚠️ 内容块没有文本内容');
                        }

                        // 检查是否已解锁
                        if (window.CourseView && typeof window.CourseView.isBlockUnlocked === 'function') {
                            const isUnlocked = window.CourseView.isBlockUnlocked(blockId);
                            if (isUnlocked) {
                                result.details.push('✅ 内容块已解锁');
                            } else {
                                result.status = 'fail';
                                result.details.push('❌ 内容块未解锁');
                                result.suggestions.push('请先完成前置内容');
                            }
                        }

                    } else {
                        result.status = 'fail';
                        result.details.push('❌ 找不到对应的内容块');
                        result.suggestions.push('检查内容块ID是否正确');
                    }
                } else {
                    result.status = 'fail';
                    result.details.push('❌ 学习地图扁平结构未加载');
                }
            } else {
                result.status = 'fail';
                result.details.push('❌ 没有选择内容块');
                result.suggestions.push('请先选择一个学习内容');
            }

        } catch (error) {
            result.status = 'error';
            result.details.push(`❌ 检查内容块时出错: ${error.message}`);
        }

        this.diagnosticResults.push(result);
    }

    /**
     * 检查对话学习数据
     */
    async checkConversationData() {
        const result = {
            test: '对话学习数据',
            status: 'unknown',
            details: [],
            suggestions: []
        };

        try {
            if (window.AppState && window.AppState.current && window.AppState.current.blockId) {
                const blockId = window.AppState.current.blockId;
                
                // 查找内容块
                const flatStructure = window.AppState.learningMap?.flatStructure;
                if (flatStructure) {
                    const block = flatStructure.find(b => b.id === blockId);
                    if (block && block.content_html) {
                        // 创建临时容器来解析HTML
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = block.content_html;
                        
                        // 检查对话数据
                        const conversationData = this.extractConversationDataFromHTML(tempDiv);
                        if (conversationData) {
                            result.status = 'pass';
                            result.details.push('✅ 找到对话学习数据');
                            result.details.push(`✅ 对话数量: ${conversationData.conversations?.length || 0}`);
                            result.details.push(`✅ 对话类型: ${conversationData.conversations?.map(c => c.type).join(', ') || '未知'}`);
                        } else {
                            result.status = 'fail';
                            result.details.push('❌ 没有找到对话学习数据');
                            result.suggestions.push('内容块可能不是对话式学习内容');
                            result.suggestions.push('检查内容是否包含正确的对话数据格式');
                        }
                    } else {
                        result.status = 'fail';
                        result.details.push('❌ 内容块没有HTML内容');
                        result.suggestions.push('内容块可能不是对话式学习内容');
                    }
                }
            }

        } catch (error) {
            result.status = 'error';
            result.details.push(`❌ 检查对话数据时出错: ${error.message}`);
        }

        this.diagnosticResults.push(result);
    }

    /**
     * 检查按钮状态
     */
    async checkButtonState() {
        const result = {
            test: '开始学习按钮',
            status: 'unknown',
            details: [],
            suggestions: []
        };

        try {
            // 查找开始学习按钮
            const buttons = document.querySelectorAll('button');
            const startButtons = Array.from(buttons).filter(btn => 
                btn.textContent.includes('开始学习') || 
                btn.textContent.includes('继续') ||
                btn.classList.contains('continue-btn')
            );

            if (startButtons.length > 0) {
                result.details.push(`✅ 找到 ${startButtons.length} 个相关按钮`);
                
                startButtons.forEach((btn, index) => {
                    const isDisabled = btn.disabled;
                    const text = btn.textContent.trim();
                    
                    if (isDisabled) {
                        result.status = 'fail';
                        result.details.push(`❌ 按钮 ${index + 1} 被禁用: "${text}"`);
                        result.suggestions.push('检查按钮禁用原因');
                    } else {
                        result.status = 'pass';
                        result.details.push(`✅ 按钮 ${index + 1} 可用: "${text}"`);
                    }
                });
            } else {
                result.status = 'fail';
                result.details.push('❌ 没有找到开始学习按钮');
                result.suggestions.push('页面可能没有正确加载');
                result.suggestions.push('检查对话学习组件是否正确初始化');
            }

        } catch (error) {
            result.status = 'error';
            result.details.push(`❌ 检查按钮状态时出错: ${error.message}`);
        }

        this.diagnosticResults.push(result);
    }

    /**
     * 从HTML中提取对话数据
     */
    extractConversationDataFromHTML(container) {
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
    }

    /**
     * 生成诊断报告
     */
    generateReport() {
        
        let hasErrors = false;
        let hasWarnings = false;

        this.diagnosticResults.forEach(result => {
            const statusIcon = {
                'pass': '✅',
                'fail': '❌',
                'warning': '⚠️',
                'error': '🔥',
                'unknown': '❓'
            }[result.status];

            
            result.details.forEach(detail => {
            });

            if (result.suggestions.length > 0) {
                result.suggestions.forEach(suggestion => {
                });
            }

            if (result.status === 'fail' || result.status === 'error') {
                hasErrors = true;
            } else if (result.status === 'warning') {
                hasWarnings = true;
            }
        });

        
        if (hasErrors) {
        } else if (hasWarnings) {
        } else {
        }

        // 生成修复建议
        this.generateFixSuggestions();
    }

    /**
     * 生成修复建议
     */
    generateFixSuggestions() {

        const failedTests = this.diagnosticResults.filter(r => r.status === 'fail' || r.status === 'error');
        
        if (failedTests.length === 0) {
            return;
        }

        // 根据失败的项目生成修复建议
        const suggestions = [];

        failedTests.forEach(test => {
            switch (test.test) {
                case '用户登录状态':
                    suggestions.push('1. 重新登录系统');
                    suggestions.push('2. 检查网络连接');
                    break;
                case '学习地图数据':
                    suggestions.push('3. 刷新页面重新加载');
                    suggestions.push('4. 检查后端服务是否正常');
                    break;
                case '当前内容块':
                    suggestions.push('5. 重新选择学习内容');
                    suggestions.push('6. 检查内容是否已解锁');
                    break;
                case '对话学习数据':
                    suggestions.push('7. 检查内容是否为对话式学习');
                    suggestions.push('8. 联系管理员检查内容格式');
                    break;
                case '开始学习按钮':
                    suggestions.push('9. 刷新页面');
                    suggestions.push('10. 检查JavaScript控制台错误');
                    break;
            }
        });

        // 通用修复步骤
        suggestions.push('11. 清除浏览器缓存');
        suggestions.push('12. 尝试不同的浏览器');
        suggestions.push('13. 检查浏览器控制台是否有错误信息');

        suggestions.forEach(suggestion => {
        });
    }

    /**
     * 快速修复尝试
     */
    async quickFix() {
        
        try {
            // 1. 重新初始化对话学习
            if (window.AppState && window.AppState.current && window.AppState.current.blockId) {
                const blockId = window.AppState.current.blockId;
                const container = document.querySelector('.content-area, #contentArea');
                
                if (container) {
                    
                    // 清空容器
                    container.innerHTML = '';
                    
                    // 重新渲染内容
                    if (window.CourseView && typeof window.CourseView.renderBlockContent === 'function') {
                        await window.CourseView.renderBlockContent(blockId);
                    }
                }
            }

            // 2. 检查按钮状态
            setTimeout(() => {
                const buttons = document.querySelectorAll('button');
                const startButtons = Array.from(buttons).filter(btn => 
                    btn.textContent.includes('开始学习')
                );
                
                if (startButtons.length > 0) {
                    startButtons.forEach(btn => {
                        if (btn.disabled) {
                            btn.disabled = false;
                        }
                    });
                }
            }, 1000);

        } catch (error) {
            console.error('❌ 快速修复失败:', error);
        }
    }
}

// 全局暴露诊断工具
window.LearningDiagnostic = LearningDiagnostic;

// 便捷的诊断函数
window.diagnoseLearning = async function() {
    const diagnostic = new LearningDiagnostic();
    return await diagnostic.runFullDiagnostic();
};

// 便捷的修复函数
window.fixLearning = async function() {
    const diagnostic = new LearningDiagnostic();
    await diagnostic.runFullDiagnostic();
    await diagnostic.quickFix();
};







