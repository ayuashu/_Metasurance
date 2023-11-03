// mocks a database containing a mapping of cookies to usernames
const database = {}

// create functions for interacting with the database
/**
 * A simple database object with get, set, and remove methods.
 * @namespace db
 */
const db = {
    /**
     * Get the value of a cookie from the database.
     * @memberof db
     * @function
     * @param {string} cookie - The name of the cookie to retrieve.
     * @returns {Object} The value of the cookie.
     */
    get: (cookie) => {
        return database[cookie]
    },
    /**
     * Set the value of a cookie in the database.
     * @memberof db
     * @function
     * @param {string} cookie - The name of the cookie to set.
     * @param {string} username - The username associated with the cookie.
     * @param {number} expiry - The expiration time of the cookie in seconds.
     */
    set: (cookie, username, expiry) => {
        database[cookie] = { username, expiresin: expiry }
    },
    /**
     * Remove a cookie from the database.
     * @memberof db
     * @function
     * @param {string} cookie - The name of the cookie to remove.
     */
    remove: (cookie) => {
        delete database[cookie]
    },

    show: () => {
        console.log('database is:')
        console.log(JSON.stringify(database))
    },
}

// export the database functions
module.exports = db
