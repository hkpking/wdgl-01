import React from 'react';
import { Settings, Link as LinkIcon, User, Activity, ChevronRight, GitGraph, AlertTriangle, Image as ImageIcon, Table as TableIcon, Plus, Minus, Workflow, Bot } from 'lucide-react';
import AISidebar from '../AI/AISidebar';

export default function RightSidebar({ block, onChange, readOnly, isOpen, onToggle, currentUser, docId, activeTab, onTabChange }) {
    const updateField = (field, value) => {
        onChange({ ...block, [field]: value });
    };

    const updateMeta = (key, value) => {
        onChange({ ...block, meta: { ...block.meta, [key]: value } });
    };

    if (!isOpen) {
        return (
            <div className="w-12 bg-white border-l border-slate-200 flex flex-col items-center py-4 shadow-sm z-20 transition-all duration-300">
                <button onClick={onToggle} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 mb-4" title="展开属性面板">
                    <Settings size={20} />
                </button>
            </div>
        );
    }

    return (
        <div className="w-80 bg-white border-l border-slate-200 flex flex-col shadow-xl z-20 transition-all duration-300">
            {/* Tab Header */}
            <div className="h-12 border-b border-slate-100 flex items-center bg-slate-50 flex-shrink-0">
                <button
                    onClick={() => onTabChange('properties')}
                    className={`flex-1 h-full flex items-center justify-center text-sm font-medium transition-colors ${activeTab === 'properties' ? 'text-blue-600 bg-white border-t-2 border-blue-500' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                    <Settings size={14} className="mr-1.5" />
                    属性
                </button>
                <div className="w-px h-4 bg-slate-200"></div>
                <button
                    onClick={() => onTabChange('ai')}
                    className={`flex-1 h-full flex items-center justify-center text-sm font-medium transition-colors ${activeTab === 'ai' ? 'text-purple-600 bg-white border-t-2 border-purple-500' : 'text-slate-500 hover:bg-slate-100'}`}
                >
                    <Bot size={14} className="mr-1.5" />
                    AI 助手
                </button>
                <button onClick={onToggle} className="w-10 h-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 border-l border-slate-100">
                    <ChevronRight size={16} />
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto flex flex-col h-full">
                {activeTab === 'properties' ? (
                    block ? (
                        // Properties Content
                        <div className="p-4 space-y-6">
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">数据定义</label>

                                <div className="space-y-1">
                                    <span className="text-xs text-slate-500">条款 ID</span>
                                    <div className="flex items-center justify-between bg-slate-100 p-2 rounded text-sm font-mono text-slate-600">
                                        {block.id}
                                        <button className="text-blue-500 hover:text-blue-600"><LinkIcon size={14} /></button>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-xs text-slate-500">语义类型</span>
                                    <select
                                        className="w-full p-2 border border-slate-200 rounded text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={block.type}
                                        onChange={(e) => updateField('type', e.target.value)}
                                        disabled={readOnly}
                                    >
                                        <option value="clause">普通条款 (Clause)</option>
                                        <option value="rule">控制规则 (Rule)</option>
                                        <option value="risk">风险点 (Risk)</option>
                                        <option value="process_link">流程挂载 (Link)</option>
                                        <option value="image">图片 (Image)</option>
                                        <option value="table">表格 (Table)</option>
                                        <option value="flowchart">流程图 (Flowchart)</option>
                                        <option value="heading">标题 (Heading)</option>
                                    </select>
                                </div>
                            </div>

                            <hr className="border-slate-100" />

                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">业务元数据</label>

                                {block.type === 'process_link' && (
                                    <div className="p-3 bg-purple-50 rounded border border-purple-100 space-y-2">
                                        <div className="flex items-center gap-2 text-purple-700 font-medium text-sm">
                                            <GitGraph size={16} /> 流程配置
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs text-purple-600">目标流程ID</label>
                                            <input
                                                type="text"
                                                value={block.meta.targetProcessId || ''}
                                                onChange={(e) => updateMeta('targetProcessId', e.target.value)}
                                                className="w-full px-2 py-1 text-xs border border-purple-200 rounded bg-white"
                                                disabled={readOnly}
                                            />
                                        </div>
                                    </div>
                                )}

                                {block.type === 'risk' && (
                                    <div className="p-3 bg-amber-50 rounded border border-amber-100 space-y-2">
                                        <div className="flex items-center gap-2 text-amber-700 font-medium text-sm">
                                            <AlertTriangle size={16} /> 风险管控
                                        </div>
                                        <div className="text-xs text-amber-600">此条款已被标记为高风险点，需要关联相应的控制措施。</div>
                                    </div>
                                )}

                                {block.type === 'image' && (
                                    <div className="p-3 bg-blue-50 rounded border border-blue-100 space-y-2">
                                        <div className="flex items-center gap-2 text-blue-700 font-medium text-sm">
                                            <ImageIcon size={16} /> 图片属性
                                        </div>
                                        <div className="space-y-2">
                                            <div className="space-y-1">
                                                <label className="text-xs text-blue-600">图片说明</label>
                                                <input
                                                    type="text"
                                                    value={block.meta.caption || ''}
                                                    onChange={(e) => updateMeta('caption', e.target.value)}
                                                    className="w-full px-2 py-1 text-xs border border-blue-200 rounded bg-white"
                                                    disabled={readOnly}
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs text-blue-600">源地址 (URL)</label>
                                                <input
                                                    type="text"
                                                    value={block.meta.src || ''}
                                                    onChange={(e) => updateMeta('src', e.target.value)}
                                                    className="w-full px-2 py-1 text-xs border border-blue-200 rounded bg-white truncate"
                                                    disabled={readOnly}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {block.type === 'table' && (
                                    <div className="p-3 bg-green-50 rounded border border-green-100 space-y-2">
                                        <div className="flex items-center gap-2 text-green-700 font-medium text-sm">
                                            <TableIcon size={16} /> 表格属性
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-1">
                                                <label className="text-xs text-green-600">行数</label>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            const newData = [...block.meta.data, new Array(block.meta.cols).fill('')];
                                                            onChange({ ...block, meta: { ...block.meta, rows: block.meta.rows + 1, data: newData } });
                                                        }}
                                                        className="p-1 bg-white border border-green-200 rounded hover:bg-green-100"
                                                        disabled={readOnly}
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                    <span className="text-sm font-mono">{block.meta.rows}</span>
                                                    <button
                                                        onClick={() => {
                                                            if (block.meta.rows <= 1) return;
                                                            const newData = block.meta.data.slice(0, -1);
                                                            onChange({ ...block, meta: { ...block.meta, rows: block.meta.rows - 1, data: newData } });
                                                        }}
                                                        className="p-1 bg-white border border-green-200 rounded hover:bg-green-100"
                                                        disabled={readOnly}
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs text-green-600">列数</label>
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => {
                                                            const newData = block.meta.data.map(row => [...row, '']);
                                                            onChange({ ...block, meta: { ...block.meta, cols: block.meta.cols + 1, data: newData } });
                                                        }}
                                                        className="p-1 bg-white border border-green-200 rounded hover:bg-green-100"
                                                        disabled={readOnly}
                                                    >
                                                        <Plus size={12} />
                                                    </button>
                                                    <span className="text-sm font-mono">{block.meta.cols}</span>
                                                    <button
                                                        onClick={() => {
                                                            if (block.meta.cols <= 1) return;
                                                            const newData = block.meta.data.map(row => row.slice(0, -1));
                                                            onChange({ ...block, meta: { ...block.meta, cols: block.meta.cols - 1, data: newData } });
                                                        }}
                                                        className="p-1 bg-white border border-green-200 rounded hover:bg-green-100"
                                                        disabled={readOnly}
                                                    >
                                                        <Minus size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {block.type === 'flowchart' && (
                                    <div className="p-3 bg-orange-50 rounded border border-orange-100 space-y-2 flex-1 flex flex-col">
                                        <div className="flex items-center gap-2 text-orange-700 font-medium text-sm">
                                            <Workflow size={16} /> 流程图代码 (Mermaid)
                                        </div>
                                        <div className="flex-1 flex flex-col">
                                            <textarea
                                                value={block.meta.code || ''}
                                                onChange={(e) => updateMeta('code', e.target.value)}
                                                className="w-full flex-1 p-2 text-xs font-mono border border-orange-200 rounded bg-white resize-none focus:ring-2 focus:ring-orange-300 outline-none"
                                                placeholder="输入 Mermaid 代码..."
                                                disabled={readOnly}
                                                style={{ minHeight: '200px' }}
                                            />
                                            <div className="text-[10px] text-orange-600 mt-1">
                                                支持 standard Mermaid 语法 (graph TD, sequenceDiagram 等)
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {block.type !== 'process_link' && block.type !== 'image' && block.type !== 'table' && block.type !== 'flowchart' && (
                                    <>
                                        <div className="space-y-1">
                                            <span className="text-xs text-slate-500">责任岗位</span>
                                            <div className="flex items-center gap-2 p-2 border border-slate-200 rounded text-sm hover:border-blue-300 cursor-pointer bg-white">
                                                <User size={14} className="text-slate-400" />
                                                <input
                                                    type="text"
                                                    value={block.meta.owner || ''}
                                                    onChange={(e) => updateMeta('owner', e.target.value)}
                                                    placeholder="未分配"
                                                    className="flex-1 outline-none text-slate-700"
                                                    disabled={readOnly}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <span className="text-xs text-slate-500">状态</span>
                                            <div className="flex gap-2">
                                                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">生效中</span>
                                                {block.subtype === 'mandatory' && <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">强制性</span>}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>

                            <hr className="border-slate-100" />

                            {/* 关联分析 */}
                            <div className="space-y-3">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex justify-between">
                                    引用分析 (Impact)
                                    <span className="bg-blue-100 text-blue-700 px-1.5 rounded-full text-xs">
                                        {block.meta.backlinks || 0}
                                    </span>
                                </label>

                                {block.meta.backlinks ? (
                                    <div className="space-y-2">
                                        <div className="text-xs text-slate-500 mb-2">以下流程直接引用了该条款：</div>
                                        <div className="flex items-center gap-2 p-2 bg-slate-50 rounded border border-slate-200 hover:border-blue-300 cursor-pointer transition-colors group">
                                            <Activity size={14} className="text-blue-500" />
                                            <div className="flex-1">
                                                <div className="text-xs font-medium text-slate-700 group-hover:text-blue-600">财务报销流程.bpmn</div>
                                                <div className="text-[10px] text-slate-400">节点: 部门经理审批</div>
                                            </div>
                                            <ChevronRight size={14} className="text-slate-300" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-sm text-slate-400 italic text-center py-4">
                                        暂无关联引用
                                    </div>
                                )}
                            </div>

                        </div>
                    ) : (
                        // No Block Selected State (Only for Properties Tab)
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                            <Settings size={40} className="mb-4 opacity-20" />
                            <p className="text-sm">在左侧选择一个段落以查看属性</p>
                        </div>
                    )
                ) : (
                    // AI Assistant Content (Integrated)
                    <AISidebar
                        currentUser={currentUser}
                        currentDoc={{ id: docId }}
                        onClose={() => onTabChange('properties')}
                        embedded={true}
                    />
                )}
            </div>
        </div>
    );
}
