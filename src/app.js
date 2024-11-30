const express = require('express');
const path = require('path');
const fs = require('fs');
const hbs = require('hbs');
const session = require('express-session');
require('./db/conn');
const Register = require('./models/registers');
const Message = require('./models/messages');

const app = express();
const port = process.env.PORT || 3000;

const static_path = path.join(__dirname, '../public');
const template_path = path.join(__dirname, '../templates/views');
const partials_path = path.join(__dirname, '../templates/partials');

const jsonData = JSON.parse(fs.readFileSync('./public/index.json', 'utf-8'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(static_path));

app.set('view engine', 'hbs');
app.set('views', template_path);
hbs.registerPartials(partials_path);

app.use(
    session({
        secret: 'pasta123',
        resave: false,
        saveUninitialized: false,
        cookie: { maxAge: 1000 * 60 * 60 },
    })
);

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

app.get('/', (req, res) => {
    res.render('index', { data: jsonData });
});

app.get('/about', (req, res) => {
    res.render('about', { data: jsonData });
});

app.get('/course', (req, res) => {
    res.render('course', { data: jsonData });
});

app.get('/CSE', (req, res) => {
    res.render('CSE');
});

app.get('/ECOM', (req, res) => {
    res.render('ECOM');
});

app.get('/ME', (req, res) => {
    res.render('ME');
});

app.get('/resources', (req, res) => {
    res.render('resources', { data: jsonData });
});

app.get('/CSE_BOOKS', (req, res) => {
    res.render('CSE_BOOKS', { data: jsonData });
});

app.get('/ECOM_BOOKS', (req, res) => {
    res.render('ECOM_BOOKS');
});

app.get('/ME_BOOKS', (req, res) => {
    res.render('ME_BOOKS');
});

app.get('/contact', (req, res) => {
    res.render('contact');
});

app.get('/quiz', (req, res) => {
    res.render('quiz', { data: jsonData });
});

app.get('/login-signup', (req, res) => {
    res.render('login-signup');
});

app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Register.findOne({ email });

        if (!user) {
            return res.status(400).send('Invalid email or password');
        }

        if (user.password === password) {
            req.session.user = {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
            };
            return res.redirect('/');
        } else {
            return res.status(400).send('Invalid username or password');
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Server error');
    }
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

app.post('/signup', async (req, res) => {
    try {
        const { email, fullName, username, password, confirmPassword } = req.body;

        if (password === confirmPassword) {
            const newUser = new Register({
                email,
                fullName,
                username,
                password,
                confirmPassword,
            });

            await newUser.save();

            req.session.user = {
                id: newUser._id,
                username: newUser.username,
                fullName: newUser.fullName,
            };

            res.redirect('/'); 
        } else {
            res.send('Passwords do not match'); 
        }
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(400).send('Error during signup');
    }
});

app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Unable to logout');
        }
        res.redirect('/'); 
    });
});

app.post('/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        const newMessage = new Message({
            name,
            email,
            subject,
            message,
        });

        await newMessage.save();

        res.status(201).render('contact', { success: 'Your message has been sent successfully!' });
    } catch (error) {
        console.error('Error saving message:', error);
        res.status(500).render('contact', { error: 'An error occurred. Please try again later.' });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
