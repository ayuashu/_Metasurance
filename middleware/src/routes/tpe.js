const express = require("express");
const JWTmiddleware = require("../helpers/jwtVerifyMiddleware");
const TPEContract = require("../../fabric/contracts/tpe");

const router = new express.Router();

router.get("/api/tpe/config/get", JWTmiddleware, async (req, res) => {
    try {
        let data = await TPEContract.GetConfig(
            { username: req.user.username, organization: req.user.organization },
            []
        );
        res.status(200).send(data);
    } catch (error) {
        res.status(404).send({ message: "Asset NOT found!" });
    }
});

router.post("/api/tpe/config/set", JWTmiddleware, async (req, res) => {
    try {
        let reply = await TPEContract.SetConfig({ username: req.user.username, organization: req.user.organization }, [
            req.body.data.N,
            req.body.data.Theta,
        ]);

        res.status(200).send({
            reply,
            message: "TPE Config has been successfully set.",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Error! TPE Config NOT set!" });
    }
});

module.exports = router;
