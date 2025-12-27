"use client";

import React, { createContext, useContext, useRef, useState } from "react";
import type { DrawIoEmbedRef } from "react-drawio";
import { extractDiagramXML } from "../lib/utils";

interface DiagramContextType {
    chartXML: string;
    latestSvg: string;
    diagramHistory: { svg: string; xml: string }[];
    loadDiagram: (chart: string) => void;
    handleExport: () => Promise<{ xml: string; svg: string }>;
    resolverRef: React.Ref<((value: { xml: string; svg: string }) => void) | null>;
    drawioRef: React.Ref<DrawIoEmbedRef | null>;
    handleDiagramExport: (data: any) => void;
    clearDiagram: () => void;
    activePageId: string;
    setActivePageId: React.Dispatch<React.SetStateAction<string>>;
}

const DiagramContext = createContext<DiagramContextType | undefined>(undefined);

export function DiagramProvider({ children }: { children: React.ReactNode }) {
    const [chartXML, setChartXML] = useState<string>("");
    const [activePageId, setActivePageId] = useState<string>("");
    const [latestSvg, setLatestSvg] = useState<string>("");
    const [diagramHistory, setDiagramHistory] = useState<
        { svg: string; xml: string }[]
    >([]);
    const drawioRef = useRef<DrawIoEmbedRef | null>(null);
    const resolverRef = useRef<((value: { xml: string; svg: string }) => void) | null>(null);

    const handleExport = () => {
        return new Promise<{ xml: string; svg: string }>((resolve) => {
            resolverRef.current = resolve;
            if (drawioRef.current) {
                // 使用 xmlsvg 格式：返回 SVG 并在 content 属性中嵌入完整的 mxfile XML
                // 必须使用 xmlsvg 才能在导出时包含所有页面 (xml 格式只返回单页 mxGraphModel)
                drawioRef.current.exportDiagram({
                    format: "xmlsvg" as any,
                } as any);
            } else {
                console.error("DrawIO ref is null");
                resolve({ xml: "", svg: "" });
            }
        });
    };

    const loadDiagram = (chart: string) => {
        if (drawioRef.current) {
            // 检查是否已经是 mxfile 格式，如果是则直接加载
            // 如果是 mxGraphModel，需要 Base64 编码并包裹，避免 InvalidCharacterError (atob failure)
            let xmlToLoad = chart;
            if (chart && !chart.includes('<mxfile')) {
                const encoded = typeof window !== 'undefined' ? window.btoa(unescape(encodeURIComponent(chart))) : '';
                xmlToLoad = `<mxfile><diagram name="Page-1" id="page-1">${encoded}</diagram></mxfile>`;
            }
            drawioRef.current.load({
                xml: xmlToLoad,
            });
        } else {
            console.warn('[DiagramContext] drawioRef.current 为空，无法加载');
        }
    };

    const handleDiagramExport = (data: any) => {
        let xmlContent = "";
        let svgContent = "";

        // 辅助函数：解码 HTML 实体
        const decodeHTMLEntities = (text: string) => {
            if (!text) return "";
            const entities: { [key: string]: string } = {
                '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#39;': "'"
            };
            return text.replace(/&amp;|&lt;|&gt;|&quot;|&#39;/g, (char) => entities[char]);
        };

        // xmlsvg 格式返回 base64 编码的 SVG，其中 content 属性包含完整的 mxfile XML
        if (data.data && typeof data.data === 'string') {
            if (data.data.startsWith('data:image/svg+xml;base64,')) {
                // 解码 SVG
                const base64 = data.data.split(',')[1];
                try {
                    svgContent = decodeURIComponent(escape(atob(base64)));
                    // 从 SVG 的 content 属性中提取 mxfile XML（URL 编码）
                    const contentMatch = svgContent.match(/content="([^"]+)"/);
                    if (contentMatch) {
                        // 1. URL Decode
                        let extractedXml = decodeURIComponent(contentMatch[1]);
                        // 2. HTML Entity Decode (修复关键：将 &lt;mxfile 还原为 <mxfile)
                        extractedXml = decodeHTMLEntities(extractedXml);

                        xmlContent = extractedXml;
                    }
                } catch (e) {
                    console.error('[DiagramContext] 解码 SVG 失败:', e);
                    xmlContent = data.data;
                }
            } else {
                // 非 base64 格式，直接使用
                xmlContent = data.data;
            }
        }

        setChartXML(xmlContent);
        setLatestSvg(svgContent);

        setDiagramHistory((prev) => [
            ...prev,
            {
                svg: svgContent,
                xml: xmlContent,
            },
        ]);
        if (resolverRef.current) {
            resolverRef.current({ xml: xmlContent, svg: svgContent });
            resolverRef.current = null;
        }
    };

    const clearDiagram = () => {
        const emptyDiagram = `<mxfile><diagram name="Page-1" id="page-1"><mxGraphModel><root><mxCell id="0"/><mxCell id="1" parent="0"/></root></mxGraphModel></diagram></mxfile>`;
        loadDiagram(emptyDiagram);
        setChartXML(emptyDiagram);
        setLatestSvg("");
        setDiagramHistory([]);
    };

    return (
        <DiagramContext.Provider
            value={{
                chartXML,
                activePageId,
                latestSvg,
                diagramHistory,
                loadDiagram,
                handleExport,
                resolverRef,
                drawioRef,
                handleDiagramExport,
                clearDiagram,
                setActivePageId
            }}
        >
            {children}
        </DiagramContext.Provider>
    );
}

export function useDiagram() {
    const context = useContext(DiagramContext);
    if (context === undefined) {
        throw new Error("useDiagram must be used within a DiagramProvider");
    }
    return context;
}
