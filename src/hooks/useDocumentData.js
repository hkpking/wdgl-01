import { useState, useEffect, useCallback } from 'react';
import { useStorage } from '../contexts/StorageContext';
import { DOC_STATUS } from '../utils/constants';
import { htmlToBlocks, blocksToHtml } from '../utils/blockConverter';
import { isPlainText, plainTextToHtml } from '../utils/editor';

export const useDocumentData = (id, currentUser) => {
    const storage = useStorage();
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadDocument = useCallback(() => {
        if (!id || !currentUser) return;

        setLoading(true);
        setError(null);

        try {
            console.log('[LOAD] Loading document:', id);
            const doc = storage.getDocument(currentUser.uid, id);

            if (doc) {
                console.log('[LOAD] Document found:', doc);

                // Process content
                let loadedContent = doc.content || '';
                let loadedBlocks = [];

                if (doc.contentType === 'blocks' && Array.isArray(doc.blocks)) {
                    loadedBlocks = doc.blocks;
                    loadedContent = blocksToHtml(loadedBlocks);
                } else {
                    // Legacy HTML or Plain Text
                    if (isPlainText(loadedContent)) {
                        loadedContent = plainTextToHtml(loadedContent);
                    }
                    loadedBlocks = htmlToBlocks(loadedContent);
                }

                setDocument({
                    ...doc,
                    content: loadedContent,
                    blocks: loadedBlocks,
                    lastSaved: doc.updatedAt ? new Date(doc.updatedAt) : (doc.createdAt ? new Date(doc.createdAt) : null)
                });
            } else {
                setError(new Error('Document not found'));
            }
        } catch (err) {
            console.error('[LOAD] Error loading document:', err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [id, currentUser?.uid, storage]);

    useEffect(() => {
        loadDocument();
    }, [loadDocument]);

    return { document, loading, error, reload: loadDocument, setDocument };
};
