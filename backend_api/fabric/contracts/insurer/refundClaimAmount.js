const FabricAPI = require('../../api')

module.exports = async (user, params) => {
    try {
        let reply = await FabricAPI.Contract.SubmitTransaction(
            {
                name: 'insurer_cc',
                channel: 'commonchannel',
                function: 'refundClaimAmount',
            },
            user,
            params 
        )

        return reply
    } catch (error) {
        console.error('Failed to refund : ', error.message)
    }
}
