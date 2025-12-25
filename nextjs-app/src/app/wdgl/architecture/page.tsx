
"use client";

import React from "react";
import MermaidDiagram from "@/components/architecture/MermaidDiagram";

const directoryArchitectureChart = `
flowchart TB
    subgraph Best_Practices ["业内最佳实践 (Industry Best Practices)"]
        direction TB
        A1[高性能渲染 (Virtualization)]:::missing
        A2[多选操作 (Multi-select)]:::missing
        A3[键盘导航 (Keyboard Nav)]:::missing
        A4["撤销/重做 (Undo/Redo)"]:::missing
        A5[实时协同 (Real-time Tree Sync)]:::implemented
        A6[乐观更新 (Optimistic UI)]:::implemented
        A7[拖拽排序 (Drag & Drop)]:::implemented
        A8[右键/快捷菜单 (Context Menu)]:::implemented
    end

    subgraph Current_Impl ["我们已实现 (Implemented)"]
        direction TB
        B1[FolderTree (前端组件)]
        B1 --> |Inline Rename| B2(行内编辑 + 即时验证):::implemented
        B1 --> |Dnd-kit Lib| B3(拖拽移动文件/文件夹):::implemented
        B1 --> |Filter Logic| B4(纯前端搜索/过滤):::implemented
        
        B5["Page / Data Layer (数据层)"]
        B5 --> |React Query| B6(全量缓存 & 自动重试):::implemented
        B5 --> |Optimistic Update| B7(操作即时响应 / 0延迟):::implemented
        B5 --> |Supabase| B8(持久化存储):::implemented
    end

    A5 -.-> |Yjs| B5
    A6 ==> B7
    A7 ==> B3
    A8 ==> B1
    
    A1 -.- B1
    A2 -.- B1
    A3 -.- B1
    A4 -.- B5

    classDef implemented fill:#e6fffa,stroke:#38b2ac,stroke-width:2px;
    classDef missing fill:#fff5f5,stroke:#fc8181,stroke-width:2px,stroke-dasharray: 5 5;
`;

export default function ArchitecturePage() {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                <header>
                    <h1 className="text-3xl font-bold text-gray-800">系统架构可视化</h1>
                    <p className="text-gray-500 mt-2">实时渲染当前产品功能与最佳实践的对比图谱</p>
                </header>

                <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                            📂 目录管理模块 (Directory Management)
                        </h2>
                        <div className="flex gap-4 text-sm">
                            <span className="flex items-center gap-1">
                                <span className="w-3 h-3 bg-teal-50 border border-teal-400 rounded-sm"></span>
                                已实现 (Implemented)
                            </span>
                            <span className="flex items-center gap-1">
                                <span className="w-3 h-3 bg-red-50 border border-red-300 border-dashed rounded-sm"></span>
                                待实现 (Missing/Planned)
                            </span>
                        </div>
                    </div>

                    <MermaidDiagram chart={directoryArchitectureChart} className="min-h-[600px]" />
                </section>
            </div>
        </div>
    );
}
