import { describe, it, expect, vi } from 'vitest';
import { importWordDoc } from '../ImportHandler';
import * as mammoth from 'mammoth';

// Mock mammoth
vi.mock('mammoth', () => ({
    convertToHtml: vi.fn(),
}));

describe('importWordDoc', () => {
    it('should convert docx to html', async () => {
        // Mock file object
        const mockFile = new File(['dummy content'], 'test.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

        // Mock success response from mammoth
        const mockResult = { value: '<h1>Test Content</h1>', messages: [] };
        mammoth.convertToHtml.mockResolvedValue(mockResult);

        const result = await importWordDoc(mockFile);
        expect(result).toBe('<h1>Test Content</h1>');
    });

    it('should handle empty content', async () => {
        const mockFile = new File([], 'empty.docx');
        mammoth.convertToHtml.mockResolvedValue({ value: '', messages: [] });
        const result = await importWordDoc(mockFile);
        expect(result).toBe('');
    });

    it('should handle conversion errors', async () => {
        const mockFile = new File(['bad'], 'bad.docx');
        mammoth.convertToHtml.mockRejectedValue(new Error('Conversion failed'));
        await expect(importWordDoc(mockFile)).rejects.toThrow('Conversion failed');
    });
});
