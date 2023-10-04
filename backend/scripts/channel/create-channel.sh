#!/bin/bash
echo "Creating channel..."
ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer0.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
CORE_PEER_LOCALMSPID=InsurerMSP
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/insurer.example.com/peers/peer0.insurer.example.com/tls/ca.crt
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/insurer.example.com/users/Admin@insurer.example.com/msp
CORE_PEER_ADDRESS=peer0.insurer.example.com:7051
CHANNEL_NAME=commonchannel
CORE_PEER_TLS_ENABLED=true
ORDERER_SYSCHAN_ID=syschain

sleep 20
peer channel create -o orderer0.example.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/commonChannel.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA >&log.txt

cat log.txt

#peer channel create -o orderer0.example.com:7050 /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer0.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -c mychannel -f ./channel-artifacts/channel.tx
sleep 10
echo
echo "Channel created, joining commonchannel..."
peer channel join -b commonchannel.block
