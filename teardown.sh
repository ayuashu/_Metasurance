# Stop the network, chaincodes, peers, channels, nodejs APIs
ROOT_DIR=$PWD
echo "Stopping the network"
cd $ROOT_DIR/backend/scripts/
yes y | ./prune.sh && ./clean.sh
echo "Removing nodejs API residuals"
cd $ROOT_DIR/backend_api/wallets
rm -rf wallet_*
cd $ROOT_DIR/backend_api/fabric/ccp
rm connection-*.json
cd $ROOT_DIR/connections/
rm connection-*.json

