const FabricAPI = require('../../api');

module.exports = async (user, params) => {
    try {
        const response = await FabricAPI.Account.RegisterUser({ orgName: user.organization, username: user.username })
        if (!response.success) {
            return {
                error: "Failed to register user. Username is not unique"
            }
        }
        let reply = await FabricAPI.Contract.SubmitTransaction(
            {
                name: 'verifier_cc',
                channel: 'commonchannel',
                function: 'register',
            },
            user,
            params // [email, password]
        );
        return reply;
    } catch (error) {
        console.error('Failed to register the Verifier.', error.message);
    }
}