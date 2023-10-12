#!/bin/bash
CHAINCODE=$1
PEER=$2
ORG=$3
MSP=$4
PORT=$5
VERSION=$6

ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/metasurance.com/orderers/orderer0.metasurance.com/msp/tlscacerts/tlsca.metasurance.com-cert.pem
CORE_PEER_LOCALMSPID=$MSP
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/$ORG.metasurance.com/peers/$PEER.$ORG.metasurance.com/tls/ca.crt
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/$ORG.metasurance.com/users/Admin@$ORG.metasurance.com/msp
CORE_PEER_ADDRESS=$PEER.$ORG.metasurance.com:$PORT
CHANNEL_NAME=commonchannel
CORE_PEER_TLS_ENABLED=true

#export ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/metasurance.com/orderers/orderer0.metasurance.com/msp/tlscacerts/tlsca.metasurance.com-cert.pem

#peer chaincode instantiate -o orderer0.metasurance.com:7050 --tls true --cafile $ORDERER_CA -C mychannel -n $CHAINCODE -v 1.0 -c '{"Args":[]}' >&log.txt
peer chaincode instantiate -o orderer0.metasurance.com:7050 --tls --cafile /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/metasurance.com/orderers/orderer0.metasurance.com/msp/tlscacerts/tlsca.metasurance.com-cert.pem -v 1.0 -c '{"Args":[]}' -C commonchannel -n $CHAINCODE

#cat log.txt
