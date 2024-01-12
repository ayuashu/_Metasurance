"use strict";

module.exports.info = "Create user profiles";

const contractID = "user_cc";
const version = "1.8";

let bc, ctx, clientArgs, clientIdx;

module.exports.init = async function (blockchain, context, args) {
    bc = blockchain;
    ctx = context;
    clientArgs = args;
    clientIdx = context.clientIdx.toString();
};

module.exports.run = async function () {
    for (let i = 0; i < clientArgs.assets; i++) {
        try {
            const uname = `PP_${clientIdx}_${i}_${Date.now()}`;
            // console.log(`Client ${clientIdx}: Creating PatientProfile ${assetID}`);
            const myArgs = {
                chaincodeFunction: "register",
                invokerIdentity: "Admin@user.metasurance.com",
                chaincodeArguments: [uname, "user1", "user@email.com", "1234567890", "1234"],
            };
            return await bc.bcObj.invokeSmartContract(ctx, contractID, version, myArgs);
        } catch (error) {
            console.log(`Client ${clientIdx}: Smart Contract threw with error: ${error}`);
        }
    }
};

module.exports.end = async function () { };