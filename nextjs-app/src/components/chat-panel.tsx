"use client";

import type React from "react";
import { useRef, useEffect, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { PanelRightClose, PanelRightOpen, Settings } from "lucide-react";
import Link from "next/link";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ChatInput } from "@/components/chat-input";
import { ChatMessageDisplay } from "./chat-message-display";
import { useDiagram } from "@/contexts/diagram-context";
import { replaceNodes, formatXML } from "@/lib/utils";
import { ButtonWithTooltip } from "@/components/button-with-tooltip";

interface ChatPanelProps {
    isVisible: boolean;
    onToggleVisibility: () => void;
}

// 默认模型列表（API 加载前显示）
const DEFAULT_MODELS: Record<string, { value: string; label: string }[]> = {
    deepseek: [{ value: 'deepseek-chat', label: 'DeepSeek-V3.2 (非思考模式)' }],
    google: [{ value: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' }],
    openai: [{ value: 'gpt-4o-mini', label: 'GPT-4o Mini' }],
};

export default function ChatPanel({ isVisible, onToggleVisibility }: ChatPanelProps) {
    // API Key 配置状态
    const [apiKey, setApiKey] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('ai_api_key') || '';
        }
        return '';
    });
    const [provider, setProvider] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('ai_provider') || 'deepseek';
        }
        return 'deepseek';
    });
    const [model, setModel] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('ai_model') || 'deepseek-chat';
        }
        return 'deepseek-chat';
    });
    const [showSettings, setShowSettings] = useState(false);
    const [availableModels, setAvailableModels] = useState<{ value: string; label: string }[]>([]);
    const [loadingModels, setLoadingModels] = useState(false);

    // 动态获取模型列表
    const fetchModels = async (prov: string, key?: string) => {
        setLoadingModels(true);
        try {
            const response = await fetch('/api/models', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ provider: prov, apiKey: key }),
            });
            if (response.ok) {
                const data = await response.json();
                const models = data.models.map((m: any) => ({
                    value: m.id,
                    label: m.name,
                }));
                setAvailableModels(models);
                // 如果当前模型不在列表中，选择第一个
                if (models.length > 0 && !models.find((m: any) => m.value === model)) {
                    setModel(models[0].value);
                }
            }
        } catch (error) {
            console.error('Error fetching models:', error);
            setAvailableModels(DEFAULT_MODELS[prov] || []);
        } finally {
            setLoadingModels(false);
        }
    };

    // 初始加载和 provider/apiKey 变化时获取模型
    useEffect(() => {
        fetchModels(provider, apiKey);
    }, [provider, apiKey]);

    // 保存设置到 localStorage
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (apiKey) localStorage.setItem('ai_api_key', apiKey);
            localStorage.setItem('ai_provider', provider);
            localStorage.setItem('ai_model', model);
        }
    }, [apiKey, provider, model]);

    // 切换 provider 时获取新模型列表
    const handleProviderChange = (newProvider: string) => {
        setProvider(newProvider);
        // fetchModels 会通过 useEffect 自动触发
    };




    const {
        loadDiagram: onDisplayChart,
        handleExport: onExport,
        resolverRef,
        chartXML,
        clearDiagram,
    } = useDiagram();

    const onFetchChart = () => {
        return Promise.race([
            onExport().then((data) => data.xml),
            new Promise<string>((_, reject) =>
                setTimeout(() => reject(new Error("Chart export timed out after 10 seconds")), 10000)
            )
        ]);
    };
    // Add a step counter to track updates

    // Add state for file attachments
    const [files, setFiles] = useState<File[]>([]);
    // Add state for showing the history dialog
    const [showHistory, setShowHistory] = useState(false);

    // Convert File[] to FileList for experimental_attachments
    const createFileList = (files: File[]): FileList => {
        const dt = new DataTransfer();
        files.forEach((file) => dt.items.add(file));
        return dt.files;
    };

    // Add state for input management
    const [input, setInput] = useState("");

    // Remove the currentXmlRef and related useEffect
    const { messages, sendMessage, addToolResult, status, error, setMessages } =
        useChat({
            transport: new DefaultChatTransport({
                api: "/api/chat",
            }),
            async onToolCall({ toolCall }) {
                if (toolCall.toolName === "display_diagram") {
                    // Diagram is handled streamingly in the ChatMessageDisplay component
                    addToolResult({
                        tool: "display_diagram",
                        toolCallId: toolCall.toolCallId,
                        output: "Successfully displayed the diagram.",
                    });
                } else if (toolCall.toolName === "edit_diagram") {
                    const { edits } = toolCall.input as {
                        edits: Array<{ search: string; replace: string }>;
                    };

                    let currentXml = '';
                    try {
                        // Fetch current chart XML
                        currentXml = await onFetchChart();

                        // Apply edits using the utility function
                        const { replaceXMLParts } = await import("@/lib/utils");
                        const editedXml = replaceXMLParts(currentXml, edits);

                        // Load the edited diagram
                        onDisplayChart(editedXml);

                        addToolResult({
                            tool: "edit_diagram",
                            toolCallId: toolCall.toolCallId,
                            output: `Successfully applied ${edits.length} edit(s) to the diagram.`,
                        });
                    } catch (error) {
                        console.error("Edit diagram failed:", error);

                        const errorMessage = error instanceof Error ? error.message : String(error);

                        // Provide detailed error with current diagram XML
                        addToolResult({
                            tool: "edit_diagram",
                            toolCallId: toolCall.toolCallId,
                            output: `Edit failed: ${errorMessage}

Current diagram XML:
\`\`\`xml
${currentXml}
\`\`\`

Please retry with an adjusted search pattern or use display_diagram if retries are exhausted.`,
                        });
                    }
                }
            },
            onError: (error) => {
                console.error("Chat error:", error);
            },
        });
    const messagesEndRef = useRef<HTMLDivElement>(null);
    // Scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // Debug: Log status changes
    useEffect(() => {
        console.log('[ChatPanel] Status changed to:', status);
    }, [status]);

    const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const isProcessing = status === "streaming" || status === "submitted";
        if (input.trim() && !isProcessing) {
            try {
                // Fetch chart data before sending message
                let chartXml = await onFetchChart();

                // Format the XML to ensure consistency
                chartXml = formatXML(chartXml);

                // Create message parts
                const parts: any[] = [{ type: "text", text: input }];

                // Add file parts if files exist
                if (files.length > 0) {
                    for (const file of files) {
                        const reader = new FileReader();
                        const dataUrl = await new Promise<string>((resolve) => {
                            reader.onload = () =>
                                resolve(reader.result as string);
                            reader.readAsDataURL(file);
                        });

                        parts.push({
                            type: "file",
                            url: dataUrl,
                            mediaType: file.type,
                        });
                    }
                }

                sendMessage(
                    { parts },
                    {
                        body: {
                            xml: chartXml,
                            apiKey,
                            provider,
                            model,
                        },
                    }
                );

                // Clear input and files after submission
                setInput("");
                setFiles([]);
            } catch (error) {
                console.error("Error fetching chart data:", error);
            }
        }
    };

    // Handle input change
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setInput(e.target.value);
    };

    // Helper function to handle file changes
    const handleFileChange = (newFiles: File[]) => {
        setFiles(newFiles);
    };

    // Collapsed view when chat is hidden
    if (!isVisible) {
        return (
            <Card className="h-full flex flex-col rounded-none py-0 gap-0 items-center justify-start pt-4">
                <ButtonWithTooltip
                    tooltipContent="Show chat panel (Ctrl+B)"
                    variant="ghost"
                    size="icon"
                    onClick={onToggleVisibility}
                >
                    <PanelRightOpen className="h-5 w-5" />
                </ButtonWithTooltip>
                <div
                    className="text-sm text-gray-500 mt-8"
                    style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                    Chat
                </div>
            </Card>
        );
    }

    // Full view when chat is visible
    return (
        <Card className="h-full flex flex-col rounded-none py-0 gap-0">
            <CardHeader className="p-4 flex flex-row justify-between items-center">
                <div className="flex items-center gap-3">
                    <CardTitle>AI 绘图助手</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                    <ButtonWithTooltip
                        tooltipContent="设置 API Key"
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowSettings(!showSettings)}
                    >
                        <Settings className="h-5 w-5" />
                    </ButtonWithTooltip>
                    <ButtonWithTooltip
                        tooltipContent="隐藏聊天面板 (Ctrl+B)"
                        variant="ghost"
                        size="icon"
                        onClick={onToggleVisibility}
                    >
                        <PanelRightClose className="h-5 w-5" />
                    </ButtonWithTooltip>
                </div>
            </CardHeader>

            {/* API Key 设置面板 */}
            {showSettings && (
                <div className="p-4 border-b bg-gray-50 space-y-3">
                    <div className="flex gap-2 items-center flex-wrap">
                        <select
                            value={provider}
                            onChange={(e) => handleProviderChange(e.target.value)}
                            className="px-3 py-2 border rounded-md text-sm"
                        >
                            <option value="deepseek">DeepSeek</option>
                            <option value="google">Google Gemini</option>
                            <option value="openai">OpenAI</option>
                        </select>
                        <select
                            value={model}
                            onChange={(e) => setModel(e.target.value)}
                            className="px-3 py-2 border rounded-md text-sm"
                            disabled={loadingModels}
                        >
                            {loadingModels ? (
                                <option>加载中...</option>
                            ) : (
                                availableModels.map((m) => (
                                    <option key={m.value} value={m.value}>
                                        {m.label}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>
                    <div className="flex gap-2 items-center">
                        <Input
                            type="password"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
                            placeholder="输入 API Key"
                            className="flex-1"
                        />
                    </div>
                    <p className="text-xs text-gray-500">
                        API Key 保存在本地，不会上传到第三方服务器
                    </p>
                </div>
            )}

            <CardContent className="flex-grow overflow-hidden px-2">
                <ChatMessageDisplay
                    messages={messages}
                    error={error}
                    setInput={setInput}
                    setFiles={handleFileChange}
                />
            </CardContent>

            <CardFooter className="p-2">
                <ChatInput
                    input={input}
                    status={status}
                    onSubmit={onFormSubmit}
                    onChange={handleInputChange}
                    onClearChat={() => {
                        setMessages([]);
                        clearDiagram();
                    }}
                    files={files}
                    onFileChange={handleFileChange}
                    showHistory={showHistory}
                    onToggleHistory={setShowHistory}
                />
            </CardFooter>
        </Card>
    );
}
