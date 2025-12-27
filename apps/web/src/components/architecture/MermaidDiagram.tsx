
"use client";

import React, { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

mermaid.initialize({
    startOnLoad: false,
    theme: "default",
    securityLevel: "loose",
});

interface MermaidDiagramProps {
    chart: string;
    className?: string;
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ chart, className }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState<string>("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const renderChart = async () => {
            if (!chart || !containerRef.current) return;

            try {
                setError(null);
                // Generate a unique ID for each render to avoid collisions
                const id = `mermaid-${Math.random().toString(36).substring(2, 9)}`;
                const { svg } = await mermaid.render(id, chart);
                setSvg(svg);
            } catch (err) {
                console.error("Mermaid Render Error:", err);
                setError("Failed to render diagram. Check console for details.");
            }
        };

        renderChart();
    }, [chart]);

    return (
        <div className={`mermaid-container ${className || ""}`}>
            {error ? (
                <div className="p-4 bg-red-50 text-red-500 border border-red-200 rounded">
                    {error}
                </div>
            ) : (
                <div
                    ref={containerRef}
                    className="w-full flex justify-center overflow-auto p-4 bg-white rounded-lg shadow-sm border border-gray-100"
                    dangerouslySetInnerHTML={{ __html: svg }}
                />
            )}
        </div>
    );
};

export default MermaidDiagram;
