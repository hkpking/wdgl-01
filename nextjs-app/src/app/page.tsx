"use client";
import React, { useState, useEffect } from "react";
import { DrawIoEmbed } from "react-drawio";
import ChatPanel from "@/components/chat-panel";
import { useDiagram } from "@/contexts/diagram-context";

export default function Home() {
  const { drawioRef, handleDiagramExport } = useDiagram();
  const [isMobile, setIsMobile] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(true);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* 移动端提示 */}
      {isMobile && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gray-100">
          <div className="text-center p-8">
            <h1 className="text-2xl font-semibold text-gray-800">
              请在电脑端打开此应用
            </h1>
          </div>
        </div>
      )}

      {/* Draw.io 编辑器 */}
      <div className={`${isChatVisible ? 'w-2/3' : 'w-full'} p-1 h-full relative transition-all duration-300 ease-in-out`}>
        <DrawIoEmbed
          ref={drawioRef}
          onExport={handleDiagramExport}
          baseUrl={process.env.NEXT_PUBLIC_DRAWIO_URL || "https://embed.diagrams.net"}
          urlParameters={{
            spin: true,
            libraries: false,
            saveAndExit: false,
            noExitBtn: true,
            lang: 'zh',
          }}
        />
      </div>

      {/* AI 聊天面板 */}
      <div className={`${isChatVisible ? 'w-1/3' : 'w-12'} h-full p-1 transition-all duration-300 ease-in-out`}>
        <ChatPanel
          isVisible={isChatVisible}
          onToggleVisibility={() => setIsChatVisible(!isChatVisible)}
        />
      </div>
    </div>
  );
}
