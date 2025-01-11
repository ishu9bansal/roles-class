require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const { USERS } = require('./db');

let sessions = new Set();

const app = express();
app.use(express.json());

app.post("/token", (req, res) => {
    const refreshToken = req.body.token;
    if (!sessions.has(refreshToken)) return res.status(403).json({ message: "Forbidden" });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
        if (err) return res.status(403).json({ message: "Forbidden", error: err.message });
        const token = generateAccessToken({ user: data.user });
        res.json({ token });
    });
});

app.post("/login", async (req, res) => {
    try {
        const user = USERS.find(user => user.username === req.body.username);

        if (!user) {
            return res.status(400).json({ message: "Username not registered!" });
        }

        const token_data = { user: user };

        const refresh_token = jwt.sign(token_data, process.env.REFRESH_TOKEN_SECRET);
        sessions.add(refresh_token);

        const token = generateAccessToken(token_data);
        return res.json({ token: token, refresh_token: refresh_token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

app.delete("/logout", (req, res) => {
    const refresh_token = req.body.token;
    if (!sessions.has(refresh_token)) {
        res.status(200).json({ message: "No op" });
    }
    sessions.delete(refresh_token);
    return res.status(204).json({ message: "Logged out" });
});

function generateAccessToken(token_data) {
    return jwt.sign(token_data, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3h' });
}

app.listen(5001);
