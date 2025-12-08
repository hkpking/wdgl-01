import React, { useMemo } from 'react';
import { X, Plus, Minus, Equal, ArrowLeft, ArrowRight, GitCompare } from 'lucide-react';
import { computeLineDiff, htmlToLines, getDiffStats, DiffType } from '../utils/diffUtils';

/**
 * 版本对比视图组件
 * @param {object} props
 * @param {object} props.oldVersion - 旧版本 { id, name, content, savedAt }
 * @param {object} props.newVersion - 新版本 { id, name, content, savedAt }
 * @param {function} props.onClose - 关闭回调
 * @param {string} props.mode - 'inline' | 'side-by-side'
 */
export default function VersionDiff({ oldVersion, newVersion, onClose, mode = 'inline' }) {
    const diffs = useMemo(() => {
        if (!oldVersion || !newVersion) return [];

        const oldLines = htmlToLines(oldVersion.content || '');
        const newLines = htmlToLines(newVersion.content || '');

        return computeLineDiff(oldLines, newLines);
    }, [oldVersion, newVersion]);

    const stats = useMemo(() => getDiffStats(diffs), [diffs]);

    const formatDate = (isoString) => {
        if (!isoString) return '未知时间';
        const date = new Date(isoString);
        return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    const getVersionLabel = (version, isNew = false) => {
        if (!version) return '未选择';
        return version.name || formatDate(version.savedAt);
    };

    if (!oldVersion || !newVersion) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50 text-gray-500">
                <GitCompare className="mr-2" size={20} />
                请选择两个版本进行对比
            </div>
        );
    }

    return (
        <div className="flex-1 flex flex-col bg-white overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-4">
                    <GitCompare size={18} className="text-gray-500" />
                    <div className="flex items-center gap-2 text-sm">
                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded">
                            <ArrowLeft size={12} className="inline mr-1" />
                            {getVersionLabel(oldVersion)}
                        </span>
                        <span className="text-gray-400">vs</span>
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded">
                            {getVersionLabel(newVersion, true)}
                            <ArrowRight size={12} className="inline ml-1" />
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Stats */}
                    <div className="flex items-center gap-3 text-sm">
                        <span className="flex items-center gap-1 text-green-600">
                            <Plus size={14} /> {stats.additions}
                        </span>
                        <span className="flex items-center gap-1 text-red-600">
                            <Minus size={14} /> {stats.deletions}
                        </span>
                        <span className="flex items-center gap-1 text-gray-500">
                            <Equal size={14} /> {stats.unchanged}
                        </span>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-1.5 hover:bg-gray-200 rounded text-gray-500"
                    >
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* Diff Content */}
            <div className="flex-1 overflow-auto p-4">
                {diffs.length === 0 ? (
                    <div className="text-center text-gray-400 py-10">
                        两个版本内容完全相同
                    </div>
                ) : (
                    <div className="font-mono text-sm space-y-0.5">
                        {diffs.map((diff, index) => (
                            <DiffLine key={index} diff={diff} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

/**
 * 单行差异显示
 */
function DiffLine({ diff }) {
    const baseClasses = "px-3 py-1 rounded flex items-start gap-3";

    switch (diff.type) {
        case DiffType.INSERT:
            return (
                <div className={`${baseClasses} bg-green-50 border-l-4 border-green-400`}>
                    <span className="text-green-600 w-8 text-right flex-shrink-0">
                        +{diff.newLineNum}
                    </span>
                    <Plus size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-green-800 break-words">{diff.content || '(空行)'}</span>
                </div>
            );

        case DiffType.DELETE:
            return (
                <div className={`${baseClasses} bg-red-50 border-l-4 border-red-400`}>
                    <span className="text-red-600 w-8 text-right flex-shrink-0">
                        -{diff.oldLineNum}
                    </span>
                    <Minus size={14} className="text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-red-800 line-through break-words">{diff.content || '(空行)'}</span>
                </div>
            );

        case DiffType.EQUAL:
        default:
            return (
                <div className={`${baseClasses} bg-gray-50 text-gray-600`}>
                    <span className="text-gray-400 w-8 text-right flex-shrink-0">
                        {diff.oldLineNum}
                    </span>
                    <span className="w-3.5 flex-shrink-0" /> {/* Spacer */}
                    <span className="break-words">{diff.content || '(空行)'}</span>
                </div>
            );
    }
}
