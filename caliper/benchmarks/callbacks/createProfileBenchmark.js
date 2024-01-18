'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

class MyWorkload extends WorkloadModuleBase {
    constructor() {
        super();
    }

    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);

        for (let i = 0; i < this.roundArguments.times; i++) {
            const uname = `${this.workerIndex}_${i}`;
            console.log(`Worker ${this.workerIndex}: Creating user ${uname}`);
            const request = {
                contractId: "user_cc",
                contractFunction: 'register',
                invokerIdentity: 'user1',
                contractArguments: [uname, "user1", "user@email.com", "1234567890", "1234"],
                readOnly: false
            };

            await this.sutAdapter.sendRequests(request);
        }
    }

    async submitTransaction() {
        const randomId = Math.floor(Math.random() * this.roundArguments.times);
        const myArgs = {
            contractId: "user_cc",
            contractFunction: 'readUserProfile',
            invokerIdentity: 'user1',
            contractArguments: [`${this.workerIndex}_${randomId}`],
            readOnly: true
        };

        await this.sutAdapter.sendRequests(myArgs);
    }

    async cleanupWorkloadModule() {
        for (let i = 0; i < this.roundArguments.times; i++) {
            const assetID = `${this.workerIndex}_${i}`;
            console.log(`Worker ${this.workerIndex}: Checking user ${assetID}`);
            const request = {
                contractId: "user_cc",
                contractFunction: 'checkUserExists',
                invokerIdentity: 'user1',
                contractArguments: [assetID],
                readOnly: false
            };
            await this.sutAdapter.sendRequests(request);
        }
    }
}

function createWorkloadModule() {
    return new MyWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;
