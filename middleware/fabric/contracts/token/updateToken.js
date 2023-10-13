const FabricAPI = require("../../api");

module.exports = async (user, params) => {
    try {
        let reply = await FabricAPI.Contract.SubmitTransaction(
            {
                name: "token_cc",
                channel: "mainchannel",
                function: "updateToken",
            },
            user,
            params
        );

        return reply;
    } catch (error) {
        console.error("Failed to updateToken.", error.message);
    }
};
