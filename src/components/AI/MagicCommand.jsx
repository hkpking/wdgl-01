import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ArrowRight, Loader, Command, Settings, Key } from 'lucide-react';
import { aiService } from '../../services/ai/AIService';
import { PromptRegistry } from '../../services/ai/PromptRegistry';

const MagicCommand = ({ isOpen, onClose, onInsert, contextText = '' }) => {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [apiKey, setApiKey] = useState(localStorage.getItem('wdgl_ai_key') || '');
    const [selectedModel, setSelectedModel] = useState(localStorage.getItem('wdgl_ai_model') || 'gemini-pro');
    const [availableModels, setAvailableModels] = useState([]);
    const inputRef = useRef(null);

    useEffect(() => {
        if (showSettings && apiKey) {
            aiService.fetchAvailableModels(apiKey).then(models => {
                if (models.length > 0) {
                    setAvailableModels(models);
                }
            });
        }
    }, [showSettings, apiKey]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
            setInput('');
            setResult('');
        }
    }, [isOpen]);

    const handleKeyDown = async (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!input.trim()) return;
            await executeCommand();
        }
    };

    const executeCommand = async () => {
        setIsLoading(true);
        setResult('');
        try {
            // Simple heuristic: if input starts with "outline", use outline prompt
            let prompt = input;
            if (input.toLowerCase().includes('outline') || input.toLowerCase().includes('大纲')) {
                prompt = PromptRegistry.GENERATE_OUTLINE(input);
            }

            // Stream response
            await aiService.streamText(prompt, (chunk) => {
                setResult(prev => prev + chunk);
            });
        } catch (error) {
            console.error(error);
            setResult(`Error: ${error.message || 'Failed to generate content'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInsert = () => {
        onInsert(result);
        onClose();
    };

    const saveApiKey = () => {
        if (apiKey.trim()) {
            aiService.initClient(apiKey.trim(), selectedModel);
            alert(`Settings saved! Model: ${selectedModel}`);
        } else {
            aiService.enableMockMode();
            alert('API Key removed. Switching to Mock mode.');
        }
        setShowSettings(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-32 bg-black/20 backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-white w-full max-w-2xl rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200"
                onClick={e => e.stopPropagation()}
            >
                {/* Input Area */}
                <div className="flex items-center p-4 border-b border-gray-100">
                    <Sparkles className="text-purple-500 mr-3 animate-pulse" size={24} />
                    <input
                        ref={inputRef}
                        type="text"
                        className="flex-1 text-lg outline-none placeholder:text-gray-400"
                        placeholder="Ask AI to write, summarize, or outline..."
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isLoading}
                    />
                    {isLoading ? (
                        <Loader className="animate-spin text-gray-400" size={20} />
                    ) : (
                        <div className="flex items-center gap-2">
                            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded border border-gray-200 font-mono">
                                ↵ Enter
                            </kbd>
                        </div>
                    )}
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className="ml-3 text-gray-400 hover:text-gray-600 transition"
                        title="AI Settings"
                    >
                        <Settings size={18} />
                    </button>
                </div>

                {/* Settings Area */}
                {showSettings && (
                    <div className="p-4 bg-gray-50 border-b border-gray-100 animate-in slide-in-from-top-2">
                        <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
                            <Key size={16} />
                            <span>Gemini API Key</span>
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="password"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-purple-500"
                                placeholder="Enter your Gemini API Key..."
                                value={apiKey}
                                onChange={e => setApiKey(e.target.value)}
                            />
                            <button
                                onClick={saveApiKey}
                                className="px-4 py-2 bg-gray-900 text-white text-sm rounded hover:bg-gray-800 transition"
                            >
                                Save
                            </button>
                        </div>

                        <div className="flex items-center gap-2 mb-2 mt-4 text-sm font-medium text-gray-700">
                            <Settings size={16} />
                            <span>Model Selection</span>
                        </div>
                        <select
                            value={selectedModel}
                            onChange={(e) => setSelectedModel(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-purple-500 bg-white"
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

                        <p className="text-xs text-gray-500 mt-2">
                            Leave empty to use Mock Mode (Free/Offline).
                        </p>
                    </div>
                )}

                {/* Result Area */}
                {result && (
                    <div className="p-4 bg-gray-50 max-h-[60vh] overflow-y-auto">
                        <div className="prose prose-sm max-w-none text-gray-700 whitespace-pre-wrap">
                            {result}
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                onClick={() => setResult('')}
                                className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition"
                            >
                                Discard
                            </button>
                            <button
                                onClick={handleInsert}
                                className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition flex items-center gap-1"
                            >
                                Insert <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                )}

                {/* Suggestions / Empty State */}
                {!result && !isLoading && (
                    <div className="p-2 bg-gray-50 text-xs text-gray-500 flex justify-between px-4">
                        <span>Try: "Create an outline for a marketing plan"</span>
                        <span className="flex items-center gap-1"><Command size={10} /> + K to open</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MagicCommand;
