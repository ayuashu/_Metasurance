#!/bin/bash
echo "Creating channel for User..."
ORDERER_CA=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer0.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
CORE_PEER_LOCALMSPID=UserMSP
CORE_PEER_TLS_ROOTCERT_FILE=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/user.example.com/peers/peer0.user.example.com/tls/ca.crt
CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/user.example.com/users/Admin@user.example.com/msp
CORE_PEER_ADDRESS=peer0.user.example.com:8051
CHANNEL_NAME=userchannel
CORE_PEER_TLS_ENABLED=true
ORDERER_SYSCHAN_ID=syschain

sleep 20
peer channel create -o orderer0.example.com:7050 -c $CHANNEL_NAME -f ./channel-artifacts/userChannel.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA >&log.txt

cat log.txt

#peer channel create -o orderer0.example.com:7050 /opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/ordererOrganizations/example.com/orderers/orderer0.example.com/msp/tlscacerts/tlsca.example.com-cert.pem -c mychannel -f ./channel-artifacts/channel.tx
sleep 10
echo
echo "Channel created, joining userchannel..."
peer channel join -b userchannel.block
