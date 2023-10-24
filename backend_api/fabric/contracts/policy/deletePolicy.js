const api = require("../../api");
module.exports = async (user, params) => {
    try {
        let reply = await api.Contract.SubmitTransaction(
            {
                name: "policy_cc",
                channel: "commonchannel",
                function: "deletePolicy",
            },
            user,
            params
        );
        return reply
    }
    catch (error) {
        console.error("Failed to delete Policy.", error.message);
    }
}