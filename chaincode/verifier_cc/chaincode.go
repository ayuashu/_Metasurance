package main

import (
	"encoding/json"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

type Verifier struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Phone    string `json:"phone"`
	Password string `json:"password"`
	Username string `json:"username"`
}

type Chaincode struct{}

func (t *Chaincode) Init(stub shim.ChaincodeStubInterface) peer.Response {
	return shim.Success(nil)
}

func (t *Chaincode) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
	function, args := stub.GetFunctionAndParameters()

	if function == "register" {
		return t.register(stub, args)
	} else if function == "readVerifierProfile" {
		return t.readVerifierProfile(stub, args)
	} else if function == "checkVerifierExists" {
		return t.checkVerifierExists(stub, args)
	} else if function == "login" {
		return t.login(stub, args)
	}

	return shim.Success([]byte("{\"error\":\"Invalid function name. Expecting 'register', 'readVerifierProfile', 'checkVerifierExists', or 'login'\"}"))
}

func (t *Chaincode) register(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 5 {
		return shim.Success([]byte("{\"error\":\"Incorrect number of arguments. Expecting 5: username, name, email, phone, password\"}"))
	}

	username := args[0]
	name := args[1]
	email := args[2]
	phone := args[3]
	password := args[4]

	user := Verifier{
		Name:     name,
		Email:    email,
		Phone:    phone,
		Password: password,
		Username: username,
	}

	userJSON, err := json.Marshal(user)
	if err != nil {
		return shim.Success([]byte("{\"error\":\"Error converting user data to JSON\"}"))
	}

	err = stub.PutState(username, userJSON)
	if err != nil {
		return shim.Success([]byte("{\"error\":\"Failed to register verifier\"}"))
	}

	return shim.Success(userJSON)
}

func (t *Chaincode) readVerifierProfile(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 1 {
		return shim.Success([]byte("{\"error\":\"Incorrect number of arguments. Expecting 1: username\"}"))
	}

	username := args[0]

	userJSON, err := stub.GetState(username)
	if err != nil {
		return shim.Success([]byte("{\"error\":\"Failed to get verifier profile\"}"))
	}

	if userJSON == nil {
		return shim.Success([]byte("{\"error\":\"Verifier not found\"}"))
	}

	return shim.Success(userJSON)
}

func (t *Chaincode) checkVerifierExists(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 1 {
		return shim.Success([]byte("{\"error\":\"Incorrect number of arguments. Expecting 1: email\"}"))
	}
	email := args[0]

	verifierJSON, err := stub.GetState(email)
	if err != nil {
		return shim.Success([]byte("{\"error\":\"Failed to check user\"}"))
	}
	var verifier Verifier
	err = json.Unmarshal(verifierJSON, &verifier)
	if err != nil {
		return shim.Success([]byte("{\"error\":\"Error unmarshaling verifier data\"}"))
	}
	if verifier.Email != "" {
		return shim.Success([]byte("{\"exists\":\"true\"}"))
	}
	return shim.Success([]byte("{\"exists\":\"false\"}"))
}

func (t *Chaincode) login(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 2 {
		return shim.Success([]byte("{\"error\":\"Incorrect number of arguments. Expecting 2: username, password\"}"))
	}

	username := args[0]
	password := args[1]

	verifierJSON, err := stub.GetState(username)
	if err != nil {
		return shim.Success([]byte("{\"error\":\"Failed to check verifier\"}"))
	}

	if verifierJSON == nil {
		return shim.Success([]byte("{\"error\":\"Verifier not found\"}"))
	}

	var verifier Verifier
	err = json.Unmarshal(verifierJSON, &verifier)
	if err != nil {
		return shim.Success([]byte("{\"error\":\"Error unmarshaling verifier data\"}"))
	}

	if verifier.Password != password {
		return shim.Success([]byte("{\"error\":\"Wrong/invalid credentials\"}"))
	}

	verifierBytes, err := json.Marshal(verifier)
	if err != nil {
		return shim.Success([]byte("{\"error\":\"Error marshaling verifier data\"}"))
	}

	return shim.Success(verifierBytes)
}
