"use client";

/**
 * FlowchartEditorModule - 流程图编辑器独立模块
 * 
 * 嵌入式流程图编辑器，与文档/表格编辑器布局一致。
 * 可以被知识库页面使用，支持打开、编辑、保存流程图。
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowLeft, Save, GitBranch, Check, Cloud, CloudOff, Sparkles, Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { DrawIoEmbed, DrawIoEmbedRef } from 'react-drawio';
import { DiagramProvider, useDiagram } from '@/contexts/diagram-context';
import ChatPanel from '@/components/chat-panel';

// 类型定义
type SaveStatus = 'saved' | 'saving' | 'unsaved' | 'error';

export interface FlowchartEditorModuleProps {
    /** 流程图 ID */
    flowchartId: string;
    /** 初始数据 */
    initialData?: {
        id: string;
        title: string;
        content?: string;
        metadata?: { previewUrl?: string };
    };
    /** 当前用户 ID */
    userId: string;
    /** 当前用户信息 */
    currentUser?: { uid: string; displayName?: string; email?: string };
    /** 显示模式 */
    mode?: 'standalone' | 'embedded';
    /** 返回按钮回调 */
    onBack?: () => void;
    /** 是否显示返回按钮 */
    showBackButton?: boolean;
    /** 是否显示头部工具栏 */
    showHeader?: boolean;
    /** 标题变化回调 */
    onTitleChange?: (title: string) => void;
    /** 保存函数 */
    onSave?: (data: { title: string; content: string; previewUrl: string }) => Promise<void>;
    /** 保存成功回调 */
    onSaveSuccess?: (data?: { id: string; title: string; updatedAt: string }) => void;
    /** 编辑状态变化回调 */
    onDirtyChange?: (isDirty: boolean) => void;
}

// 内部编辑器内容组件
function FlowchartEditorContent({
    flowchartId,
    initialData,
    userId,
    currentUser,
    mode = 'standalone',
    onBack,
    showBackButton = true,
    showHeader = true,
    onTitleChange,
    onSave,
    onSaveSuccess,
    onDirtyChange,
}: FlowchartEditorModuleProps) {
    const { drawioRef, handleDiagramExport, loadDiagram, handleExport, setActivePageId } = useDiagram();

    // 状态
    const [title, setTitle] = useState(initialData?.title || '新建流程图');
    const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
    const [lastSaved, setLastSaved] = useState<Date | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isChatVisible, setIsChatVisible] = useState(true);
    const hasLoadedRef = useRef(false);
    const lastFlowchartIdRef = useRef<string | null>(null);
    const latestXmlRef = useRef<string | null>(null);
    const lastSavedContentRef = useRef<string | null>(initialData?.content || null);
    const iframeContainerRef = useRef<HTMLDivElement>(null);
    const statusIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const isSavingRef = useRef(false); // 防止保存循环

    // 辅助函数：消息发送给 iframe
    const postMessageToDrawio = useCallback((msg: any) => {
        if (iframeContainerRef.current) {
            const iframe = iframeContainerRef.current.querySelector('iframe');
            if (iframe && iframe.contentWindow) {
                iframe.contentWindow.postMessage(JSON.stringify(msg), '*');
            }
        }
    }, []);

    // 监听 Draw.io 消息，获取当前页面
    useEffect(() => {
        const handleMessage = (e: MessageEvent) => {
            if (!e.data || typeof e.data !== 'string') return;
            try {
                const msg = JSON.parse(e.data);

                // 处理 pageSelected (如果 Draw.io 支持/配置了)
                if (msg.event === 'pageSelected' && msg.change) {
                    const pageId = msg.change.id || msg.change;
                    if (typeof pageId === 'string') {
                        console.log('[Flowchart] Event: pageSelected ->', pageId);
                        setActivePageId(pageId);
                    }
                }
                // 处理 status 或 export 事件 (包含 currentPage 索引)
                else if ((msg.event === 'status' || msg.event === 'export') && typeof msg.currentPage === 'number') {
                    // msg.currentPage 是索引，需要映射到 ID
                    // msg.xml 包含了当前的图表结构
                    const xmlStr = msg.xml || latestXmlRef.current || "";
                    if (xmlStr) {
                        // 简单的正则提取所有 diagram id
                        // 注意：XML 中的 diagram 顺序对应索引
                        const diagramRegex = /<diagram[^>]*id="([^"]+)"[^>]*>/g;
                        const matches = [...xmlStr.matchAll(diagramRegex)];
                        if (matches && matches.length > msg.currentPage) {
                            const targetId = matches[msg.currentPage][1];
                            setActivePageId((prev) => {
                                if (prev !== targetId) {
                                    console.log(`[Flowchart] Channel '${msg.event}' updated Active Page: ${prev} -> ${targetId} (Index: ${msg.currentPage})`);
                                    return targetId;
                                }
                                return prev;
                            });
                        }
                    }
                }

                if (msg.event === 'init') {
                    console.log('[Flowchart] Draw.io Initialized');
                }
            } catch (err) {
                // 忽略非 JSON 消息
            }
        };
        window.addEventListener('message', handleMessage);

        // 启动轮询获取状态 (因为 pageSelected 事件不可靠)
        // 每 2 秒查询一次状态，确保 AI 获取正确的页面上下文
        statusIntervalRef.current = setInterval(() => {
            postMessageToDrawio({ action: 'status' });
        }, 2000);

        return () => {
            window.removeEventListener('message', handleMessage);
            if (statusIntervalRef.current) clearInterval(statusIntervalRef.current);
        };
    }, [setActivePageId, postMessageToDrawio]);

    // 当 flowchartId 变化时，重置状态
    useEffect(() => {
        // 检测是否是新的流程图
        if (flowchartId !== lastFlowchartIdRef.current) {
            console.log('[Flowchart] 切换到新流程图:', flowchartId, '标题:', initialData?.title);
            lastFlowchartIdRef.current = flowchartId;
            // hasLoadedRef.current 由 onLoad 回调控制

            // 同步标题
            setTitle(initialData?.title || '新建流程图');
            setSaveStatus('saved');
            lastSavedContentRef.current = initialData?.content || null;
            setActivePageId(''); // 重置页面 ID
        }
    }, [flowchartId, initialData?.title, setActivePageId]);

    // 同步 dirty 状态
    useEffect(() => {
        if (onDirtyChange) {
            onDirtyChange(saveStatus === 'unsaved' || saveStatus === 'error');
        }
    }, [saveStatus, onDirtyChange]);

    // 标题变化
    const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        setSaveStatus('unsaved');
        onTitleChange?.(newTitle);
    }, [onTitleChange]);

    // 保存流程图
    const handleSave = useCallback(async () => {
        if (!onSave) return;

        // 防止重入 - 避免保存循环
        if (isSavingRef.current) {
            console.log('[Flowchart] 跳过保存：正在保存中');
            return;
        }

        // 防止在编辑器未加载完成时保存空内容
        if (!hasLoadedRef.current && initialData?.content) {
            console.log('[Flowchart] 跳过保存：编辑器尚未加载完成');
            return;
        }

        isSavingRef.current = true;
        setSaveStatus('saving');
        try {
            // 优先使用 latestXmlRef（来自 onAutoSave/onSave），这是最可靠的完整 XML 数据源
            // 只在 latestXmlRef 为空或格式不正确时才使用 handleExport
            let xml = latestXmlRef.current;

            // 验证 latestXmlRef 是否有效
            const isLatestXmlValid = xml && (xml.includes('<mxfile') || xml.includes('<mxGraphModel'));

            if (!isLatestXmlValid) {
                console.log('[Flowchart] latestXmlRef 无效，尝试使用 handleExport...');
                const exportResult = await handleExport();
                xml = exportResult.xml;
            }

            console.log('[Flowchart] 保存数据:', xml?.length, '字符',
                xml?.includes('<mxfile') ? '(mxfile完整格式)' :
                    xml?.includes('<mxGraphModel') ? '(mxGraphModel单页格式)' : '(未知格式)');

            // 检查是否为无效格式（如 base64 图片数据）
            if (xml && xml.startsWith('data:')) {
                console.error('[Flowchart] 检测到无效的 base64 数据格式，跳过保存');
                setSaveStatus('error');
                return;
            }

            // 检查是否为真正的空内容
            const hasValidStructure = xml && (xml.includes('<mxfile') || xml.includes('<mxGraphModel'));
            const isEmptyDiagram = !xml || xml.length < 100 || !hasValidStructure;

            if (isEmptyDiagram && initialData?.content && initialData.content.length > 100) {
                console.log('[Flowchart] 跳过保存：检测到无效内容，避免覆盖原有数据');
                console.log('[Flowchart] 当前内容长度:', xml?.length, '原有内容长度:', initialData.content.length);
                setSaveStatus('saved');
                return;
            }

            await onSave({ title, content: xml || '', previewUrl: '' });
            setLastSaved(new Date());
            setSaveStatus('saved');
            lastSavedContentRef.current = xml || '';
            onSaveSuccess?.({
                id: flowchartId,
                title,
                updatedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error('[Flowchart] 保存失败:', error);
            setSaveStatus('error');
        } finally {
            isSavingRef.current = false;
        }
    }, [flowchartId, title, handleExport, onSave, onSaveSuccess, initialData?.content]);

    // 快捷键 Ctrl+S 保存
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
            // Ctrl+B 切换 AI 面板
            if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
                e.preventDefault();
                setIsChatVisible(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleSave]);



    return (
        <div className="h-full flex flex-col bg-white">
            {/* 顶部工具栏 */}
            {showHeader && (
                <header className="h-14 border-b border-gray-200 flex items-center justify-between px-4 bg-white shrink-0">
                    <div className="flex items-center gap-3">
                        {showBackButton && (
                            <button
                                onClick={onBack}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                title="返回"
                            >
                                <ArrowLeft size={20} className="text-gray-600" />
                            </button>
                        )}

                        <GitBranch size={20} className="text-purple-600" />

                        <input
                            type="text"
                            value={title}
                            onChange={handleTitleChange}
                            onBlur={() => handleSave()}
                            className="text-lg font-medium bg-transparent border-none outline-none focus:ring-2 focus:ring-purple-500 rounded px-2 py-1 min-w-[200px]"
                            placeholder="无标题流程图"
                        />

                        <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">AI 驱动</span>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* 保存状态指示器 */}
                        <div className="flex items-center gap-1.5 text-xs">
                            {saveStatus === 'saved' && (
                                <>
                                    <Cloud size={14} className="text-green-500" />
                                    <span className="text-gray-400">
                                        {lastSaved ? `已保存 ${lastSaved.toLocaleTimeString()}` : '已保存'}
                                    </span>
                                </>
                            )}
                            {saveStatus === 'saving' && (
                                <>
                                    <Cloud size={14} className="text-blue-500 animate-pulse" />
                                    <span className="text-blue-500">保存中...</span>
                                </>
                            )}
                            {saveStatus === 'unsaved' && (
                                <>
                                    <CloudOff size={14} className="text-orange-500" />
                                    <span className="text-orange-500">未保存</span>
                                </>
                            )}
                            {saveStatus === 'error' && (
                                <>
                                    <CloudOff size={14} className="text-red-500" />
                                    <span className="text-red-500">保存失败</span>
                                </>
                            )}
                        </div>

                        <button
                            onClick={handleSave}
                            disabled={saveStatus === 'saving'}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                        >
                            {saveStatus === 'saving' ? (
                                <Cloud size={16} className="animate-pulse" />
                            ) : saveStatus === 'saved' ? (
                                <Check size={16} />
                            ) : (
                                <Save size={16} />
                            )}
                            {saveStatus === 'saving' ? '保存中...' : '保存'}
                        </button>

                        <button
                            onClick={() => setIsChatVisible(!isChatVisible)}
                            className={`p-2 rounded-lg transition-colors ${isChatVisible ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-100'}`}
                            title="AI 助手 (Ctrl+B)"
                        >
                            <Sparkles size={20} className="text-purple-600" />
                        </button>
                    </div>
                </header>
            )}

            {/* 主体区域 */}
            <div className="flex-1 flex overflow-hidden">
                {/* Draw.io 编辑器 */}
                <div ref={iframeContainerRef} className={`${isChatVisible ? 'w-2/3' : 'flex-1'} h-full relative transition-all duration-300`}>
                    <DrawIoEmbed
                        key={flowchartId}
                        xml={initialData?.content ? (() => {
                            // 辅助函数：解码 HTML 实体
                            // 解决 &lt;mxfile 等格式导致的 invalid block type 错误
                            const decodeHTMLEntities = (text: string) => {
                                if (!text) return "";
                                const entities: { [key: string]: string } = {
                                    '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'"
                                };
                                return text.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, (char) => entities[char]);
                            };

                            let content = initialData.content;
                            // 1. 如果是 base64 数据（脏数据），尝试清理或忽略
                            if (content.startsWith('data:')) {
                                console.warn('[Flowchart] 忽略无效的 base64 初始数据');
                                return undefined;
                            }

                            // 2. 解码 HTML 实体
                            content = decodeHTMLEntities(content);

                            // 3. 确保是 mxfile 格式
                            return content.includes('<mxfile')
                                ? content
                                : `<mxfile><diagram name="Page-1" id="page-1">${typeof window !== 'undefined' ? window.btoa(unescape(encodeURIComponent(content))) : ''}</diagram></mxfile>`;
                        })() : undefined}
                        ref={drawioRef}
                        onExport={handleDiagramExport}
                        baseUrl={process.env.NEXT_PUBLIC_DRAWIO_URL || "https://bpm-auto.com/drawio"}
                        onLoad={() => {
                            setIsLoading(false);
                            hasLoadedRef.current = true;
                            console.log('[Flowchart] 编辑器加载完成');
                        }}
                        onAutoSave={(data) => {
                            if (data.xml) {
                                latestXmlRef.current = data.xml;
                                if (data.xml !== lastSavedContentRef.current) {
                                    setSaveStatus('unsaved');
                                }
                                console.log('[Flowchart] onAutoSave 捕获数据:', data.xml.length, 'chars');
                            }
                        }}
                        onSave={(data) => {
                            if (data.xml) {
                                latestXmlRef.current = data.xml;
                                console.log('[Flowchart] onSave (internal) 捕获数据:', data.xml.length, 'chars');
                                // 只更新状态，不触发 handleSave 避免循环
                                if (data.xml !== lastSavedContentRef.current) {
                                    setSaveStatus('unsaved');
                                }
                            }
                        }}
                        urlParameters={{
                            spin: true,
                            libraries: false,
                            saveAndExit: false,
                            noExitBtn: true,
                            lang: 'zh',
                            math: '0',
                        } as any}
                    />
                    {isLoading && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white">
                            <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
                            <p className="text-gray-500 font-medium">编辑器加载中...</p>
                        </div>
                    )}
                </div>

                {/* AI 聊天面板 */}
                <div className={`${isChatVisible ? 'w-1/3' : 'w-12'} h-full transition-all duration-300 overflow-hidden border-l border-gray-200`}>
                    <ChatPanel
                        isVisible={isChatVisible}
                        onToggleVisibility={() => setIsChatVisible(!isChatVisible)}
                    />
                </div>
            </div>
        </div>
    );
}

// 导出包装组件（提供 DiagramProvider）
export default function FlowchartEditorModule(props: FlowchartEditorModuleProps) {
    return (
        <DiagramProvider>
            <FlowchartEditorContent {...props} />
        </DiagramProvider>
    );
}
