import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User, AlertCircle, ChevronDown, ChevronUp, Terminal, Settings, History, Lightbulb } from 'lucide-react';
import { streamChat, AI_PROVIDERS, healthCheck } from '../../services/ai/ChatAPI';
import ExamplePanel from './ExamplePanel';
import HistoryDialog, { useDiagramHistory } from './HistoryDialog';

/**
 * AI 绘图助手 - 对标 aidiwo 的 chat-panel
 */
export default function DrawIOChat({ currentXML, onApplyXML, onApplyEdits }) {
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            role: 'assistant',
            content: '你好！我是 AI 绘图助手。我可以帮你创建新的图表，或者修改现有的图表。请告诉我你想画什么？'
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [streamingText, setStreamingText] = useState('');
    const [showSettings, setShowSettings] = useState(false);
    const [showExamples, setShowExamples] = useState(true); // 默认显示示例
    const [showHistory, setShowHistory] = useState(false);
    const [serverStatus, setServerStatus] = useState('checking');

    // 图表历史记录
    const { history, addToHistory, clearHistory } = useDiagramHistory();

    // AI 配置
    const [provider, setProvider] = useState(localStorage.getItem('drawio_ai_provider') || 'deepseek');
    const [model, setModel] = useState(localStorage.getItem('drawio_ai_model') || '');
    const [apiKey, setApiKey] = useState(localStorage.getItem('drawio_ai_key') || '');

    const messagesEndRef = useRef(null);

    // 检查服务器状态
    useEffect(() => {
        const checkServer = async () => {
            const isHealthy = await healthCheck();
            setServerStatus(isHealthy ? 'online' : 'offline');
        };
        checkServer();
        const interval = setInterval(checkServer, 30000);
        return () => clearInterval(interval);
    }, []);

    // 保存配置到 localStorage
    useEffect(() => {
        localStorage.setItem('drawio_ai_provider', provider);
        localStorage.setItem('drawio_ai_model', model);
        localStorage.setItem('drawio_ai_key', apiKey);
    }, [provider, model, apiKey]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, streamingText]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        if (!apiKey) {
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                role: 'assistant',
                content: '请先在设置中配置 API Key',
                isError: true
            }]);
            setShowSettings(true);
            return;
        }

        const userMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setStreamingText('');

        try {
            let fullText = '';
            let toolCalls = [];

            await streamChat({
                messages: [...messages.filter(m => m.id !== 'welcome'), userMessage].map(m => ({
                    role: m.role,
                    content: m.content
                })),
                xml: currentXML,
                provider,
                model,
                apiKey,
                onText: (text) => {
                    fullText += text;
                    setStreamingText(fullText);
                },
                onToolCall: (tool, args) => {
                    toolCalls.push({ tool, args });

                    // 在修改前保存历史记录
                    if (currentXML && (tool === 'display_diagram' || tool === 'edit_diagram')) {
                        addToHistory(currentXML);
                    }

                    // 处理工具调用
                    if (tool === 'display_diagram' && args.xml) {
                        onApplyXML(args.xml);
                        setShowExamples(false); // 隐藏示例面板
                    } else if (tool === 'edit_diagram' && args.edits) {
                        onApplyEdits(args.edits);
                    }
                },
                onError: (error) => {
                    setMessages(prev => [...prev, {
                        id: (Date.now() + 1).toString(),
                        role: 'assistant',
                        content: `错误: ${error.message}`,
                        isError: true
                    }]);
                },
                onDone: () => {
                    const assistantMessage = {
                        id: (Date.now() + 1).toString(),
                        role: 'assistant',
                        content: fullText || (toolCalls.length > 0 ? '已完成图表操作' : ''),
                        toolCalls: toolCalls.length > 0 ? toolCalls : undefined
                    };
                    setMessages(prev => [...prev, assistantMessage]);
                    setStreamingText('');
                }
            });

        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: '抱歉，处理您的请求时出现错误。请检查 API 配置和网络连接。',
                isError: true
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // 工具调用卡片组件
    const ToolCallCard = ({ toolCall }) => {
        const [isExpanded, setIsExpanded] = useState(false);
        const argsString = JSON.stringify(toolCall.args, null, 2);

        return (
            <div className="mt-2 border border-gray-200 rounded-md overflow-hidden bg-gray-50">
                <div className="flex items-center justify-between px-3 py-2 bg-gray-100 border-b border-gray-200">
                    <div className="flex items-center gap-2 text-xs font-mono text-gray-600">
                        <Terminal size={14} />
                        <span>{toolCall.tool}</span>
                    </div>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                        {isExpanded ? (
                            <>收起 <ChevronUp size={12} /></>
                        ) : (
                            <>展开 <ChevronDown size={12} /></>
                        )}
                    </button>
                </div>
                {isExpanded && (
                    <div className="p-2 overflow-x-auto max-h-40">
                        <pre className="text-[10px] leading-relaxed font-mono text-gray-700 whitespace-pre-wrap break-all">
                            {argsString.length > 500 ? argsString.substring(0, 500) + '...' : argsString}
                        </pre>
                    </div>
                )}
            </div>
        );
    };

    // 设置面板
    const SettingsPanel = () => (
        <div className="p-4 border-b border-gray-200 bg-gray-50 space-y-3">
            <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">AI 提供商</label>
                <select
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full text-sm px-2 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                    <option value="deepseek">DeepSeek (推荐)</option>
                    <option value="google">Google Gemini</option>
                    <option value="openai">OpenAI</option>
                </select>
            </div>
            <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">模型 (可选)</label>
                <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder={provider === 'deepseek' ? 'deepseek-chat' : provider === 'google' ? 'gemini-1.5-flash' : 'gpt-4o-mini'}
                    className="w-full text-sm px-2 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
            </div>
            <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">API Key</label>
                <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="输入你的 API Key"
                    className="w-full text-sm px-2 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-200 w-80 shadow-sm">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Bot className="w-5 h-5 text-blue-600" />
                    AI 绘图助手
                </h2>
                <div className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${serverStatus === 'online' ? 'bg-green-500' :
                        serverStatus === 'offline' ? 'bg-red-500' : 'bg-yellow-500'
                        }`} title={`服务器: ${serverStatus}`} />
                    <button
                        onClick={() => setShowHistory(true)}
                        className="p-1.5 rounded-md transition-colors hover:bg-gray-200 text-gray-500"
                        title="历史记录"
                    >
                        <History size={16} />
                    </button>
                    <button
                        onClick={() => setShowSettings(!showSettings)}
                        className={`p-1.5 rounded-md transition-colors ${showSettings ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-200 text-gray-500'}`}
                        title="设置"
                    >
                        <Settings size={16} />
                    </button>
                </div>
            </div>

            {/* Settings Panel */}
            {showSettings && <SettingsPanel />}

            {/* Example Panel - 第一次使用时显示 */}
            {showExamples && messages.length <= 1 && (
                <ExamplePanel
                    setInput={setInput}
                    onClose={() => setShowExamples(false)}
                />
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user'
                                ? 'bg-blue-100 text-blue-600'
                                : 'bg-green-100 text-green-600'
                                }`}
                        >
                            {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                        </div>

                        <div className="flex flex-col max-w-[85%]">
                            <div
                                className={`p-3 rounded-lg text-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-tr-none'
                                    : msg.isError
                                        ? 'bg-red-50 text-red-600 border border-red-100 rounded-tl-none'
                                        : 'bg-gray-100 text-gray-800 rounded-tl-none'
                                    }`}
                            >
                                {msg.isError && <AlertCircle className="w-4 h-4 inline mr-1 mb-0.5" />}
                                {msg.content}
                            </div>

                            {/* Render Tool Calls */}
                            {msg.toolCalls?.map((tc, idx) => (
                                <ToolCallCard key={idx} toolCall={tc} />
                            ))}
                        </div>
                    </div>
                ))}

                {/* Streaming Text */}
                {streamingText && (
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-green-100 text-green-600">
                            <Bot size={16} />
                        </div>
                        <div className="p-3 rounded-lg text-sm leading-relaxed bg-gray-100 text-gray-800 rounded-tl-none">
                            {streamingText}
                            <span className="inline-block w-1 h-4 bg-gray-400 ml-0.5 animate-pulse" />
                        </div>
                    </div>
                )}

                {isLoading && !streamingText && (
                    <div className="flex items-center gap-2 text-gray-400 text-sm ml-11">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        正在思考...
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100 bg-white">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="描述你想画的流程图..."
                        className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-600 hover:bg-blue-50 rounded-md disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                    >
                        <Send size={16} />
                    </button>
                </div>
                <div className="mt-2 text-xs text-gray-400 text-center">
                    使用 {provider === 'deepseek' ? 'DeepSeek' : provider === 'google' ? 'Gemini' : 'OpenAI'} · 支持流程图、架构图
                </div>
            </form>

            {/* History Dialog */}
            <HistoryDialog
                isOpen={showHistory}
                onClose={() => setShowHistory(false)}
                onRestore={onApplyXML}
                history={history}
            />
        </div>
    );
}
