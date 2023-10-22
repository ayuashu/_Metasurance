const api = require("../../api");

module.exports = async (user, params) => {
    try{
        let reply = await api.Contract.SubmitTransaction(
            {
                name: "asset_cc",
                channel: "commonchannel",
                function: "createAsset",
            },
            user,
            params
        );
        return reply
    }
    catch(error){
        console.error("Failed to create Asset.", error.message);
    }
}