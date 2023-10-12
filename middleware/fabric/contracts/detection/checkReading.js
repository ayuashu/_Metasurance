const FabricAPI = require("../../api");

module.exports = async (user, params) => {
    try {
        let reply = await FabricAPI.Contract.EvaluateTransaction(
            {
                name: "emergencydetection_cc",
                channel: "mainchannel",
                function: "checkReading",
            },
            user,
            params
        );

        return reply;
    } catch (error) {
        console.error("Failed to Evaluate checkReading.", error.message);
    }
};
