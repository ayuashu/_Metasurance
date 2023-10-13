"use strict";

const FabricCAServices = require("fabric-ca-client");
const { FileSystemWallet, X509WalletMixin } = require("fabric-network");
const path = require("path");

const EnrollAdmin = async (organization) => {
    try {
        // Load Connection Profile
        const ccp = require(`../ccp/connection-${organization.name}.json`);

        // Create a new CA client for interacting with the CA.
        const caInfo = ccp.certificateAuthorities[organization.ca];
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: [], verify: false }, caInfo.caName);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), "wallets", `wallet_${organization.name}`);
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists("admin");
        if (adminExists) {
            console.log('An identity for the admin user "admin" already exists in the wallet.');
            return;
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({ enrollmentID: "admin", enrollmentSecret: "adminpw" });
        const identity = X509WalletMixin.createIdentity(
            organization.msp,
            enrollment.certificate,
            enrollment.key.toBytes()
        );
        await wallet.import("admin", identity);
        console.log('Successfully enrolled admin user "admin" and imported it into the wallet.');
    } catch (error) {
        console.error(`Failed to enroll admin user "admin": ${error.message}`);
    }
};

module.exports = EnrollAdmin;
