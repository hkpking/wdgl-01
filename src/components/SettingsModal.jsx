import React, { useState, useEffect } from 'react';
import { X, Settings, Sparkles, Key, Monitor, Shield, Zap } from 'lucide-react';
import { aiService, AI_PROVIDERS } from '../services/ai/AIService';

export default function SettingsModal({ isOpen, onClose }) {
    const [activeTab, setActiveTab] = useState('ai');
    const [provider, setProvider] = useState(AI_PROVIDERS.GEMINI);
    const [apiKey, setApiKey] = useState('');
    const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash');
    const [availableModels, setAvailableModels] = useState([]);
    const [autocompleteEnabled, setAutocompleteEnabled] = useState(true);

    useEffect(() => {
        if (isOpen) {
            // Load current settings
            const savedProvider = localStorage.getItem('wdgl_ai_provider') || AI_PROVIDERS.GEMINI;
            const currentKey = localStorage.getItem('wdgl_ai_key') || '';
            const defaultModel = savedProvider === AI_PROVIDERS.DEEPSEEK ? 'deepseek-chat' : 'gemini-1.5-flash';

            setProvider(savedProvider);
            setApiKey(currentKey);
            setSelectedModel(localStorage.getItem('wdgl_ai_model') || defaultModel);
            setAutocompleteEnabled(localStorage.getItem('wdgl_ai_autocomplete_enabled') !== 'false');

            // Load models based on provider
            updateModelsForProvider(savedProvider, currentKey);
        }
    }, [isOpen]);

    const updateModelsForProvider = (prov, key) => {
        // Temporarily set provider in aiService to get correct models
        const originalProvider = aiService.provider;
        aiService.provider = prov;
        const models = aiService.getAvailableModels();
        aiService.provider = originalProvider;
        setAvailableModels(models);
    };

    const handleProviderChange = (newProvider) => {
        setProvider(newProvider);
        // Update models list for new provider
        updateModelsForProvider(newProvider, apiKey);
        // Set default model for new provider
        const defaultModel = newProvider === AI_PROVIDERS.DEEPSEEK ? 'deepseek-chat' : 'gemini-1.5-flash';
        setSelectedModel(defaultModel);
    };

    const handleSaveAI = () => {
        // 保存自动补全开关状态
        localStorage.setItem('wdgl_ai_autocomplete_enabled', autocompleteEnabled.toString());

        if (apiKey.trim()) {
            aiService.initClient(apiKey.trim(), selectedModel, provider);
            const providerName = provider === AI_PROVIDERS.DEEPSEEK ? 'DeepSeek' : 'Google Gemini';
            alert(`AI 设置已保存！\n服务商: ${providerName}\n模型: ${selectedModel}\n自动补全: ${autocompleteEnabled ? '已启用' : '已禁用'}`);
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
                                {/* Provider Selection */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                                        <Zap size={16} className="text-orange-500" />
                                        AI 服务商
                                    </h4>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleProviderChange(AI_PROVIDERS.GEMINI)}
                                            className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${provider === AI_PROVIDERS.GEMINI
                                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                                }`}
                                        >
                                            <div className="font-medium">Google Gemini</div>
                                            <div className="text-xs opacity-70 mt-1">免费额度，多模态支持</div>
                                        </button>
                                        <button
                                            onClick={() => handleProviderChange(AI_PROVIDERS.DEEPSEEK)}
                                            className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all ${provider === AI_PROVIDERS.DEEPSEEK
                                                    ? 'border-green-500 bg-green-50 text-green-700'
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                                                }`}
                                        >
                                            <div className="font-medium">DeepSeek</div>
                                            <div className="text-xs opacity-70 mt-1">高性价比，中文优化</div>
                                        </button>
                                    </div>
                                </div>

                                {/* API Configuration */}
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                                        <Key size={16} className="text-purple-500" />
                                        {provider === AI_PROVIDERS.DEEPSEEK ? 'DeepSeek' : 'Gemini'} API 配置
                                    </h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm text-gray-700 mb-1">API Key</label>
                                            <input
                                                type="password"
                                                value={apiKey}
                                                onChange={(e) => setApiKey(e.target.value)}
                                                placeholder={`输入您的 ${provider === AI_PROVIDERS.DEEPSEEK ? 'DeepSeek' : 'Gemini'} API Key...`}
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
                                                {availableModels.map(model => (
                                                    <option key={model.id} value={model.id}>
                                                        {model.name}
                                                    </option>
                                                ))}
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

                                {/* 自动补全设置 */}
                                <div className="border-t border-gray-200 pt-6">
                                    <h4 className="text-sm font-medium text-gray-900 mb-4 flex items-center gap-2">
                                        <Sparkles size={16} className="text-blue-500" />
                                        自动补全设置
                                    </h4>
                                    <div className="space-y-4">
                                        <label className="flex items-center justify-between cursor-pointer">
                                            <div>
                                                <span className="text-sm text-gray-700">启用 AI 自动补全</span>
                                                <p className="text-xs text-gray-500 mt-0.5">
                                                    输入时自动显示 AI 补全建议（快捷键：Cmd/Ctrl+Shift+Space 手动触发）
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                role="switch"
                                                aria-checked={autocompleteEnabled}
                                                onClick={() => setAutocompleteEnabled(!autocompleteEnabled)}
                                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${autocompleteEnabled ? 'bg-purple-600' : 'bg-gray-200'
                                                    }`}
                                            >
                                                <span
                                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${autocompleteEnabled ? 'translate-x-5' : 'translate-x-0'
                                                        }`}
                                                />
                                            </button>
                                        </label>
                                        <p className="text-xs text-amber-600 bg-amber-50 p-3 rounded-lg border border-amber-100">
                                            ⚠️ 免费版 API 每分钟限制 5 次请求。如果频繁触发 429 错误，建议禁用自动补全，改用快捷键手动触发。
                                        </p>
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
