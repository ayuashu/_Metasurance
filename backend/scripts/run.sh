cd ..
export IMAGE_TAG=1.4

docker-compose -f docker-compose-cli.yaml up -d
# create a channel, insurer already in channel
docker exec -it cli bash ./scripts/channel/create-channel.sh
# docker exec -it cli bash ./scripts/channel/create-channel-user.sh
# make peers join the channel
docker exec -it cli bash ./scripts/channel/join-peer.sh peer0 user UserMSP 8051 1.0
echo "Joined user"
docker exec -it cli bash ./scripts/channel/join-peer.sh peer0 verifier VerifierMSP 9051 1.0
echo "Joined verifier"

echo "Installing user_cc"
docker exec -it cli bash ./scripts/install-cc/install-onpeer-cc.sh user_cc peer0 user UserMSP 8051 1.8 # install in common channel now
echo "Instantiating user_cc"
docker exec -it cli bash ./scripts/install-cc/instantiate.sh user_cc peer0 user UserMSP 8051 1.8

echo "Installing insurer_cc"
docker exec -it cli bash ./scripts/install-cc/install-onpeer-cc.sh insurer_cc peer0 insurer InsurerMSP 7051 1.9 # install in common channel now
echo "Instantiating insurer_cc"
docker exec -it cli bash ./scripts/install-cc/instantiate.sh insurer_cc peer0 insurer InsurerMSP 7051 1.9

echo "Installing verifier_cc"
docker exec -it cli bash ./scripts/install-cc/install-onpeer-cc.sh verifier_cc peer0 verifier VerifierMSP 9051 1.8 # install in common channel now
echo "Instantiating verifier_cc"
docker exec -it cli bash ./scripts/install-cc/instantiate.sh verifier_cc peer0 verifier VerifierMSP 9051 1.8

echo "Installing asset_cc"
docker exec -it cli bash ./scripts/install-cc/install-onpeer-cc.sh asset_cc peer0 user UserMSP 8051 1.8 # install in common channel now
echo "Instantiating asset_cc"
docker exec -it cli bash ./scripts/install-cc/instantiate.sh asset_cc peer0 user UserMSP 8051 1.8

echo "Installing policy_cc"
docker exec -it cli bash ./scripts/install-cc/install-onpeer-cc.sh policy_cc peer0 insurer InsurerMSP 7051 2.7 # install in common channel now
docker exec -it cli bash ./scripts/install-cc/install-onpeer-cc.sh policy_cc peer0 user UserMSP 8051 2.7
echo "Instantiating policy_cc"
docker exec -it cli bash ./scripts/install-cc/instantiate.sh policy_cc peer0 insurer InsurerMSP 7051 2.7
docker exec -it cli bash ./scripts/install-cc/instantiate.sh policy_cc peer0 user UserMSP 8051 2.7

echo "Installing policyusermapping_cc"
docker exec -it cli bash ./scripts/install-cc/install-onpeer-cc.sh policyusermapping_cc peer0 user UserMSP 8051 1.8
echo "Instantiating policyusermapping_cc"
docker exec -it cli bash ./scripts/install-cc/instantiate.sh policyusermapping_cc peer0 user UserMSP 8051 1.8

echo "Installing claim_cc"
docker exec -it cli bash ./scripts/install-cc/install-onpeer-cc.sh claim_cc peer0 user UserMSP 8051 1.9
docker exec -it cli bash ./scripts/install-cc/install-onpeer-cc.sh claim_cc peer0 insurer InsurerMSP 7051 1.9
docker exec -it cli bash ./scripts/install-cc/install-onpeer-cc.sh claim_cc peer0 verifier VerifierMSP 9051 1.9
echo "Instantiating claim_cc"
docker exec -it cli bash ./scripts/install-cc/instantiate.sh claim_cc peer0 insurer InsurerMSP 7051 1.9
docker exec -it cli bash ./scripts/install-cc/instantiate.sh claim_cc peer0 verifier VerifierMSP 9051 1.9

echo "Installing token_cc"
docker exec -it cli bash ./scripts/install-cc/install-onpeer-cc.sh token_cc peer0 user UserMSP 8051 1.8
docker exec -it cli bash ./scripts/install-cc/install-onpeer-cc.sh token_cc peer0 insurer InsurerMSP 7051 1.8
echo "Instantiating token_cc"
docker exec -it cli bash ./scripts/install-cc/instantiate.sh token_cc peer0 user UserMSP 8051 1.8
docker exec -it cli bash ./scripts/install-cc/instantiate.sh token_cc peer0 insurer InsurerMSP 7051 1.8

echo "All Done!"
