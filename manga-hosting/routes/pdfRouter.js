const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

// Define the directory where PDF files are stored
const pdfDirectory = path.join(__dirname, '..', 'uploads'); // Adjust the path here

// Route to serve PDF files
router.get('/pdfs/:fileName', (req, res) => {
    const { fileName } = req.params;
    const filePath = path.join(pdfDirectory, fileName); // Adjust the path here

    // Check if the file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error('File not found:', err);
            return res.status(404).send('File not found');
        }

        // Set headers
        res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
        res.setHeader('Content-Type', 'application/pdf');

        // Stream the file to the client
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Error sending file:', err);
                res.status(500).send('Error sending file');
            }
        });
    });
});

module.exports = router;
