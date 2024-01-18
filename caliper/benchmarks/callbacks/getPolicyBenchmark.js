'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

class MyWorkload extends WorkloadModuleBase {
    constructor() {
        super();
    }

    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);

        for (let i = 0; i < this.roundArguments.policies; i++) {
            const pname = `${this.workerIndex}_${i}`;
            console.log(`Worker ${this.workerIndex}: Creating policy ${pname}`);
            const request = {
                contractId: "policy_cc",
                contractFunction: 'postPolicy',
                invokerIdentity: 'user1',
                contractArguments: [pname, "1200", "5", "NFT", "LIC", "3"],
                readOnly: false
            };

            await this.sutAdapter.sendRequests(request);
        }
    }

    async submitTransaction() {
        const randomId = Math.floor(Math.random() * this.roundArguments.policies);
        const myArgs = {
            contractId: "policy_cc",
            contractFunction: 'getAllPolicies',
            invokerIdentity: 'user1',
            contractArguments: [],
            readOnly: true
        };

        await this.sutAdapter.sendRequests(myArgs);
    }

    // async cleanupWorkloadModule() {
    //     for (let i = 0; i < this.roundArguments.policies; i++) {
    //         const pname = `${this.workerIndex}_${i}`;
    //         console.log(`Worker ${this.workerIndex}: Getting policy ${pname}`);
    //         const request = {
    //             contractId: "policy_cc",
    //             contractFunction: 'viewAllPolices',
    //             invokerIdentity: 'user1',
    //             contractArguments: [assetID],
    //             readOnly: false
    //         };
    //         await this.sutAdapter.sendRequests(request);
    //     }
    // }
}

function createWorkloadModule() {
    return new MyWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
