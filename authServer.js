require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;
const jwt = require('jsonwebtoken');

app.use(express.json());

// In production, you should verify if refreshToken is in DB or in-memory store like Redis
let refreshTokens = [];

// Create a new function token
app.post('/token', (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401); // if there isn't any token
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403); // if token is not valid
    // verify token
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateAccessToken({ name: user.name });
        res.json({ accessToken: accessToken });
    });
});

app.delete('/logout', (req, res) => {
    // In production, remove the refresh token from DB or in-memory store like Redis
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.sendStatus(204); // Successfully deleted the token
});

// Login logic remain here and posts logic will remain in server.js
// For now, we'll just create a token
// Generate these tokens using the following commands in Node.js REPL 
// The Node.js Read-Eval-Print-Loop (REPL) is an interactive shell that processes Node.js expressions
// to set them as environment variables
// > require('crypto').randomBytes(64).toString('hex')
// > require('crypto').randomBytes(64).toString('hex')
app.post('/login', (req, res) => {
    const username = req.body.username;
    const user = { name: username };
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30s'});
}

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    });

//vCode=mbsmsi7l3r4