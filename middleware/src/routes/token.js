const express = require("express");
const md5 = require("md5");
const JWTmiddleware = require("../helpers/jwtVerifyMiddleware");
const TokenContract = require("../../fabric/contracts/token");

const router = new express.Router();

router.get("/api/token/get/:id", JWTmiddleware, async (req, res) => {
    try {
        let data = await TokenContract.ReadToken({ username: req.user.username, organization: req.user.organization }, [
            req.params.id,
        ]);
        res.status(200).send(data);
    } catch (error) {
        res.status(404).send({ message: "Token NOT found!" });
    }
});

router.post("/api/token/create", JWTmiddleware, async (req, res) => {
    try {
        let reply = await TokenContract.CreateToken(
            { username: req.user.username, organization: req.user.organization },
            [req.body.data.ID, req.body.data.Token]
        );
        res.status(200).send({ reply, message: "Token Successfully Created." });
    } catch (error) {
        res.status(500).send({ message: "Token NOT Created!" });
    }
});

router.post("/api/token/update/:id", JWTmiddleware, async (req, res) => {
    try {
        let reply = await TokenContract.UpdateToken(
            { username: req.user.username, organization: req.user.organization },
            [req.params.id, req.body.data.Token]
        );
        res.status(200).send({ reply, message: "Token Successfully Updated." });
    } catch (error) {
        res.status(500).send({ message: "Token NOT Updated!" });
    }
});

module.exports = router;
