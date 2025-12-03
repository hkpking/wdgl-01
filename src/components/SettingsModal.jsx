import React, { useState, useEffect } from 'react';
import { X, Settings, Sparkles, Key, Monitor, Shield } from 'lucide-react';
import { aiService } from '../services/ai/AIService';

export default function SettingsModal({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState('ai');
    const [apiKey, setApiKey] = useState('');
    const [selectedModel, setSelectedModel] = useState('gemini-pro');
    const [availableModels, setAvailableModels] = useState([]);

    useEffect(() => {
        if (isOpen) {
            // Load current settings
            const currentKey = localStorage.getItem('wdgl_ai_key') || '';
            setApiKey(currentKey);
            setSelectedModel(localStorage.getItem('wdgl_ai_model') || 'gemini-pro');

            if (currentKey) {
                fetchModels(currentKey);
            }
        }
    }, [isOpen]);

    const fetchModels = async (key) => {
        const models = await aiService.fetchAvailableModels(key);
        if (models.length > 0) {
            setAvailableModels(models);
        }
    };

    const handleSaveAI = () => {
        if (apiKey.trim()) {
            aiService.initClient(apiKey.trim(), selectedModel);
            alert(`AI 设置已保存！当前模型: ${selectedModel}`);
        } else {
            aiService.enableMockMode();
            alert('API Key 已移除，切换回模拟模式。');
        }
    };

    if (!isOpen) return null;

    const tabs = [
        { id: 'general', label: '通用', icon: <Settings size={18} /> },
        { id: 'ai', label: 'AI 设置', icon: <Sparkles size={18} /> },
        { id: 'about', label: '关于', icon: <Shield size={18} /> },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white w-full max-w-3xl h-[600px] rounded-xl shadow-2xl flex overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                {/* Sidebar */}
                <div className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <Settings className="text-blue-600" />
                            设置
                        </h2>
                    </div>
                    <nav className="flex-1 p-4 space-y-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                                        ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Header */}
                    <div className="h-16 border-b border-gray-200 flex items-center justify-between px-8 bg-white">
                        <h3 className="text-lg font-semibold text-gray-800">
                            {tabs.find(t => t.id === activeTab)?.label}
                        </h3>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Scrollable Body */}
                    <div className="flex-1 overflow-y-auto p-8">

                        {/* AI Settings */}
                        {activeTab === 'ai' && (
                            <div className="space-y-8 max-w-lg">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                                        <Key size={16} className="text-purple-500" />
                                        Gemini API 配置
                                    </h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm text-gray-700 mb-1">API Key</label>
                                            <input
                                                type="password"
                                                value={apiKey}
                                                onChange={(e) => setApiKey(e.target.value)}
                                                placeholder="输入您的 Gemini API Key..."
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-shadow"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                您的 Key 仅存储在本地浏览器中，不会上传到服务器。
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm text-gray-700 mb-1">选择模型</label>
                                            <select
                                                value={selectedModel}
                                                onChange={(e) => setSelectedModel(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
                                            >
                                                {availableModels.length > 0 ? (
                                                    availableModels.map(model => (
                                                        <option key={model.id} value={model.id}>
                                                            {model.name}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <>
                                                        <option value="gemini-pro">Gemini Pro (Default)</option>
                                                        <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                                                    </>
                                                )}
                                            </select>
                                        </div>

                                        <div className="pt-4">
                                            <button
                                                onClick={handleSaveAI}
                                                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm font-medium"
                                            >
                                                保存配置
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800">
                                    <h5 className="font-semibold mb-1 flex items-center gap-2">
                                        <Monitor size={14} />
                                        提示
                                    </h5>
                                    <p>如果不配置 API Key，系统将使用<b>模拟模式 (Mock Mode)</b>，仅返回预设的测试数据。</p>
                                </div>
                            </div>
                        )}

                        {/* General Settings (Placeholder) */}
                        {activeTab === 'general' && (
                            <div className="text-center py-20 text-gray-500">
                                <Settings size={48} className="mx-auto mb-4 opacity-20" />
                                <p>通用设置功能开发中...</p>
                                <p className="text-sm mt-2">未来将支持：主题切换、语言设置、默认字体等。</p>
                            </div>
                        )}

                        {/* About */}
                        {activeTab === 'about' && (
                            <div className="prose prose-sm">
                                <h3>关于在线文档系统</h3>
                                <p>版本: v0.1.0 (Beta)</p>
                                <p>这是一个基于 React + Tiptap 构建的现代化文档编辑器，集成了 Gemini AI 能力。</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
