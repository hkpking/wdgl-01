import React from 'react';
import { NodeViewWrapper } from '@tiptap/react';

export default function ProcessCardNodeView({ node, updateAttributes, editor }) {
    const fields = node.attrs.fields || {};
    const readOnly = !editor.isEditable;

    const handleChange = (field, value) => {
        updateAttributes({
            fields: {
                ...fields,
                [field]: value
            }
        });
    };

    return (
        <NodeViewWrapper className="block-item group relative mb-0.5 transition-all duration-200">
            <div className="relative pl-3">
                <div className="outline-none px-1 py-0.5 rounded border border-transparent transition-colors min-h-[24px] overflow-hidden border-slate-300 rounded-sm">
                    <div className="bg-slate-50 border-b border-slate-200 p-2 text-center font-bold text-slate-700">
                        流程基础信息卡片
                    </div>
                    <div className="grid grid-cols-4 text-sm border border-slate-200">
                        {/* Row 1 */}
                        <div className="p-2 bg-slate-50 border-b border-r border-slate-200 font-medium text-slate-600">流程名称</div>
                        <div className="p-2 border-b border-r border-slate-200 col-span-3">
                            <input
                                type="text"
                                className="w-full outline-none bg-transparent"
                                value={fields.name || ''}
                                onChange={(e) => handleChange('name', e.target.value)}
                                readOnly={readOnly}
                            />
                        </div>

                        {/* Row 2 */}
                        <div className="p-2 bg-slate-50 border-b border-r border-slate-200 font-medium text-slate-600">流程层级</div>
                        <div className="p-2 border-b border-r border-slate-200">
                            <input
                                type="text"
                                className="w-full outline-none bg-transparent"
                                value={fields.level || ''}
                                onChange={(e) => handleChange('level', e.target.value)}
                                readOnly={readOnly}
                            />
                        </div>
                        <div className="p-2 bg-slate-50 border-b border-r border-slate-200 font-medium text-slate-600">流程架构编码</div>
                        <div className="p-2 border-b border-slate-200">
                            <input
                                type="text"
                                className="w-full outline-none bg-transparent"
                                value={fields.code || ''}
                                onChange={(e) => handleChange('code', e.target.value)}
                                readOnly={readOnly}
                            />
                        </div>

                        {/* Row 3 */}
                        <div className="p-2 bg-slate-50 border-b border-r border-slate-200 font-medium text-slate-600">流程定义</div>
                        <div className="p-2 border-b border-r border-slate-200">
                            <input
                                type="text"
                                className="w-full outline-none bg-transparent"
                                value={fields.definition || ''}
                                onChange={(e) => handleChange('definition', e.target.value)}
                                readOnly={readOnly}
                            />
                        </div>
                        <div className="p-2 bg-slate-50 border-b border-r border-slate-200 font-medium text-slate-600">流程目的</div>
                        <div className="p-2 border-b border-slate-200">
                            <input
                                type="text"
                                className="w-full outline-none bg-transparent"
                                value={fields.purpose || ''}
                                onChange={(e) => handleChange('purpose', e.target.value)}
                                readOnly={readOnly}
                            />
                        </div>

                        {/* Row 4 */}
                        <div className="p-2 bg-slate-50 border-b border-r border-slate-200 font-medium text-slate-600">流程责任人</div>
                        <div className="p-2 border-b border-r border-slate-200">
                            <input
                                type="text"
                                className="w-full outline-none bg-transparent"
                                value={fields.owner || ''}
                                onChange={(e) => handleChange('owner', e.target.value)}
                                readOnly={readOnly}
                            />
                        </div>
                        <div className="p-2 bg-slate-50 border-b border-r border-slate-200 font-medium text-slate-600">上一层流程名称</div>
                        <div className="p-2 border-b border-slate-200">
                            <input
                                type="text"
                                className="w-full outline-none bg-transparent"
                                value={fields.parent || ''}
                                onChange={(e) => handleChange('parent', e.target.value)}
                                readOnly={readOnly}
                            />
                        </div>

                        {/* Row 5 */}
                        <div className="p-2 bg-slate-50 border-b border-r border-slate-200 font-medium text-slate-600">包含下一层流程</div>
                        <div className="p-2 border-b border-slate-200 col-span-3">
                            <input
                                type="text"
                                className="w-full outline-none bg-transparent"
                                value={fields.children || ''}
                                onChange={(e) => handleChange('children', e.target.value)}
                                readOnly={readOnly}
                            />
                        </div>

                        {/* Row 6 */}
                        <div className="p-2 bg-slate-50 border-b border-r border-slate-200 font-medium text-slate-600">流程输入</div>
                        <div className="p-2 border-b border-slate-200 col-span-3">
                            <input
                                type="text"
                                className="w-full outline-none bg-transparent"
                                value={fields.input || ''}
                                onChange={(e) => handleChange('input', e.target.value)}
                                readOnly={readOnly}
                            />
                        </div>

                        {/* Row 7 */}
                        <div className="p-2 bg-slate-50 border-b border-r border-slate-200 font-medium text-slate-600">流程输出</div>
                        <div className="p-2 border-b border-slate-200 col-span-3">
                            <input
                                type="text"
                                className="w-full outline-none bg-transparent"
                                value={fields.output || ''}
                                onChange={(e) => handleChange('output', e.target.value)}
                                readOnly={readOnly}
                            />
                        </div>

                        {/* Row 8 */}
                        <div className="p-2 bg-slate-50 border-b border-r border-slate-200 font-medium text-slate-600">流程起点</div>
                        <div className="p-2 border-b border-slate-200 col-span-3">
                            <input
                                type="text"
                                className="w-full outline-none bg-transparent"
                                value={fields.start || ''}
                                onChange={(e) => handleChange('start', e.target.value)}
                                readOnly={readOnly}
                            />
                        </div>

                        {/* Row 9 */}
                        <div className="p-2 bg-slate-50 border-b border-r border-slate-200 font-medium text-slate-600">流程终点</div>
                        <div className="p-2 border-b border-slate-200 col-span-3">
                            <input
                                type="text"
                                className="w-full outline-none bg-transparent"
                                value={fields.end || ''}
                                onChange={(e) => handleChange('end', e.target.value)}
                                readOnly={readOnly}
                            />
                        </div>

                        {/* Row 10 */}
                        <div className="p-2 bg-slate-50 border-r border-slate-200 font-medium text-slate-600">流程KPI</div>
                        <div className="p-2 border-slate-200 col-span-3">
                            <input
                                type="text"
                                className="w-full outline-none bg-transparent"
                                value={fields.kpi || ''}
                                onChange={(e) => handleChange('kpi', e.target.value)}
                                readOnly={readOnly}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </NodeViewWrapper>
    );
}
