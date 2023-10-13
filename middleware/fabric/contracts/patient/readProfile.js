const FabricAPI = require("../../api");

module.exports = async (user, params) => {
    try {
        let reply = await FabricAPI.Contract.EvaluateTransaction(
            {
                name: "patientprofile_cc",
                channel: "mainchannel",
                function: "readPatientProfile",
            },
            user,
            params
        );

        return reply;
    } catch (error) {
        console.error("Failed to readPatientProfile.", error.message);
    }
};
