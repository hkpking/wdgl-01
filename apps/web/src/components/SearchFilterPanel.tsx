'use client';

import React from 'react';
import { X, Calendar, FileText, Building2, CheckCircle } from 'lucide-react';

interface SearchFilterPanelProps {
    isOpen: boolean;
    onClose: () => void;
    filters: {
        documentType: string;
        dateRange: string;
        department: string;
        status: string;
    };
    onFiltersChange: (filters: any) => void;
}

// 文档类型选项
const DOCUMENT_TYPES = [
    { value: '', label: '所有类型' },
    { value: 'policy', label: '📋 制度' },
    { value: 'workflow', label: '🔄 流程' },
    { value: 'manual', label: '📖 手册' },
    { value: 'template', label: '📝 模板' },
    { value: 'report', label: '📊 报告' },
    { value: 'notice', label: '📢 通知' },
];

// 时间范围选项
const DATE_RANGES = [
    { value: '', label: '所有时间' },
    { value: 'today', label: '今天' },
    { value: 'week', label: '本周' },
    { value: 'month', label: '本月' },
    { value: 'quarter', label: '本季度' },
    { value: 'year', label: '今年' },
];

// 部门选项
const DEPARTMENTS = [
    { value: '', label: '所有部门' },
    { value: '人事', label: '人事部' },
    { value: '财务', label: '财务部' },
    { value: '行政', label: '行政部' },
    { value: '技术', label: '技术部' },
    { value: '市场', label: '市场部' },
    { value: '销售', label: '销售部' },
    { value: '研发', label: '研发部' },
    { value: '法务', label: '法务部' },
];

// 状态选项
const STATUSES = [
    { value: '', label: '所有状态' },
    { value: 'draft', label: '草稿' },
    { value: 'review', label: '待审核' },
    { value: 'published', label: '已发布' },
];

export function SearchFilterPanel({ isOpen, onClose, filters, onFiltersChange }: SearchFilterPanelProps) {
    if (!isOpen) return null;

    const hasActiveFilters = filters.documentType || filters.dateRange || filters.department || filters.status;

    const handleClearAll = () => {
        onFiltersChange({
            documentType: '',
            dateRange: '',
            department: '',
            status: '',
        });
    };

    const updateFilter = (key: string, value: string) => {
        onFiltersChange({
            ...filters,
            [key]: value,
        });
    };

    return (
        <div className="mb-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm animate-in slide-in-from-top-2 duration-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FileText size={16} />
                    高级筛选
                </h3>
                <div className="flex items-center gap-2">
                    {hasActiveFilters && (
                        <button
                            onClick={handleClearAll}
                            className="text-xs text-gray-500 hover:text-gray-700 underline"
                        >
                            清除全部
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded text-gray-400 hover:text-gray-600"
                    >
                        <X size={16} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* 文档类型 */}
                <div>
                    <label className="block text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <FileText size={12} />
                        文档类型
                    </label>
                    <select
                        value={filters.documentType}
                        onChange={(e) => updateFilter('documentType', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        {DOCUMENT_TYPES.map((type) => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 时间范围 */}
                <div>
                    <label className="block text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <Calendar size={12} />
                        时间范围
                    </label>
                    <select
                        value={filters.dateRange}
                        onChange={(e) => updateFilter('dateRange', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        {DATE_RANGES.map((range) => (
                            <option key={range.value} value={range.value}>
                                {range.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 部门 */}
                <div>
                    <label className="block text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <Building2 size={12} />
                        所属部门
                    </label>
                    <select
                        value={filters.department}
                        onChange={(e) => updateFilter('department', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        {DEPARTMENTS.map((dept) => (
                            <option key={dept.value} value={dept.value}>
                                {dept.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 状态 */}
                <div>
                    <label className="block text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <CheckCircle size={12} />
                        文档状态
                    </label>
                    <select
                        value={filters.status}
                        onChange={(e) => updateFilter('status', e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                        {STATUSES.map((status) => (
                            <option key={status.value} value={status.value}>
                                {status.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* 已激活的筛选标签 */}
            {hasActiveFilters && (
                <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                    {filters.documentType && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                            类型: {DOCUMENT_TYPES.find(t => t.value === filters.documentType)?.label}
                            <button onClick={() => updateFilter('documentType', '')} className="hover:bg-purple-200 rounded-full p-0.5">
                                <X size={10} />
                            </button>
                        </span>
                    )}
                    {filters.dateRange && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                            时间: {DATE_RANGES.find(r => r.value === filters.dateRange)?.label}
                            <button onClick={() => updateFilter('dateRange', '')} className="hover:bg-blue-200 rounded-full p-0.5">
                                <X size={10} />
                            </button>
                        </span>
                    )}
                    {filters.department && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                            部门: {filters.department}
                            <button onClick={() => updateFilter('department', '')} className="hover:bg-green-200 rounded-full p-0.5">
                                <X size={10} />
                            </button>
                        </span>
                    )}
                    {filters.status && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs">
                            状态: {STATUSES.find(s => s.value === filters.status)?.label}
                            <button onClick={() => updateFilter('status', '')} className="hover:bg-orange-200 rounded-full p-0.5">
                                <X size={10} />
                            </button>
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchFilterPanel;
