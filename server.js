const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let homePageUsers = 0; // Track users on the home page

io.on('connection', (socket) => {
    console.log('A user connected.');

    // When a user visits the home page
    socket.on('homePageVisit', () => {
        homePageUsers++;
        io.emit('updateHomePageUsers', homePageUsers); // Notify all connected clients
    });

    // When a user disconnects
    socket.on('disconnect', () => {
        homePageUsers = Math.max(homePageUsers - 1, 0); // Ensure it doesn't go negative
        io.emit('updateHomePageUsers', homePageUsers); // Notify all connected clients
    });
});

// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html explicitly when visiting '/'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html')); // Serve index.html from the root directory
});

// Serve dashboard.html explicitly when visiting '/dashboard'
app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Start the server
server.listen(3000, () => console.log('Server is running on http://localhost:3000'));
