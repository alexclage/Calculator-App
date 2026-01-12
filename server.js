const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Route for home page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route for car loan calculator - serve both the route and static files
app.get('/car-loan', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'car-loan', 'index.html'));
});

app.use('/car-loan', express.static(path.join(__dirname, 'public', 'car-loan')));

// Route for mortgage calculator - serve both the route and static files
app.get('/mortgage', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'mortgage', 'index.html'));
});

app.use('/mortgage', express.static(path.join(__dirname, 'public', 'mortgage')));

// Serve static files from public root (for home page assets)
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Car Loan Calculator: http://localhost:${PORT}/car-loan`);
    console.log(`Mortgage Calculator: http://localhost:${PORT}/mortgage`);
});
