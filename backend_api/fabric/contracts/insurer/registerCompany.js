const FabricAPI = require("../../api");

module.exports = async (user, params) => {
    try {
        const response = await FabricAPI.Account.RegisterUser({ orgName: user.organization, username: user.username })
        if(!response.success){
            return {
                error: "Failed to register user. Username is not unique"
            }
        }
        let reply = await FabricAPI.Contract.SubmitTransaction(
            {
                name: "insurer_cc",
                channel: "commonchannel",
                function: "register",
            },
            user,
            params /* params are array of name, email, phone, password */
        );

        return reply;
    } catch (error) {
        console.error("Failed to register Insurance Company.", error.message);
    }
};