import type { Metadata } from "next";
import { DiagramProvider } from "@/contexts/diagram-context";
import { StorageProvider } from "@/contexts/StorageContext";
import SWRProvider from "@/components/providers/SWRProvider";
import ReactQueryProvider from "@/components/providers/ReactQueryProvider";
import { PageErrorBoundary } from "@/components/providers/ErrorBoundary";

import "./globals.css";

// 使用系统字体栈，避免依赖 Google Fonts（阿里云服务器无法访问）
const fontVariables = "font-sans";

export const metadata: Metadata = {
  title: "WDGL 文档管理系统 - AI 驱动的智能制度管理",
  description: "AI 驱动的制度文档管理系统，支持流程图绘制、文档编辑、审批发布等功能",
  keywords: ["制度管理", "文档编辑", "流程图", "AI 绘图", "审批流程"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${fontVariables} antialiased`}
      >
        <PageErrorBoundary>
          <ReactQueryProvider>
            <SWRProvider>
              <StorageProvider>
                <DiagramProvider>{children}</DiagramProvider>
              </StorageProvider>
            </SWRProvider>
          </ReactQueryProvider>
        </PageErrorBoundary>
      </body>
    </html>
  );
}

