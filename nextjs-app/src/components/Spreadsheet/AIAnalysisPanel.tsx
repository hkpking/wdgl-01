'use client';

import React, { useState, useCallback } from 'react';
import { X, Sparkles, BarChart3, TrendingUp, AlertTriangle, Loader2, ChevronDown } from 'lucide-react';

interface AIAnalysisPanelProps {
    isOpen: boolean;
    onClose: () => void;
    onGetSelection: () => any[][] | null;
}

type AnalysisType = 'summary' | 'trend' | 'anomaly';

interface AnalysisResult {
    summary: string;
    insights: string[];
    suggestions?: string[];
    chartRecommendation?: {
        type: 'bar' | 'line' | 'pie';
        reason: string;
    };
}

export default function AIAnalysisPanel({ isOpen, onClose, onGetSelection }: AIAnalysisPanelProps) {
    const [analysisType, setAnalysisType] = useState<AnalysisType>('summary');
    const [customPrompt, setCustomPrompt] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleAnalyze = useCallback(async () => {
        const selection = onGetSelection();
        if (!selection || selection.length === 0) {
            setError('请先选择要分析的数据区域');
            return;
        }

        setIsAnalyzing(true);
        setError(null);

        try {
            const response = await fetch('/api/spreadsheet/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    data: selection,
                    prompt: customPrompt || undefined,
                    analysisType,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || '分析失败');
            }

            setResult(data.result);
        } catch (err: any) {
            setError(err.message || '分析失败');
        } finally {
            setIsAnalyzing(false);
        }
    }, [onGetSelection, analysisType, customPrompt]);

    if (!isOpen) return null;

    return (
        <div className="fixed right-0 top-14 bottom-0 w-96 bg-white border-l border-gray-200 shadow-lg flex flex-col z-40">
            {/* 头部 */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50">
                <div className="flex items-center gap-2">
                    <Sparkles size={20} className="text-purple-600" />
                    <span className="font-medium text-gray-800">AI 数据分析</span>
                </div>
                <button onClick={onClose} className="p-1 hover:bg-white/50 rounded">
                    <X size={18} className="text-gray-500" />
                </button>
            </div>

            {/* 分析类型选择 */}
            <div className="p-4 border-b border-gray-100">
                <label className="text-sm text-gray-600 mb-2 block">分析类型</label>
                <div className="flex gap-2">
                    <button
                        onClick={() => setAnalysisType('summary')}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm transition-all ${analysisType === 'summary'
                                ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                                : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                            }`}
                    >
                        <BarChart3 size={16} />
                        概要统计
                    </button>
                    <button
                        onClick={() => setAnalysisType('trend')}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm transition-all ${analysisType === 'trend'
                                ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                                : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                            }`}
                    >
                        <TrendingUp size={16} />
                        趋势分析
                    </button>
                    <button
                        onClick={() => setAnalysisType('anomaly')}
                        className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-sm transition-all ${analysisType === 'anomaly'
                                ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                                : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                            }`}
                    >
                        <AlertTriangle size={16} />
                        异常检测
                    </button>
                </div>
            </div>

            {/* 自定义问题输入 */}
            <div className="p-4 border-b border-gray-100">
                <label className="text-sm text-gray-600 mb-2 block">自定义问题（可选）</label>
                <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="例如：销售额最高的产品是什么？"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                    rows={2}
                />
            </div>

            {/* 分析按钮 */}
            <div className="p-4 border-b border-gray-100">
                <button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 transition-all"
                >
                    {isAnalyzing ? (
                        <>
                            <Loader2 size={18} className="animate-spin" />
                            分析中...
                        </>
                    ) : (
                        <>
                            <Sparkles size={18} />
                            开始分析选中区域
                        </>
                    )}
                </button>
                <p className="text-xs text-gray-400 mt-2 text-center">
                    请先在表格中选择要分析的数据区域
                </p>
            </div>

            {/* 错误提示 */}
            {error && (
                <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* 分析结果 */}
            {result && (
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* 概要 */}
                    <div className="bg-gray-50 rounded-lg p-4">
                        <h4 className="font-medium text-gray-800 mb-2">分析概要</h4>
                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{result.summary}</p>
                    </div>

                    {/* 关键发现 */}
                    {result.insights && result.insights.length > 0 && (
                        <div>
                            <h4 className="font-medium text-gray-800 mb-2">关键发现</h4>
                            <ul className="space-y-2">
                                {result.insights.map((insight, idx) => (
                                    <li key={idx} className="flex gap-2 text-sm">
                                        <span className="text-purple-600">•</span>
                                        <span className="text-gray-600">{insight}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* 建议 */}
                    {result.suggestions && result.suggestions.length > 0 && (
                        <div>
                            <h4 className="font-medium text-gray-800 mb-2">建议</h4>
                            <ul className="space-y-2">
                                {result.suggestions.map((suggestion, idx) => (
                                    <li key={idx} className="flex gap-2 text-sm">
                                        <span className="text-green-600">→</span>
                                        <span className="text-gray-600">{suggestion}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* 图表推荐 */}
                    {result.chartRecommendation && (
                        <div className="bg-indigo-50 rounded-lg p-4">
                            <h4 className="font-medium text-indigo-800 mb-1">推荐图表</h4>
                            <p className="text-sm text-indigo-600">
                                {result.chartRecommendation.type === 'bar' && '📊 柱状图'}
                                {result.chartRecommendation.type === 'line' && '📈 折线图'}
                                {result.chartRecommendation.type === 'pie' && '🥧 饼图'}
                                {' - '}
                                {result.chartRecommendation.reason}
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
