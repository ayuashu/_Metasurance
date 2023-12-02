const api = require('../../api')
module.exports = async (user, params) => {
    try {
        let reply = await api.Contract.SubmitTransaction(
            {
                name: 'policyusermapping_cc',
                channel: 'commonchannel',
                function: 'viewRequestedPolicies',
            },
            user,
            params,
        )
        if (!reply) {
            return { error: 'internal server error. Check console' }
        }
        return reply
    } catch (error) {
        console.error('Failed to access Policy.', error.message)
    }
}
