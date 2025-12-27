
import * as mammoth from 'mammoth';
import { Buffer } from 'buffer';

const testMammoth = async () => {
    try {
        // Create a minimal valid docx buffer (this is hard without a library, so we will try to use a simple text-based mock if mammoth supports it, or just rely on the fact that we can't easily mock a binary docx here)
        // Actually, let's just see if we can import mammoth at all and run a basic conversion on a text buffer to see the error, or use a known base64 valid docx.

        // Minimal valid empty docx base64 (approximate)
        // If this is too complex, I'll just rely on inspecting the code.
        // But the user says "import after show no content".

        console.log('Mammoth imported successfully');

        const buffer = Buffer.from('PK\x03\x04', 'binary'); // Just a zip signature, will fail, but tests import.

        try {
            await mammoth.convertToHtml({ buffer });
        } catch (e) {
            console.log('Conversion attempted (and failed as expected on bad buffer):', e.message);
        }

    } catch (e) {
        console.error('Mammoth check failed:', e);
    }
};

testMammoth();
