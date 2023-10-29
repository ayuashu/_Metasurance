const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser")
require("dotenv").config();

const app = express();

// JSON Middleware
app.use(express.json());

// CORS Middleware
const whitelist = ['http://localhost:3001'];
app.options('*', cors());
const corsOptions = {
    credentials: true,
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};
app.use(cors(corsOptions));
app.use(cookieParser())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
});

// Load API Routes
app.use('/api/user', require('./routes/userProfile'));
app.use('/api/company', require('./routes/companyProfile'));

// Start Listening
app.listen(3000, () => console.log("Listening on port 3000."));
