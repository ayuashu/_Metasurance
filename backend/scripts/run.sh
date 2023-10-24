cd ..
export IMAGE_TAG=1.4

docker-compose -f docker-compose-cli.yaml up -d
# create a channel, insurer already in channel
docker exec -it cli bash ./scripts/channel/create-channel.sh
# docker exec -it cli bash ./scripts/channel/create-channel-user.sh
# make peers join the channel
docker exec -it cli bash ./scripts/channel/join-peer.sh peer0 user UserMSP 8051 1.0
echo "Joined user"

echo "Installing user_cc"
docker exec -it cli bash ./scripts/install-cc/install-onpeer-cc.sh user_cc peer0 user UserMSP 8051 1.5 # install in common channel now
echo "Instantiating user_cc"
docker exec -it cli bash ./scripts/install-cc/instantiate.sh user_cc peer0 user UserMSP 8051 1.5
echo "Installing insurer_cc"
docker exec -it cli bash ./scripts/install-cc/install-onpeer-cc.sh insurer_cc peer0 insurer InsurerMSP 7051 1.6 # install in common channel now
echo "Instantiating insurer_cc"
docker exec -it cli bash ./scripts/install-cc/instantiate.sh insurer_cc peer0 insurer InsurerMSP 7051 1.6
echo "Installing asset_cc"
docker exec -it cli bash ./scripts/install-cc/install-onpeer-cc.sh asset_cc peer0 user UserMSP 8051 1.5 # install in common channel now
echo "Instantiating asset_cc"
docker exec -it cli bash ./scripts/install-cc/instantiate.sh asset_cc peer0 user UserMSP 8051 1.5
echo "Installing policy_cc"
docker exec -it cli bash ./scripts/install-cc/install-onpeer-cc.sh policy_cc peer0 insurer InsurerMSP 7051 1.2 # install in common channel now
echo "Instantiating policy_cc"
docker exec -it cli bash ./scripts/install-cc/instantiate.sh policy_cc peer0 insurer InsurerMSP 7051 1.2

echo "All Done!"
