import express from 'express';
import puppeteer from 'puppeteer';
import { generateCVHtml } from '../utils/htmlGenerator.js';

const router = express.Router();

// Export PDF endpoint using Puppeteer
router.post('/pdf', async (req, res) => {
  let browser = null;
  try {
    const { data, template = 'modern', themeColor = '#2563eb', fontFamily = 'Inter', fontSize = 'medium', title = 'Curriculum_Vitae' } = req.body;

    // Generate standalone HTML
    const html = generateCVHtml({ data, template, themeColor, fontFamily, fontSize });

    // Launch headless Puppeteer browser
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--font-render-hinting=medium'
      ]
    });

    const page = await browser.newPage();
    
    // Set viewport to A4 aspect ratio
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });
    
    // Set content and wait for network/fonts
    await page.setContent(html, { waitUntil: ['load', 'networkidle0'] });

    // Generate PDF buffer
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: '0mm',
        right: '0mm',
        bottom: '0mm',
        left: '0mm'
      }
    });

    await browser.close();
    browser = null;

    const safeTitle = (title || 'CV').replace(/[^a-zA-Z0-9_-]/g, '_');

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${safeTitle}.pdf"`,
      'Content-Length': pdfBuffer.length
    });

    return res.end(pdfBuffer);
  } catch (err) {
    console.error('Puppeteer PDF export error:', err);
    if (browser) {
      try {
        await browser.close();
      } catch (closeErr) {
        console.error('Error closing browser:', closeErr);
      }
    }
    return res.status(500).json({ error: 'Failed to generate PDF document: ' + err.message });
  }
});

// HTML preview endpoint (for debugging or iframe rendering)
router.post('/html-preview', (req, res) => {
  try {
    const { data, template, themeColor, fontFamily, fontSize } = req.body;
    const html = generateCVHtml({ data, template, themeColor, fontFamily, fontSize });
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (err) {
    res.status(500).json({ error: 'Preview generation error' });
  }
});

export default router;
