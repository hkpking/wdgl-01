import React from 'react';

interface CreateFolderModalProps {
    isOpen: boolean;
    folderName: string;
    onFolderNameChange: (name: string) => void;
    onCancel: () => void;
    onCreate: () => void;
}

export const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
    isOpen,
    folderName,
    onFolderNameChange,
    onCancel,
    onCreate
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                <h3 className="text-lg font-bold mb-4">新建文件夹</h3>
                <input
                    type="text"
                    className="w-full border border-gray-300 rounded p-2 mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="文件夹名称"
                    value={folderName}
                    onChange={e => onFolderNameChange(e.target.value)}
                    autoFocus
                />
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                    >
                        取消
                    </button>
                    <button
                        onClick={onCreate}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        创建
                    </button>
                </div>
            </div>
        </div>
    );
};
