package main

import (
	"encoding/json"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

type Company struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Phone    string `json:"phone"`
	Password string `json:"password"`
	Username string `json:"username"`
}

type Chaincode struct {
}

func (t *Chaincode) Init(stub shim.ChaincodeStubInterface) peer.Response {
	return shim.Success(nil)
}

func (t *Chaincode) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
	function, args := stub.GetFunctionAndParameters()

	if function == "register" {
		return t.register(stub, args)
	} else if function == "readCompanyProfile" {
		return t.readCompanyProfile(stub, args)
	} else if function == "checkCompanyExists" {
		return t.checkCompanyExists(stub, args)
	} else if function == "login" {
		return t.login(stub, args)
	}

	return shim.Success([]byte("{\"error\":\"Invalid function name. Expecting 'register', 'login', 'readCompanyProfile', or 'checkCompanyExists'\"}"))
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

	user := Company{
		Name:     name,
		Email:    email,
		Phone:    phone,
		Password: password,
		Username: username,
	}

	userJSON, err := json.Marshal(user)
	if err != nil {
		return shim.Success([]byte("{\"error\":\"Error converting company data to JSON\"}"))
	}

	err = stub.PutState(username, userJSON)
	if err != nil {
		return shim.Success([]byte("{\"error\":\"Failed to register company\"}"))
	}

	return shim.Success(userJSON)
}

func (t *Chaincode) readCompanyProfile(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 1 {
		return shim.Success([]byte("{\"error\":\"Incorrect number of arguments. Expecting 1: username\"}"))
	}

	username := args[0]

	userJSON, err := stub.GetState(username)
	if err != nil {
		return shim.Success([]byte("{\"error\":\"Failed to get company profile\"}"))
	}

	if userJSON == nil {
		return shim.Success([]byte("{\"error\":\"Company not found\"}"))
	}

	return shim.Success(userJSON)
}

//TODO: Check if it works
func (t *Chaincode) checkCompanyExists(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 1 {
		return shim.Success([]byte("{\"error\":\"Incorrect number of arguments. Expecting 1: email\"}"))
	}
	email := args[0]

	companyJSON, err := stub.GetState(email)
	if err != nil {
		return shim.Success([]byte("{\"error\":\"Failed to check user\"}"))
	}
	var company Company
	err = json.Unmarshal(companyJSON, &company)
	if err != nil {
		return shim.Success([]byte("{\"error\":\"Error unmarshaling company data\"}"))
	}
	if company.Email != "" {
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

	companyJSON, err := stub.GetState(username)
	if err != nil {
		return shim.Success([]byte("{\"error\":\"Failed to check company\"}"))
	}

	if companyJSON == nil {
		return shim.Success([]byte("{\"error\":\"Company not found\"}"))
	}

	var company Company
	err = json.Unmarshal(companyJSON, &company)
	if err != nil {
		return shim.Success([]byte("{\"error\":\"Error unmarshaling company data\"}"))
	}

	if company.Password != password {
		return shim.Success([]byte("{\"error\":\"Wrong/invalid credentials\"}"))
	}

	companyBytes, err := json.Marshal(company)
	if err != nil {
		return shim.Success([]byte("{\"error\":\"Error marshaling company data\"}"))
	}

	return shim.Success(companyBytes)
}
