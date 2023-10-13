const express = require("express");
const md5 = require("md5");
const JWTmiddleware = require("../helpers/jwtVerifyMiddleware");
const PatientContract = require("../../fabric/contracts/patient");

const router = new express.Router();

router.get("/api/patient/get/:id", JWTmiddleware, async (req, res) => {
    try {
        let data = await PatientContract.ReadProfile(
            { username: req.user.username, organization: req.user.organization },
            [req.params.id]
        );
        res.status(200).send(data);
    } catch (error) {
        res.status(404).send({ message: "Profile NOT found!" });
    }
});

router.post("/api/patient/create", JWTmiddleware, async (req, res) => {
    try {
        let reply = await PatientContract.CreateProfile(
            { username: req.user.username, organization: req.user.organization },
            [md5(req.body.data.Name + new Date().toISOString()), req.body.data.Name]
        );
        res.status(200).send({ reply, message: "Profile Successfully Created." });
    } catch (error) {
        res.status(500).send({ message: "Profile NOT Created!" });
    }
});

router.post("/api/patient/update/:id", JWTmiddleware, async (req, res) => {
    try {
        let reply = await PatientContract.UpdateProfile(
            { username: req.user.username, organization: req.user.organization },
            [req.params.id, req.body.data.Name]
        );
        res.status(200).send({ reply, message: "Profile Successfully Updated." });
    } catch (error) {
        res.status(500).send({ message: "Profile NOT Updated!" });
    }
});

router.post("/api/patient/activate/:id", JWTmiddleware, async (req, res) => {
    try {
        let reply = await PatientContract.ActivateProfile(
            { username: req.user.username, organization: req.user.organization },
            [req.params.id]
        );
        res.status(200).send({ reply, message: "Profile Successfully Activated." });
    } catch (error) {
        res.status(500).send({ message: "Profile NOT Activated!" });
    }
});

module.exports = router;
