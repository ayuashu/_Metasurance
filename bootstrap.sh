# Start the network, chaincodes, peers, channels, nodejs APIs
ROOT_DIR=$PWD
echo "Starting the network"
cd $ROOT_DIR/backend/scripts/
./generate.sh
./run.sh
echo "Starting the nodejs APIs"
cd $ROOT_DIR/backend_api/
# check if node_modules is there
if [ ! -d "node_modules" ]; then
    echo "Running npm install"
    npm install
fi
./setup.sh
npm run start
