import mammoth from 'mammoth';
import fs from 'fs/promises';
import path from 'path';

const filePath = '/home/dev/Desktop/wdgl-01/非商品性采购管理制度 - 2025-11-10 - （新版）.docx';

async function analyzeDoc() {
    try {
        console.log(`Reading file: ${filePath}`);
        const buffer = await fs.readFile(filePath);

        console.log('Converting...');
        const options = {
            styleMap: [
                "p[style-name='封面文档标题'] => h1.doc-title",
                "p[style-name='封面表格文本'] => p.table-text",
                "r[style-name='Emphasis'] => em",
                "p[style-name='List Paragraph'] => ul > li:fresh"
            ]
        };
        const result = await mammoth.convertToHtml({ buffer: buffer }, options);

        // Simulate post-processing
        let html = result.value;
        html = html.replace(/<td>\s*<\/td>/g, '<td><p>&nbsp;</p></td>');
        result.value = html; // Update result for logging

        console.log('--- Conversion Messages (Warnings) ---');
        if (result.messages.length > 0) {
            result.messages.forEach(msg => console.log(`[${msg.type}] ${msg.message}`));
        } else {
            console.log('No warnings.');
        }

        console.log('\n--- Generated HTML Preview (Table Snippet) ---');
        const tableMatch = result.value.match(/<table[\s\S]*?<\/table>/);
        if (tableMatch) {
            console.log(tableMatch[0].substring(0, 1000)); // Print first 1000 chars of table
        } else {
            console.log('No table found in the first chunk, searching entire string...');
            const index = result.value.indexOf('<table');
            if (index !== -1) {
                console.log(result.value.substring(index, index + 1000));
            } else {
                console.log('No table found.');
            }
        }

        console.log('\n--- Analysis Complete ---');
    } catch (error) {
        console.error('Error analyzing document:', error);
    }
}

analyzeDoc();
