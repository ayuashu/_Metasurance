const api = require('../../api')
module.exports = async (user, params) => {
    try {
        let reply = await api.Contract.SubmitTransaction(
            {
                name: 'policy_cc',
                channel: 'commonchannel',
                function: 'viewAllPolicies',
            },
            user,
            params,
        )
        if (!reply) {
            return { error: 'something wrong happened' }
        }
        return reply
    } catch (error) {
        console.error('Failed to get Policies.', error.message)
    }
}
