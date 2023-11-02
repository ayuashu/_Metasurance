const FabricAPI = require('../../api')

module.exports = async (user, params) => {
    try {
        let reply = await FabricAPI.Contract.SubmitTransaction(
            {
                name: 'user_cc',
                channel: 'commonchannel',
                function: 'login',
            },
            user,
            params /* params are array of email, password */,
        )

        return reply
    } catch (error) {
        console.error('Failed to log in: ', error.message)
    }
}
