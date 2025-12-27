/**
 * 文本差异计算工具
 * 基于简化版 LCS (最长公共子序列) 算法
 */

/**
 * 差异类型枚举
 */
export const DiffType = {
    EQUAL: 'equal',
    INSERT: 'insert',
    DELETE: 'delete',
};

/**
 * 计算两个字符串数组（按行）的差异
 * @param {string[]} oldLines - 旧版本的文本行数组
 * @param {string[]} newLines - 新版本的文本行数组
 * @returns {Array<{type: string, content: string, oldLineNum?: number, newLineNum?: number}>}
 */
export function computeLineDiff(oldLines, newLines) {
    const lcs = computeLCS(oldLines, newLines);
    const result = [];

    let oldIdx = 0;
    let newIdx = 0;
    let oldLineNum = 1;
    let newLineNum = 1;

    for (const lcsItem of lcs) {
        // 处理旧版本中被删除的行
        while (oldIdx < oldLines.length && oldLines[oldIdx] !== lcsItem) {
            result.push({
                type: DiffType.DELETE,
                content: oldLines[oldIdx],
                oldLineNum: oldLineNum++,
            });
            oldIdx++;
        }

        // 处理新版本中新增的行
        while (newIdx < newLines.length && newLines[newIdx] !== lcsItem) {
            result.push({
                type: DiffType.INSERT,
                content: newLines[newIdx],
                newLineNum: newLineNum++,
            });
            newIdx++;
        }

        // LCS 中的相同行
        if (oldIdx < oldLines.length && newIdx < newLines.length) {
            result.push({
                type: DiffType.EQUAL,
                content: lcsItem,
                oldLineNum: oldLineNum++,
                newLineNum: newLineNum++,
            });
            oldIdx++;
            newIdx++;
        }
    }

    // 处理剩余的删除行
    while (oldIdx < oldLines.length) {
        result.push({
            type: DiffType.DELETE,
            content: oldLines[oldIdx],
            oldLineNum: oldLineNum++,
        });
        oldIdx++;
    }

    // 处理剩余的新增行
    while (newIdx < newLines.length) {
        result.push({
            type: DiffType.INSERT,
            content: newLines[newIdx],
            newLineNum: newLineNum++,
        });
        newIdx++;
    }

    return result;
}

/**
 * 计算最长公共子序列 (LCS)
 * @param {string[]} arr1 
 * @param {string[]} arr2 
 * @returns {string[]}
 */
function computeLCS(arr1, arr2) {
    const m = arr1.length;
    const n = arr2.length;

    // 创建 DP 表
    const dp = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

    // 填充 DP 表
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (arr1[i - 1] === arr2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1] + 1;
            } else {
                dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
            }
        }
    }

    // 回溯获取 LCS
    const lcs = [];
    let i = m, j = n;
    while (i > 0 && j > 0) {
        if (arr1[i - 1] === arr2[j - 1]) {
            lcs.unshift(arr1[i - 1]);
            i--;
            j--;
        } else if (dp[i - 1][j] > dp[i][j - 1]) {
            i--;
        } else {
            j--;
        }
    }

    return lcs;
}

/**
 * 从 HTML 内容提取纯文本行
 * @param {string} htmlContent 
 * @returns {string[]}
 */
export function htmlToLines(htmlContent) {
    if (!htmlContent) return [];

    // 创建临时 DOM 元素
    const temp = document.createElement('div');
    temp.innerHTML = htmlContent;

    // 提取文本内容，按块级元素分行
    const blocks = temp.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li, div, tr');

    if (blocks.length === 0) {
        // 如果没有块级元素，直接用换行分割
        return temp.textContent.split('\n').filter(line => line.trim());
    }

    const lines = [];
    blocks.forEach(block => {
        const text = block.textContent.trim();
        if (text) {
            lines.push(text);
        }
    });

    return lines;
}

/**
 * 计算差异统计
 * @param {Array} diffs 
 * @returns {{additions: number, deletions: number, unchanged: number}}
 */
export function getDiffStats(diffs) {
    return diffs.reduce((stats, diff) => {
        if (diff.type === DiffType.INSERT) {
            stats.additions++;
        } else if (diff.type === DiffType.DELETE) {
            stats.deletions++;
        } else {
            stats.unchanged++;
        }
        return stats;
    }, { additions: 0, deletions: 0, unchanged: 0 });
}
