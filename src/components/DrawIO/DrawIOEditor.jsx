import React, { useRef, useState, useEffect } from 'react';
import { DrawIoEmbed } from 'react-drawio';
import DrawIOChat from './DrawIOChat';
import { extractDiagramXML, replaceXMLParts, replaceNodes } from '../../utils/drawio-utils';

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

    const handleApplyXML = (xml) => {
        if (drawioRef.current) {
            let fullXML = xml;
            // If the XML is just the root nodes (from AI), wrap it in the standard structure
            if (xml.trim().startsWith('<root>')) {
                try {
                    const base = currentXML || EMPTY_DIAGRAM;
                    fullXML = replaceNodes(base, xml);
                } catch (error) {
                    console.error("Failed to merge nodes:", error);
                    // Fallback to empty diagram with new nodes
                    try {
                        fullXML = replaceNodes(EMPTY_DIAGRAM, xml);
                    } catch (e) {
                        console.error("Critical error constructing XML:", e);
                    }
                }
            }

            console.log("Loading XML to Draw.io:", fullXML.substring(0, 100) + "...");
            drawioRef.current.load({ xml: fullXML });
            setCurrentXML(fullXML);
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
                    urlParameters={{
                        spin: true,
                        libraries: false,
                        saveAndExit: false,
                        noExitBtn: true,
                    }}
                />
            </div>
        </div>
    );
}
