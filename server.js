const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static('public'));

// Route for home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for car loan calculator
app.get('/car-loan', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'car-loan', 'index.html'));
});

// Route for mortgage calculator
app.get('/mortgage', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'mortgage', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Car Loan Calculator: http://localhost:${PORT}/car-loan`);
    console.log(`Mortgage Calculator: http://localhost:${PORT}/mortgage`);
});
