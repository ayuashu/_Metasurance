const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser")
require("dotenv").config();

const app = express();

// JSON Middleware
app.use(express.json());

// CORS Middleware
const whitelist = ['http://localhost:3001'];
const corsOptions = {
    credentials: true,
    origin: "http://localhost:3001",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};
app.use(cors(corsOptions));
app.use(cookieParser())

// Load API Routes
app.use('/api/user', require('./routes/userProfile'));
app.use('/api/company', require('./routes/companyProfile'));

// Start Listening
app.listen(3000, () => console.log("Listening on port 3000."));
