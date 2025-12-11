// Type declarations for JSX components used in TypeScript files

declare module '@/components/RichTextEditor' {
    import { FC } from 'react';
    interface RichTextEditorProps {
        content: string;
        onChange: (content: string) => void;
        placeholder?: string;
        editable?: boolean;
        onEditorReady?: (editor: any) => void;
        onMagicCommand?: () => void;
        collaboration?: {
            ydoc: any;
            provider: any;
            user: any;
        };
    }
    const RichTextEditor: FC<RichTextEditorProps>;
    export default RichTextEditor;
}

declare module '@/components/DocHeader' {
    import { FC, ReactNode } from 'react';
    interface DocHeaderProps {
        title: string;
        setTitle: (title: string) => void;
        status: string;
        saving: boolean;
        lastSaved: Date | null;
        onBack: () => void;
        onShare: () => void;
        onOpenVersionHistory: () => void;
        onImport?: (file: File) => Promise<void>;
        onInsertBlock?: (type: string) => void;
        content?: string;
        editor?: any;
        children?: ReactNode;
    }
    const DocHeader: FC<DocHeaderProps>;
    export default DocHeader;
}

declare module '@/components/DocToolbar' {
    import { FC } from 'react';
    const DocToolbar: FC<any>;
    export default DocToolbar;
}

declare module '@/components/VersionHistorySidebar' {
    import { FC } from 'react';
    const VersionHistorySidebar: FC<any>;
    export default VersionHistorySidebar;
}

declare module '@/components/Comments/CommentSidebar' {
    import { FC } from 'react';
    const CommentSidebar: FC<any>;
    export default CommentSidebar;
}

declare module '@/components/AI/AISidebar' {
    import { FC } from 'react';
    const AISidebar: FC<any>;
    export default AISidebar;
}

declare module '@/components/AI/MagicCommand' {
    import { FC } from 'react';
    const MagicCommand: FC<any>;
    export default MagicCommand;
}

declare module '@/components/shared/CollaborationStatus' {
    import { FC } from 'react';
    const CollaborationStatus: FC<any>;
    export default CollaborationStatus;
}

declare module '@/components/EditModeSelector' {
    import { FC } from 'react';
    interface EditModeSelectorProps {
        mode?: string;
        onChange: (mode: string) => void;
        currentUser: any;
        onAcceptAll: () => void;
        onRejectAll: () => void;
        hasSuggestions?: boolean;
    }
    const EditModeSelector: FC<EditModeSelectorProps>;
    export default EditModeSelector;
}
