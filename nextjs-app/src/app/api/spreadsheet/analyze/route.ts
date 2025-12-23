/**
 * 表格 AI 分析 API
 * POST /api/spreadsheet/analyze
 */
import { NextRequest } from 'next/server';
import { createDeepSeek } from '@ai-sdk/deepseek';
import { generateText } from 'ai';

const deepseek = createDeepSeek({
    apiKey: process.env.DEEPSEEK_API_KEY,
});

export async function POST(req: NextRequest) {
    try {
        const { data, prompt, analysisType = 'summary' } = await req.json();

        if (!data || !Array.isArray(data)) {
            return Response.json({ error: '缺少表格数据' }, { status: 400 });
        }

        // 将选区数据格式化为文本
        const headers = data[0] || [];
        const dataText = data.slice(1).map((row: any[], idx: number) => {
            const cells = row.map((cell, c) => `${headers[c] || `列${c + 1}`}=${cell ?? ''}`);
            return `行${idx + 1}: ${cells.join(', ')}`;
        }).join('\n');

        // 构建分析 prompt
        let systemPrompt = '你是一个专业的数据分析师，精通统计分析和数据可视化。请用中文回答。';
        let userMessage = '';

        if (prompt) {
            userMessage = `请分析以下表格数据并回答问题：

### 数据：
${dataText}

### 问题：
${prompt}

请以 JSON 格式返回，包含以下字段：
- summary: 简要回答
- insights: 关键发现数组
- suggestions: 建议数组（可选）`;
        } else {
            const typePrompts: Record<string, string> = {
                summary: '请提供概要统计（总计、平均值、最大最小值、数据分布）',
                trend: '请分析趋势和变化规律',
                anomaly: '请检测异常值或异常模式',
            };

            userMessage = `请分析以下表格数据：

### 数据：
${dataText}

### 分析要求：
${typePrompts[analysisType] || typePrompts.summary}

请以 JSON 格式返回，包含以下字段：
- summary: 分析概述
- insights: 关键发现数组（3-5条）
- suggestions: 行动建议数组（2-3条，可选）
- chartRecommendation: { type: "bar"|"line"|"pie", reason: "推荐原因" }（可选）`;
        }

        const { text } = await generateText({
            model: deepseek('deepseek-chat'),
            system: systemPrompt,
            prompt: userMessage,
        });

        // 尝试解析 JSON
        try {
            // 提取 JSON 块
            const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) ||
                text.match(/\{[\s\S]*\}/);
            const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : text;
            const result = JSON.parse(jsonStr);

            return Response.json({
                success: true,
                result,
                rawText: text,
            });
        } catch {
            // JSON 解析失败，返回原始文本
            return Response.json({
                success: true,
                result: {
                    summary: text,
                    insights: [],
                },
                rawText: text,
            });
        }
    } catch (error: any) {
        console.error('[Spreadsheet AI] 分析失败:', error);
        return Response.json(
            { error: error.message || '分析失败' },
            { status: 500 }
        );
    }
}
