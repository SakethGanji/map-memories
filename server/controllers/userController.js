const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/userClass');
const router = express.Router();

// Input Validation Middleware
const validateRegistration = (req, res, next) => {
    const { email, username, password, retypePassword } = req.body;

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: "Invalid Email" });
    }
    if (password.length < 8) {
        return res.status(400).json({ error: "Minimum password length of 8" });
    }
    if (!/\d/.test(password)) {
        return res.status(400).json({ error: "Password requires at least one number" });
    }
    if (password !== retypePassword) {
        return res.status(400).json({ error: "Passwords do not match" });
    }
    next();
};

//Register Route
router.post('/register', validateRegistration, async (req, res) => {
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
router.post('/login', async (req, res) => {
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

module.exports = router;