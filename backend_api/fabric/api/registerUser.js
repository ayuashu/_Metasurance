"use strict";

const { FileSystemWallet, Gateway, X509WalletMixin } = require("fabric-network");
const path = require("path");

const RegisterUser = async (user) => {
    try {
        // Load the Connection Profile
        const ccp = require(`../ccp/connection-${user.orgName}.json`);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), "wallets", `wallet_${user.orgName}`);
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, { wallet, identity: "admin", discovery: { enabled: true, asLocalhost: true } });

        // Get the CA client object from the gateway for interacting with the CA.
        const ca = gateway.getClient().getCertificateAuthority();
        const adminIdentity = gateway.getCurrentIdentity();

        // Register the user, enroll the user, and import the new identity into the wallet.
        const secret = await ca.register(
            { affiliation: user.affiliation, enrollmentID: user.username, role: "client" },
            adminIdentity
        );
        const enrollment = await ca.enroll({ enrollmentID: user.username, enrollmentSecret: secret });
        const userIdentity = X509WalletMixin.createIdentity(
            ccp.organizations[user.orgName].mspid,
            enrollment.certificate,
            enrollment.key.toBytes()
        );
        await wallet.import(user.username, userIdentity);
        console.log(`Added user <${user.username}>`);
        return {
            success: true,
            message: `Successfully registered and enrolled user <${user.username}> and imported it into the wallet`,
        };
    } catch (error) {
        console.error(`Failed to register user <${user.username}>: ${error}`);
        return { success: false, message: `Failed to enroll user <${user.username}>: ${error.message}` };
    }
};

module.exports = RegisterUser;
