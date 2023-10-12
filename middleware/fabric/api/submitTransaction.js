const { FileSystemWallet, Gateway } = require("fabric-network");
const path = require("path");

const SubmitTransaction = async (contract, user, params) => {
    try {
        // Load user Wallet
        const ccp = require(`../ccp/connection-${user.organization}.json`);
        const walletPath = path.join(process.cwd(), "wallets", `wallet_${user.organization}`);
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, {
            wallet,
            identity: user.username,
            discovery: { enabled: true, asLocalhost: true },
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(contract.channel);

        // Get the contract from the network.
        const Contract = network.getContract(contract.name);

        // Submit the specified transaction.
        let payload = await Contract.submitTransaction(contract.function, ...params);

        // Return payload (if any)
        if (payload) return JSON.parse(payload.toString());
        else return null;
    } catch (error) {
        console.error("Failed to Submit Transaction.", error.message);
    }
};

module.exports = SubmitTransaction;
