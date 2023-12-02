package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

type ClaimMap struct {
	Claims []Claim `json:"claims"`
}

type Claim struct {
	Username     string   `json:"username"`
	Mappingid    string   `json:"mappingid"`
	Policyid     string   `json:"policyid"`
	Assetid      string   `json:"assetid"`
	Premiumspaid string   `json:"premiumspaid"`
	Claimed      string   `json:"claimed"`
	ClaimCause   string   `json:"claimcause"`
	DocsLinked   []string `json:"docslinked"`
	VerifiedBy   string   `json:"verifiedby"`
}

type Chaincode struct {
}

func (cc *Chaincode) Init(stub shim.ChaincodeStubInterface) peer.Response {
	return shim.Success(nil)
}

func (cc *Chaincode) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
	fn, args := stub.GetFunctionAndParameters()
	if fn == "claimPolicy" {
		return cc.claimPolicy(stub, args)
	} else if fn == "approveClaim" {
		return cc.approveClaim(stub, args)
	} else if fn == "rejectClaim" {
		return cc.rejectClaim(stub, args)
	} else if fn == "viewClaimedPolicies" {
		return cc.viewClaimedPolicies(stub, args)
	} else if fn == "viewAllClaimRequests" {
		return cc.viewAllClaimRequests(stub)
	}
	return shim.Error("{\"error\":\"Invalid function name. Expecting 'claimPolicy', 'viewClaimedPolicies' or 'viewAllClaimRequests'\"}")
}

// args: [username, mappingid, policyid, assetid, premiumspaid, claimcause, docslinked]
func (cc *Chaincode) claimPolicy(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 7 {
		return shim.Error("{\"error\": \"Incorrect number of arguments. Expecting 7\"}")
	}

	// Assuming DocsLinked is an array of strings
	var docslinked []string
	err := json.Unmarshal([]byte(args[6]), &docslinked)
	if err != nil {
		return shim.Error("{\"error\": \"Failed to unmarshal docslinked array: " + err.Error() + "\"}")
	}

	var claim = Claim{
		Username:     args[0],
		Mappingid:    args[1],
		Policyid:     args[2],
		Assetid:      args[3],
		Premiumspaid: args[4],
		Claimed:      "Requested",
		ClaimCause:   args[5],
		DocsLinked:   docslinked,
		VerifiedBy:   "",
	}

	claimList, err := stub.GetState("allClaims")
	if err != nil {
		return shim.Success([]byte("{\"error\": \"Failed to get existing claims: " + err.Error() + "\"}"))
	} else if claimList != nil {
		var claimmap ClaimMap
		json.Unmarshal(claimList, &claimmap)
		// print claimmap struct
		fmt.Println("Before insertion")
		fmt.Println(claimmap)
		claimmap.Claims = append(claimmap.Claims, claim)
		claimList, _ = json.Marshal(claimmap)
		stub.PutState("allClaims", claimList)
		return shim.Success([]byte("{\"success\": \"Claim policy registered with mapping ID: " + args[1] + "\"}"))
	} else {
		var claimmap ClaimMap
		claimmap.Claims = append(claimmap.Claims, claim)
		claimList, _ = json.Marshal(claimmap)
		stub.PutState("allClaims", claimList)
		return shim.Success([]byte("{\"success\": \"Claim policy registered with mapping ID: " + args[1] + "\"}"))
	}
}

// args: [username, mappingid]
func (cc *Chaincode) approveClaim(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 2 {
		return shim.Error("{\"error\": \"Incorrect number of arguments. Expecting 2: username and mappingid\"}")
	}

	// Fetch all claims
	claimList, err := stub.GetState("allClaims")
	if err != nil {
		return shim.Error("Failed to get all claims: " + err.Error())
	}

	if claimList != nil {
		var claimmap ClaimMap
		if err := json.Unmarshal(claimList, &claimmap); err != nil {
			return shim.Error("Failed to unmarshal claims: " + err.Error())
		}

		found := false
		for i := 0; i < len(claimmap.Claims); i++ {
			if claimmap.Claims[i].Mappingid == args[1] {
				claimmap.Claims[i].Claimed = "Approved"
				claimmap.Claims[i].VerifiedBy = args[0]
				claimList, err = json.Marshal(claimmap)
				if err != nil {
					return shim.Error("Failed to marshal claims: " + err.Error())
				}

				if err := stub.PutState("allClaims", claimList); err != nil {
					return shim.Error("Failed to update claims on the ledger: " + err.Error())
				}

				found = true
				break
			}
		}

		if !found {
			return shim.Error("{\"error\": \"Claim with mapping ID " + args[1] + " not found\"}")
		}
	}

	return shim.Success([]byte("{\"success\": \"Claim approved for mapping ID: " + args[1] + "\"}"))
}

// args: [username, mappingid]
func (cc *Chaincode) rejectClaim(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 2 {
		return shim.Error("{\"error\": \"Incorrect number of arguments. Expecting 2: username and mappingid\"}")
	}

	// Fetch all claims
	claimList, err := stub.GetState("allClaims")
	if err != nil {
		return shim.Error("Failed to get all claims: " + err.Error())
	}

	if claimList != nil {
		var claimmap ClaimMap
		if err := json.Unmarshal(claimList, &claimmap); err != nil {
			return shim.Error("Failed to unmarshal claims: " + err.Error())
		}

		found := false
		for i := 0; i < len(claimmap.Claims); i++ {
			if claimmap.Claims[i].Mappingid == args[1] {
				claimmap.Claims[i].Claimed = "Rejected"
				claimmap.Claims[i].VerifiedBy = args[0]
				claimList, err = json.Marshal(claimmap)
				if err != nil {
					return shim.Error("Failed to marshal claims: " + err.Error())
				}

				if err := stub.PutState("allClaims", claimList); err != nil {
					return shim.Error("Failed to update claims on the ledger: " + err.Error())
				}

				found = true
				break
			}
		}

		if !found {
			return shim.Error("{\"error\": \"Claim with mapping ID " + args[1] + " not found\"}")
		}
	}

	return shim.Success([]byte("{\"success\": \"Claim rejected for mapping ID: " + args[1] + "\"}"))
}

// args: [username]
func (cc *Chaincode) viewClaimedPolicies(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	// Check if the correct number of arguments is provided
	if len(args) != 1 {
		return shim.Error("{\"error\": \"Incorrect number of arguments. Expecting 1: username\"}")
	}

	// Fetch all claims from the ledger
	allClaimsBytes, err := stub.GetState("allClaims")
	if err != nil {
		return shim.Error("Failed to get all claims: " + err.Error())
	}

	// Check if allClaimsBytes is nil (no data found)
	if allClaimsBytes == nil {
		fmt.Println("No claims found")
		return shim.Success([]byte("{\"message\": \"No claims found\"}"))
	}

	// Unmarshal the JSON data into the allClaims struct
	var allClaims ClaimMap
	if err := json.Unmarshal(allClaimsBytes, &allClaims); err != nil {
		return shim.Error("Failed to unmarshal all claims: " + err.Error())
	}

	// Filter policies where Claimed is "Approved" or "Rejected" and VerifiedBy matches the provided username
	filteredClaims := make([]Claim, 0)
	for _, claim := range allClaims.Claims {
		if (claim.Claimed == "Approved" || claim.Claimed == "Rejected") && claim.VerifiedBy == args[0] {
			filteredClaims = append(filteredClaims, claim)
		}
	}

	// Marshal the filtered claims into JSON format
	filteredClaimsBytes, err := json.Marshal(filteredClaims)
	if err != nil {
		return shim.Error("Failed to marshal filtered claims: " + err.Error())
	}

	// Return the filtered claims as the successful response
	return shim.Success(filteredClaimsBytes)
}

// get all claim requests
func (cc *Chaincode) viewAllClaimRequests(stub shim.ChaincodeStubInterface) peer.Response {
	claimList, err := stub.GetState("allClaims")
	if err != nil {
		return shim.Success([]byte("{\"error\": \"Failed to get existing claims: " + err.Error() + "\"}"))
	}
	return shim.Success(claimList)
}

// package main

// import (
// 	"encoding/json"
// 	"strconv"

// 	"github.com/hyperledger/fabric/core/chaincode/shim"
// 	"github.com/hyperledger/fabric/protos/peer"
// )

// type PolicyMap struct {
// 	Mappingid    string   `json:"mappingid"`
// 	Policyid     string   `json:"policyid"`
// 	Assetid      string   `json:"assetid"`
// 	Premiumspaid int      `json:"premiumspaid"`
// 	Claimed      bool     `json:"claimed"`
// 	Documents    []string `json:"documents"`
// }

// type PolicyList struct {
// 	Policies []PolicyMap `json:"policies"`
// }

// type Chaincode struct {
// }

// func (cc *Chaincode) Init(stub shim.ChaincodeStubInterface) peer.Response {
// 	return shim.Success(nil)
// }

// func (cc *Chaincode) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
// 	fn, args := stub.GetFunctionAndParameters()
// 	if fn == "claimPolicy" {
// 		return cc.claimPolicy(stub, args)
// 	} else if fn == "viewClaimedPolicies" {
// 		return cc.viewClaimedPolicies(stub, args)
// 	} else if fn == "viewClaimDetails" {
// 		return cc.viewClaimDetails(stub, args)
// 	} else if fn == "viewAllClaimRequests" {
// 		return cc.viewAllClaimRequests(stub, args)
// 	}
// 	return shim.Error("{\"error\":\"Invalid function name. Expecting 'claimPolicy', 'viewClaimedPolicies', 'viewClaimDetails', or 'viewAllClaimRequests'\"}")
// }

// // args: [username, mappingid, policyid, assetid, premiumspaid, document1, document2, ...]
// func (cc *Chaincode) claimPolicy(stub shim.ChaincodeStubInterface, args []string) peer.Response {
// 	if len(args) < 6 {
// 		return shim.Success([]byte("{\"error\": \"Incorrect number of arguments. Expecting at least 6\"}"))
// 	}

// 	// Get the policy list for the user
// 	policyListBytes, err := stub.GetState(args[0])
// 	if err != nil {
// 		return shim.Error("Failed to get existing user policies: " + err.Error())
// 	} else if policyListBytes == nil {
// 		return shim.Success([]byte("{\"error\": \"No policies found for user " + args[0] + "\"}"))
// 	}

// 	// Unmarshal the policy list
// 	var policyContract PolicyList
// 	err = json.Unmarshal(policyListBytes, &policyContract)
// 	if err != nil {
// 		return shim.Error("Failed to unmarshal policy list: " + err.Error())
// 	}

// 	// Find the policy with the specified mapping ID
// 	for i := 0; i < len(policyContract.Policies); i++ {
// 		if policyContract.Policies[i].Mappingid == args[1] {
// 			// Check if the policy has been claimed
// 			if policyContract.Policies[i].Claimed {
// 				return shim.Success([]byte("{\"error\": \"Policy is already claimed\"}"))
// 			}

// 			// Perform additional checks if needed (e.g., premium payment)

// 			// Update the policy fields
// 			policyContract.Policies[i].Policyid = args[2]
// 			policyContract.Policies[i].Assetid = args[3]
// 			policyContract.Policies[i].Premiumspaid, err = strconv.Atoi(args[4])
// 			if err != nil {
// 				return shim.Error("Failed to convert Premiumspaid to integer: " + err.Error())
// 			}
// 			policyContract.Policies[i].Claimed = true
// 			policyContract.Policies[i].Documents = args[5:]

// 			// Update the policy list in the state
// 			policyListBytes, err = json.Marshal(policyContract)
// 			if err != nil {
// 				return shim.Error("Failed to marshal updated policy list: " + err.Error())
// 			}
// 			err = stub.PutState(args[0], policyListBytes)
// 			if err != nil {
// 				return shim.Error("Failed to put state: " + err.Error())
// 			}

// 			return shim.Success([]byte("{\"success\": \"Claim succeeded for policy request: " + args[1] + "\"}"))
// 		}
// 	}

// 	return shim.Success([]byte("{\"error\": \"No policies found for user " + args[0] + "\"}"))
// }

// // args: [username, mappingid]
// func (cc *Chaincode) viewClaimDetails(stub shim.ChaincodeStubInterface, args []string) peer.Response {
// 	if len(args) != 2 {
// 		return shim.Success([]byte("{\"error\": \"Incorrect number of arguments. Expecting 2: username and mappingid\"}"))
// 	}

// 	// Get the policy list for the user
// 	policyListBytes, err := stub.GetState(args[0])
// 	if err != nil {
// 		return shim.Error("Failed to get existing user policies: " + err.Error())
// 	} else if policyListBytes != nil {
// 		// Unmarshal the policy list and find the requested policy
// 		var policyContract PolicyList
// 		err = json.Unmarshal(policyListBytes, &policyContract)
// 		if err != nil {
// 			return shim.Error("Failed to unmarshal policy list: " + err.Error())
// 		}

// 		// Find the policy with the specified mapping ID
// 		for _, policy := range policyContract.Policies {
// 			if policy.Mappingid == args[1] && policy.Claimed {
// 				policyBytes, err := json.Marshal(policy)
// 				if err != nil {
// 					return shim.Error("Failed to marshal claimed policy: " + err.Error())
// 				}

// 				return shim.Success(policyBytes)
// 			}
// 		}

// 		return shim.Success([]byte("{\"error\": \"No claimed policy found for user " + args[0] + " with mapping ID " + args[1] + "\"}"))
// 	} else {
// 		return shim.Success([]byte("{\"message\": \"No policies found for user " + args[0] + "\"}"))
// 	}
// }

// // args: [username]
// func (cc *Chaincode) viewClaimedPolicies(stub shim.ChaincodeStubInterface, args []string) peer.Response {
// 	if len(args) != 1 {
// 		return shim.Success([]byte("{\"error\": \"Incorrect number of arguments. Expecting 1: username\"}"))
// 	}

// 	// Get the policy list for the user
// 	policyListBytes, err := stub.GetState(args[0])
// 	if err != nil {
// 		return shim.Error("Failed to get existing user policies: " + err.Error())
// 	} else if policyListBytes != nil {
// 		// Unmarshal the policy list and filter claimed policies
// 		var policyContract PolicyList
// 		err = json.Unmarshal(policyListBytes, &policyContract)
// 		if err != nil {
// 			return shim.Error("Failed to unmarshal policy list: " + err.Error())
// 		}

// 		// Filter claimed policies
// 		var claimedPolicies []PolicyMap
// 		for _, policy := range policyContract.Policies {
// 			if policy.Claimed {
// 				claimedPolicies = append(claimedPolicies, policy)
// 			}
// 		}

// 		claimedPoliciesBytes, err := json.Marshal(claimedPolicies)
// 		if err != nil {
// 			return shim.Error("Failed to marshal claimed policies: " + err.Error())
// 		}

// 		return shim.Success(claimedPoliciesBytes)
// 	} else {
// 		return shim.Success([]byte("{\"message\": \"No policies found for user " + args[0] + "\"}"))
// 	}
// }

// // args: []
// func (cc *Chaincode) viewAllClaimRequests(stub shim.ChaincodeStubInterface, args []string) peer.Response {
// 	if len(args) != 0 {
// 		return shim.Error("{\"error\": \"Incorrect number of arguments. Expecting 0\"}")
// 	}

// 	// Get all policies
// 	allPoliciesBytes, err := stub.GetState("allPolicies")
// 	if err != nil {
// 		return shim.Error("Failed to get all policies: " + err.Error())
// 	} else if allPoliciesBytes == nil {
// 		return shim.Success([]byte("{\"message\": \"No policies found\"}"))
// 	}

// 	// Unmarshal all policies
// 	var allPolicies PolicyList
// 	err = json.Unmarshal(allPoliciesBytes, &allPolicies)
// 	if err != nil {
// 		return shim.Error("Failed to unmarshal all policies: " + err.Error())
// 	}

// 	// Filter claimed policies
// 	var claimedPolicies []PolicyMap
// 	for _, policy := range allPolicies.Policies {
// 		if policy.Claimed {
// 			claimedPolicies = append(claimedPolicies, policy)
// 		}
// 	}

// 	claimedPoliciesBytes, err := json.Marshal(claimedPolicies)
// 	if err != nil {
// 		return shim.Error("Failed to marshal claimed policies: " + err.Error())
// 	}

// 	return shim.Success(claimedPoliciesBytes)
// }
