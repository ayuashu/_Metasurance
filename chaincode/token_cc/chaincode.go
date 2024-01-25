// chaincode for asset contract
package main

import (
	"crypto/x509"
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/google/uuid"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/core/chaincode/shim/ext/cid"
	"github.com/hyperledger/fabric/protos/peer"
)

type Chaincode struct{
}

func (ac *Chaincode) Init(stub shim.ChaincodeStubInterface) peer.Response{
	return shim.Success(nil)
}

func (ac *Chaincode) Invoke(stub shim.ChaincodeStubInterface) peer.Response{
	fn, args := stub.GetFunctionAndParameters()
	if fn == "Mint"{
		return ac.Mint(stub, args)
	}else if fn == "Burn"{
		return ac.Burn(stub, args)
	}else if fn == "Transfer"{
		return ac.Transfer(stub, args)
	}else if fn == "balanceOf"{
		return ac.balanceOf(stub, args)
	}else if fn == "TotalSupply"{
		return ac.TotalSupply(stub, args)
	}else if fn == "Name"{
		return ac.Name(stub, args)
	}else if fn == "Symbol"{
		return ac.Symbol(stub, args)
	}
	return shim.Error("{\"error\":\"Invalid function name. Expecting 'createAsset', 'queryAsset', or 'queryAllAssets'\"}")
}

func (ac *Chaincode) Mint(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 3 {
		return shim.Error("{\"error\":\"Incorrect number of arguments. Expecting 3\"}")
	}
	mspID, certCN, _, err := getTxCreatorInfo(stub)
	if err != nil {
		return shim.Error("{\"error\":\"Failed getting creator info\"}")
	}
	if !authenticateMinter(mspID, certCN) {
		return shim.Error("{\"error\":\"Only Bank can mint tokens\"}")
	}
	amount := args[0]
	var amountAsInt, parserr = strconv.Atoi(amount)
	if parserr != nil {
		return shim.Error("{\"error\":\"Invalid amount\"}")
	}
	if amountAsInt < 0 {
		return shim.Error("{\"error\":\"Cannot mint negative amount\"}")
	}
	currentBalanceAsBytes, err := stub.GetState(mspID)
	if err != nil {
		return shim.Error("{\"error\":\"Failed to get state for " + mspID + "\"}")
	}
	var currentBalance int
	if currentBalanceAsBytes == nil {
		currentBalance = 0
	} else {
		currentBalance, _ = strconv.Atoi(string(currentBalanceAsBytes))
	}
	updatedBalance, err := add(currentBalance, amountAsInt)
	if err != nil {
		return shim.Error("{\"error\":\"Failed to add " + amount + " to balance\"}")
	}

	// Update total supply after minting
	var totalSupplyAsBytes, error = stub.GetState("totalSupply")
	if error != nil {
		return shim.Error("{\"error\":\"Failed to get total supply\"}")
	}
	var totalSupply int
	if totalSupplyAsBytes == nil {
		totalSupply = 0
	} else {
		totalSupply, _ = strconv.Atoi(string(totalSupplyAsBytes))
	}
	updatedTotalSupply, err := add(totalSupply, amountAsInt)
	if err != nil {
		return shim.Error("{\"error\":\"Failed to add " + amount + " to total supply\"}")
	}

	// update the states
	err = stub.PutState(mspID, []byte(strconv.Itoa(updatedBalance)))
	if err != nil {
		return shim.Error("{\"error\":\"Failed to update state for " + mspID + "\"}")
	}
	err = stub.PutState("totalSupply", []byte(strconv.Itoa(updatedTotalSupply)))
	if err != nil {
		return shim.Error("{\"error\":\"Failed to update total supply\"}")
	}
	return shim.Success(nil)
}

func (ac *Chaincode) Burn(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 1 {
		return shim.Error("{\"error\":\"Incorrect number of arguments. Expecting 1: Amount to burn\"}")
	}
	mspID, certCN, _, err := getTxCreatorInfo(stub)
	if err != nil {
		return shim.Error("{\"error\":\"Failed getting creator info\"}")
	}
	if !authenticateMinter(mspID, certCN) {
		return shim.Error("{\"error\":\"Only Bank can burn tokens\"}")
	}
	amount := args[0]
	var amountAsInt, parserr = strconv.Atoi(amount)
	if parserr != nil {
		return shim.Error("{\"error\":\"Invalid amount\"}")
	}
	if amountAsInt < 0 {
		return shim.Error("{\"error\":\"Cannot burn negative amount\"}")
	}
	currentBalanceAsBytes, err := stub.GetState(mspID)
	if err != nil {
		return shim.Error("{\"error\":\"Failed to get state for " + mspID + "\"}")
	}
	var currentBalance int
	if currentBalanceAsBytes == nil {
		currentBalance = 0
	} else {
		currentBalance, _ = strconv.Atoi(string(currentBalanceAsBytes))
	}
	updatedBalance, err := sub(currentBalance, amountAsInt)
	if err != nil {
		return shim.Error("{\"error\":\"Failed to add " + amount + " to balance\"}")
	}

	// Update total supply after burning
	var totalSupplyAsBytes, error = stub.GetState("totalSupply")
	if error != nil {
		return shim.Error("{\"error\":\"Failed to get total supply\"}")
	}
	var totalSupply int
	if totalSupplyAsBytes == nil {
		totalSupply = 0
	} else {
		totalSupply, _ = strconv.Atoi(string(totalSupplyAsBytes))
	}
	updatedTotalSupply, err := sub(totalSupply, amountAsInt)
	if err != nil {
		return shim.Error("{\"error\":\"Failed to add " + amount + " to total supply\"}")
	}

	// update the states
	err = stub.PutState(mspID, []byte(strconv.Itoa(updatedBalance)))
	if err != nil {
		return shim.Error("{\"error\":\"Failed to update state for " + mspID + "\"}")
	}
	err = stub.PutState("totalSupply", []byte(strconv.Itoa(updatedTotalSupply)))
	if err != nil {
		return shim.Error("{\"error\":\"Failed to update total supply\"}")
	}
	return shim.Success(nil)
}

func (ac *Chaincode) Transfer(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 2 {
		return shim.Error("{\"error\":\"Incorrect number of arguments. Expecting 2: Amount to transfer, Recipient\"}")
	}
	mspID, _, _, err := getTxCreatorInfo(stub)
	if err != nil {
		return shim.Error("{\"error\":\"Failed getting creator info\"}")
	}
	recipient := args[0]
	amount := args[1]
	var amountAsInt, parserr = strconv.Atoi(amount)
	if parserr != nil {
		return shim.Error("{\"error\":\"Invalid amount\"}")
	}
	if amountAsInt < 0 {
		return shim.Error("{\"error\":\"Cannot transfer negative amount\"}")
	}
	currentBalanceAsBytes, err := stub.GetState(mspID)
	if err != nil {
		return shim.Error("{\"error\":\"Failed to get state for " + mspID + "\"}")
	}
	var currentBalance int
	if currentBalanceAsBytes == nil {
		currentBalance = 0
	} else {
		currentBalance, _ = strconv.Atoi(string(currentBalanceAsBytes))
	}
	updatedBalance, err := sub(currentBalance, amountAsInt)
	if err != nil {
		return shim.Error("{\"error\":\"Failed to subtract " + amount + " from balance\"}")
	}
	recipientBalanceAsBytes, err := stub.GetState(recipient)
	if err != nil {
		return shim.Error("{\"error\":\"Failed to get state for " + recipient + "\"}")
	}
	var recipientBalance int
	if recipientBalanceAsBytes == nil {
		recipientBalance = 0
	} else {
		recipientBalance, _ = strconv.Atoi(string(recipientBalanceAsBytes))
	}
	updatedRecipientBalance, err := add(recipientBalance, amountAsInt)
	if err != nil {
		return shim.Error("{\"error\":\"Failed to add " + amount + " to recipient balance\"}")
	}
	err = stub.PutState(mspID, []byte(strconv.Itoa(updatedBalance)))
	if err != nil {
		return shim.Error("{\"error\":\"Failed to update state for " + mspID + "\"}")
	}
	err = stub.PutState(recipient, []byte(strconv.Itoa(updatedRecipientBalance)))
	if err != nil {
		return shim.Error("{\"error\":\"Failed to update state for " + recipient + "\"}")
	}
	return shim.Success(nil)
}

func (ac *Chaincode) balanceOf(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 1 {
		return shim.Error("{\"error\":\"Incorrect number of arguments. Expecting 1: Account\"}")
	}
	account := args[0]
	balanceAsBytes, err := stub.GetState(account)
	if err != nil {
		return shim.Error("{\"error\":\"Failed to get state for " + account + "\"}")
	}
	if balanceAsBytes == nil {
		return shim.Error("{\"error\":\"Account " + account + " does not exist\"}")
	}
	return shim.Success(balanceAsBytes)
}

func (ac *Chaincode) TotalSupply(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 0 {
		return shim.Error("{\"error\":\"Incorrect number of arguments. Expecting 0\"}")
	}
	totalSupplyAsBytes, err := stub.GetState("totalSupply")
	if err != nil {
		return shim.Error("{\"error\":\"Failed to get total supply\"}")
	}
	if totalSupplyAsBytes == nil {
		return shim.Error("{\"error\":\"Total supply does not exist\"}")
	}
	return shim.Success(totalSupplyAsBytes)
}

func (ac *Chaincode) Name(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 0 {
		return shim.Error("{\"error\":\"Incorrect number of arguments. Expecting 0\"}")
	}
	return shim.Success([]byte("Metasurance Token"))
}

func (ac *Chaincode) Symbol(stub shim.ChaincodeStubInterface, args []string) peer.Response {
	if len(args) != 0 {
		return shim.Error("{\"error\":\"Incorrect number of arguments. Expecting 0\"}")
	}
	return shim.Success([]byte("MET"))
}

// Get Tx Creator Info
func getTxCreatorInfo(stub shim.ChaincodeStubInterface) (string, string, string, error) {
	var mspid string
	var err error
	var cert *x509.Certificate
	mspid, err = cid.GetMSPID(stub)

	if err != nil {
		fmt.Printf("Error getting MSP identity: %sn", err.Error())
		return "", "", "", err
	}

	cert, err = cid.GetX509Certificate(stub)
	if err != nil {
		fmt.Printf("Error getting client certificate: %sn", err.Error())
		return "", "", "", err
	}

	return mspid, cert.Issuer.CommonName, cert.Subject.CommonName, nil
}

func authenticateMinter(mspID string, certCN string) bool {
	return (mspID == "BankMSP") && (certCN == "ca.bank.metasurance.com")
}

// add two number checking for overflow
func add(b int, q int) (int, error) {

	// Check overflow
	var sum int
	sum = q + b

	if (sum < q || sum < b) == (b >= 0 && q >= 0) {
		return 0, fmt.Errorf("Math: addition overflow occurred %d + %d", b, q)
	}

	return sum, nil
}

// sub two number checking for overflow
func sub(b int, q int) (int, error) {

	// sub two number checking 
	if q <= 0 {
		return 0, fmt.Errorf("Error: the subtraction number is %d, it should be greater than 0", q)
	}
	if b < q {
		return 0, fmt.Errorf("Error: the number %d is not enough to be subtracted by %d", b, q)
	}
	var diff int
	diff = b - q

	return diff, nil
}