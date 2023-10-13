const express = require("express");
const UserContract = require("../../fabric/contracts/user")

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
        res.status(500).send({ message: "User NOT Registered!" });
    }
})

module.exports = router;