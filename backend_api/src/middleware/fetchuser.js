const db = require('../utils/db')

/**
 * Middleware function to fetch the user from the cookie and set it on the request object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {Object} - Returns the response object with an error message if the user is not logged in or the session has expired.
 */
const fetchuser = async (req, res, next) => {
    const cookie = req.cookies['auth']
    // console.log(JSON.stringify(cookie))
    db.show()
    if (!cookie) {
        return res.status(401).send({ error: 'You are required to log in' })
    }
    if (db.get(cookie) == null)
        return res.status(401).send({ error: 'you are required to log in' })
    const { username, expiry } = db.get(cookie)
    if (!username) {
        return res.status(401).send({ error: 'You are required to log in' })
    }
    if (expiry < Date.now()) {
        return res.status(401).send({ error: 'Your session has expired' })
    }
    req.body.username = username
    next()
}

module.exports = fetchuser
