require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const jwt = require('jsonwebtoken');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello, World! Use /posts to see the list of posts.');
});

const posts = [
        { 
            username: 'Kyle', 
            title: 'First Post' 
        },
        { 
            username: 'Jim', 
            title: 'Second Post' 
        },
        { username: 'Bob', title: 'Third Post' }
    ];


// Login logic will be consolidated from here to authServer.js 
// This endpoint will only have posts related logic
// Here will be only get authenticateToken only 

// v1 posts route without authentication
// app.get('/posts', (req, res) => {    
//     res.json(posts);    
// }); 

// v2 posts route with authentication
app.get('/posts', authenticateToken, (req, res) => {    
    res.json(posts.filter(post => post.username === req.user.name));
});

// v2 Add middleware to verify token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // if there isn't any token

    // (err, user) => {} is a callback function
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // if token is no longer valid
        req.user = user;
        next(); // pass the execution off to whatever request the client intended
    });
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });

//vCode=mbsmsi7l3r4