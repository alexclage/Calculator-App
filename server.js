const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Base path for when app is served under a subpath (e.g., /calc)
const BASE_PATH = '/calc';

// Serve static files for car-loan calculator (CSS, JS, etc.)
app.use(BASE_PATH + '/car-loan', express.static(path.join(__dirname, 'public', 'car-loan')));

// Serve static files for mortgage calculator (CSS, JS, etc.)
app.use(BASE_PATH + '/mortgage', express.static(path.join(__dirname, 'public', 'mortgage')));

// Serve static files from public root (for home page assets)
app.use(BASE_PATH, express.static(path.join(__dirname, 'public')));

// Route for home page
app.get(BASE_PATH + '/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for car loan calculator
app.get(BASE_PATH + '/car-loan', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'car-loan', 'index.html'));
});

// Route for mortgage calculator
app.get(BASE_PATH + '/mortgage', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'mortgage', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Car Loan Calculator: http://localhost:${PORT}/car-loan`);
    console.log(`Mortgage Calculator: http://localhost:${PORT}/mortgage`);
});
