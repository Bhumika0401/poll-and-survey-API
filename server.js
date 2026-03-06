const express = require('express');
const path = require('path');

const pollRoutes = require('./routes/pollRoutes');

const app = express();
const PORT = 3000;


// Middleware
app.use(express.json());


// Logger middleware
app.use((req, res, next) => {

    console.log(`${req.method} ${req.url}`);

    next();

});


// Serve static frontend
app.use(express.static(path.join(__dirname, 'public')));


// Routes
app.use('/polls', pollRoutes);


// Error handling middleware
app.use((err, req, res, next) => {

    console.error(err);

    res.status(500).json({
        message: "Internal Server Error"
    });

});


app.listen(PORT, () => {

    console.log(`Server running at http://localhost:${PORT}`);

});