import { useState, useEffect, useCallback, useRef } from 'react';
import { useStorage } from '../contexts/StorageContext';
import { blocksToHtml } from '../utils/blockConverter';

export const useAutoSave = (id, currentUser, documentState, isPaused = false) => {
    const storage = useStorage();
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [lastSavedState, setLastSavedState] = useState(null);

    // Initialize lastSavedState when document loads
    useEffect(() => {
        if (documentState && !lastSavedState) {
            setLastSavedState({
                title: documentState.title,
                content: documentState.content
            });
            setLastSaved(documentState.lastSaved);
        }
    }, [documentState, lastSavedState]);

    const handleSave = useCallback(async () => {
        if (!documentState || !documentState.title.trim() || !currentUser) return;

        setSaving(true);
        try {
            const htmlContent = blocksToHtml(documentState.blocks);
            const docData = {
                title: documentState.title,
                content: htmlContent,
                blocks: documentState.blocks,
                status: documentState.status,
                contentType: 'blocks'
            };

            console.log('[SAVE] Saving document:', docData);
            storage.saveDocument(currentUser.uid, id, docData);

            // Save version history
            storage.saveVersion(currentUser.uid, id, {
                title: documentState.title,
                content: htmlContent,
                blocks: documentState.blocks,
                status: documentState.status
            });

            const now = new Date();
            setLastSaved(now);
            setLastSavedState({
                title: documentState.title,
                content: htmlContent // Use the generated HTML as the "saved" content state
            });

        } catch (error) {
            console.error('[SAVE] Error saving:', error);
            alert(error.message);
        } finally {
            setSaving(false);
        }
    }, [id, currentUser?.uid, documentState, storage]);

    // Check if content has changed
    const isDirty = documentState && lastSavedState ? (
        documentState.title !== lastSavedState.title ||
        blocksToHtml(documentState.blocks) !== lastSavedState.content
    ) : false;

    // Auto-save effect
    useEffect(() => {
        if (!id || isPaused || !isDirty) return;

        const timer = setTimeout(() => {
            handleSave();
        }, 3000);
        return () => clearTimeout(timer);
    }, [id, isPaused, isDirty, handleSave]);

    // Browser close warning
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    return { saving, lastSaved, handleSave, isDirty };
};
