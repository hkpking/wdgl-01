/**
 * @file 安全的DOM操作管理器
 * @description 统一DOM操作，减少重复代码，提供类型安全的DOM操作接口
 * @version 1.0.1 - 安全增强版
 */

class SafeDOMManager {
    constructor() {
        this.elementCache = new Map();
        this.eventListeners = new Map();
        this.stats = {
            cacheHits: 0,
            cacheMisses: 0,
            errors: 0
        };
    }

    /**
     * 安全检查元素是否有效
     * @param {Element} element 
     * @returns {boolean}
     */
    isValidElement(element) {
        return element && 
               element.nodeType === Node.ELEMENT_NODE && 
               typeof element.getBoundingClientRect === 'function' &&
               element.isConnected !== false;
    }

    /**
     * 获取DOM元素（带缓存和安全检查）
     * @param {string} selector - CSS选择器或元素ID
     * @param {boolean} useCache - 是否使用缓存
     * @returns {Element|null}
     */
    getElement(selector, useCache = true) {
        try {
            // 检查缓存
            if (useCache && this.elementCache.has(selector)) {
                const cachedElement = this.elementCache.get(selector);
                // 验证缓存元素是否仍然有效
                if (this.isValidElement(cachedElement)) {
                    this.stats.cacheHits++;
                    return cachedElement;
                } else {
                    // 清除无效缓存
                    this.elementCache.delete(selector);
                }
            }

            let element;
            if (selector.startsWith('#')) {
                element = document.getElementById(selector.slice(1));
            } else {
                element = document.querySelector(selector);
            }

            // 验证元素有效性
            if (element && this.isValidElement(element)) {
                if (useCache) {
                    this.elementCache.set(selector, element);
                }
                this.stats.cacheMisses++;
                return element;
            }

            this.stats.cacheMisses++;
            return null;

        } catch (error) {
            console.warn(`DOMManager: 获取元素时发生错误 (${selector}):`, error);
            this.stats.errors++;
            return null;
        }
    }

    /**
     * 获取多个DOM元素
     * @param {string} selector - CSS选择器
     * @returns {NodeList}
     */
    getElements(selector) {
        try {
            return document.querySelectorAll(selector);
        } catch (error) {
            console.warn(`DOMManager: 获取元素列表时发生错误 (${selector}):`, error);
            this.stats.errors++;
            return document.createDocumentFragment().childNodes; // 返回空NodeList
        }
    }

    /**
     * 批量获取元素（优化版本）
     * @param {Object} selectors - 选择器对象 {key: selector}
     * @returns {Object} - 元素对象 {key: element}
     */
    getElementsBatch(selectors) {
        const elements = {};
        
        Object.entries(selectors).forEach(([key, selector]) => {
            elements[key] = this.getElement(selector);
        });

        return elements;
    }

    /**
     * 安全的事件监听器添加
     * @param {string|Element} elementOrSelector - 元素或选择器
     * @param {string} event - 事件类型
     * @param {Function} handler - 事件处理函数
     * @param {Object} options - 事件选项
     */
    addEventListener(elementOrSelector, event, handler, options = {}) {
        try {
            const element = typeof elementOrSelector === 'string' 
                ? this.getElement(elementOrSelector)
                : elementOrSelector;

            if (!this.isValidElement(element)) {
                console.warn(`DOMManager: 无法为无效元素添加事件监听器: ${elementOrSelector}`);
                return false;
            }

            // 包装处理函数以捕获错误
            const safeHandler = (event) => {
                try {
                    return handler(event);
                } catch (error) {
                    console.error('DOMManager: 事件处理函数执行错误:', error);
                    this.stats.errors++;
                }
            };

            element.addEventListener(event, safeHandler, options);

            // 记录事件监听器以便后续清理
            const key = `${element.id || element.tagName}_${event}_${Date.now()}`;
            if (!this.eventListeners.has(key)) {
                this.eventListeners.set(key, []);
            }
            this.eventListeners.get(key).push({ 
                element, 
                event, 
                handler: safeHandler, 
                originalHandler: handler,
                options 
            });

            return true;

        } catch (error) {
            console.warn('DOMManager: 添加事件监听器时发生错误:', error);
            this.stats.errors++;
            return false;
        }
    }

    /**
     * 批量添加事件监听器
     * @param {Array} eventConfigs - 事件配置数组
     */
    addEventListenersBatch(eventConfigs) {
        let successCount = 0;
        eventConfigs.forEach(config => {
            const { selector, event, handler, options } = config;
            if (this.addEventListener(selector, event, handler, options)) {
                successCount++;
            }
        });
        return successCount;
    }

    /**
     * 移除事件监听器
     * @param {string|Element} elementOrSelector - 元素或选择器
     * @param {string} event - 事件类型
     * @param {Function} handler - 事件处理函数
     */
    removeEventListener(elementOrSelector, event, handler) {
        try {
            const element = typeof elementOrSelector === 'string' 
                ? this.getElement(elementOrSelector)
                : elementOrSelector;

            if (this.isValidElement(element)) {
                element.removeEventListener(event, handler);
            }
        } catch (error) {
            console.warn('DOMManager: 移除事件监听器时发生错误:', error);
            this.stats.errors++;
        }
    }

    /**
     * 设置元素内容（安全版本）
     * @param {string|Element} elementOrSelector - 元素或选择器
     * @param {string} content - 内容
     * @param {boolean} isHTML - 是否为HTML内容
     */
    setContent(elementOrSelector, content, isHTML = false) {
        try {
            const element = typeof elementOrSelector === 'string' 
                ? this.getElement(elementOrSelector)
                : elementOrSelector;

            if (!this.isValidElement(element)) {
                console.warn(`DOMManager: 无法为无效元素设置内容: ${elementOrSelector}`);
                return false;
            }

            if (isHTML) {
                element.innerHTML = content;
            } else {
                element.textContent = content;
            }

            return true;

        } catch (error) {
            console.warn('DOMManager: 设置元素内容时发生错误:', error);
            this.stats.errors++;
            return false;
        }
    }

    /**
     * 切换元素类名
     * @param {string|Element} elementOrSelector - 元素或选择器
     * @param {string} className - 类名
     * @param {boolean} force - 强制添加/移除
     */
    toggleClass(elementOrSelector, className, force) {
        try {
            const element = typeof elementOrSelector === 'string' 
                ? this.getElement(elementOrSelector)
                : elementOrSelector;

            if (!this.isValidElement(element)) {
                console.warn(`DOMManager: 无法为无效元素切换类名: ${elementOrSelector}`);
                return false;
            }

            return element.classList.toggle(className, force);

        } catch (error) {
            console.warn('DOMManager: 切换元素类名时发生错误:', error);
            this.stats.errors++;
            return false;
        }
    }

    /**
     * 批量操作类名
     * @param {string|Element} elementOrSelector - 元素或选择器
     * @param {Object} classOperations - 类操作对象 {add: [], remove: [], toggle: []}
     */
    manipulateClasses(elementOrSelector, classOperations) {
        try {
            const element = typeof elementOrSelector === 'string' 
                ? this.getElement(elementOrSelector)
                : elementOrSelector;

            if (!this.isValidElement(element)) {
                console.warn(`DOMManager: 无法为无效元素操作类名: ${elementOrSelector}`);
                return false;
            }

            const { add = [], remove = [], toggle = [] } = classOperations;

            add.forEach(cls => element.classList.add(cls));
            remove.forEach(cls => element.classList.remove(cls));
            toggle.forEach(cls => element.classList.toggle(cls));

            return true;

        } catch (error) {
            console.warn('DOMManager: 批量操作类名时发生错误:', error);
            this.stats.errors++;
            return false;
        }
    }

    /**
     * 显示/隐藏元素
     * @param {string|Element} elementOrSelector - 元素或选择器  
     * @param {boolean} show - 是否显示
     * @param {string} displayType - 显示类型
     */
    toggleVisibility(elementOrSelector, show, displayType = 'block') {
        try {
            const element = typeof elementOrSelector === 'string' 
                ? this.getElement(elementOrSelector)
                : elementOrSelector;

            if (!this.isValidElement(element)) {
                console.warn(`DOMManager: 无法为无效元素切换可见性: ${elementOrSelector}`);
                return false;
            }

            if (show) {
                element.style.display = displayType;
                element.classList.remove('hidden');
            } else {
                element.style.display = 'none';
                element.classList.add('hidden');
            }

            return true;

        } catch (error) {
            console.warn('DOMManager: 切换元素可见性时发生错误:', error);
            this.stats.errors++;
            return false;
        }
    }

    /**
     * 安全获取元素边界信息
     * @param {string|Element} elementOrSelector - 元素或选择器
     * @returns {DOMRect|Object}
     */
    getElementBounds(elementOrSelector) {
        try {
            const element = typeof elementOrSelector === 'string' 
                ? this.getElement(elementOrSelector)
                : elementOrSelector;

            if (!this.isValidElement(element)) {
                console.warn(`DOMManager: 无法获取无效元素的边界信息: ${elementOrSelector}`);
                return { top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0 };
            }

            return element.getBoundingClientRect();

        } catch (error) {
            console.warn('DOMManager: 获取元素边界信息时发生错误:', error);
            this.stats.errors++;
            return { top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0 };
        }
    }

    /**
     * 检查元素是否在视口中
     * @param {string|Element} elementOrSelector - 元素或选择器
     * @returns {boolean}
     */
    isElementInViewport(elementOrSelector) {
        try {
            const element = typeof elementOrSelector === 'string' 
                ? this.getElement(elementOrSelector)
                : elementOrSelector;

            if (!this.isValidElement(element)) {
                return false;
            }

            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );

        } catch (error) {
            console.warn('DOMManager: 检查元素视口状态时发生错误:', error);
            this.stats.errors++;
            return false;
        }
    }

    /**
     * 创建元素
     * @param {string} tag - 标签名
     * @param {Object} attributes - 属性对象
     * @param {string} content - 内容
     * @returns {Element}
     */
    createElement(tag, attributes = {}, content = '') {
        try {
            const element = document.createElement(tag);

            Object.entries(attributes).forEach(([key, value]) => {
                if (key === 'className') {
                    element.className = value;
                } else if (key === 'dataset') {
                    Object.entries(value).forEach(([dataKey, dataValue]) => {
                        element.dataset[dataKey] = dataValue;
                    });
                } else {
                    element.setAttribute(key, value);
                }
            });

            if (content) {
                element.textContent = content;
            }

            return element;

        } catch (error) {
            console.warn('DOMManager: 创建元素时发生错误:', error);
            this.stats.errors++;
            return null;
        }
    }

    /**
     * 清理缓存和事件监听器
     */
    cleanup() {
        try {
            this.elementCache.clear();
            
            // 清理事件监听器
            this.eventListeners.forEach((listeners, key) => {
                listeners.forEach(({ element, event, handler }) => {
                    if (this.isValidElement(element)) {
                        element.removeEventListener(event, handler);
                    }
                });
            });
            this.eventListeners.clear();

            // 重置统计
            this.stats = {
                cacheHits: 0,
                cacheMisses: 0,
                errors: 0
            };

        } catch (error) {
            console.warn('DOMManager: 清理时发生错误:', error);
        }
    }

    /**
     * 性能监控：DOM操作统计
     */
    getStats() {
        return {
            cachedElements: this.elementCache.size,
            eventListeners: Array.from(this.eventListeners.values())
                .reduce((total, listeners) => total + listeners.length, 0),
            cacheHits: this.stats.cacheHits,
            cacheMisses: this.stats.cacheMisses,
            errors: this.stats.errors,
            cacheHitRate: this.stats.cacheHits + this.stats.cacheMisses > 0 
                ? (this.stats.cacheHits / (this.stats.cacheHits + this.stats.cacheMisses) * 100).toFixed(2)
                : 0
        };
    }
}

// 创建单例实例
export const domManager = new SafeDOMManager();

// 便捷方法导出
export const {
    getElement,
    getElements,
    getElementsBatch,
    addEventListener,
    addEventListenersBatch,
    removeEventListener,
    setContent,
    toggleClass,
    manipulateClasses,
    toggleVisibility,
    createElement,
    getElementBounds,
    isElementInViewport
} = domManager;

export default domManager;