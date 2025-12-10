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
 * Convert HTML to Markdown (Simple implementation)
 */
export function htmlToMarkdown(html) {
    if (!html) return '';

    let markdown = html;

    // Replace headings
    markdown = markdown.replace(/<h1>(.*?)<\/h1>/g, '# $1\n\n');
    markdown = markdown.replace(/<h2>(.*?)<\/h2>/g, '## $1\n\n');
    markdown = markdown.replace(/<h3>(.*?)<\/h3>/g, '### $1\n\n');
    markdown = markdown.replace(/<h4>(.*?)<\/h4>/g, '#### $1\n\n');
    markdown = markdown.replace(/<h5>(.*?)<\/h5>/g, '##### $1\n\n');
    markdown = markdown.replace(/<h6>(.*?)<\/h6>/g, '###### $1\n\n');

    // Replace paragraphs
    markdown = markdown.replace(/<p>(.*?)<\/p>/g, '$1\n\n');

    // Replace bold/strong
    markdown = markdown.replace(/<strong>(.*?)<\/strong>/g, '**$1**');
    markdown = markdown.replace(/<b>(.*?)<\/b>/g, '**$1**');

    // Replace italic/em
    markdown = markdown.replace(/<em>(.*?)<\/em>/g, '*$1*');
    markdown = markdown.replace(/<i>(.*?)<\/i>/g, '*$1*');

    // Replace unordered lists
    markdown = markdown.replace(/<ul>([\s\S]*?)<\/ul>/g, (match, content) => {
        return content.replace(/<li>(.*?)<\/li>/g, '- $1\n') + '\n';
    });

    // Replace ordered lists
    markdown = markdown.replace(/<ol>([\s\S]*?)<\/ol>/g, (match, content) => {
        let index = 1;
        return content.replace(/<li>(.*?)<\/li>/g, () => `${index++}. $1\n`) + '\n';
    });

    // Replace links
    markdown = markdown.replace(/<a href="(.*?)">(.*?)<\/a>/g, '[$2]($1)');

    // Replace images
    markdown = markdown.replace(/<img src="(.*?)".*?>/g, '![]($1)');

    // Replace code blocks
    markdown = markdown.replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, '```\n$1\n```\n\n');

    // Replace blockquotes
    markdown = markdown.replace(/<blockquote>([\s\S]*?)<\/blockquote>/g, '> $1\n\n');

    // Replace horizontal rules
    markdown = markdown.replace(/<hr>/g, '---\n\n');

    // Decode HTML entities
    const textarea = document.createElement('textarea');
    textarea.innerHTML = markdown;
    markdown = textarea.value;

    return markdown.trim();
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
