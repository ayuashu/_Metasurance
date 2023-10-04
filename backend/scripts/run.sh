cd ..
export IMAGE_TAG=1.4

docker-compose -f docker-compose-cli.yaml up -d
# create a channel
docker exec -it cli bash ./scripts/channel/create-channel.sh
docker exec -it cli bash ./scripts/channel/create-channel-user.sh

# make peers join the channel
docker exec -it cli bash ./scripts/channel/join-peer.sh peer0 user UserMSP 8051 1.0

CC_NAMES=$(ls ../chaincode/ | grep _cc)

for CC in $CC_NAMES; do
    echo "Installing "$CC
    docker exec -it cli bash ./scripts/install-cc/install-onpeer-cc.sh $CC peer0 insurer InsurerMSP 7051 1.0
    docker exec -it cli bash ./scripts/install-cc/install-onpeer-cc.sh $CC peer0 user UserMSP 8051 1.0
    #docker exec -it cli bash ./scripts/install-cc/install-onpeer-cc.sh $CC peer0 assets AssetsMSP 9051 1.0
    #docker exec -it cli bash ./scripts/install-cc/install-onpeer-cc.sh $CC peer0 exampleadmin MetaAdminMSP 10051 1.0
    echo "Instantiating "$CC
    docker exec -it cli bash ./scripts/install-cc/instantiate.sh $CC
done

echo "All Done!"
