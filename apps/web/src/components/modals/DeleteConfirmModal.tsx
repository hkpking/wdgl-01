import React from 'react';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    title?: string;
    message?: string;
    onCancel: () => void;
    onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
    isOpen,
    title = '确认删除',
    message = '您确定要删除这个文档吗?此操作无法撤销。',
    onCancel,
    onConfirm
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
                <h3 className="text-lg font-bold text-gray-900">{title}</h3>
                <p className="my-4 text-gray-600">{message}</p>
                <div className="flex justify-end gap-4 mt-6">
                    <button
                        onClick={onCancel}
                        className="bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition"
                    >
                        取消
                    </button>
                    <button
                        onClick={onConfirm}
                        className="bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition"
                    >
                        确认删除
                    </button>
                </div>
            </div>
        </div>
    );
};
