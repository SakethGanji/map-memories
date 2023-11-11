const express = require('express');
const bcrypt = require('bcrypt');
require('dotenv').config({path:'../.env'});
const User = require('./models/userClass');
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URL)

// Input Validation Middleware
const validateRegistration = (req, res, next) => {
    const { email, username, password, repassword } = req.body;

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid Email" });
    }
    if (password !== repassword) {
        return res.status(400).json({ error: "Passwords do not match" });
    }
    if (password.length < 8) {
        return res.status(400).json({ error: "Minimum password length of 8" });
    }
    if (!/\d/.test(password)) {
        return res.status(400).json({ error: "Password requires at least one number" });
    }
    next();
};

//Register Route
app.post('/register', validateRegistration, async (req, res) => {
    const { email, username, password } = req.body;

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        return res.status(400).json({ error: "Email already in use" });
    }

    const existingUserByUsername = await User.findOne({ username: username });
    if (existingUserByUsername) {
        return res.status(400).json({ error: "Username already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, username, password: hashedPassword });

    try {
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error registering user" });
    }
});

// Login Route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
        return res.status(400).send("User not found");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        return res.status(400).send("Invalid password");
    }

    res.send("Login successful");
});


// Test route
app.get('/test', (req, res) => {
    res.send('Test route is working!');
});

// Listening on port 5000
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is running on port localhost:${PORT}`));