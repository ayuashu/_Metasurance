const api = require("../../api");

module.exports = async (user, params) => {
    try {
        let reply = await api.Contract.SubmitTransaction(
            {
                name: "asset_cc",
                channel: "commonchannel",
                function: "checkAssetBelongsToUser",
            },
            user,
            params
        );
        return reply
    }
    catch (error) {
        console.error("Failed to check Asset.", error.message);
    }
}