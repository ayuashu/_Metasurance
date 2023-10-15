package main

import (
	"encoding/json"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
	"github.com/google/uuid"
)

type Company struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Phone    string `json:"phone"`
	Password string `json:"password"`
	UniqueID string `json:"uniqueID"`
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
	if len(args) != 4 {
		return shim.Success([]byte("{\"error\":\"Incorrect number of arguments. Expecting 4: name, email, phone, password\"}"))
	}

	newUUID := uuid.New()

	name := args[0]
	email := args[1]
	phone := args[2]
	password := args[3]
	uniqueID := newUUID.String()

	user := Company{
		Name:     name,
		Email:    email,
		Phone:    phone,
		Password: password,
		UniqueID: uniqueID,
	}

	userJSON, err := json.Marshal(user)
	if err != nil {
		return shim.Success([]byte("{\"error\":\"Error converting company data to JSON\"}"))
	}

	err = stub.PutState(email, userJSON)
	if err != nil {
		return shim.Success([]byte("{\"error\":\"Failed to register company\"}"))
	}

	return shim.Success([]byte("{\"uniqueId\":\""+ uniqueID + "\"} "))
}

func (t *Chaincode) readCompanyProfile(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 1 {
		return shim.Success([]byte("{\"error\":\"Incorrect number of arguments. Expecting 1: email\"}"))
	}

	email := args[0]

	userJSON, err := stub.GetState(email)
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
		return shim.Success([]byte("{\"error\":\"Incorrect number of arguments. Expecting 2: email, password\"}"))
	}

	email := args[0]
	password := args[1]

	companyJSON, err := stub.GetState(email)
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
		return shim.Success([]byte("{\"error\":\"Invalid password\"}"))
	}

	companyBytes, err := json.Marshal(company)
	if err != nil {
		return shim.Success([]byte("{\"error\":\"Error marshaling company data\"}"))
	}

	return shim.Success(companyBytes)
}
