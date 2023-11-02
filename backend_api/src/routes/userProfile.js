const express = require('express')
const fetchuser = require('../middleware/fetchuser')
const UserContract = require('../../fabric/contracts/user')
const AssetContract = require('../../fabric/contracts/asset')
const PolicyContract = require('../../fabric/contracts/policy')
const PolicyMapping = require('../../fabric/contracts/policyusermapping')
const db = require('../utils/db')
const getSessionToken = require('../utils/getSessionToken')

const router = new express.Router()

/**
 * Registers a user with the given information.
 * @async
 * @function
 * @param {string} req.body.username - The username of the user.
 * @param {string} req.body.name - The name of the user.
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.phone - The phone number of the user.
 * @param {string} req.body.password - The password of the user.
 * @returns {Promise<Object>} The response object.
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
            })
            return
        }
        const username = req.body.username
        const expiresAt = Date.now() + 24 * 60 * 60 * 1000
        let reply = await UserContract.RegisterUser(
            { username, organization: 'user' },
            [
                req.body.username,
                req.body.name,
                req.body.email,
                req.body.phone,
                req.body.password,
            ],
        )
        if (reply.error) {
            res.status(500).send({ error: reply.error })
            return
        }
        const token = getSessionToken(username)
        db.set(token, username, expiresAt)
        res.cookie('auth', token, { httpOnly: true, maxAge: expiresAt })
        res.status(200).send({
            reply,
            message: 'User Successfully Registered.',
        })
    } catch (error) {
        res.status(500).send({ error })
    }
})

/**
 * Logs in a user with the provided username and password.
 * @async
 * @function
 * @param {string} req.body.username - The username of the user to log in.
 * @param {string} req.body.password - The password of the user to log in.
 * @returns {Promise} A promise that resolves with the login response.
 */
router.post('/login', async (req, res) => {
    try {
        if (
            req.body.username === undefined ||
            req.body.password === undefined
        ) {
            res.status(400).send({
                error: 'Invalid Request! Request must contain two fields',
            })
            return
        }
        let reply = await UserContract.Login(
            { username: req.body.username, organization: 'user' },
            [req.body.username, req.body.password],
        )
        if (reply.error) {
            res.status(500).send({ error: reply.error })
            return
        }
        const username = req.body.username
        const expiresAt = Date.now() + 24 * 60 * 60 * 1000
        const token = getSessionToken(username)
        db.remove(req.cookies.auth)
        db.set(token, username, expiresAt)
        res.cookie('auth', token, { httpOnly: true, maxAge: expiresAt })
        res.status(200).send({ reply, message: 'User Successfully Logged In.' })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'User NOT Logged In!', error })
    }
})

/**
 * Reads the user profile from the blockchain.
 * @async
 * @function
 * @param {string} req.body.username - The username of the user whose profile is to be read.
 * @returns {Promise<Object>} The profile of the user.
 */
router.get('/readprofile', fetchuser, async (req, res) => {
    try {
        if (req.body.username === undefined) {
            res.status(400).send({
                error: 'Invalid Request! Request must contain username',
            })
            return
        }
        let reply = await UserContract.ReadProfile(
            { username: req.body.username, organization: 'user' },
            [req.body.username],
        )
        if (reply.error) {
            res.status(500).send({ error: reply.error })
            return
        }
        res.status(200).send({
            reply,
            message: 'User Profile Successfully Read.',
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'User Profile NOT Read!', error })
    }
})

router.get('/logout', fetchuser, async (req, res) => {
    try {
        db.remove(req.cookies.auth)
        res.clearCookie('auth')
        res.status(200).send({ message: 'User Successfully Logged Out.' })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'User NOT Logged Out!', error })
    }
})

/**
 * Creates a new asset using the AssetContract.CreateAsset method.
 * @async
 * @function
 * @param {string} req.body.username - The username of the user creating the asset.
 * @param {string} req.body.assetName - The name of the asset.
 * @param {string} req.body.assetType - The type of the asset.
 * @param {number} req.body.value - The value of the asset.
 * @param {number} req.body.age - The age of the asset.
 * @returns {Promise} A promise that resolves with the result of the CreateAsset method.
 */
router.post('/asset/add', fetchuser, async (req, res) => {
    try {
        if (
            req.body.username === undefined ||
            req.body.assetName === undefined ||
            req.body.assetType === undefined ||
            req.body.value === undefined ||
            req.body.age === undefined
        ) {
            res.status(400).send({
                error: 'Invalid Request! Request must contain five fields',
            })
            return
        }
        // TODO: check if user requesting exists or not
        let reply = await AssetContract.CreateAsset(
            { username: req.body.username, organization: 'user' },
            [
                req.body.assetName,
                req.body.assetType,
                req.body.value,
                req.body.age,
                req.body.username,
            ],
        )
        if (reply.error) {
            res.status(500).send({ error: reply.error })
            return
        }
        res.status(200).send({ reply, message: 'Asset Successfully Added.' })
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: 'Asset NOT Added!', error })
    }
})

/**
 * Deletes an asset from the blockchain.
 * @async
 * @function
 * @param {string} req.body.username - The username of the user who owns the asset.
 * @param {string} req.body.assetid - The ID of the asset to be deleted.
 * @returns {Promise} A promise that resolves with the result of the delete operation.
 */
router.delete('/asset/delete', fetchuser, async (req, res) => {
    try {
        if (req.body.username === undefined || req.body.assetid === undefined) {
            res.status(400).send({
                error: 'Invalid Request! Request must contain assetid',
            })
            return
        }
        // TODO: check if asset belongs to user
        let reply = await AssetContract.DeleteAsset(
            { username: req.body.username, organization: 'user' },
            [req.body.username, req.body.assetid],
        )
        if (reply.error) {
            res.status(500).send({ error: reply.error })
            return
        }
        res.status(200).send({ reply, message: 'Asset Successfully Deleted.' })
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: 'Asset NOT Deleted!', error })
    }
})

/**
 * Queries an asset from the AssetContract using the provided username and organization.
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {string} req.body.username - The username to query the asset for.
 * @returns {Promise<Object>} - The asset object returned by the AssetContract.
 */
router.get('/asset/get', fetchuser, async (req, res) => {
    try {
        let reply = await AssetContract.QueryAsset(
            { username: req.body.username, organization: 'user' },
            [req.body.username],
        )
        if (reply.error) {
            res.status(500).send({ error: reply.error })
            return
        }
        res.status(200).send({ reply, message: 'Asset Successfully Queried.' })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Unable to query asset!', error })
    }
})

// policy mapping endpoints
router.post('/policy/request', fetchuser, async (req, res) => {
    if (
        req.body.username === undefined ||
        req.body.policyid === undefined ||
        req.body.assetid === undefined
    ) {
        res.status(400).send({
            error: 'Invalid Request! Request must contain username, policyid and assetid',
        })
        return
    }
    try {
        // check if asset belongs to user
        let result = await AssetContract.CheckUserOwnAsset(
            { username: req.body.username, organization: 'user' },
            [req.body.username, req.body.assetid],
        )
        if (result.error) {
            res.status(500).send({ error: res.error })
            return
        }
        if (result.status === 'false') {
            res.status(500).send({ error: 'Asset does not belong to user!' })
            return
        }
        let reply = await PolicyMapping.RequestPolicy(
            { username: req.body.username, organization: 'user' },
            [req.body.username, req.body.policyid, req.body.assetid],
        )
        if (reply.error) {
            res.status(500).send({ error: reply.error })
            return
        }
        res.status(200).send({
            reply,
            message: 'Policy Requested Successfully.',
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Unable to request policy!', error })
    }
})

router.get('/policy/view', fetchuser, async (req, res) => {
    if (req.body.username === undefined || req.body.companyname === undefined) {
        res.status(400).send({
            error: 'Invalid Request! Request must contain username',
        })
        return
    }
    try {
        let reply = await PolicyMapping.ViewRequestedPolicies(
            { username: req.body.username, organization: 'user' },
            [req.body.companyname],
        )
        if (reply.error) {
            res.status(500).send({ error: reply.error })
            return
        }
        res.status(200).send({ reply, message: 'Policy Viewed Successfully.' })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Unable to view policy!', error })
    }
})

router.post('/policy/paypremium', fetchuser, async (req, res) => {
    if (req.body.username === undefined || req.body.mappingid === undefined) {
        res.status(400).send({
            error: 'Invalid Request! Request must contain username and mappingid',
        })
        return
    }
    try {
        let reply = await PolicyMapping.PayPremium(
            { username: req.body.username, organization: 'user' },
            [req.body.username, req.body.mappingid],
        )
        if (reply.error) {
            res.status(500).send({ error: reply.error })
            return
        }
        res.status(200).send({ reply, message: 'Premium Paid Successfully.' })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Unable to pay premium!', error })
    }
})

router.post('/policy/claim', fetchuser, async (req, res) => {
    if (req.body.username === undefined || req.body.mappingid === undefined) {
        res.status(400).send({
            error: 'Invalid Request! Request must contain username and mappingid',
        })
        return
    }
    try {
        // check if user paid all premiums
        // for that, get mapping details
        let mapping = await PolicyMapping.ViewMappingById(
            { username: req.body.username, organization: 'user' },
            [req.body.username, req.body.mappingid],
        )
        if (mapping.error) {
            res.status(500).send({ error: mapping.error })
            return
        }
        // NOTE: the policy details in PolicyContract are stored against the username of insurance company, but we try to access as a user. So
        // we are unable to find the policydetails.
        let result = await PolicyContract.CheckAllPremiumsPaid(
            { username: req.body.username, organization: 'user' },
            [mapping.policyid, mapping.premiumspaid.toString()],
        )
        if (result.error) {
            res.status(500).send({ error: result.error })
            return
        }
        if (result.status === 'false') {
            res.status(500).send({ error: 'All premiums not paid!' })
            return
        }
        let reply = await PolicyMapping.ClaimPolicy(
            { username: req.body.username, organization: 'user' },
            [req.body.username, req.body.mappingid],
        )
        if (reply.error) {
            res.status(500).send({ error: reply.error })
            return
        }
        res.status(200).send({ reply, message: 'Claim Successful.' })
    } catch (error) {
        console.log(error)
        res.status(500).send({ message: 'Unable to claim!', error })
    }
})

router.get('/policy/viewall', fetchuser, async (req, res) => {
    if (req.body.username === undefined) {
        res.status(400).send({
            error: 'Invalid Request! Request must contain username',
        })
        return
    }
    let reply = await PolicyContract.GetAllPolicies(
        { username: req.body.username, organization: 'user' },
        [],
    )
    if (reply.error) {
        res.status(500).send({ error: reply.error })
        return
    }
    res.status(200).send({
        reply,
        message: 'All Policies Viewed Successfully.',
    })
})

module.exports = router
