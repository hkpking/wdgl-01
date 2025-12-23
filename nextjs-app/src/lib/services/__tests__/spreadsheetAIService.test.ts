/**
 * spreadsheetAIService 单元测试
 */
import { describe, it, expect } from 'vitest';
import {
    spreadsheetToText,
    chunkSpreadsheetText,
    formatSelectionForAnalysis,
    buildAnalysisPrompt
} from '../ai/spreadsheetAIService';

describe('spreadsheetToText', () => {
    it('应该将空表格转换为空字符串', () => {
        const result = spreadsheetToText([]);
        expect(result).toBe('');
    });

    it('应该正确转换带标题的表格', () => {
        const sheets = [{
            name: 'Sheet1',
            celldata: [
                { r: 0, c: 0, v: { v: '产品', m: '产品' } },
                { r: 0, c: 1, v: { v: '销量', m: '销量' } },
                { r: 1, c: 0, v: { v: '手机', m: '手机' } },
                { r: 1, c: 1, v: { v: 100, m: '100' } },
            ],
        }];

        const result = spreadsheetToText(sheets, '销售报表');

        expect(result).toContain('表格标题: 销售报表');
        expect(result).toContain('[Sheet1]');
        expect(result).toContain('产品');
        expect(result).toContain('销量');
        expect(result).toContain('手机');
        expect(result).toContain('100');
    });

    it('应该正确处理表格名称', () => {
        const sheets = [{
            name: '季度数据',
            celldata: [
                { r: 0, c: 0, v: { v: '测试', m: '测试' } },
            ],
        }];

        const result = spreadsheetToText(sheets);
        expect(result).toContain('[季度数据]');
    });
});

describe('chunkSpreadsheetText', () => {
    it('应该将短文本保持为单个块', () => {
        const text = '这是一段短文本';
        const chunks = chunkSpreadsheetText(text, 500);
        expect(chunks).toHaveLength(1);
        expect(chunks[0]).toBe(text);
    });

    it('应该正确分割长文本', () => {
        const lines = Array(20).fill('这是一行测试数据，用于测试分块功能');
        const text = lines.join('\n');
        const chunks = chunkSpreadsheetText(text, 200);

        expect(chunks.length).toBeGreaterThan(1);
        chunks.forEach(chunk => {
            expect(chunk.length).toBeLessThanOrEqual(250); // 允许一些余量
        });
    });
});

describe('formatSelectionForAnalysis', () => {
    it('应该正确格式化选区数据', () => {
        const data = [
            ['产品', '销量', '价格'],
            ['手机', 100, 5000],
            ['电脑', 50, 8000],
        ];

        const result = formatSelectionForAnalysis(data);

        expect(result).toContain('产品: 手机');
        expect(result).toContain('销量: 100');
        expect(result).toContain('价格: 5000');
    });

    it('应该跳过空值', () => {
        const data = [
            ['列1', '列2'],
            ['值1', null],
            [undefined, '值2'],
        ];

        const result = formatSelectionForAnalysis(data);
        expect(result).toContain('列1: 值1');
        expect(result).toContain('列2: 值2');
    });
});

describe('buildAnalysisPrompt', () => {
    it('应该生成概要统计 prompt', () => {
        const data = '测试数据';
        const result = buildAnalysisPrompt(data, undefined, 'summary');

        expect(result).toContain('测试数据');
        expect(result).toContain('概要统计');
    });

    it('应该处理自定义问题', () => {
        const data = '测试数据';
        const question = '销量最高的是什么？';
        const result = buildAnalysisPrompt(data, question);

        expect(result).toContain('测试数据');
        expect(result).toContain(question);
    });

    it('应该生成趋势分析 prompt', () => {
        const result = buildAnalysisPrompt('数据', undefined, 'trend');
        expect(result).toContain('趋势');
    });

    it('应该生成异常检测 prompt', () => {
        const result = buildAnalysisPrompt('数据', undefined, 'anomaly');
        expect(result).toContain('异常');
    });
});
