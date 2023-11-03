// chaincode for asset contract
package main

import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/google/uuid"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

type PCList struct{
	PolicyCompanies []PolicyCompany `json:"policyCompanies"`
}

type PolicyCompany struct {
	CompanyName string   `json:"companyName"`
	Policies    []Policy `json:"policies"`
}

type Policy struct {
	PolicyID       string `json:"policyid"`
	PolicyName     string `json:"policyname"`
	CompanyName    string `json:"companyname"`
	PremiumAmount  string `json:"premiumamount"`
	InsuranceCover string `json:"insurancecover"`
	InsuranceType  string `json:"insurancetype"`
}

type Chaincode struct {
}

func (ac *Chaincode) Init(stub shim.ChaincodeStubInterface) peer.Response {
	return shim.Success(nil)
}

func (ac *Chaincode) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
	fn, args := stub.GetFunctionAndParameters()
	if fn == "postPolicy" {
		return ac.postPolicy(stub, args)
	} else if fn == "viewAllPolicies" {
		return ac.viewAllPolicies(stub, args)
	} else if fn == "deletePolicy" {
		return ac.deletePolicy(stub, args)
	}  else if fn == "checkAllPremiumsPaid" {
		return ac.checkAllPremiumsPaid(stub, args)
	} else if fn == "getAllPolicies" {
		return ac.getAllPolicies(stub)
	} else if fn == "getPolicyByID" {
		return ac.getPolicyByID(stub, args)
	}
	return shim.Error("{\"error\":\"Invalid function name. Expecting 'createAsset', 'queryAsset', or 'queryAllAssets'\"}")
}

// args: [policyname, premiumamount, insurancecover, insurancetype, companyname]
func (ac *Chaincode) postPolicy(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 5 {
		return shim.Success([]byte("{\"error\": \"Incorrect number of arguments. Expecting 5\"}"))
	}
	var policy = Policy{PolicyID: uuid.New().String(), PolicyName: args[0], PremiumAmount: args[1], InsuranceCover: args[2], InsuranceType: args[3], CompanyName: args[4]}
	policyList, err := stub.GetState("policies")
	if err != nil {
		return shim.Success([]byte("{\"error\": \"Failed to get existing policies: " + err.Error() + "\"}"))
	} else if policyList != nil {
		var policyContract PCList
		json.Unmarshal(policyList, &policyContract)
		// print policycontract struct
		fmt.Println("Before insertion: ")
		fmt.Println(policyContract)
		for i, policyCompany := range policyContract.PolicyCompanies {
			if policyCompany.CompanyName == args[4] {
				fmt.Println("Company match found")
				fmt.Println(policyCompany)
				policyContract.PolicyCompanies[i].Policies = append(policyCompany.Policies, policy)
				fmt.Println("After insertion: ")
				fmt.Println(policyContract)
				policyList, _ = json.Marshal(policyContract)
				stub.PutState("policies", policyList)
				return shim.Success([]byte("{\"uniqueID\":\"" + policy.PolicyID + "\"}"))
			}
		}
		// if company not found but other policies exist
		policyContract.PolicyCompanies = append(policyContract.PolicyCompanies, PolicyCompany{CompanyName: args[4], Policies: []Policy{policy}})
		policyList, _ = json.Marshal(policyContract)
		stub.PutState("policies", policyList)
		return shim.Success([]byte("{\"uniqueID\":\"" + policy.PolicyID + "\"}"))
	} else {
		var policyContract PCList
		policyContract.PolicyCompanies = append(policyContract.PolicyCompanies, PolicyCompany{CompanyName: args[4], Policies: []Policy{policy}})
		policyList, _ = json.Marshal(policyContract)
		stub.PutState("policies", policyList)
		return shim.Success([]byte("{\"uniqueID\":\"" + policy.PolicyID + "\"}"))
	}
}

// args: [companyname]
func (ac *Chaincode) viewAllPolicies(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 1 {
		return shim.Success([]byte("{\"error\": \"Incorrect number of arguments. Expecting 1: companyname\"}"))
	}
	policyList, err := stub.GetState("policies")
	if err != nil {
		return shim.Success([]byte("{\"error\": \"Failed to get existing policies: " + err.Error() + "\"}"))
	} else if policyList != nil {
		var policyContract PCList
		json.Unmarshal(policyList, &policyContract)
		for _, policyCompany := range policyContract.PolicyCompanies {
			if policyCompany.CompanyName == args[0] {
				policyList, _ = json.Marshal(policyCompany.Policies)
				return shim.Success(policyList)
			}
		}
		return shim.Success([]byte("{\"error\": \"No policies found for company " + args[0] + "\"}"))
	} else {
		return shim.Success([]byte("{\"error\": \"No policies found for company " + args[0] + "\"}"))
	}
}

// args: [username, policyid]
func (ac *Chaincode) deletePolicy(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 2 {
		return shim.Success([]byte("{\"error\": \"Incorrect number of arguments. Expecting 2: companyname, policyid\"}"))
	}
	policyMap, err := stub.GetState(args[0])
	if err != nil {
		return shim.Success([]byte("{\"error\": \"Failed to get existing company policies: " + err.Error() + "\"}"))
	} else if policyMap != nil {
		var policyContract PCList
		json.Unmarshal(policyMap, &policyContract)
		for i, policy := range policyContract.PolicyCompanies {
			if policy.CompanyName == args[0] {
				for j, policy := range policy.Policies {
					if policy.PolicyID == args[1] {
						policyContract.PolicyCompanies[i].Policies = append(policyContract.PolicyCompanies[i].Policies[:j], policyContract.PolicyCompanies[i].Policies[j+1:]...)
						policyMap, _ = json.Marshal(policyContract)
						stub.PutState(args[0], policyMap)
						return shim.Success([]byte("{\"success\": \"Policy deleted successfully for company " + args[0] + "\"}"))
					}
				}
				return shim.Success([]byte("{\"error\": \"No policies found for company " + args[0] + "\"}"))
			}
		}
		return shim.Success([]byte("{\"error\": \"No policies found for company " + args[0] + "\"}"))
	} else {
		return shim.Success([]byte("{\"error\": \"No policies found for company " + args[0] + "\"}"))
	}
}

// args: [policyid, premiumsPaid]
func (ac *Chaincode) checkAllPremiumsPaid(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 2 {
		return shim.Success([]byte("{\"error\": \"Need two arguments: policyid and premiumsPaid\"}"))
	}
	policyList, err := stub.GetState("policies")
	if err != nil {
		return shim.Success([]byte("{\"error\": \"Failed to get existing policies: " + err.Error() + "\"}"))
	}
	var policyContract PCList
	json.Unmarshal(policyList, &policyContract)
	for _, policyCompany := range policyContract.PolicyCompanies {
		for _, policy := range policyCompany.Policies {
			if policy.PolicyID == args[0] {
				premiumsPaid, _ := strconv.Atoi(args[1])
				premiumsReqd, _ := strconv.Atoi(policy.InsuranceCover)
				if premiumsPaid >= premiumsReqd {
					return shim.Success([]byte("{\"status\": \"true\"}"))
				}
				return shim.Success([]byte("{\"status\": \"false\"}"))
			}
		}
	}
	return shim.Success([]byte("{\"error\": \"No policies found for policyid " + args[0] + "\"}"))
}

// get all policies
func (ac *Chaincode) getAllPolicies(stub shim.ChaincodeStubInterface) peer.Response {
	policyList, err := stub.GetState("policies")
	if err != nil {
		return shim.Success([]byte("{\"error\": \"Failed to get existing policies: " + err.Error() + "\"}"))
	}
	return shim.Success(policyList)
}

// get policy by id
// args: [policyid]
func (ac *Chaincode) getPolicyByID(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 1 {
		return shim.Success([]byte("{\"error\": \"Need one argument: policyid\"}"))
	}
	policyList, err := stub.GetState("policies")
	if err != nil {
		return shim.Success([]byte("{\"error\": \"Failed to get existing policies: " + err.Error() + "\"}"))
	}
	var policyContract PCList
	json.Unmarshal(policyList, &policyContract)
	for _, policyCompany := range policyContract.PolicyCompanies {
		for _, policy := range policyCompany.Policies {
			if policy.PolicyID == args[0] {
				policyList, _ = json.Marshal(policy)
				return shim.Success(policyList)
			}
		}
	}
	return shim.Success([]byte("{\"error\": \"No policies found for policyid " + args[0] + "\"}"))
}

// TODO: complete fucntion definition
// func (ac *Chaincode) checkPolicyExist(stub shim.ChaincodeStubInterface, args []string) peer.Response{
// }
