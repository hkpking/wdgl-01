import React, { useRef, useState, useEffect } from 'react';
import { DrawIoEmbed } from 'react-drawio';
import { X, Save, Maximize2, Minimize2 } from 'lucide-react';
import DrawIOChat from './DrawIO/DrawIOChat';
import { extractDiagramXML, replaceXMLParts, replaceNodes, convertToLegalXml } from '../utils/drawio-utils';

export default function DrawioEditor({ isOpen, onClose, initialXml, onSave }) {
    const drawioRef = useRef(null);
    const [currentXML, setCurrentXML] = useState(initialXml || '');
    const [isChatVisible, setIsChatVisible] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Reset state when opening
    useEffect(() => {
        if (isOpen) {
            setCurrentXML(initialXml || '');
            setIsChatVisible(true);
        }
    }, [isOpen, initialXml]);

    // Promise resolver for export
    const exportResolverRef = useRef(null);

    const handleDiagramExport = (data) => {
        try {
            // If we are just tracking changes or AI needs it
            if (data.event === 'export') {
                const extractedXML = extractDiagramXML(data.data);
                setCurrentXML(extractedXML);

                if (exportResolverRef.current) {
                    exportResolverRef.current({ xml: extractedXML, data: data.data }); // data.data is the SVG/XMLSVG
                    exportResolverRef.current = null;
                }
            }
        } catch (error) {
            console.error("Error extracting XML:", error);
        }
    };

    const getLatestData = () => {
        return new Promise((resolve, reject) => {
            if (!drawioRef.current) {
                reject("Draw.io editor not initialized");
                return;
            }

            exportResolverRef.current = resolve;

            // Trigger export
            drawioRef.current.exportDiagram({
                format: 'xmlsvg',
            });

            // Timeout safety
            setTimeout(() => {
                if (exportResolverRef.current) {
                    exportResolverRef.current = null;
                    reject("Export timed out");
                }
            }, 5000);
        });
    };

    const EMPTY_DIAGRAM = '<mxfile><diagram name="Page-1" id="page-1"><mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/></root></mxGraphModel></diagram></mxfile>';

    /**
     * 处理 AI 生成的 XML 并加载到 Draw.io
     * 对标 aidiwo 的处理逻辑：统一使用 convertToLegalXml + replaceNodes
     */
    const handleApplyXML = (xml) => {
        if (!drawioRef.current) {
            console.error("Draw.io editor not initialized");
            return;
        }

        if (!xml || typeof xml !== 'string') {
            console.error("Invalid XML provided:", xml);
            return;
        }

        try {
            const inputXml = xml.trim();
            console.log("[handleApplyXML] Processing XML input...");

            // 1. 使用 convertToLegalXml 清理 XML，提取有效的 mxCell 节点
            // 这与 aidiwo 的 handleDisplayChart 函数完全一致
            const cleanedXml = convertToLegalXml(inputXml);
            console.log("[handleApplyXML] Cleaned XML:", cleanedXml.substring(0, 100) + "...");

            // 2. 使用 replaceNodes 将清理后的节点合并到当前图表
            const base = currentXML || EMPTY_DIAGRAM;
            const mergedXml = replaceNodes(base, cleanedXml);
            console.log("[handleApplyXML] Merged XML ready, loading to Draw.io");

            // 3. 加载到 Draw.io
            drawioRef.current.load({ xml: mergedXml });
            setCurrentXML(mergedXml);

        } catch (error) {
            console.error("[handleApplyXML] Failed to apply XML:", error);
            // 回退：加载空图表
            try {
                console.log("[handleApplyXML] Fallback: Loading empty diagram");
                drawioRef.current.load({ xml: EMPTY_DIAGRAM });
                setCurrentXML(EMPTY_DIAGRAM);
            } catch (e) {
                console.error("[handleApplyXML] Critical error:", e);
            }
        }
    };


    const handleApplyEdits = async (edits) => {
        try {
            const { xml } = await getLatestData();
            const newXML = replaceXMLParts(xml, edits);
            handleApplyXML(newXML);
        } catch (error) {
            console.error("Failed to apply edits:", error);
            alert("应用修改失败，请重试。");
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const { xml, data } = await getLatestData();
            // data is the XMLSVG string (data:image/svg+xml;base64,...)
            // We can use this as the preview URL directly
            onSave(xml, data);
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
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full h-full max-w-[95vw] max-h-[95vh] rounded-lg shadow-2xl flex flex-col overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">

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

                {/* Main Content */}
                <div className="flex-1 flex overflow-hidden relative">
                    {/* Chat Sidebar */}
                    <div
                        className={`transition-all duration-300 ease-in-out ${isChatVisible ? 'w-80 border-r' : 'w-0'
                            } border-gray-200 bg-white relative flex-shrink-0`}
                    >
                        <div className="w-80 h-full absolute left-0 top-0">
                            <DrawIOChat
                                currentXML={currentXML}
                                onApplyXML={handleApplyXML}
                                onApplyEdits={handleApplyEdits}
                            />
                        </div>
                    </div>

                    {/* Toggle Chat Button */}
                    <button
                        onClick={() => setIsChatVisible(!isChatVisible)}
                        className="absolute bottom-4 left-4 z-10 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 text-gray-600 transition-transform hover:scale-105"
                        style={{ left: isChatVisible ? '21rem' : '1rem' }}
                        title={isChatVisible ? "隐藏 AI 助手" : "显示 AI 助手"}
                    >
                        {isChatVisible ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
                    </button>

                    {/* Editor Area */}
                    <div className="flex-1 h-full bg-gray-100 relative">
                        <DrawIoEmbed
                            ref={drawioRef}
                            onExport={handleDiagramExport}
                            baseUrl={import.meta.env.VITE_DRAWIO_URL || undefined}
                            urlParameters={{
                                spin: true,
                                libraries: false,
                                saveAndExit: false,
                                noExitBtn: true,
                                ui: 'atlas', // Use atlas theme for better embedded experience
                                lang: 'zh', // 设置界面语言为中文
                            }}
                            xml={initialXml} // Load initial XML
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
