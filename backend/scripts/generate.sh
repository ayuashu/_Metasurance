#!/bin/bash
ls
cd ..
export IMAGE_TAG=1.4
export PATH=$PATH:/home/fishnak/fabric-samples/bin 
echo "Generating cryto material for peers..."

mkdir ./channel-artifacts

cryptogen generate --config=./crypto-config.yaml

echo "Generating channel artifacts and genesis block..."
configtxgen -profile METAOrderGenesis -outputBlock ./channel-artifacts/genesis.block
configtxgen -profile CommonChannel -outputCreateChannelTx ./channel-artifacts/commonChannel.tx -channelID commonchannel
configtxgen -profile UserChannel -outputCreateChannelTx ./channel-artifacts/userChannel.tx -channelID userchannel

CURRENT_DIR=$PWD
cd ./base
cp docker-compose-base-template.yaml docker-compose-base.yaml
OPTS="-i"
cd $CURRENT_DIR
cd ./crypto-config/peerOrganizations/insurer.metasurance.com/ca/
PRIV_KEY=$(ls *_sk)
cd $CURRENT_DIR
cd ./base
sed $OPTS "s/CA1_PRIVATE_KEY/${PRIV_KEY}/g" docker-compose-base.yaml

cd $CURRENT_DIR
cd ./crypto-config/peerOrganizations/user.metasurance.com/ca/
PRIV_KEY=$(ls *_sk)
cd $CURRENT_DIR
cd ./base
sed $OPTS "s/CA2_PRIVATE_KEY/${PRIV_KEY}/g" docker-compose-base.yaml

cd $CURRENT_DIR
cd ./crypto-config/peerOrganizations/assets.metasurance.com/ca/
PRIV_KEY=$(ls *_sk)
cd $CURRENT_DIR
cd ./base
sed $OPTS "s/CA3_PRIVATE_KEY/${PRIV_KEY}/g" docker-compose-base.yaml

cd $CURRENT_DIR
cd ./crypto-config/peerOrganizations/exampleadmin.metasurance.com/ca/
PRIV_KEY=$(ls *_sk)
cd $CURRENT_DIR
cd ./base
sed $OPTS "s/CA4_PRIVATE_KEY/${PRIV_KEY}/g" docker-compose-base.yaml

cd $CURRENT_DIR
cd ./scripts
bash ./auxiliary/ccp-generate.sh

# Install Go dependencies
bash ./auxiliary/go-mod.sh
