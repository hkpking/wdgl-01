import * as mammoth from 'mammoth';

/**
 * 增强的 styleMap 配置 - 覆盖中英文 Word 常见样式
 * 参考 Google Docs 导入行为，尽可能保留原始格式
 */
const ENHANCED_STYLE_MAP = [
    // ==================== 标题样式 ====================
    // 英文 Word 标题
    "p[style-name='Heading 1'] => h1:fresh",
    "p[style-name='Heading 2'] => h2:fresh",
    "p[style-name='Heading 3'] => h3:fresh",
    "p[style-name='Heading 4'] => h4:fresh",
    "p[style-name='Heading 5'] => h5:fresh",
    "p[style-name='Heading 6'] => h6:fresh",

    // 中文 Word 标题 (简体)
    "p[style-name='标题 1'] => h1:fresh",
    "p[style-name='标题 2'] => h2:fresh",
    "p[style-name='标题 3'] => h3:fresh",
    "p[style-name='标题 4'] => h4:fresh",
    "p[style-name='标题 5'] => h5:fresh",
    "p[style-name='标题 6'] => h6:fresh",

    // 繁体中文标题
    "p[style-name='標題 1'] => h1:fresh",
    "p[style-name='標題 2'] => h2:fresh",
    "p[style-name='標題 3'] => h3:fresh",

    // WPS Office 样式
    "p[style-name='标题1'] => h1:fresh",
    "p[style-name='标题2'] => h2:fresh",
    "p[style-name='标题3'] => h3:fresh",

    // 自定义封面样式 (项目特有)
    "p[style-name='封面文档标题'] => h1.doc-title",
    "p[style-name='封面表格文本'] => p.table-text",

    // ==================== 列表样式 ====================
    // 无序列表
    "p[style-name='List Paragraph'] => ul > li:fresh",
    "p[style-name='List Bullet'] => ul > li:fresh",
    "p[style-name='List Bullet 2'] => ul > li:fresh",
    "p[style-name='List Bullet 3'] => ul > li:fresh",
    "p[style-name='列表段落'] => ul > li:fresh",
    "p[style-name='项目符号'] => ul > li:fresh",

    // 有序列表
    "p[style-name='List Number'] => ol > li:fresh",
    "p[style-name='List Number 2'] => ol > li:fresh",
    "p[style-name='List Number 3'] => ol > li:fresh",
    "p[style-name='编号列表'] => ol > li:fresh",

    // ==================== 引用和代码 ====================
    "p[style-name='Quote'] => blockquote > p:fresh",
    "p[style-name='Block Quote'] => blockquote > p:fresh",
    "p[style-name='引用'] => blockquote > p:fresh",
    "p[style-name='Intense Quote'] => blockquote > p:fresh",

    // 代码块 (通常用 "代码" 或 monospace 字体)
    "p[style-name='Code'] => pre > code:fresh",
    "p[style-name='代码'] => pre > code:fresh",
    "r[style-name='Code'] => code",

    // ==================== 文本强调样式 ====================
    "r[style-name='Strong'] => strong",
    "r[style-name='Emphasis'] => em",
    "r[style-name='Intense Emphasis'] => strong > em",
    "r[style-name='Book Title'] => cite",
    "r[style-name='Subtle Emphasis'] => em.subtle",

    // ==================== 其他常见样式 ====================
    "p[style-name='Title'] => h1.document-title",
    "p[style-name='Subtitle'] => h2.document-subtitle",
    "p[style-name='No Spacing'] => p",
    "p[style-name='Normal'] => p",
    "p[style-name='正文'] => p",

    // 表格标题
    "p[style-name='Table Heading'] => p.table-heading",
    "p[style-name='表格标题'] => p.table-heading",
];

/**
 * 创建图片转换器 - 将嵌入式图片转为 base64 data URL
 * @returns {object} mammoth 图片转换器配置
 */
const createImageConverter = () => {
    return {
        convertImage: mammoth.images.inline(async (element) => {
            try {
                // 读取图片的 base64 数据
                const imageBuffer = await element.read("base64");
                const contentType = element.contentType || 'image/png';

                // 返回 data URL 格式的图片
                return {
                    src: `data:${contentType};base64,${imageBuffer}`
                };
            } catch (error) {
                console.warn('[Import] Failed to convert image:', error);
                // 返回占位图片
                return {
                    src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="150" viewBox="0 0 200 150"%3E%3Crect fill="%23f0f0f0" width="200" height="150"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3E图片加载失败%3C/text%3E%3C/svg%3E'
                };
            }
        })
    };
};

/**
 * 后处理 HTML - 修复 Tiptap 兼容性问题
 * @param {string} html - 原始 HTML
 * @returns {string} - 处理后的 HTML
 */
const postProcessHtml = (html) => {
    if (!html) return '';

    let processed = html;

    // 1. Tiptap 要求表格单元格必须有内容
    processed = processed.replace(/<td>\s*<\/td>/g, '<td><p>&nbsp;</p></td>');
    processed = processed.replace(/<th>\s*<\/th>/g, '<th><p>&nbsp;</p></th>');

    // 2. 确保图片有 max-width 防止溢出
    processed = processed.replace(/<img(?![^>]*style=)/g, '<img style="max-width: 100%; height: auto;" ');
    processed = processed.replace(/(<img[^>]*style=")([^"]*)/g, (match, prefix, styles) => {
        if (!styles.includes('max-width')) {
            return `${prefix}max-width: 100%; height: auto; ${styles}`;
        }
        return match;
    });

    // 3. 移除空段落（但保留换行意图）
    processed = processed.replace(/<p>\s*<\/p>/g, '<p><br></p>');

    // 4. 确保 blockquote 内有段落包裹
    processed = processed.replace(/<blockquote>([^<]+)<\/blockquote>/g, '<blockquote><p>$1</p></blockquote>');

    return processed;
};

/**
 * Imports a Word document (.docx) and converts it to HTML.
 * 增强版本 - 支持完整的样式映射和嵌入式图片
 * 
 * @param {File} file - The .docx file to import.
 * @param {object} options - 可选配置
 * @param {boolean} options.preserveImages - 是否保留图片 (默认 true)
 * @param {function} options.onProgress - 进度回调 (stage: string)
 * @returns {Promise<string>} - 转换后的 HTML 字符串
 */
export const importWordDoc = async (file, options = {}) => {
    const { preserveImages = true, onProgress } = options;

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async (event) => {
            try {
                const arrayBuffer = event.target.result;

                // 通知：开始解析
                if (onProgress) onProgress('parsing');

                // 构建 mammoth 配置
                const mammothOptions = {
                    styleMap: ENHANCED_STYLE_MAP,
                    ...(preserveImages ? createImageConverter() : {})
                };

                // Fix for Vite/Rollup CommonJS interop
                const convertToHtml = mammoth.convertToHtml || (mammoth.default ? mammoth.default.convertToHtml : null);

                if (!convertToHtml) {
                    throw new Error('Mammoth library not loaded correctly');
                }

                console.log('[Import] Starting enhanced conversion for:', file.name);

                // 通知：转换中
                if (onProgress) onProgress('converting');

                const result = await convertToHtml({ arrayBuffer: arrayBuffer }, mammothOptions);

                // 收集警告信息
                const warnings = result.messages
                    .filter(msg => msg.type === 'warning')
                    .map(msg => msg.message);

                if (warnings.length > 0) {
                    console.log("[Import] Conversion warnings:", warnings);
                }

                // 后处理 HTML
                let html = postProcessHtml(result.value);

                if (!html || !html.trim()) {
                    console.warn('[Import] Warning: Converted HTML is empty');
                }

                console.log('[Import] Conversion successful, length:', html.length, 'warnings:', warnings.length);

                // 通知：完成
                if (onProgress) onProgress('done');

                // 为了向后兼容，直接返回 html 字符串
                // 如果调用方需要 warnings，可以通过第二个参数获取
                resolve(html);

            } catch (error) {
                console.error('[Import] Error:', error);
                reject(error);
            }
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsArrayBuffer(file);
    });
};

/**
 * 导出增强版本 - 返回完整结果包含警告
 */
export const importWordDocWithDetails = async (file, options = {}) => {
    const { preserveImages = true, onProgress } = options;

    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async (event) => {
            try {
                const arrayBuffer = event.target.result;

                if (onProgress) onProgress('parsing');

                const mammothOptions = {
                    styleMap: ENHANCED_STYLE_MAP,
                    ...(preserveImages ? createImageConverter() : {})
                };

                const convertToHtml = mammoth.convertToHtml || (mammoth.default ? mammoth.default.convertToHtml : null);

                if (!convertToHtml) {
                    throw new Error('Mammoth library not loaded correctly');
                }

                if (onProgress) onProgress('converting');

                const result = await convertToHtml({ arrayBuffer: arrayBuffer }, mammothOptions);

                const warnings = result.messages
                    .filter(msg => msg.type === 'warning')
                    .map(msg => msg.message);

                const html = postProcessHtml(result.value);

                if (onProgress) onProgress('done');

                resolve({
                    html,
                    warnings,
                    hasWarnings: warnings.length > 0
                });

            } catch (error) {
                console.error('[Import] Error:', error);
                reject(error);
            }
        };

        reader.onerror = (error) => {
            reject(error);
        };

        reader.readAsArrayBuffer(file);
    });
};
