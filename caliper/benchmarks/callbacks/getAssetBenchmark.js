'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

class MyWorkload extends WorkloadModuleBase {
    constructor() {
        super();
        this.assetids = []
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
            let res = await this.sutAdapter.sendRequests(request);
            let buf = res.status.result
            if(typeof buf.toJSON === 'function') {
              let JSONbuf = buf.toJSON()
              let bufdata = JSONbuf.data
              let bufDataString = Buffer.from(bufdata).toString('utf-8')
              let dataJSON = JSON.parse(bufDataString)
              // console.log(dataJSON)
              this.assetids.push(dataJSON.assetID)
            }
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
       await this.sutAdapter.sendRequests(myArgs);
    }

    async cleanupWorkloadModule() {
        for (let i = 0; i < this.assetids.length; i++) {
            console.log(`Worker ${this.workerIndex}: deleting asset id ${this.assetids[i]}`);
            const request = {
                contractId: "asset_cc",
                contractFunction: 'deleteAsset',
                invokerIdentity: 'user1',
                contractArguments: ["user1", this.assetids[i]],
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
