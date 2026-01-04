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

app.get('/posts', (req, res) => {    
    res.json(posts);    
});

app.post('/login', (req, res) => {
    // Login logic will go here maybe from front end
    // For now, we'll just create a token
    // Generate these tokens using the following commands in Node.js REPL 
    // The Node.js Read-Eval-Print-Loop (REPL) is an interactive shell that processes Node.js expressions
    // to set them as environment variables
    // > require('crypto').randomBytes(64).toString('hex')
    // > require('crypto').randomBytes(64).toString('hex')

    const username = req.body.username;
    const user = { name: username };
    const accessToken = jwt.sign(
        user,
        process.env.ACCESS_TOKEN_SECRET
        , { expiresIn: process.env.expiresIn });
    //
    res.json({ 'accessToken': accessToken });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });

