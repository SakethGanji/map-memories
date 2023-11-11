const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
require('dotenv').config({path:'../.env'});
const User = require('./models/userClass');
const mongoose = require("mongoose");
const { MongoClient, ServerApiVersion } = require('mongodb');
const url = process.env.MONGO_URL;

app.use(express.json());

const client = new MongoClient(url, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function runMongoOperation(operation) {
    try {
        await client.connect();
        return await operation(client);
    } catch (error) {
        console.error('MongoDB operation failed:', error);
    } finally {
        await client.close();
    }
}

app.post('/register', async (req, res) => {
    const { email, username, password, repassword } = req.body;

    // Basic validation
    if (!/@./.test(email) || !/../.test(email))
        return res.status(400).send("Invalid Email");
    if (password !== repassword)
        return res.status(400).send("Passwords do not match");
    if (password.length < 8)
        return res.status(400).send("Minimum password length of 8");
    if (!/\d/.test(password))
        return res.status(400).send("Password requires at least one number");

    try {
        await client.connect();
        const db = client.db(); // Add your DB name here
        const users = db.collection('users'); // Change 'users' to your collection name if different

        // Check if email already exists
        const emailExists = await users.findOne({ email });
        if (emailExists) {
            await client.close();
            return res.status(400).send("Email already in use");
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Insert the new user
        await users.insertOne({ email, username, password: hashedPassword });
        await client.close();

        res.status(201).send("User created successfully");
    } catch (error) {
        console.error(error);
        await client.close();
        res.status(500).send("Error in saving user");
    }
});

// Test route
app.get('/test', (req, res) => {
    res.send('Test route is working!');
});

// Listening on port 5000
const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));