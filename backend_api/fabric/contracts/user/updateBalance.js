const FabricAPI = require('../../api')

module.exports = async (user, params) => {
    try {
        let reply = await FabricAPI.Contract.SubmitTransaction(
            {
                name: 'user_cc',
                channel: 'commonchannel',
                function: 'updateBalance',
            },
            user,
            params 
        )

        return reply
    } catch (error) {
        console.error('Failed to update balance: ', error.message)
    }
}
