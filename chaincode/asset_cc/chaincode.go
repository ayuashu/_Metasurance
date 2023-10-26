// chaincode for asset contract
package main

import (
	"encoding/json"
	"fmt"

	"github.com/google/uuid"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	"github.com/hyperledger/fabric/protos/peer"
)

type UserAssetMap struct{
	Assets []Asset `json:"assets"`
}

type Asset struct{
	AssetID string `json:"assetID"`
	AssetName string `json:"assetName"`
	AssetType string `json:"assetType"`
	Value string `json:"value"`
	Age string `json:"age"`
}

type Chaincode struct{
}

func (ac *Chaincode) Init(stub shim.ChaincodeStubInterface) peer.Response{
	return shim.Success(nil)
}

func (ac *Chaincode) Invoke(stub shim.ChaincodeStubInterface) peer.Response{
	fn, args := stub.GetFunctionAndParameters()
	if fn == "createAsset"{
		return ac.createAsset(stub, args)
	}else if fn == "queryAsset"{
		return ac.queryAsset(stub, args)
	}else if fn == "queryAllAssets"{
		return ac.queryAllAssets(stub)
	}else if fn == "deleteAsset"{
		return ac.deleteAsset(stub, args)
	}
	return shim.Error("{\"error\":\"Invalid function name. Expecting 'createAsset', 'queryAsset', or 'queryAllAssets'\"}")
}

func (ac *Chaincode) createAsset(stub shim.ChaincodeStubInterface, args []string) peer.Response{
	if len(args) != 5{
		return shim.Error("{\"error\": \"Incorrect number of arguments. Expecting 5\"}")
	}
	var asset = Asset{AssetID: uuid.New().String(), AssetName: args[0], AssetType: args[1], Value: args[2], Age: args[3]}
	assetMap, err := stub.GetState(args[4]) // username
	if err != nil{
		return shim.Error("{\"error\": \"Failed to get existing user assets: " + err.Error() + "\"}")
	}else if assetMap != nil{
		var userAssetMap UserAssetMap
		json.Unmarshal(assetMap, &userAssetMap)
		userAssetMap.Assets = append(userAssetMap.Assets, asset)
		assetMap, _ = json.Marshal(userAssetMap)
	}else{
		var userAssetMap UserAssetMap
		userAssetMap.Assets = append(userAssetMap.Assets, asset)
		assetMap, _ = json.Marshal(userAssetMap)
	}
	stub.PutState(args[4], assetMap)
	fmt.Print("asset created: ")
	fmt.Print(assetMap)
	fmt.Print("for user " + args[4])
	return shim.Success([]byte("{\"assetID\":\""+asset.AssetID+"\"}"))
}

func (ac *Chaincode) deleteAsset(stub shim.ChaincodeStubInterface, args []string) peer.Response{
	if len(args) != 2{
		return shim.Error("{\"error\": \"Incorrect number of arguments. Expecting 2: username, assetid\"}")
	}
	assetMap, err := stub.GetState(args[0])
	if err != nil{
		return shim.Error("{\"error\": \"Failed to get existing user assets: " + err.Error() + "\"}")
	}else if assetMap != nil{
		var userAssetMap UserAssetMap
		json.Unmarshal(assetMap, &userAssetMap)
		for i, asset := range userAssetMap.Assets{
			if asset.AssetID == args[1]{
				userAssetMap.Assets = append(userAssetMap.Assets[:i], userAssetMap.Assets[i+1:]...)
				break
			}
		}
		assetMap, _ = json.Marshal(userAssetMap)
	}
	stub.PutState(args[0], assetMap)
	return shim.Success([]byte("{\"uniqueID\":\""+args[1]+"\"}"))
}

func (ac *Chaincode) queryAsset(stub shim.ChaincodeStubInterface, args []string) peer.Response{
	if len(args) != 1{
		return shim.Error("\"error\": \"Incorrect number of arguments. Expecting 1: username\"}")
	}
	assetAsBytes, _ := stub.GetState(args[0])
	fmt.Println(assetAsBytes)
	return shim.Success(assetAsBytes)
}

func (ac *Chaincode) queryAllAssets(stub shim.ChaincodeStubInterface) peer.Response{
	startKey := ""
	endKey := ""
	resultsIterator, _ := stub.GetStateByRange(startKey, endKey)
	defer resultsIterator.Close()
	var buffer string
	buffer = "["
	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext(){
		queryResponse, _ := resultsIterator.Next()
		if bArrayMemberAlreadyWritten {
			buffer += ","
		}
		buffer += string(queryResponse.Value)
		bArrayMemberAlreadyWritten = true
	}
	buffer += "]"
	return shim.Success([]byte(buffer))
}