import { describe, it, expect, vi, beforeEach } from 'vitest';
import { aiService } from '../AIService';

describe('AIService Autocomplete', () => {
    beforeEach(() => {
        aiService.isMock = true;
    });

    it('should return mock completion in mock mode', async () => {
        const completion = await aiService.generateCompletion('The quick brown fox');
        expect(completion).toBe(' [Mock Autocomplete]');
    });

    it('should return empty string on error', async () => {
        aiService.isMock = false;
        // Mock genAI to throw
        aiService.genAI = {
            getGenerativeModel: () => ({
                generateContent: () => Promise.reject(new Error('API Error'))
            })
        };

        const completion = await aiService.generateCompletion('Test');
        expect(completion).toBe('');
    });
});
