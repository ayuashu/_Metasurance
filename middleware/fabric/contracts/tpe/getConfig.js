const FabricAPI = require("../../api");

module.exports = async (user, params) => {
    try {
        let reply = await FabricAPI.Contract.EvaluateTransaction(
            {
                name: "tpeconfig_cc",
                channel: "mainchannel",
                function: "readTPEConfig",
            },
            user,
            params
        );

        return reply;
    } catch (error) {
        console.error("Failed to Evaluate readTPEConfig.", error.message);
    }
};
