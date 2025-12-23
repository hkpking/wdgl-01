import React from 'react';

interface Folder {
    id: string;
    name: string;
    parentId?: string | null;
}

interface Document {
    id: string;
    title: string;
    folderId?: string | null;
    status?: string;
}

interface FolderTreeProps {
    folders: Folder[];
    documents?: Document[];
    selectedFolderId?: string | null;
    activeDocId?: string | null;
    onSelectFolder?: (folderId: string | null) => void;
    onSelectDocument?: (doc: Document) => void;
    onAction?: (e: React.MouseEvent, folder: Folder | null, action: string) => void;
    onMenuClick?: (e: React.MouseEvent, item: any, type: 'folder' | 'document' | 'spreadsheet' | 'create-folder') => void;
    onMoveItem?: (itemId: string, itemType: string, targetFolderId: string | null) => void;
    showHome?: boolean;
    onSelectHome?: () => void;
    enableDragDrop?: boolean;
    renamingItemId?: string | null;
    onRename?: (id: string, newName: string | null, type: 'folder' | 'document' | 'spreadsheet') => void;
}

declare const FolderTree: React.FC<FolderTreeProps>;
export default FolderTree;
