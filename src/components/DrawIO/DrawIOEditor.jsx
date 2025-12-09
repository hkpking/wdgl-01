import React, { useRef, useState, useEffect } from 'react';
import { DrawIoEmbed } from 'react-drawio';
import DrawIOChat from './DrawIOChat';
import { extractDiagramXML, replaceXMLParts, replaceNodes, convertToLegalXml } from '../../utils/drawio-utils';

export default function DrawIOEditor() {
    const drawioRef = useRef(null);
    const [currentXML, setCurrentXML] = useState('');
    const [isChatVisible, setIsChatVisible] = useState(true);

    // We use a promise resolver pattern to wait for the export to complete
    const exportResolverRef = useRef(null);

    const handleDiagramExport = (data) => {
        try {
            const extractedXML = extractDiagramXML(data.data);
            setCurrentXML(extractedXML);

            if (exportResolverRef.current) {
                exportResolverRef.current(extractedXML);
                exportResolverRef.current = null;
            }
        } catch (error) {
            console.error("Error extracting XML:", error);
        }
    };

    const getLatestXML = () => {
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
            // 1. Get latest XML to ensure we are editing the current state
            const latestXML = await getLatestXML();

            // 2. Apply edits
            const newXML = replaceXMLParts(latestXML, edits);

            // 3. Load new XML
            handleApplyXML(newXML);

        } catch (error) {
            console.error("Failed to apply edits:", error);
            alert("应用修改失败，请重试。");
        }
    };

    return (
        <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
            {/* Chat Sidebar */}
            <div
                className={`transition-all duration-300 ease-in-out ${isChatVisible ? 'w-80' : 'w-0'
                    } overflow-hidden border-r border-gray-200 bg-white relative`}
            >
                <div className="w-80 h-full">
                    <DrawIOChat
                        currentXML={currentXML}
                        onApplyXML={handleApplyXML}
                        onApplyEdits={handleApplyEdits}
                    />
                </div>
            </div>

            {/* Toggle Button (Floating or Integrated) */}
            <button
                onClick={() => setIsChatVisible(!isChatVisible)}
                className="absolute bottom-4 left-4 z-50 p-2 bg-white rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 text-gray-600"
                title={isChatVisible ? "隐藏聊天" : "显示聊天"}
            >
                {isChatVisible ? '◀' : '▶'}
            </button>

            {/* Draw.io Embed */}
            <div className="flex-1 h-full relative">
                <DrawIoEmbed
                    ref={drawioRef}
                    onExport={handleDiagramExport}
                    baseUrl={import.meta.env.VITE_DRAWIO_URL || undefined}
                    urlParameters={{
                        spin: true,
                        libraries: false,
                        saveAndExit: false,
                        noExitBtn: true,
                        lang: 'zh', // 设置界面语言为中文
                    }}
                />
            </div>
        </div>
    );
}
