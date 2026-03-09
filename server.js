const express = require("express");
const path = require("path");

const pollRoutes = require("./routes/pollRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.use("/", authRoutes);
app.use("/polls", pollRoutes);


app.post("/login", (req, res) => {

    const { username, password } = req.body;

    if (username === "admin" && password === "1234") {

        res.json({ success: true });

    }
    else if (username === "user1" && password === "4321") {

        res.json({ success: true });

    }
    else {

        res.json({ success: false });

    }

});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});