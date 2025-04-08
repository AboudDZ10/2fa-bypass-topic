const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'supersecret', resave: false, saveUninitialized: true }));


const users = [
    { username: 'nouredine', password: '2024-2025', name: 'Amraoui' },
    { username: 'mohamed', password: 'qwerty', name: 'mohamed' }
];

app.get("/", (req, res) => {
    res.render('home');
});

app.get("/home", (req, res) => {
    res.render('home');
});

app.get("/registr", (req, res) => {
    res.render('registr');
});

app.post("/registr", (req, res) => {
    const { username, name, password } = req.body;


    const userExists = users.some(u => u.username === username);
    if (userExists) {
        return res.render('registr', { error: 'Username already exists.' });
    }


    users.push({ username, password, name });
    res.redirect('/login');
});

app.get("/login", (req, res) => {
    res.render('login');
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
    

    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {

        req.session.user = { 
            username: user.username,
            name: user.name 
        };

        res.redirect('/verify');
    } else {
        res.render('login', { error: 'Invalid username or password' });
    }
});

app.get("/verify", (req, res) => {
    res.render('verify');
});

app.post("/verify", (req, res) => {
    const { code } = req.body;
    
    if (code === '123456') {
        // req.session.verified = true; 
        res.redirect('/account');
    } else {
        res.render('verify', { error: 'Invalid verification code.' });
    }
});

app.get("/account", (req, res) => {
   // if (!req.session.user || !req.session.verified) {
   //     return res.redirect('/login');
   //  }

    const username = req.session.user?.username || 'Guest';
    const name = req.session.user?.name || 'Guest User';
    res.render('account', { username, name });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);    
});
