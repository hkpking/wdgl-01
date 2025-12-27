import { describe, it, expect, vi, beforeEach } from 'vitest';
import { aiService } from '../AIService';

// Mock localStorage
const localStorageMock = (() => {
    let store = {};
    return {
        getItem: (key) => store[key] || null,
        setItem: (key, value) => { store[key] = value.toString(); },
        removeItem: (key) => { delete store[key]; },
        clear: () => { store = {}; }
    };
})();

Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

describe('AIService', () => {
    beforeEach(() => {
        localStorage.clear();
        aiService.enableMockMode(); // Reset to mock mode
    });

    it('should default to mock mode if no key is present', () => {
        expect(aiService.isMock).toBe(true);
    });

    it('should generate mock text in mock mode', async () => {
        const prompt = "Hello AI";
        const response = await aiService.generateText(prompt);
        expect(response).toContain("[MOCK RESPONSE]");
        expect(response).toContain(prompt);
    });

    it('should stream mock text in mock mode', async () => {
        const prompt = "Stream me";
        const onChunk = vi.fn();
        await aiService.streamText(prompt, onChunk);
        expect(onChunk).toHaveBeenCalled();
    });

    it('should switch to real mode when initialized with key', () => {
        aiService.initClient('fake-key');
        expect(aiService.isMock).toBe(false);
        expect(aiService.apiKey).toBe('fake-key');
    });
});
