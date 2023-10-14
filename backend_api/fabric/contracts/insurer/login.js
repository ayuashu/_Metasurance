const FabricAPI = require("../../api");

module.exports = async (user, params) => {
    try {
        await FabricAPI.Account.RegisterUser({ orgName: user.organization, username: user.username })
        let reply = await FabricAPI.Contract.SubmitTransaction(
            {
                name: "insurer_cc",
                channel: "commonchannel",
                function: "login",
            },
            user,
            params /* params are array of email, password */
        );

        return reply;
    } catch (error) {
        console.error("Failed to log in: ", error.message);
    }
};