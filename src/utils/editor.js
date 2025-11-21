/**
 * Extract plain text from HTML content
 * Used for word count and search
 */
export function getTextContent(html) {
    if (!html) return '';

    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
}

/**
 * Check if content is plain text (old format) or HTML
 */
export function isPlainText(content) {
    if (!content) return true;

    // Simple heuristic: if it contains HTML tags, it's HTML
    return !/<[a-z][\s\S]*>/i.test(content);
}

/**
 * Convert plain text to HTML (for migration)
 */
export function plainTextToHtml(text) {
    if (!text) return '<p></p>';

    // Split by newlines and wrap each paragraph
    const paragraphs = text.split('\n').filter(line => line.trim());

    if (paragraphs.length === 0) return '<p></p>';

    return paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('');
}

/**
 * Escape HTML characters
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Upload image to Firebase Storage (placeholder)
 * TODO: Implement when Firebase Storage is configured
 */
import { storage } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function uploadImage(file, userId) {
    try {
        // Create a unique filename with timestamp
        const timestamp = Date.now();
        const filename = `${timestamp}_${file.name}`;
        const storageRef = ref(storage, `users/${userId}/images/${filename}`);

        // Upload the file
        const snapshot = await uploadBytes(storageRef, file);

        // Get the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);

        return downloadURL;
    } catch (error) {
        console.error('Image upload failed:', error);

        // Fallback to base64 if upload fails
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
}

