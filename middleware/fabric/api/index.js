// Import Account Functions
const EnrollAdmin = require("./enrollAdmin");
const RegisterUser = require("./registerUser");

// Import Contract Functions
const EvaluateTransaction = require("./evaluateTransaction");
const SubmitTransaction = require("./submitTransaction");

const apiBody = {
    Account: {
        EnrollAdmin,
        RegisterUser,
    },
    Contract: {
        EvaluateTransaction,
        SubmitTransaction,
    },
};

module.exports = apiBody;
