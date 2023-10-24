const api = require("../../api");

module.exports = async (user, params) => {
    try {
        let reply = await api.Contract.SubmitTransaction(
            {
                name: "asset_cc",
                channel: "commonchannel",
                function: "queryAsset",
            },
            user,
            params
        );
        console.log(reply)
        return reply
    }
    catch (error) {
        console.error("Failed to query Asset.", error.message);
    }
}