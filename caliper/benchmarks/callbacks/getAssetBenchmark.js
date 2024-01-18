'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

class MyWorkload extends WorkloadModuleBase {
    constructor() {
        super();
    }

    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);

        for (let i = 0; i < this.roundArguments.assets; i++) {
            const aname = `${this.workerIndex}_${i}`;
            console.log(`Worker ${this.workerIndex}: Creating asset ${aname}`);
            const request = {
                contractId: "asset_cc",
                contractFunction: 'createAsset',
                invokerIdentity: 'user1',
                contractArguments: [aname, "NFT", "500", "3", "user1"],
                readOnly: false
            };
            await this.sutAdapter.sendRequests(request);
        }
    }

    async submitTransaction() {
        const randomId = Math.floor(Math.random() * this.roundArguments.assets);
        const myArgs = {
            contractId: "asset_cc",
            contractFunction: 'queryAsset',
            invokerIdentity: 'user1',
            contractArguments: ["user1"],
            readOnly: true
        };
       let res = await this.sutAdapter.sendRequests(myArgs);
      let buf = res.status.result
      let JSONbuf = buf.toJSON()
      let bufdata = JSONbuf.data
      let bufDataString = Buffer.from(bufdata).toString('utf-8')
       console.log(JSON.parse(bufDataString));
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
