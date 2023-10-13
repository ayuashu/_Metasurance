const express = require("express");
const sha256 = require("sha256");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const JWTConfig = require("../helpers/jwtConfig");
const router = new express.Router();

// Login JWT Route
router.post("/api/auth/login", (req, res) => {
    const username = req.body.username;
    const passhash = sha256(req.body.password);
    const organization = req.body.organization;
    try {
        User.findOne({ username }, (err, doc) => {
            if (err || doc == null) return res.sendStatus(404);
            if (doc.passhash === passhash) {
                let userdata = {
                    username,
                    passhash,
                    organization,
                };
                let token = jwt.sign(userdata, JWTConfig.secretKey, {
                    algorithm: JWTConfig.algorithm,
                    expiresIn: process.env.JWT_EXPIRATION,
                });
                res.status(200).send({
                    message: "Login Successful!",
                    jwtoken: token,
                });
            } else {
                res.status(401).send({
                    message: "Login Failed!",
                });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Server Error!",
        });
    }
});

// Sign Up JWT Route
router.post("/api/auth/signup", async (req, res) => {
    const username = req.body.username;
    const passhash = sha256(req.body.password);
    const organization = req.body.organization;
    try {
        let newUser = {
            username,
            passhash,
            organization,
        };

        // Create Wallet Identity for the Username
        const FabricAPI = require("../../fabric/api");
        await FabricAPI.Account.RegisterUser({
            orgName: newUser.organization,
            username: newUser.username,
            affiliation: "org1.department1",
        });

        // Add username & passhash to the MongoDB Auth Database
        User.create(newUser, function (err, doc) {
            console.log(err);
            res.status(200).send({
                message: "Sign Up Successful!",
            });
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Server Error!",
        });
    }
});

// Verify JWT Route
router.get("/api/auth/verify", (req, res) => {
    let token = req.headers["x-access-token"];
    if (token) {
        jwt.verify(
            token,
            JWTConfig.secretKey,
            {
                algorithm: JWTConfig.algorithm,
            },
            function (err, decoded) {
                if (err) {
                    res.status(401).send({
                        status: 0,
                    });
                }
                res.status(200).send({
                    status: 1,
                    username: decoded.username,
                    organization: decoded.organization,
                });
            }
        );
    } else {
        res.status(401).send({
            status: 0,
        });
    }
});

// Login JWT Route
router.post("/api/auth/loginpt", (req, res) => {
    const username = req.body.username;
    const passhash = sha256(req.body.password);
    const organization = req.body.organization;
    try {
        User.findOne({ username }, (err, doc) => {
            if (err || doc == null) return res.sendStatus(404);
            if (doc.passhash === passhash) {
                let userdata = {
                    username,
                    passhash,
                    organization,
                };
                let token = jwt.sign(userdata, JWTConfig.secretKey, {
                    algorithm: JWTConfig.algorithm,
                    expiresIn: process.env.JWT_EXPIRATION,
                });
                res.status(200).send(token);
            } else {
                res.status(401).send({
                    message: "Login Failed!",
                });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            message: "Server Error!",
        });
    }
});

module.exports = router;
