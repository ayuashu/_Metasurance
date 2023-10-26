// generate a session token from username
var crypto = require('crypto');

/**
 * Generates a random string of specified length using crypto module.
 * @param {number} length - The length of the random string to be generated.
 * @returns {string} - The generated random string.
 */
var genRandomString = function (length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
};

/**
 * Generates a SHA512 hash of the given password using the provided salt.
 * @param {string} password - The password to hash.
 * @param {string} salt - The salt to use for hashing.
 * @returns {Object} An object containing the salt and the hashed password.
 */
var sha512 = function (password, salt) {
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
};

// Takes a username string and returns a unique session token
/**
 * Generates a session token for the given username using SHA512 encryption.
 * @param {string} username - The username for which the session token is to be generated.
 * @returns {string} - The generated session token.
 */
const getSessionToken = (username) => {
    var salt = genRandomString(16);
    var sessionToken = sha512(username, salt);
    return sessionToken;
}

module.exports = getSessionToken;