const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

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

    // When a user leaves the site
    socket.on('disconnect', () => {
        homePageUsers = Math.max(homePageUsers - 1, 0); // Ensure it doesn't go negative
        io.emit('updateHomePageUsers', homePageUsers); // Notify all connected clients
    });
});

app.use(express.static('public'));

server.listen(3000, () => console.log('Server is running on http://localhost:3000'));
