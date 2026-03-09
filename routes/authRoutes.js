const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");
const userPath = path.join(__dirname, "../data/users.json");

function readUsers() {
    if (!fs.existsSync(userPath)) {
        fs.writeFileSync(userPath, "[]");
    }
    return JSON.parse(fs.readFileSync(userPath));
}

function writeUsers(users) {
    fs.writeFileSync(userPath, JSON.stringify(users, null, 2));
}

// Register
router.post("/register", async (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.json({
            success: false,
            message: "Username and password required"
        });
    }

    const users = readUsers();

    const existingUser = users.find(u => u.username === username);

    if (existingUser) {
        return res.json({
            success: false,
            message: "User already exists"
        });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
        id: Date.now(),
        username,
        password: hashedPassword,
        role: "user"
    };

    users.push(newUser);

    writeUsers(users);

    res.json({
        success: true,
        userId: newUser.id
    });

});
// Login
router.post("/login", async (req, res) => {

    const { username, password } = req.body;

    const users = readUsers();

    const user = users.find(u => u.username === username);

    if (!user) {
        return res.json({ success: false });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        return res.json({ success: false });
    }

    res.json({
        success: true,
        userId: user.id,
        role: user.role
    });

});
router.delete("/:id", (req, res) => {

    const polls = readPolls();

    const updatedPolls = polls.filter(p => p.id != req.params.id);

    writePolls(updatedPolls);

    res.json({
        success: true,
        message: "Poll deleted"
    });

});

module.exports = router;