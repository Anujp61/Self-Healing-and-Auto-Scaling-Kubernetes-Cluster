// backend/server.js
const express = require('express');
const app = express();
const port = 8080;

app.get('/', (req, res) => {
    res.send('Hello from the Backend!');
});

app.listen(port, () => {
    console.log(`Backend is running on http://localhost:${port}`);
});
