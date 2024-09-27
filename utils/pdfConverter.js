const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const sizeOf = require('image-size');

// Directory for PDFs
const pdfsDir = path.join(__dirname, '../public/pdfs');

// Ensure the PDFs directory exists
if (!fs.existsSync(pdfsDir)) {
    fs.mkdirSync(pdfsDir, { recursive: true });
}

// Function to convert PNG to PDF with exact size and padding
async function convertToPDF(screenshotFileName, taskId) {
    const screenshotPath = path.join(__dirname, '../public/screenshots', screenshotFileName);
    
    // Get the dimensions of the PNG screenshot
    const dimensions = sizeOf(screenshotPath);
    const padding = 20;  // Add some padding around the PNG in the PDF

    const pdfFileName = `ss-${taskId}.pdf`;
    const pdfPath = path.join(pdfsDir, pdfFileName);

    const doc = new PDFDocument({
        autoFirstPage: false, // Disable the default first page
    });
    
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    // Create a new PDF page with the exact size of the screenshot plus padding
    doc.addPage({
        size: [dimensions.width + padding * 2, dimensions.height + padding * 2]  // Add padding to the PDF page size
    });

    // Place the image in the center of the PDF page with padding
    doc.image(screenshotPath, padding, padding, {
        width: dimensions.width,  // Maintain the original width
        height: dimensions.height  // Maintain the original height
    });

    doc.end();  // Finalize the PDF

    // Return a promise that resolves when the PDF is fully written
    return new Promise((resolve, reject) => {
        writeStream.on('finish', () => resolve(pdfFileName));
        writeStream.on('error', reject);
    });
}

module.exports = { convertToPDF };
