const FabricAPI = require("../../api");

module.exports = async (user, params) => {
    try {
        let reply = await FabricAPI.Contract.SubmitTransaction(
            {
                name: "insurer_cc",
                channel: "commonchannel",
                function: "readCompanyProfile",
            },
            user,
            params /* params is an array of email */
        );

        return reply;
    } catch (error) {
        console.error("Failed to read Insurance Company.", error.message);
    }
};