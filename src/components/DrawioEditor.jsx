import React, { useEffect, useRef, useState } from 'react';

export default function DrawioEditor({ isOpen, onClose, initialXml, onSave }) {
    const iframeRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [tempXml, setTempXml] = useState(null);

    useEffect(() => {
        if (!isOpen) return;

        const handleMessage = (e) => {
            if (!e.data || typeof e.data !== 'string') return;

            let msg;
            try {
                msg = JSON.parse(e.data);
            } catch (err) {
                return;
            }

            if (msg.event === 'configure') {
                // Configuration if needed
                iframeRef.current?.contentWindow.postMessage(JSON.stringify({
                    action: 'configure',
                    config: {
                        compressXml: false // Keep it simple for now
                    }
                }), '*');
            } else if (msg.event === 'init') {
                setIsLoaded(true);
                // Send load message
                iframeRef.current?.contentWindow.postMessage(JSON.stringify({
                    action: 'load',
                    xml: initialXml || '',
                    autosave: 0, // We handle save manually via the save button
                }), '*');
            } else if (msg.event === 'save') {
                // User clicked save in Draw.io
                // 1. Capture XML
                const xml = msg.xml;
                setTempXml(xml);

                // 2. Request Export for Preview (SVG)
                iframeRef.current?.contentWindow.postMessage(JSON.stringify({
                    action: 'export',
                    format: 'svg',
                    spin: 'Generating preview...',
                    xml: xml,
                }), '*');
            } else if (msg.event === 'export') {
                // 3. Receive Export Data
                if (tempXml) {
                    // We have both XML and the exported image (SVG data URI)
                    onSave(tempXml, msg.data);
                    onClose();
                } else {
                    // Fallback if tempXml wasn't set (shouldn't happen in this flow)
                    // But if we just requested export without save, we might handle it here
                    // For now, assume this flows from 'save'
                    // If msg.data is the SVG, we can try to extract XML from it if embedded, but better to use the one from 'save'
                }
            } else if (msg.event === 'exit') {
                onClose();
            }
        };

        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, [isOpen, initialXml, onSave, onClose, tempXml]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white w-full h-full md:w-[95vw] md:h-[95vh] relative flex flex-col rounded-lg overflow-hidden shadow-2xl">
                <iframe
                    ref={iframeRef}
                    src="https://embed.diagrams.net/?embed=1&ui=atlas&spin=1&modified=unsavedChanges&proto=json&configure=1&libraries=1&clibs=general;flowchart;basic;arrows;bpmn"
                    className="w-full h-full border-0"
                    title="Draw.io Editor"
                />
                {!isLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-gray-500 font-medium">正在加载 Draw.io 编辑器...</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
