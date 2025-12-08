import React from 'react';
import { COLORS } from './colors';

/**
 * 通用颜色选择器组件
 * @param {Object} props
 * @param {function} props.onSelect - 选择颜色时的回调
 * @param {function} props.onClear - 清除颜色时的回调（可选）
 * @param {string} props.currentColor - 当前选中的颜色
 * @param {boolean} props.showCustomPicker - 是否显示自定义颜色输入
 * @param {string} props.clearLabel - 清除按钮的文案
 */
export function ColorPicker({
    onSelect,
    onClear,
    currentColor = '#000000',
    showCustomPicker = true,
    clearLabel = '默认颜色'
}) {
    const colorInputRef = React.useRef(null);

    return (
        <div className="bg-white border border-gray-200 rounded shadow-lg p-2 z-20 w-64">
            {/* 清除按钮 */}
            {onClear && (
                <div className="mb-2 pb-2 border-b border-gray-100">
                    <button
                        onClick={onClear}
                        className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded flex items-center gap-2"
                    >
                        <div className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center text-xs">A</div>
                        <span>{clearLabel}</span>
                    </button>
                </div>
            )}

            {/* 颜色网格 */}
            <div className="grid grid-cols-10 gap-1 mb-2">
                {COLORS.map((color) => (
                    <button
                        key={color}
                        onClick={() => onSelect(color)}
                        className="w-5 h-5 rounded-sm border border-gray-200 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                        title={color}
                    />
                ))}
            </div>

            {/* 自定义颜色 */}
            {showCustomPicker && (
                <div className="pt-2 border-t border-gray-100">
                    <button
                        onClick={() => colorInputRef.current?.click()}
                        className="w-full text-left px-2 py-1 text-sm hover:bg-gray-100 rounded flex items-center gap-2"
                    >
                        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-red-500 via-green-500 to-blue-500"></div>
                        <span>自定义颜色...</span>
                    </button>
                    <input
                        ref={colorInputRef}
                        type="color"
                        className="hidden"
                        onInput={(e) => onSelect(e.target.value)}
                        value={currentColor}
                    />
                </div>
            )}
        </div>
    );
}
