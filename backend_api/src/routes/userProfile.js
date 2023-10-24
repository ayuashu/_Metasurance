const express = require("express");
const UserContract = require("../../fabric/contracts/user")
const AssetContract = require("../../fabric/contracts/asset")

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
        if(req.body.username === undefined || req.body.name === undefined || req.body.email === undefined || req.body.phone === undefined || req.body.password === undefined){
            res.status(400).send({ error: "Invalid Request! Request must contain five fields" });
            return;
        }
        let reply = await UserContract.RegisterUser(
            { username: req.body.username, organization: "user" },
            [req.body.name, req.body.email, req.body.phone, req.body.password]
        );
        res.status(200).send({ reply, message: "User Successfully Registered." });
    } catch (error) {
        res.status(500).send({ error: "User NOT Registered!", error });
    }
})

router.get("/readprofile", async (req, res) => {
    try {
        if (req.body.username === undefined || req.body.email === undefined) {
            res.status(400).send({ error: "Invalid Request! Request must contain two fields" });
            return;
        }
        let reply = await UserContract.ReadProfile(
            { username: req.body.username, organization: "user" },
            [req.body.email]
        );
        res.status(200).send({ reply, message: "User Profile Successfully Read." });
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: "User Profile NOT Read!", error });
    }
});

router.post("/login", async (req, res) => {
    try {
        if (req.body.username === undefined || req.body.email === undefined || req.body.password === undefined) {
            res.status(400).send({ error: "Invalid Request! Request must contain three fields" });
            return;
        }
        let reply = await UserContract.Login(
            { username: req.body.username, organization: "user" },
            [req.body.email, req.body.password]
        );
        res.status(200).send({ reply, message: "User Successfully Logged In." });
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: "User NOT Logged In!", error });
    }
});

router.post('/asset/add', async (req, res) => {
    try {
        if (req.body.username === undefined || req.body.assetName === undefined || req.body.assetType === undefined || req.body.userid === undefined || req.body.value === undefined || req.body.age === undefined) {
            res.status(400).send({ error: "Invalid Request! Request must contain six fields" });
            return;
        }
        // TODO: check if user requesting exists or not
        let reply = await AssetContract.CreateAsset(
            { username: req.body.username, organization: "user" },
            [req.body.assetName, req.body.assetType, req.body.value, req.body.age, req.body.userid ]
        )
        res.status(200).send({ reply, message: "Asset Successfully Added." });
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: "Asset NOT Added!", error });
    }
})

router.delete("/asset/delete", async (req, res) => {
    try {
        if (req.body.username === undefined || req.body.assetid === undefined || req.body.userid === undefined) {
            res.status(400).send({ error: "Invalid Request! Request must contain two fields: username and assetid" });
            return;
        }
        // TODO: check if asset belongs to user
        let reply = await AssetContract.DeleteAsset(
            { username: req.body.username, organization: "user" },
            [ req.body.userid, req.body.assetid ]
        )
        res.status(200).send({ reply, message: "Asset Successfully Deleted." });
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: "Asset NOT Deleted!", error });
    }
})

router.get("/asset/get", async (req, res) => {
    try {
        if (req.body.username === undefined || req.body.userid === undefined) {
            res.status(400).send({ error: "Invalid Request! Request must contain two fields: username and assetid" });
            return;
        }
        let reply = await AssetContract.QueryAsset(
            { username: req.body.username, organization: "user" },
            [ req.body.userid ]
        )
        res.status(200).send({ reply, message: "Asset Successfully Queried." });
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: "Unable to query asset!", error });
    }
})

module.exports = router;
