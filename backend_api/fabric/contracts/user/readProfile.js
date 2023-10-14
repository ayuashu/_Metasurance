const FabricAPI = require("../../api");

module.exports = async (user, params) => {
    try {
        let reply = await FabricAPI.Contract.SubmitTransaction(
            {
                name: "user_cc",
                channel: "commonchannel",
                function: "readUserProfile",
            },
            user,
            params /* params is an array of email */
        );

        return reply;
    } catch (error) {
        console.error("Failed to read User profile.", error.message);
    }
};