const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const db = require('../utils/db');
const getSessionToken = require('../utils/getSessionToken');
const VerifierContract = require('../../fabric/contracts/verifier');
const ClaimContract = require('../../fabric/contracts/claim');
const InsurerContract = require('../../fabric/contracts/insurer');
const UserContract = require('../../fabric/contracts/user');

const router = new express.Router();

/** 
 * Registers a new verifier with the VerifierContract.
 * @async
 * @function
 * @param {string} req.body.username - The username of the verifier.
 * @param {string} req.body.name - The name of the verifier.
 * @param {string} req.body.email - The email of the verifier.
 * @param {string} req.body.phone - The phone number of the verifier.
 * @param {string} req.body.password - The password of the verifier.
 * @returns {Promise} A promise that resolves with the reply from the VerifierContract.
 */
router.post('/register', async (req, res) => {
    try {
        if (
            req.body.username === undefined ||
            req.body.name === undefined ||
            req.body.email === undefined ||
            req.body.phone === undefined ||
            req.body.password === undefined
        ) {
            res.status(400).send({
                error: 'Invalid Request! Request must contain five fields',
            });
            return;
        }
        const username = req.body.username;
        const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
        let reply = await VerifierContract.RegisterVerifier(
            { username: req.body.username, organization: 'verifier' },
            [
                req.body.username,
                req.body.name,
                req.body.email,
                req.body.phone,
                req.body.password,
            ],
        );
        if (reply.error) {
            res.status(500).send({ error: reply.error });
            return;
        }
        const token = getSessionToken(username);
        db.set(token.passwordHash, username, expiresAt);
        res.cookie('auth', token.passwordHash, {
            httpOnly: true,
            maxAge: expiresAt,
        });
        res.status(200).send({
            reply,
            message: 'Verifier Successfully Registered.',
        });
    } catch (error) {
        res.status(500).send({ message: 'Verifier NOT Registered!', error });
    }
});

/**
 * Logs in a verifier with the given username and password.
 * @async
 * @function
 * @param {object} req - The request body.
 * @param {string} req.body.username - The username of the verifier.
 * @param {string} req.body.password - The password of the verifier.
 * @returns {Promise} A promise that resolves with the reply from the VerifierContract.
 */
router.post('/login', async (req, res) => {
    try {
        if (
            req.body.username === undefined ||
            req.body.password === undefined
        ) {
            res.status(400).send({
                error: 'Invalid Request! Request must contain two fields',
            });
            return;
        }
        let reply = await VerifierContract.Login(
            { username: req.body.username, organization: 'verifier' },
            [req.body.username, req.body.password],
        );
        if (reply.error) {
            res.status(500).send({ error: reply.error });
            return;
        }
        const username = req.body.username;
        const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
        const token = getSessionToken(username);
        db.set(token.passwordHash, username, expiresAt);
        res.cookie('auth', token.passwordHash, {
            httpOnly: true,
            maxAge: expiresAt,
        });
        res.status(200).send({
            reply,
            message: 'Verifier Successfully Logged In.',
        });
    } catch (error) {
        res.status(500).send({ message: 'Verifier NOT Logged In!', error });
    }
});

/**
 * Reads the profile of the logged in verifier.
 * @async
 * @function
 * @param {object} req - The request body.
 * @param {string} req.body.username - The username of the verifier whose profile is to be read.
 * @returns {Promise<Object>} A promise that resolves with the reply from the VerifierContract.
 */
router.get('/readprofile', fetchuser, async (req, res) => {
    try {
        if (req.body.username === undefined) {
            res.status(400).send({
                error: 'Invalid Request! Request must contain username',
            });
            return;
        }
        let reply = await VerifierContract.ReadProfile(
            { username: req.body.username, organization: 'verifier' },
            [req.body.username],
        );
        if (reply.error) {
            res.status(500).send({ error: reply.error });
            return;
        }
        res.status(200).send({
            reply,
            message: 'Verifier Profile Successfully Read.',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Verifier Profile NOT Read!', error });
    }
});

router.get('/logout', fetchuser, async (req, res) => {
    try {
        db.remove(req.cookies.auth);
        res.clearCookie('auth');
        res.status(200).send({
            message: 'Verifier Successfully Logged Out.',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Verifier NOT Logged Out!', error });
    }
});

 // Approve a claim request.
router.post('/claim/accept', fetchuser, async (req, res) => {
    try {
        if (
            req.body.username === undefined ||
            req.body.insuredname === undefined ||
            req.body.insurername === undefined ||
            req.body.mappingid === undefined ||
            req.body.refund === undefined
        ) {
            res.status(400).send({
                error: 'Invalid Request! Request must contain mappingid, username, insuredname, insurername and refund.',
            })
            return
        }
        console.log('Request Body:', req.body);

        // Approve claim
        console.log('Approving Claim...');
        let claimApprovalResult = await ClaimContract.approveClaim(
                {username: req.body.username, organization: 'verifier'},
                [req.body.username, req.body.mappingid],
        );
        console.log('Claim Approval Result:', claimApprovalResult);

        if (claimApprovalResult.error) {
            res.status(500).send({ error: claimApprovalResult.error });
            return;
        }

        // Refund amount from the insurer
        console.log('Refunding from Insurer...');
        let insurerRefundResult = await InsurerContract.RefundClaimAmount(
            { username: req.body.username, organization: 'verifier' },
            [req.body.insurername, req.body.refund],
        );

        console.log('Insurer Refund Result:', insurerRefundResult);

        if (insurerRefundResult.error) {
            res.status(500).send({ error: insurerRefundResult.error });
            return;
        }

        // Refund amount to the user
        console.log('Refunding to User...');
        let userRefundResult = await UserContract.RefundClaimAmount(
            { username: req.body.username, organization: 'verifier' },
            [req.body.insuredname, req.body.refund],
        );

        console.log('User Refund Result:', userRefundResult);

        if (userRefundResult.error) {
            res.status(500).send({ error: userRefundResult.error });
            return;
        }

        res.status(200).send({
            claimApprovalResult,
            insurerRefundResult,
            userRefundResult,
            message: 'Claim Successfully Approved. Company balance updated. User balance updated.',
        });
    } catch (error) {
        console.log('Error:', error);
        res.status(500).send({ error: 'Claim NOT Approved!', error });
    }
});

/**
 * Reject a claim request.
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {string} req.body.username - The username of the company rejecting the claim.
 * @param {string} req.body.mappingid - The ID of the claim to be rejected.
 * @returns {Promise} A Promise that resolves with the result of the claim rejection.
 */
router.post('/claim/reject', fetchuser, async (req, res) => {
    try {
        if (
            req.body.username === undefined ||
            req.body.mappingid === undefined
        ) {
            res.status(400).send({
                error: 'Invalid Request! Request must contain mappingid',
            })
            return
        }
        let reply = await ClaimContract.rejectClaim(
            {username: req.body.username, organization: 'verifier'},
            [req.body.username, req.body.mappingid],
        )
        // check if error key exists in reply
        if (reply.error) {
            res.status(500).send({ error: reply.error })
            return
        }
        res.status(200).send({ reply, message: 'Claim Successfully Rejected.' })
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: 'Claim NOT Rejected!', error })
    }   
})

router.get('/claim/get', fetchuser, async (req, res) => {
    if (req.body.username === undefined) {
        res.status(400).send({
            error: 'Invalid Request! Request must contain username',
        })
        return
    }
    let reply = await ClaimContract.viewAllClaimRequests(
        { username: req.body.username, organization: 'verifier' },
        [req.body.username],
    )
    if (reply.error) {
        res.status(500).send({ error: reply.error })
        return
    }
    res.status(200).send({ reply, message: 'All Claim Requests Viewed Successfully.' })
})

router.get('/claim/approved', fetchuser, async (req, res) => {
    try {
        if (req.body.username === undefined) {
            res.status(400).send({
                error: 'Invalid Request! Request must contain username',
            })
            return
        }
        let reply = await ClaimContract.viewClaimedPolicies(
            {username: req.body.username, organization: 'verifier'},
            [req.body.username],
        )
        // check if error key exists in reply
        if (reply.error) {
            res.status(500).send({ error: reply.error })
            return
        }
        res.status(200).send({ reply, message: 'Claims Successfully Fetched.' })
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: 'Claims NOT Fetched!', error })
    }
})

module.exports = router;

