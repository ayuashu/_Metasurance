// chaincode for token contract
package main

import (
	"encoding/json"
	"fmt"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

type Token struct {
	Value string `json:"value"`
}

type Chaincode struct{}

func (ac *Chaincode) Init(stub shim.ChaincodeStubInterface) peer.Response {
	return shim.Success(nil)
}

func (ac *Chaincode) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
	fn, args := stub.GetFunctionAndParameters()
	if fn == "getTokenValue" {
		return ac.getTokenValue(stub, args)
	}
	return shim.Error("{\"error\":\"Invalid function name. Expecting 'getTokenValue'\"}")
}

func (ac *Chaincode) getTokenValue(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	// Create a new Token instance with the specified value
	token := Token{
		Value: "100",
	}

	// Convert the token to JSON format
	tokenJSON, err := json.Marshal(token)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to marshal token: %s", err))
	}

	// Save the token to the ledger
	err = stub.PutState("your_fixed_token_key", tokenJSON)
	if err != nil {
		return shim.Error(fmt.Sprintf("Failed to update state: %s", err))
	}

	return shim.Success(tokenJSON)
}
