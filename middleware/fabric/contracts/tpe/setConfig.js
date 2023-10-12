const FabricAPI = require("../../api");

module.exports = async (user, params) => {
    try {
        let reply = await FabricAPI.Contract.SubmitTransaction(
            {
                name: "tpeconfig_cc",
                channel: "mainchannel",
                function: "setTPEConfig",
            },
            user,
            params
        );

        return reply;
    } catch (error) {
        console.error("Failed to Submit setTPEConfig.", error.message);
    }
};
