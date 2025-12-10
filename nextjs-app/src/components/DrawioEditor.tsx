'use client';

import React, { useState, useEffect } from 'react';
import { DrawIoEmbed } from 'react-drawio';
import { X, Save } from 'lucide-react';
import ChatPanel from '@/components/chat-panel';
import { DiagramProvider, useDiagram } from '@/contexts/diagram-context';

interface DrawioEditorModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialXml?: string;
    onSave: (xml: string, previewUrl: string) => void;
}

function DrawioEditorContent({ isOpen, onClose, initialXml, onSave }: DrawioEditorModalProps) {
    const { drawioRef, handleDiagramExport, chartXML, latestSvg, loadDiagram } = useDiagram();
    const [isChatVisible, setIsChatVisible] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // 加载初始 XML
    useEffect(() => {
        if (isOpen && initialXml && drawioRef && 'current' in drawioRef && drawioRef.current) {
            // 延迟加载以确保 Draw.io 已初始化
            const timer = setTimeout(() => {
                loadDiagram(initialXml);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [isOpen, initialXml, drawioRef, loadDiagram]);

    // 快捷键 Ctrl+B 切换聊天面板
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
                event.preventDefault();
                setIsChatVisible((prev) => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // 使用当前的 chartXML 和 latestSvg
            onSave(chartXML || '', latestSvg || '');
            onClose();
        } catch (error) {
            console.error("Save failed:", error);
            alert("保存失败，请重试");
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white w-full h-full max-w-[98vw] max-h-[98vh] rounded-lg shadow-2xl flex flex-col overflow-hidden">
                {/* Header */}
                <div className="h-12 border-b border-gray-200 flex justify-between items-center px-4 bg-gray-50 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-700">流程图编辑器</span>
                        <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">AI 驱动</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 text-sm font-medium transition-colors"
                        >
                            {isSaving ? '保存中...' : (
                                <>
                                    <Save size={16} /> 保存并关闭
                                </>
                            )}
                        </button>
                        <button
                            onClick={onClose}
                            className="p-1.5 hover:bg-gray-200 rounded text-gray-500 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Main Content - 左右布局，Draw.io 在左，AI 在右 */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Draw.io 编辑器 */}
                    <div className={`${isChatVisible ? 'w-2/3' : 'w-full'} h-full relative transition-all duration-300 ease-in-out`}>
                        <DrawIoEmbed
                            ref={drawioRef}
                            onExport={handleDiagramExport}
                            baseUrl={process.env.NEXT_PUBLIC_DRAWIO_URL || "http://120.79.181.206:18080"}
                            urlParameters={{
                                spin: true,
                                libraries: false,
                                saveAndExit: false,
                                noExitBtn: true,
                                lang: 'zh',
                            }}
                        />
                    </div>

                    {/* AI 聊天面板 - 右侧 */}
                    <div className={`${isChatVisible ? 'w-1/3' : 'w-0'} h-full transition-all duration-300 ease-in-out overflow-hidden border-l border-gray-200`}>
                        <ChatPanel
                            isVisible={isChatVisible}
                            onToggleVisibility={() => setIsChatVisible(!isChatVisible)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

// 包装组件，提供 DiagramProvider
export default function DrawioEditor(props: DrawioEditorModalProps) {
    if (!props.isOpen) return null;

    return (
        <DiagramProvider>
            <DrawioEditorContent {...props} />
        </DiagramProvider>
    );
}
