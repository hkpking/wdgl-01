/**
 * @file DOM操作管理器
 * @description 统一DOM操作，减少重复代码，提供类型安全的DOM操作接口
 * @version 1.0.0
 */

class DOMManager {
    constructor() {
        this.elementCache = new Map();
        this.eventListeners = new Map();
    }

    /**
     * 获取DOM元素（带缓存）
     * @param {string} selector - CSS选择器或元素ID
     * @param {boolean} useCache - 是否使用缓存
     * @returns {Element|null}
     */
    getElement(selector, useCache = true) {
        if (useCache && this.elementCache.has(selector)) {
            return this.elementCache.get(selector);
        }

        let element;
        if (selector.startsWith('#')) {
            element = document.getElementById(selector.slice(1));
        } else {
            element = document.querySelector(selector);
        }

        if (useCache && element) {
            this.elementCache.set(selector, element);
        }

        return element;
    }

    /**
     * 获取多个DOM元素
     * @param {string} selector - CSS选择器
     * @returns {NodeList}
     */
    getElements(selector) {
        return document.querySelectorAll(selector);
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
        const element = typeof elementOrSelector === 'string' 
            ? this.getElement(elementOrSelector)
            : elementOrSelector;

        if (!element) {
            console.warn(`元素未找到: ${elementOrSelector}`);
            return false;
        }

        element.addEventListener(event, handler, options);

        // 记录事件监听器以便后续清理
        const key = `${element.id || element.className}_${event}`;
        if (!this.eventListeners.has(key)) {
            this.eventListeners.set(key, []);
        }
        this.eventListeners.get(key).push({ element, event, handler, options });

        return true;
    }

    /**
     * 批量添加事件监听器
     * @param {Array} eventConfigs - 事件配置数组
     */
    addEventListenersBatch(eventConfigs) {
        eventConfigs.forEach(config => {
            const { selector, event, handler, options } = config;
            this.addEventListener(selector, event, handler, options);
        });
    }

    /**
     * 移除事件监听器
     * @param {string|Element} elementOrSelector - 元素或选择器
     * @param {string} event - 事件类型
     * @param {Function} handler - 事件处理函数
     */
    removeEventListener(elementOrSelector, event, handler) {
        const element = typeof elementOrSelector === 'string' 
            ? this.getElement(elementOrSelector)
            : elementOrSelector;

        if (element) {
            element.removeEventListener(event, handler);
        }
    }

    /**
     * 设置元素内容（安全版本）
     * @param {string|Element} elementOrSelector - 元素或选择器
     * @param {string} content - 内容
     * @param {boolean} isHTML - 是否为HTML内容
     */
    setContent(elementOrSelector, content, isHTML = false) {
        const element = typeof elementOrSelector === 'string' 
            ? this.getElement(elementOrSelector)
            : elementOrSelector;

        if (!element) {
            console.warn(`元素未找到: ${elementOrSelector}`);
            return false;
        }

        if (isHTML) {
            element.innerHTML = content;
        } else {
            element.textContent = content;
        }

        return true;
    }

    /**
     * 切换元素类名
     * @param {string|Element} elementOrSelector - 元素或选择器
     * @param {string} className - 类名
     * @param {boolean} force - 强制添加/移除
     */
    toggleClass(elementOrSelector, className, force) {
        const element = typeof elementOrSelector === 'string' 
            ? this.getElement(elementOrSelector)
            : elementOrSelector;

        if (!element) {
            console.warn(`元素未找到: ${elementOrSelector}`);
            return false;
        }

        return element.classList.toggle(className, force);
    }

    /**
     * 批量操作类名
     * @param {string|Element} elementOrSelector - 元素或选择器
     * @param {Object} classOperations - 类操作对象 {add: [], remove: [], toggle: []}
     */
    manipulateClasses(elementOrSelector, classOperations) {
        const element = typeof elementOrSelector === 'string' 
            ? this.getElement(elementOrSelector)
            : elementOrSelector;

        if (!element) {
            console.warn(`元素未找到: ${elementOrSelector}`);
            return false;
        }

        const { add = [], remove = [], toggle = [] } = classOperations;

        add.forEach(cls => element.classList.add(cls));
        remove.forEach(cls => element.classList.remove(cls));
        toggle.forEach(cls => element.classList.toggle(cls));

        return true;
    }

    /**
     * 显示/隐藏元素
     * @param {string|Element} elementOrSelector - 元素或选择器
     * @param {boolean} show - 是否显示
     * @param {string} displayType - 显示类型
     */
    toggleVisibility(elementOrSelector, show, displayType = 'block') {
        const element = typeof elementOrSelector === 'string' 
            ? this.getElement(elementOrSelector)
            : elementOrSelector;

        if (!element) {
            console.warn(`元素未找到: ${elementOrSelector}`);
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
    }

    /**
     * 创建元素
     * @param {string} tag - 标签名
     * @param {Object} attributes - 属性对象
     * @param {string} content - 内容
     * @returns {Element}
     */
    createElement(tag, attributes = {}, content = '') {
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
    }

    /**
     * 清理缓存和事件监听器
     */
    cleanup() {
        this.elementCache.clear();
        
        // 清理事件监听器
        this.eventListeners.forEach((listeners, key) => {
            listeners.forEach(({ element, event, handler }) => {
                element.removeEventListener(event, handler);
            });
        });
        this.eventListeners.clear();
    }

    /**
     * 性能监控：DOM操作统计
     */
    getStats() {
        return {
            cachedElements: this.elementCache.size,
            eventListeners: Array.from(this.eventListeners.values())
                .reduce((total, listeners) => total + listeners.length, 0)
        };
    }
}

// 创建单例实例
export const domManager = new DOMManager();

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
    createElement
} = domManager;

export default domManager;