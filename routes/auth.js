const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

const userDB = { 
    username: "admin",
    password: "password123",
    email: "test@example.com" 
};
let verificationCode = null;

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (username === userDB.username && password === userDB.password) {
        req.session.user = username;

        // Generate random 6-digit code
        req.session.verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    } else {
        res.render('login', { error: "Invalid credentials!" });
    }
});

router.get('/verify', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    res.render('verify', { error: null });
});

router.post("/verify-code", (req, res) => {
    const { code } = req.body;

    if (req.session.verificationCode === code) {
        req.session.verificationCode = null; // Clear the code after successful verification
        res.json({ message: "✅ Code verified!" });
    } else {
        res.status(400).json({ message: "❌ Invalid code" });
    }
});

module.exports = router;