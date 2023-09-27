package main

import (
	"encoding/json"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

type User struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Phone    string `json:"phone"`
	Password string `json:"password"`
}

type Chaincode struct {
}

// Init is called when the chaincode is instantiated by the blockchain network.
func (t *Chaincode) Init(stub shim.ChaincodeStubInterface) peer.Response {
	return shim.Success(nil)
}

// Invoke is called as a result of an application request to run the chaincode.
func (t *Chaincode) Invoke(stub shim.ChaincodeStubInterface) peer.Response {
	function, args := stub.GetFunctionAndParameters()

	if function == "registerUser" {
		return t.registerUser(stub, args)
	} else if function == "readUserProfile" {
		return t.readUserProfile(stub, args)
	} else if function == "checkUser" {
		return t.checkUser(stub, args)
	}

	return shim.Error("Invalid function name. Expecting 'registerUser', 'readUserProfile', or 'checkUser'")
}

//function to register user
func (t *Chaincode) registerUser(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 4 {
		return shim.Error("Incorrect number of arguments. Expecting 4: name, email, phone, password")
	}

	name := args[0]
	email := args[1]
	phone := args[2]
	password := args[3]

	// Check if User exists with Key => args[0]
	UserID, err := stub.GetState(email)
	if err != nil {
		return shim.Error("Failed to check if User exists!")
	} else if UserID != nil {
		return shim.Error("User Already Exists!")
	}

	// Generate User from args provided	
	user := User{
		Name:     name,
		Email:    email,
		Phone:    phone,
		Password: password,
	}

	// Get JSON bytes of User struct
	userJSON, err := json.Marshal(user)
	if err != nil {
		return shim.Error("Error converting user to JSON")
	}

	// Put State of newly generated User with Key => args[0]
	err = stub.PutState(email, userJSON)
	if err != nil {
		return shim.Error("Failed to register user")
	}

	return shim.Success([]byte("User registered successfully"))
}

// Function to read an User
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

func (t *Chaincode) checkUser(stub shim.ChaincodeStubInterface, args []string) peer.Response {
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

	return shim.Success([]byte("User exists and password is correct"))
}

