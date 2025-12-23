/**
 * Storage Context Types
 * Type definitions for the unified storage layer
 */

// ============================================
// User Types
// ============================================

export interface User {
    uid: string;
    email?: string;  // Can be undefined in some auth scenarios
    displayName: string;
}

// ============================================
// Document Types
// ============================================

export type DocumentStatus = 'draft' | 'review' | 'published' | 'archived';

export interface Document {
    id: string;
    title: string;
    content: string;
    status: DocumentStatus;
    folderId?: string | null;
    parentId?: string | null;  // Alias for folderId (backward compatibility)
    knowledgeBaseId?: string | null;
    teamId?: string | null;
    createdAt: string;
    updatedAt: string;
    [key: string]: unknown;  // Allow dynamic property access for sorting
}

export interface DocumentVersion {
    id: string;
    documentId: string;
    title: string;
    content: string;
    name: string | null;
    savedAt: string;
}

// ============================================
// Folder Types
// ============================================

export interface Folder {
    id: string;
    name: string;
    parentId: string | null;
    createdAt: string;
}

// ============================================
// Comment Types
// ============================================

export interface CommentAuthor {
    uid: string;
    name: string;
}

export interface CommentReply {
    id: string;
    content: string;
    author: CommentAuthor;
    createdAt: string;
}

export interface Comment {
    id: string;
    docId: string;
    content: string;
    quote?: string | null;
    status: 'open' | 'resolved';
    author: CommentAuthor;
    createdAt: string;
    replies: CommentReply[];
}

// ============================================
// Storage Context Type
// ============================================

export interface StorageContextType {
    // Authentication State
    currentUser: User | null;
    loading: boolean;
    isAuthenticated: boolean;

    // Authentication Methods
    signIn: (email: string, password: string) => Promise<User>;
    signUp: (email: string, password: string, displayName: string) => Promise<User>;
    signOut: () => Promise<void>;
    getCurrentUser: () => User | null;

    // Document Methods
    getAllDocuments: (userId: string) => Promise<Document[]>;
    getDocument: (userId: string, docId: string) => Promise<Document | null>;
    saveDocument: (userId: string, docId: string | null, data: Partial<Document>) => Promise<Document | null>;
    deleteDocument: (userId: string, docId: string) => Promise<boolean>;
    moveDocument: (userId: string, docId: string, folderId: string | null) => Promise<{ id: string; folderId: string | null } | null>;
    searchDocuments: (userId: string, query: string) => Promise<Document[]>;

    // Version Methods
    getVersions: (userId: string, docId: string) => Promise<DocumentVersion[]>;
    saveVersion: (userId: string, docId: string, data: { title: string; content: string; status?: DocumentStatus }) => Promise<DocumentVersion | null>;
    updateVersion: (userId: string, docId: string, versionId: string, updates: { name: string }) => Promise<{ id: string; name: string } | null>;

    // Folder Methods
    getFolders: (userId: string) => Promise<Folder[]>;
    createFolder: (userId: string, name: string, parentId?: string | null) => Promise<Folder | null>;
    updateFolder: (userId: string, folderId: string, updates: { name?: string; parentId?: string | null }) => Promise<Folder | null>;
    deleteFolder: (userId: string, folderId: string) => Promise<boolean>;

    // Comment Methods
    getComments: (userId: string, docId: string) => Promise<Comment[]>;
    addComment: (userId: string, docId: string, data: { content: string; quote?: string; author: CommentAuthor }) => Promise<Comment | null>;
    addReply: (userId: string, docId: string, commentId: string, data: { content: string; author: CommentAuthor }) => Promise<CommentReply | null>;
    updateCommentStatus: (userId: string, docId: string, commentId: string, status: 'open' | 'resolved') => Promise<{ id: string; status: string } | null>;
    deleteComment: (userId: string, docId: string, commentId: string) => Promise<boolean>;

    // Storage Info
    getStorageInfo: () => StorageInfo;

    // Legacy Compatibility
    isSupabaseMode: boolean;
    isCloudMode: boolean;
}

export interface StorageInfo {
    used: number;
    total: number;
    percentage: number;
}
