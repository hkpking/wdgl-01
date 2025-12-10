/**
 * Utility for handling AI streams.
 * Can be expanded to handle markdown parsing, partial JSON parsing, etc.
 */

export class StreamHandler {
    /**
     * Accumulates stream chunks and returns the full text.
     * Useful if you want to process the stream but also get the final result.
     */
    constructor() {
        this.fullText = "";
    }

    processChunk(chunk) {
        this.fullText += chunk;
        return chunk;
    }

    getResult() {
        return this.fullText;
    }

    reset() {
        this.fullText = "";
    }
}
