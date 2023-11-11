const express = require('express');
const app = express();

app.use(express.json());
app.post('/register', (req, res) => {
    const { email, username, password, repassword } = req.body;
    // Check email and username unique
    if(!/@./.test(email) || !/\../.test(email))
        res.send("Invalid Email");
    else if(password !== repassword)
        res.send("Passwords do not match");
    else if(password.length < 8)
        res.send("Minimum password length of 8")
    else if(!/\d/.test(password))
        res.send("Password requires at least one number")
    else
        res.send(`User: ${username} Email: ${email} Password: ${password} Repassword: ${repassword}`);
});

// Test route
app.get('/test', (req, res) => {
    res.send('Test route is working!');
});

// Listening on port 3000
const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));