import React, { useState, useEffect } from 'react';
import { History, X, RotateCcw, Trash2 } from 'lucide-react';

/**
 * 图表历史记录对话框 - 对标 aidiwo 的 history-dialog
 * 保存每次 AI 修改前的图表状态，支持回滚
 */
export default function HistoryDialog({ isOpen, onClose, onRestore, history = [] }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <History className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">图表历史记录</h2>
                            <p className="text-sm text-gray-500">每次 AI 修改前的图表状态都会自动保存</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {history.length === 0 ? (
                        <div className="text-center py-12">
                            <History size={48} className="mx-auto text-gray-300 mb-4" />
                            <p className="text-gray-500">暂无历史记录</p>
                            <p className="text-sm text-gray-400 mt-1">
                                使用 AI 助手修改图表后，历史记录会自动保存
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {history.map((item, index) => (
                                <div
                                    key={item.id || index}
                                    className="group border border-gray-200 rounded-lg p-3 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
                                    onClick={() => {
                                        onRestore(item.xml);
                                        onClose();
                                    }}
                                >
                                    {/* Preview */}
                                    <div className="aspect-video bg-gray-50 rounded-md overflow-hidden flex items-center justify-center mb-2">
                                        {item.svg ? (
                                            <img
                                                src={item.svg}
                                                alt={`版本 ${index + 1}`}
                                                className="object-contain w-full h-full p-2"
                                            />
                                        ) : (
                                            <div className="text-xs text-gray-400">预览不可用</div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm font-medium text-gray-700">
                                                版本 {history.length - index}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                {item.timestamp ? new Date(item.timestamp).toLocaleString('zh-CN') : '-'}
                                            </div>
                                        </div>
                                        <button
                                            className="opacity-0 group-hover:opacity-100 p-1.5 bg-blue-100 text-blue-600 rounded-md transition-opacity"
                                            title="恢复此版本"
                                        >
                                            <RotateCcw size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                        共 {history.length} 条历史记录
                    </span>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        关闭
                    </button>
                </div>
            </div>
        </div>
    );
}

/**
 * 图表历史管理 Hook
 */
export function useDiagramHistory(maxItems = 20) {
    const STORAGE_KEY = 'drawio_diagram_history';

    const [history, setHistory] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    // 保存到 localStorage
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        } catch (e) {
            console.warn('Failed to save diagram history:', e);
        }
    }, [history]);

    // 添加新的历史记录
    const addToHistory = (xml, svg = null) => {
        if (!xml) return;

        const newItem = {
            id: Date.now().toString(),
            xml,
            svg,
            timestamp: Date.now()
        };

        setHistory(prev => {
            const updated = [newItem, ...prev];
            // 限制最大数量
            return updated.slice(0, maxItems);
        });
    };

    // 清空历史记录
    const clearHistory = () => {
        setHistory([]);
    };

    return {
        history,
        addToHistory,
        clearHistory
    };
}
