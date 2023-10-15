package main

import (
	"encoding/json"

	"github.com/google/uuid"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

type User struct {
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
	} else if function == "readUserProfile" {
		return t.readUserProfile(stub, args)
	} else if function == "checkUserExists" {
		return t.checkUserExists(stub, args)
	} else if function == "login" {
		return t.login(stub, args)
	}

	return shim.Success([]byte("{\"error\":\"Invalid function name. Expecting 'register', 'readUserProfile', or 'checkUser'\"}"))
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

	user := User{
		Name:     name,
		Email:    email,
		Phone:    phone,
		Password: password,
		UniqueID: uniqueID,
	}

	userJSON, err := json.Marshal(user)
	if err != nil {
		return shim.Success([]byte("{\"error\":\"Error converting user data to JSON\"}"))
	}

	err = stub.PutState(email, userJSON)
	if err != nil {
		return shim.Success([]byte("{\"error\":\"Failed to register user\"}"))
	}

	return shim.Success([]byte("{\"uniqueId\":\""+ uniqueID + "\"} "))
}

func (t *Chaincode) readUserProfile(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 1 {
		return shim.Success([]byte("{\"error\":\"Incorrect number of arguments. Expecting 1: email\"}"))
	}

	email := args[0]

	userJSON, err := stub.GetState(email)
	if err != nil {
		return shim.Success([]byte("{\"error\":\"Failed to get user profile\"}"))
	}

	if userJSON == nil {
		return shim.Success([]byte("{\"error\":\"User not found\"}"))
	}

	return shim.Success(userJSON)
}

func (t *Chaincode) checkUserExists(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 1 {
		return shim.Success([]byte("{\"error\":\"Incorrect number of arguments. Expecting 2: email, password\"}"))
	}
	email := args[0]

	userJSON, err := stub.GetState(email)
	if err != nil {
		return shim.Success([]byte("{\"error\":\"Failed to check user\"}"))
	}
	var user User
	err = json.Unmarshal(userJSON, &user)
	if err != nil {
		return shim.Success([]byte("{\"error\":\"Error unmarshaling user data\"}"))
	}
	if user.Email != "" {
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

	userJSON, err := stub.GetState(email)
	if err != nil {
		return shim.Success([]byte("{\"error\":\"Failed to check user\"}"))
	}

	if userJSON == nil {
		return shim.Success([]byte("{\"error\":\"User not found\"}"))
	}

	var user User
	err = json.Unmarshal(userJSON, &user)
	if err != nil {
		return shim.Success([]byte("{\"error\":\"Error unmarshaling user data\"}"))
	}

	if user.Password != password {
		return shim.Success([]byte("{\"error\":\"Invalid password\"}"))
	}

	userBytes, err := json.Marshal(user)
	if err != nil {
		return shim.Success([]byte("{\"error\":\"Error marshaling user data\"}"))
	}

	return shim.Success(userBytes)
}
