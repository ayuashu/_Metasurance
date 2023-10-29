const api = require("../../api");
module.exports = async (user, params) => {
    try {
        let reply = await api.Contract.SubmitTransaction(
            {
                name: "policyusermapping_cc",
                channel: "commonchannel",
                function: "claimPolicy",
            },
            user,
            params
        );
        return reply
    }
    catch (error) {
        console.error("Failed to claim Policy.", error.message);
    }
}