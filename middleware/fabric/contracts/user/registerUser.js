const FabricAPI = require("../../api");

module.exports = async (user, params) => {
    try {
        let reply = await FabricAPI.Contract.SubmitTransaction(
            {
                name: "user_cc",
                channel: "commonchannel",
                function: "register",
            },
            user,
            params /* params are array of name, email, phone, password */
        );

        return reply;
    } catch (error) {
        console.error("Failed to register User.", error.message);
    }
};