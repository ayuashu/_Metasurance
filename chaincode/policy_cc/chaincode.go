// chaincode for asset contract
package main

import (
	"encoding/json"
	"fmt"

	"github.com/google/uuid"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

type PolicyContract struct{
	CompanyName string `json:"companyName"`
	Policies []Policy `json:"policies"`
}

type Policy struct{
	PolicyID string `json:"policyid"`
	PolicyName string `json:"policyname"`
	CompanyName string `json:"companyname"`
	PremiumAmount string `json:"premiumamount"`
	InsuranceCover string `json:"insurancecover"`
	InsuranceType string `json:"insurancetype"`
}

type Chaincode struct{
}

func (ac *Chaincode) Init(stub shim.ChaincodeStubInterface) peer.Response{
	return shim.Success(nil)
}

func (ac *Chaincode) Invoke(stub shim.ChaincodeStubInterface) peer.Response{
	fn, args := stub.GetFunctionAndParameters()
	if fn == "postPolicy"{
		return ac.postPolicy(stub, args)
	}else if fn == "viewAllPolicies"{
		return ac.viewAllPolicies(stub, args)
	}else if fn == "deletePolicy"{
		return ac.deletePolicy(stub, args)
	}
	return shim.Error("{\"error\":\"Invalid function name. Expecting 'createAsset', 'queryAsset', or 'queryAllAssets'\"}")
}

// args: [policyname, companyname, premiumamount, insurancecover, insurancetype]
func (ac *Chaincode) postPolicy(stub shim.ChaincodeStubInterface, args []string) peer.Response{
	if len(args) != 5{
		return shim.Success([]byte("{\"error\": \"Incorrect number of arguments. Expecting 5\"}"))
	}
	var policy = Policy{PolicyID: uuid.New().String(), PolicyName: args[0], CompanyName: args[1], PremiumAmount: args[2], InsuranceCover: args[3], InsuranceType: args[4]}
	policyMap, err := stub.GetState(args[1]) // companyname
	if err != nil{
		return shim.Success([]byte("{\"error\": \"Failed to get existing company policies: " + err.Error() + "\"}"))
	}else if policyMap != nil{
		var policyContract PolicyContract
		json.Unmarshal(policyMap, &policyContract)
		policyContract.Policies = append(policyContract.Policies, policy)
		policyMap, _ = json.Marshal(policyContract)
	}else{
		var policyContract PolicyContract
		policyContract.CompanyName = args[1]
		policyContract.Policies = append(policyContract.Policies, policy)
		policyMap, _ = json.Marshal(policyContract)
	}
	stub.PutState(args[1], policyMap)
	fmt.Print("policy created: ")
	fmt.Print(policyMap)
	fmt.Print("for company " + args[1])
	return shim.Success([]byte("{\"uniqueID\":\""+policy.PolicyID+"\"}"))
}

// args: [companyname]
func (ac *Chaincode) viewAllPolicies(stub shim.ChaincodeStubInterface, args []string) peer.Response{
	if len(args) != 1{
		return shim.Success([]byte("{\"error\": \"Incorrect number of arguments. Expecting 1: companyname\"}"))
	}
	policyMap, err := stub.GetState(args[0])
	if err != nil{
		return shim.Success([]byte("{\"error\": \"Failed to get existing company policies: " + err.Error() + "\"}"))
	}else if policyMap != nil{
		return shim.Success(policyMap)
	}else{
		return shim.Success([]byte("{\"error\": \"No policies found for company " + args[0] + "\"}"))
	}
}

// args: [username, policyid]
func (ac *Chaincode) deletePolicy(stub shim.ChaincodeStubInterface, args []string) peer.Response{
	if len(args) != 2{
		return shim.Success([]byte("{\"error\": \"Incorrect number of arguments. Expecting 2: companyname, policyid\"}"))
	}
	policyMap, err := stub.GetState(args[0])
	if err != nil{
		return shim.Success([]byte("{\"error\": \"Failed to get existing company policies: " + err.Error() + "\"}"))
	}else if policyMap != nil{
		var policyContract PolicyContract
		json.Unmarshal(policyMap, &policyContract)
		for i, policy := range policyContract.Policies{
			if policy.PolicyID == args[1]{
				policyContract.Policies = append(policyContract.Policies[:i], policyContract.Policies[i+1:]...)
				policyMap, _ = json.Marshal(policyContract)
				stub.PutState(args[0], policyMap)
				return shim.Success([]byte("{\"success\": \"Policy deleted successfully\"}"))
			}
		}
		return shim.Success([]byte("{\"error\": \"Policy not found\"}"))
	}else{
		return shim.Success([]byte("{\"error\": \"No policies found for company " + args[0] + "\"}"))
	}
}
// TODO: complete fucntion definition
// func (ac *Chaincode) checkPolicyExist(stub shim.ChaincodeStubInterface, args []string) peer.Response{
// }
