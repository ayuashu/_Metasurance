const FabricAPI = require('../../api');

module.exports = async (user, params) => {
    try{
        let reply = await FabricAPI.Contract.SubmitTransaction(
            {
                name: 'verifier_cc',
                channel: 'commonchannel',
                function: 'readVerifierProfile',
            },
            user,
            params // [email, password]
        );
        return reply;
    } catch (error) {
        console.error('Failed to log Verifier Profile: ',error.message);
    }
}   