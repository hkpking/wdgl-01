import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Bot, User, AlertCircle, ChevronDown, ChevronUp, Terminal } from 'lucide-react';
import { aiService } from '../../services/ai/AIService';

export default function DrawIOChat({ currentXML, onApplyXML, onApplyEdits }) {
    const [messages, setMessages] = useState([
        {
            id: 'welcome',
            role: 'assistant',
            content: '你好！我是你的流程图助手。我可以帮你创建新的图表，或者修改现有的图表。请告诉我你想画什么？'
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: input
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Call AI Service
            const result = await aiService.generateDiagram(userMessage.content, currentXML);

            let assistantMessage = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: ''
            };

            if (result.tool === 'display_diagram') {
                assistantMessage.toolCall = {
                    name: 'display_diagram',
                    args: result.content
                };
                assistantMessage.content = '正在为您生成图表...';
                onApplyXML(result.content.xml);
            } else if (result.tool === 'edit_diagram') {
                assistantMessage.toolCall = {
                    name: 'edit_diagram',
                    args: result.content
                };
                assistantMessage.content = '正在为您修改图表...';
                onApplyEdits(result.content.edits);
            } else {
                // Normal text message
                assistantMessage.content = result.content;
            }

            setMessages(prev => [...prev, assistantMessage]);

        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: '抱歉，处理您的请求时出现错误。请稍后重试。',
                isError: true
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    // Tool Call Card Component
    const ToolCallCard = ({ toolCall }) => {
        const [isExpanded, setIsExpanded] = useState(false);
        const argsString = JSON.stringify(toolCall.args, null, 2);

        return (
            <div className="mt-2 border border-gray-200 rounded-md overflow-hidden bg-gray-50">
                <div className="flex items-center justify-between px-3 py-2 bg-gray-100 border-b border-gray-200">
                    <div className="flex items-center gap-2 text-xs font-mono text-gray-600">
                        <Terminal size={14} />
                        <span>Tool: {toolCall.name}</span>
                    </div>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                        {isExpanded ? (
                            <>Hide Args <ChevronUp size={12} /></>
                        ) : (
                            <>Show Args <ChevronDown size={12} /></>
                        )}
                    </button>
                </div>

                {isExpanded && (
                    <div className="p-2 overflow-x-auto">
                        <pre className="text-[10px] leading-relaxed font-mono text-gray-700 whitespace-pre-wrap break-all">
                            {argsString}
                        </pre>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-200 w-80 shadow-sm">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <Bot className="w-5 h-5 text-blue-600" />
                    AI 绘图助手
                </h2>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''
                            }`}
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

                            {/* Render Tool Call Card if exists */}
                            {msg.toolCall && (
                                <ToolCallCard toolCall={msg.toolCall} />
                            )}
                        </div>
                    </div>
                ))}
                {isLoading && (
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
                    支持生成流程图、架构图，或修改现有图表
                </div>
            </form>
        </div>
    );
}
