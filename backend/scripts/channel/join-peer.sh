#!/bin/bash
PEER=$1
ORG=$2
MSP=$3
PORT=$4
VERSION=$5

ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/metasurance.com/orderers/orderer0.metasurance.com/msp/tlscacerts/tlsca.metasurance.com-cert.pem
CORE_PEER_LOCALMSPID=$MSP
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/$ORG.metasurance.com/peers/$PEER.$ORG.metasurance.com/tls/ca.crt
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/$ORG.metasurance.com/users/Admin@$ORG.metasurance.com/msp
CORE_PEER_ADDRESS=$PEER.$ORG.metasurance.com:$PORT
CHANNEL_NAME=commonchannel
CORE_PEER_TLS_ENABLED=true

sleep 10
peer channel join -b commonchannel.block >&log.txt

cat log.txt
