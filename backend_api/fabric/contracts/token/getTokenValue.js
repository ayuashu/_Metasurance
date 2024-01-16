const FabricAPI =  require('../../api');

module.exports = async (user, params) => {
    try{
        let reply = await FabricAPI.Contract.SubmitTransaction(
            {
                name: 'token_cc',
                channel: 'commonchannel',
                function: 'getTokenValue',
            },
            user,
            params // [email, password]
        );
        return reply;
    } catch (error) {
        console.error('Failed to get Token Value: ',error.message);
    }
}