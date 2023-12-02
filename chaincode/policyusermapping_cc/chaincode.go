// chaincode for asset contract
package main

import (
	"encoding/json"

	"github.com/google/uuid"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

type PolicyMap struct {
	Mappingid    string `json:"mappingid"`
	Policyid     string `json:"policyid"`
	Assetid      string `json:"assetid"`
	Premiumspaid int    `json:"premiumspaid"`
	Claimed      bool   `json:"claimed"`
}

type PolicyList struct {
	Policies []PolicyMap `json:"policies"`
}

type InvokeResponse struct {
	Status bool `json:"status"`
}

type Chaincode struct {
}

func (ac *Chaincode) Init(stub shim.ChaincodeStubInterface) peer.Response {
	return shim.Success(nil)
}

func (ac *Chaincode) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
	fn, args := stub.GetFunctionAndParameters()
	if fn == "requestPolicy" {
		return ac.requestPolicy(stub, args)
	} else if fn == "payPremium" {
		return ac.payPremium(stub, args)
	} else if fn == "viewRequestedPolicies" {
		return ac.viewRequestedPolicies(stub, args)
	} else if fn == "viewMappingById" {
		return ac.viewMappingById(stub, args)
	}
	return shim.Error("{\"error\":\"Invalid function name. Expecting 'requestPolicy', 'payPremium', 'viewRequestedPolicies'}")
}

// args: [username, Policyid, Assetid]
func (ac *Chaincode) requestPolicy(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 3 {
		return shim.Success([]byte("{\"error\": \"Incorrect number of arguments. Expecting 3\"}"))
	}
	var policyMap = PolicyMap{Mappingid: uuid.New().String(), Policyid: args[1], Assetid: args[2], Premiumspaid: 0, Claimed: false}
	policyList, err := stub.GetState(args[0]) // username
	if err != nil {
		return shim.Success([]byte("{\"error\": \"Failed to get existing user policies: " + err.Error() + "\"}"))
	} else if policyList != nil {
		var policyContract PolicyList
		json.Unmarshal(policyList, &policyContract)
		policyContract.Policies = append(policyContract.Policies, policyMap)
		policyList, _ = json.Marshal(policyContract)
	} else {
		var policyContract PolicyList
		policyContract.Policies = append(policyContract.Policies, policyMap)
		policyList, _ = json.Marshal(policyContract)
	}
	err = stub.PutState(args[0], policyList)
	if err != nil {
		return shim.Success([]byte("{\"error\": \"Failed to put state: " + err.Error() + "\"}"))
	}
	return shim.Success([]byte("{\"success\": \"Policy created successfully for asset " + args[2] + "\", \"uniqueid\":\"" + policyMap.Mappingid + "\"}"))
}

// args: [username, mappingid]
// TODO: create a token system for users which can be used to pay premium, then do below task
// TODO: check if premium amount equals the sent amount(add sent amount in args)
func (ac *Chaincode) payPremium(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 2 {
		return shim.Success([]byte("{\"error\": \"Incorrect number of arguments. Expecting 2\"}"))
	}
	policyList, err := stub.GetState(args[0]) // username
	if err != nil {
		return shim.Success([]byte("{\"error\": \"Failed to get existing user policies: " + err.Error() + "\"}"))
	} else if policyList == nil {
		return shim.Success([]byte("{\"error\": \"No policies found for user " + args[0] + "\"}"))
	}
	var policyContract PolicyList
	json.Unmarshal(policyList, &policyContract)
	for i := 0; i < len(policyContract.Policies); i++ {
		if policyContract.Policies[i].Mappingid == args[1] {
			policyContract.Policies[i].Premiumspaid++
			policyList, _ = json.Marshal(policyContract)
			err = stub.PutState(args[0], policyList)
			if err != nil {
				return shim.Success([]byte("{\"error\": \"Failed to put state: " + err.Error() + "\"}"))
			}
			return shim.Success([]byte("{\"success\": \"Premium paid successfully for policy " + args[1] + "\"}"))
		}
	}
	return shim.Success([]byte("{\"error\": \"No policies found for user " + args[0] + "\"}"))
}

// //args: [username, mappingid]
// func (ac *Chaincode) claimPolicy(stub shim.ChaincodeStubInterface, args []string) peer.Response{
// 	if len(args) != 2 {
// 		return shim.Success([]byte("\"error\": \"Incorrect number of arguments. Expecting 2\""))
// 	}
// 	policyList, err := stub.GetState(args[0])
// 	if err != nil {
// 		return shim.Success([]byte("{\"error\": \"Failed to get existing user policies: " + err.Error() + "\"}"))
// 	}else if policyList == nil{
// 		return shim.Success([]byte("{\"error\": \"No policies found for user " + args[0] + "\"}"))
// 	}
// 	var policyContract PolicyList
// 	json.Unmarshal(policyList, &policyContract)
// 	for i := 0; i < len(policyContract.Policies); i++ {
// 		if policyContract.Policies[i].Mappingid == args[1] {
// 			if policyContract.Policies[i].Claimed {
// 				return shim.Success([]byte("\"error\": \"Policy is already claimed\""))
// 			}
// 			// check if all premiums are paid
// 			// callargs := util.ToChaincodeArgs("checkAllPremiumsPaid", args[0], policyContract.Policies[i].Policyid, strconv.Itoa(policyContract.Policies[i].Premiumspaid))
// 			// response := stub.InvokeChaincode("policy_cc", callargs, "commonchannel")
// 			// var invokeRes InvokeResponse
// 			// err := json.Unmarshal(response.GetPayload(), &invokeRes)
// 			// if err != nil {
// 			// 	return shim.Error(err.Error())
// 			// }
// 			// if(!invokeRes.Status){
// 			// 	return shim.Success([]byte("\"error\": \"All premiums are not paid\""))
// 			// }
// 			policyContract.Policies[i].Claimed = true
// 			policyList, _ = json.Marshal(policyContract)
// 			err = stub.PutState(args[0], policyList)
// 			if err != nil {
// 				return shim.Success([]byte("{\"error\": \"Failed to put state: " + err.Error() + "\"}"))
// 			}
// 			return shim.Success([]byte("{\"success\": \"Claim succeeded for policy request: " + args[1] + "\"}"))
// 		}
// 	}
// 	return shim.Success([]byte("{\"error\": \"No policies found for user " + args[0] + "\"}"))
// }

// args: [username]
func (ac *Chaincode) viewRequestedPolicies(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 1 {
		return shim.Success([]byte("{\"error\": \"Incorrect number of arguments. Expecting 1: username\"}"))
	}
	policyList, err := stub.GetState(args[0])
	if err != nil {
		return shim.Success([]byte("{\"error\": \"Failed to get existing user policies: " + err.Error() + "\"}"))
	} else if policyList != nil {
		return shim.Success(policyList)
	} else {
		return shim.Success([]byte("{\"message\": \"No policies found for user " + args[0] + "\"}"))
	}
}

// args: [username, mappingid]
func (ac *Chaincode) viewMappingById(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 2 {
		return shim.Success([]byte("{\"error\": \"Incorrect number of arguments. Expecting 2: username, mappingid\"}"))
	}
	policyList, err := stub.GetState(args[0])
	if err != nil {
		return shim.Success([]byte("{\"error\": \"Failed to get existing user policies: " + err.Error() + "\"}"))
	} else if policyList != nil {
		var policyContract PolicyList
		json.Unmarshal(policyList, &policyContract)
		for i := 0; i < len(policyContract.Policies); i++ {
			if policyContract.Policies[i].Mappingid == args[1] {
				policyList, _ = json.Marshal(policyContract.Policies[i])
				return shim.Success(policyList)
			}
		}
		return shim.Success([]byte("{\"error\": \"No policies found for user " + args[0] + "\"}"))
	} else {
		return shim.Success([]byte("{\"error\": \"No policies found for user " + args[0] + "\"}"))
	}
}
