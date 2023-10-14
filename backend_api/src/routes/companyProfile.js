const express = require("express");
const InsurerContract = require("../../fabric/contracts/insurer")

const router = new express.Router();

/**
 * request format:
 * ```json
 * {
 *  username: "user1",
 *  name: "User One",
 *  email: ",
 *  phone: "",
 *  password: "password"
 * }
 * ```
 * 
 */

router.post("/register", async (req, res) => {
    try {
        if (req.body.username === undefined || req.body.name === undefined || req.body.email === undefined || req.body.phone === undefined || req.body.password === undefined) {
            res.status(400).send({ error: "Invalid Request! Request must contain five fields" });
            return;
        }
        let reply = await InsurerContract.RegisterCompany(
            { username: req.body.username, organization: "insurer" },
            [req.body.name, req.body.email, req.body.phone, req.body.password]
        );
        res.status(200).send({ reply, message: "Company Successfully Registered." });
    } catch (error) {
        res.status(500).send({ error: "Company NOT Registered!" });
    }
})

router.get("/readprofile", async (req, res) => {
    try {
        if(req.body.username === undefined || req.body.email === undefined){
            res.status(400).send({ error: "Invalid Request! Request must contain two fields" });
            return;
        }
        let reply = await InsurerContract.ReadProfile(
            { username: req.body.username, organization: "insurer" },
            [req.body.email]
        );
        res.status(200).send({ reply, message: "Company Profile Successfully Read." });
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: "Company Profile NOT Read!" });
    }
});

router.post("/login", async (req, res) => {
    try {
        if(req.body.username === undefined || req.body.email === undefined || req.body.password === undefined){
            res.status(400).send({ error: "Invalid Request! Request must contain three fields" });
            return;
        }
        let reply = await InsurerContract.Login(
            { username: req.body.username, organization: "insurer" },
            [req.body.email, req.body.password]
        );
        res.status(200).send({ reply, message: "Company Successfully Logged In." });
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: "Company NOT Logged In!" });
    }
});

module.exports = router;