import fs from 'fs';

/**
 * Extract text from a PDF file and convert to basic HTML paragraphs.
 * After extraction, the source file is deleted to avoid storage bloat.
 */
export async function extractPdfToHtml(filePath: string): Promise<string> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const pdfParse = require('pdf-parse');
    const buffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(buffer);

    const html = pdfData.text
      .split(/\n\s*\n/)
      .map((p: string) => p.trim())
      .filter((p: string) => p.length > 0)
      .map((p: string) => `<p>${p.replace(/\n/g, '<br>')}</p>`)
      .join('\n');

    return html;
  } catch (err) {
    console.error('[pdf] Extraction error:', err);
    return '<p><em>PDF text extraction failed. Please enter content manually.</em></p>';
  } finally {
    // Clean up: delete the uploaded file after extraction
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch {
      // Ignore cleanup errors
    }
  }
}
