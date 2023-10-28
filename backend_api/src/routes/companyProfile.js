const express = require("express");
const fetchuser = require("../middleware/fetchuser");
const db = require('../utils/db');
const getSessionToken = require('../utils/getSessionToken');
const InsurerContract = require("../../fabric/contracts/insurer")
const PolicyContract = require("../../fabric/contracts/policy")

const router = new express.Router();

/**
 * Registers a new company with the InsurerContract.
 * @async
 * @function
 * @param {string} req.body.username - The username of the company.
 * @param {string} req.body.name - The name of the company.
 * @param {string} req.body.email - The email of the company.
 * @param {string} req.body.phone - The phone number of the company.
 * @param {string} req.body.password - The password of the company.
 * @returns {Promise} A promise that resolves with the reply from the InsurerContract.
 */
router.post("/register", async (req, res) => {
    try {
        if (req.body.username === undefined || req.body.name === undefined || req.body.email === undefined || req.body.phone === undefined || req.body.password === undefined) {
            res.status(400).send({ error: "Invalid Request! Request must contain five fields" });
            return;
        }
        const username = req.body.username
        const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
        let reply = await InsurerContract.RegisterCompany(
            { username: req.body.username, organization: "insurer" },
            [req.body.username, req.body.name, req.body.email, req.body.phone, req.body.password]
        );
        if (reply.error) {
            res.status(500).send({ error: reply.error });
            return;
        }
        const token = getSessionToken(username);
        db.set(token, username, expiresAt);
        res.cookie("auth", token, { httpOnly: true, maxAge: expiresAt });
        res.status(200).send({ reply, message: "Company Successfully Registered." });
    } catch (error) {
        res.status(500).send({ message: "Company NOT Registered!", error });
    }
})

/**
 * Logs in the insurer with the given username and password.
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {string} req.body.username - The username of the insurer.
 * @param {string} req.body.password - The password of the insurer.
 * @returns {Promise} A promise that resolves with the login response.
 */
router.post("/login", async (req, res) => {
    try {
        if (req.body.username === undefined || req.body.password === undefined) {
            res.status(400).send({ error: "Invalid Request! Request must contain two fields" });
            return;
        }
        let reply = await InsurerContract.Login(
            { username: req.body.username, organization: "insurer" },
            [req.body.username, req.body.password]
        );
        if (reply.error) {
            res.status(500).send({ error: reply.error });
            return;
        }
        const username = req.body.username
        const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
        const token = getSessionToken(username);
        db.remove(req.cookies.auth);
        db.set(token, username, expiresAt);
        res.cookie("auth", token, { httpOnly: true, maxAge: expiresAt });
        res.status(200).send({ reply, message: "Company Successfully Logged In." });
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Company NOT Logged In!", error });
    }
});

/**
 * Reads the profile of an insurer from the blockchain.
 * @async
 * @function
 * @param {Object} req - The HTTP request object.
 * @param {string} req.body.username - The username of the insurer whose profile is to be read.
 * @returns {Promise<Object>} The profile of the specified insurer.
 */
router.get("/readprofile", fetchuser, async (req, res) => {
    try {
        if(req.body.username === undefined){
            res.status(400).send({ error: "Invalid Request! Request must contain username" });
            return;
        }
        let reply = await InsurerContract.ReadProfile(
            { username: req.body.username, organization: "insurer" },
            [req.body.username]
        );
        if(reply.error){
            res.status(500).send({ error: reply.error });
            return;
        }
        res.status(200).send({ reply, message: "Company Profile Successfully Read." });
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: "Company Profile NOT Read!", error });
    }
});

// policy functionalities
/**
 * Creates a new policy using the PolicyContract.CreatePolicy method.
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {string} req.body.username - The username of the company creating the policy.
 * @param {string} req.body.policyname - The name of the policy.
 * @param {number} req.body.premiumamount - The premium amount of the policy.
 * @param {number} req.body.insurancecover - The insurance cover of the policy.
 * @param {string} req.body.insurancetype - The insurance type of the policy.
 * @returns {Promise} A promise that resolves with the reply from the PolicyContract.CreatePolicy method.
 */
router.post("/createPolicy", fetchuser, async (req, res) => {
    try {
        if (req.body.username === undefined || req.body.policyname === undefined || req.body.premiumamount === undefined || req.body.insurancecover === undefined || req.body.insurancetype === undefined){
            res.status(400).send({ error: "Invalid Request! Request must contain five fields" });
            return;
        }
        // TODO: check if company requesting exists or not
        let reply = await PolicyContract.CreatePolicy(
            { username: req.body.username, organization: "insurer" },
            [req.body.policyname, req.body.premiumamount, req.body.insurancecover, req.body.insurancetype, req.body.username] //send username as company name
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

/**
 * Retrieves policies for a specific username and organization from the PolicyContract.
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {string} req.body.username - The username to retrieve policies for.
 * @returns {Promise<Array>} - An array of policies for the specified username and organization.
 */
router.get("/getPolicies", fetchuser, async (req, res) => {
    try {
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

/**
 * Deletes a policy from the blockchain.
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {string} req.body.username - The username of the user deleting the policy.
 * @param {string} req.body.policyid - The ID of the policy to be deleted.
 * @returns {Promise} A Promise that resolves with the result of the policy deletion.
 */
router.delete("/deletePolicy", fetchuser, async (req, res) => {
    try {
        if(req.body.username === undefined || req.body.policyid === undefined){
            res.status(400).send({ error: "Invalid Request! Request must contain policyid" });
            return;
        }
        //TODO: check if policy belongs to company
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