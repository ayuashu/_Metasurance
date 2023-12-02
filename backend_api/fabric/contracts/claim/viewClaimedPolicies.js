const api = require("../../api");
module.exports = async (user, params) => {
    try {
        let reply = await api.Contract.SubmitTransaction(
            {
                name: "claim_cc",
                channel: "commonchannel",
                function: "viewClaimedPolicies",
            },
            user,
            params
        );
        return reply
    }
    catch (error) {
        console.error("Failed to view Claimed Policies.", error.message);
    }
}