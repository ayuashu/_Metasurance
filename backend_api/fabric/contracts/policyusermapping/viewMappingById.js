const api = require("../../api");
module.exports = async (user, params) => {
    try {
        let reply = await api.Contract.SubmitTransaction(
            {
                name: "policyusermapping_cc",
                channel: "commonchannel",
                function: "viewMappingById",
            },
            user,
            params
        );
        return reply
    }
    catch (error) {
        console.error("Failed to view Policy mapping by id.", error.message);
    }
}