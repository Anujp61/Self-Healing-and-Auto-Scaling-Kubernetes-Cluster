// frontend/server.js
const express = require('express');
const axios = require('axios');
const app = express();
const port = 8080;

app.get('/', async (req, res) => {
    try {
        const backendResponse = await axios.get('http://backend:8080');
        res.send(`Hello from the Frontend! Message from Backend: "${backendResponse.data}"`);
    } catch (error) {
        res.send('Error connecting to backend');
    }
});

app.listen(port, () => {
    console.log(`Frontend is running on http://localhost:${port}`);
});
