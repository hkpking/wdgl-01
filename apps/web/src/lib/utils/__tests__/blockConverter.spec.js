import { describe, it, expect } from 'vitest';
import { markdownToBlocks } from '../blockConverter';

describe('markdownToBlocks', () => {
    it('should convert simple text to clauses', () => {
        const text = "Line 1\nLine 2";
        const blocks = markdownToBlocks(text);
        expect(blocks).toHaveLength(2);
        expect(blocks[0].content).toBe('Line 1');
        expect(blocks[1].content).toBe('Line 2');
    });

    it('should handle headings', () => {
        const text = "# Heading 1\n## Heading 2";
        const blocks = markdownToBlocks(text);
        expect(blocks).toHaveLength(2);
        expect(blocks[0].type).toBe('heading');
        expect(blocks[0].level).toBe(1);
        expect(blocks[1].type).toBe('heading');
        expect(blocks[1].level).toBe(2);
    });

    it('should handle lists', () => {
        const text = "- Item 1\n* Item 2\n1. Item 3";
        const blocks = markdownToBlocks(text);
        expect(blocks).toHaveLength(3);
        expect(blocks[0].content).toBe('Item 1');
        expect(blocks[2].content).toBe('Item 3');
        expect(blocks[2].number).toBe('1.');
    });

    it('should handle mock response format', () => {
        const text = `[MOCK STREAM]
This is a simulated streaming response.
It mimics the behavior of an LLM generating text token by token.

Prompt received: "outline..."`;
        const blocks = markdownToBlocks(text);
        expect(blocks.length).toBeGreaterThan(1);
    });
});
