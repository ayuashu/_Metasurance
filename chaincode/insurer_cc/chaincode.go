package main

import (
	"encoding/json"
	"os/exec"

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

	return shim.Error("Invalid function name. Expecting 'register', 'readUserProfile', or 'checkUser'")
}

func (t *Chaincode) register(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 4 {
		return shim.Error("Incorrect number of arguments. Expecting 4: name, email, phone, password")
	}

	newUUID, err := exec.Command("uuidgen").Output() 
    if err != nil { 
        return shim.Error("Cannot generate uuid") 
    }

	name := args[0]
	email := args[1]
	phone := args[2]
	password := args[3]
	uniqueID := string(newUUID)

	user := User{
		Name:     name,
		Email:    email,
		Phone:    phone,
		Password: password,
		UniqueID: uniqueID,
	}

	userJSON, err := json.Marshal(user)
	if err != nil {
		return shim.Error("Error converting user to JSON")
	}

	err = stub.PutState(email, userJSON)
	if err != nil {
		return shim.Error("Failed to register user")
	}

	return shim.Success([]byte("The unique id of this user is: "+ uniqueID))
}

func (t *Chaincode) readUserProfile(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1: email")
	}

	email := args[0]

	userJSON, err := stub.GetState(email)
	if err != nil {
		return shim.Error("Failed to get user profile")
	}

	if userJSON == nil {
		return shim.Error("User not found")
	}

	return shim.Success(userJSON)
}

func (t *Chaincode) checkUserExists(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 2: email, password")
	}
	userid := args[0]

	userJSON, err := stub.GetState(userid)
	if err != nil {
		return shim.Error("Failed to check user")
	}
	var user User
	err = json.Unmarshal(userJSON, &user)
	if err != nil {
		return shim.Error("Error unmarshaling user data")
	}
	if user.Email != "" {
		return shim.Success([]byte("User exists"))
	}
	return shim.Success([]byte("User does not exist"))
}

func (t *Chaincode) login(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 2 {
		return shim.Error("Incorrect number of arguments. Expecting 2: email, password")
	}

	email := args[0]
	password := args[1]

	userJSON, err := stub.GetState(email)
	if err != nil {
		return shim.Error("Failed to check user")
	}

	if userJSON == nil {
		return shim.Error("User not found")
	}

	var user User
	err = json.Unmarshal(userJSON, &user)
	if err != nil {
		return shim.Error("Error unmarshaling user data")
	}

	if user.Password != password {
		return shim.Error("Invalid password")
	}

	userBytes, err := json.Marshal(user)
	if err != nil {
		return shim.Error("Error marshaling user data")
	}

	return shim.Success(userBytes)
}
