const express = require("express");
const InsurerContract = require("../../fabric/contracts/insurer")
const PolicyContract = require("../../fabric/contracts/policy")

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
        res.status(500).send({ error: "Company NOT Registered!", error });
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
        res.status(500).send({ error: "Company Profile NOT Read!", error });
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
        res.status(500).send({ error: "Company NOT Logged In!", error });
    }
});

router.post("/createPolicy", async (req, res) => {
    try {
        if (req.body.username === undefined || req.body.policyname === undefined || req.body.premiumamount === undefined || req.body.insurancecover === undefined || req.body.insurancetype === undefined){
            res.status(400).send({ error: "Invalid Request! Request must contain seven fields" });
            return;
        }
        let reply = await PolicyContract.CreatePolicy(
            { username: req.body.username, organization: "insurer" },
            [req.body.policyname, req.body.username, req.body.premiumamount, req.body.insurancecover, req.body.insurancetype] //send username as company name
        );
        // check if error key exists in reply
        if ("error" in reply) {
            res.status(500).send({ error: reply.error });
            return;
        }
        res.status(200).send({ reply, message: "Policy Successfully Created." });
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: "Policy NOT Created!", error });
    }
});

router.get("/getPolicies", async (req, res) => {
    try {
        if(req.body.username === undefined){
            res.status(400).send({ error: "Invalid Request! Request must contain one field" });
            return;
        }
        let reply = await PolicyContract.GetPolicies(
            { username: req.body.username, organization: "insurer" },
            [ req.body.username ]
        );
        // check if error key exists in reply
        if(reply.error){
            res.status(500).send({ error: reply.error });
            return;
        }
        res.status(200).send({ reply, message: "Policies Successfully Read." });
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: "Policies NOT Read!", error });
    }
})

router.delete("/deletePolicy", async (req, res) => {
    try {
        if(req.body.username === undefined || req.body.policyid === undefined){
            res.status(400).send({ error: "Invalid Request! Request must contain two fields" });
            return;
        }
        let reply = await PolicyContract.DeletePolicy(
            { username: req.body.username, organization: "insurer" },
            [ req.body.username, req.body.policyid ]
        );
        // check if error key exists in reply
        if(reply.error){
            res.status(500).send({ error: reply.error });
            return;
        }
        res.status(200).send({ reply, message: "Policy Successfully Deleted." });
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: "Policy NOT Deleted!", error });
    }
})

module.exports = router