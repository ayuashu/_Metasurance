'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

class MyWorkload extends WorkloadModuleBase {
    constructor() {
        super();
        this.assetids = []
        this.policyids = []
        this.mappingdis = []
    }
    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);

        for (let i = 0; i < this.roundArguments.issues; i++) {
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

        for (let i = 0; i < this.roundArguments.issues; i++) {
            const pname = `${this.workerIndex}_${i}`;
            console.log(`Worker ${this.workerIndex}: Creating policy ${pname}`);
            const request = {
                contractId: "policy_cc",
                contractFunction: 'postPolicy',
                invokerIdentity: 'user1',
                contractArguments: [pname, "1200", "5", "NFT", "LIC", "3"],
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
              this.policyids.push(dataJSON.uniqueID)
            }
        }

        for(let i=0; i<this.roundArguments.issues; i++) {
            const request = {
                contractId: "policyusermapping_cc",
                contractFunction: 'requestPolicy',
                invokerIdentity: 'user1',
                contractArguments: ['user1', this.policyids[i], this.assetids[i]],
                readOnly: false
            };
            await this.sutAdapter.sendRequests(request);
        }

        const request = {
            contractId: "policyusermapping_cc",
            contractFunction: 'viewRequestedPolicies',
            invokerIdentity: 'user1',
            contractArguments: ["user1"],
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
          for(let i=0; i<dataJSON.policies.length; i++) {
            this.mappingdis.push(dataJSON.policies[i].mappingid)
          }
        }
    }

    async submitTransaction() {
        let randomId = Math.floor(Math.random() * this.mappingdis.length);
        const myArgs = {
            contractId: "policyusermapping_cc",
            contractFunction: 'payPremium',
            invokerIdentity: 'user1',
            contractArguments: ["user1", this.mappingdis[randomId]],
            readOnly: false
        };
       await this.sutAdapter.sendRequests(myArgs);
    }

    // async cleanupWorkloadModule() {
    //     for (let i = 0; i < this.assetids.length; i++) {
    //         console.log(`Worker ${this.workerIndex}: deleting asset id ${this.assetids[i]}`);
    //         const request = {
    //             contractId: "asset_cc",
    //             contractFunction: 'deleteAsset',
    //             invokerIdentity: 'user1',
    //             contractArguments: ["user1", this.assetids[i]],
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
