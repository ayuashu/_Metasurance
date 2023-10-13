const FabricAPI = require("../../api");

module.exports = async (user, params) => {
    try {
        let reply = await FabricAPI.Contract.EvaluateTransaction(
            {
                name: "token_cc",
                channel: "mainchannel",
                function: "readToken",
            },
            user,
            params
        );

        return reply;
    } catch (error) {
        console.error("Failed to readToken.", error.message);
    }
};
