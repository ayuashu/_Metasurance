const api = require("../../api");
module.exports = async (user, params) => {
    try {
        let reply = await api.Contract.SubmitTransaction(
            {
                name: "policyusermapping_cc",
                channel: "commonchannel",
                function: "requestPolicy",
            },
            user,
            params
        );
        return reply
    }
    catch (error) {
        console.error("Failed to request Policy.", error.message);
    }
}