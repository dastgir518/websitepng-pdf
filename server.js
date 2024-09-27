const express = require('express');
const path = require('path');
const fs = require('fs');
const { takeScreenshot } = require('./utils/screenshot');
const { convertToPDF } = require('./utils/pdfConverter');
const { createTask, updateTask, getTask } = require('./utils/taskManager');

const app = express();
const port = 3040;

// Serve static files (screenshots, PDFs, and HTML)
app.use(express.static(path.join(__dirname, 'public')));

// Serve homepage (optional)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route to take a screenshot and convert it to a PDF
app.get('/screenshot', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).send('URL is required');
    }

    const taskId = createTask(url);  // Use the new taskId logic
    res.json({ message: 'Screenshot and PDF request received', taskId });

    try {
        const screenshotFileName = await takeScreenshot(url, taskId);
        const pdfFileName = await convertToPDF(screenshotFileName, taskId);
        
        updateTask(taskId, 'completed', { 
            screenshot: `/screenshots/${screenshotFileName}`, 
            pdf: `/pdfs/${pdfFileName}` 
        });
    } catch (error) {
        updateTask(taskId, 'failed', null, error.message);
    }
});

// Route to check the task status
app.get('/task-status/:id', (req, res) => {
    const taskId = req.params.id;
    const task = getTask(taskId);

    if (!task) {
        return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task);
});

// Route to list all PDFs
app.get('/list-pdfs', (req, res) => {
    const pdfsDir = path.join(__dirname, 'public', 'pdfs');
    
    // Read the directory and list all PDF files
    fs.readdir(pdfsDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to list PDFs' });
        }

        // Filter out PDF files and return the list
        const pdfFiles = files.filter(file => file.endsWith('.pdf')).map(file => `/pdfs/${file}`);
        res.json(pdfFiles); // Respond with the list of PDF files
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
