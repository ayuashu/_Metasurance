const FabricAPI = require("../../api");

module.exports = async (user, params) => {
    try {
        let reply = await FabricAPI.Contract.SubmitTransaction(
            {
                name: "patientprofile_cc",
                channel: "mainchannel",
                function: "updatePatientProfile",
            },
            user,
            params
        );

        return reply;
    } catch (error) {
        console.error("Failed to updatePatientProfile.", error.message);
    }
};
