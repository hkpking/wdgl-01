import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Helper to get the path from root to current folder
 * Returns array of { id, name }
 */
export const getFolderPath = (currentId, folders) => {
    const path = [];
    let current = folders.find(f => f.id === currentId);

    while (current) {
        path.unshift(current);
        current = folders.find(f => f.id === current.parentId);
    }

    return path;
};

export default function Breadcrumbs({ folders, currentFolderId, onNavigate }) {
    const path = getFolderPath(currentFolderId, folders);

    return (
        <nav className="flex items-center text-sm text-gray-500 mb-4 overflow-x-auto whitespace-nowrap pb-2">
            <button
                onClick={() => onNavigate(null)}
                className={`flex items-center hover:text-blue-600 transition ${!currentFolderId ? 'text-blue-600 font-medium' : ''}`}
            >
                <Home size={16} className="mr-1" />
                全部文档
            </button>

            {path.map((folder, index) => (
                <div key={folder.id} className="flex items-center">
                    <ChevronRight size={14} className="mx-2 text-gray-400" />
                    <button
                        onClick={() => onNavigate(folder.id)}
                        className={`hover:text-blue-600 transition ${index === path.length - 1 ? 'text-gray-900 font-medium cursor-default' : ''}`}
                        disabled={index === path.length - 1}
                    >
                        {folder.name}
                    </button>
                </div>
            ))}
        </nav>
    );
}
