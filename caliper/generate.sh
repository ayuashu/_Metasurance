if [ ! -d "node_modules" ]; then
    echo "Installing Dependencies . . . ."
    npm install
fi

echo "Binding Caliper to Fabric v1.4.4 . . . ."
npx caliper bind --caliper-bind-sut fabric:1.4.4 --caliper-bind-cwd ./ --caliper-bind-args="-g"


echo "Generating Network Config for Caliper . . . ."

CURRENT_DIR=$PWD

cp networks/network_config_template.json networks/network_config.json

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

INDEX=1

for ORG in user insurer verifier; do
    echo "Commiting $ORG . . . ."
    # SET PRIVATE KEYS
    KEY_PATH="../backend/crypto-config/peerOrganizations/${ORG}.metasurance.com/users/Admin@${ORG}.metasurance.com/msp/keystore/"
    echo $KEY_PATH
    echo $INDEX
    cd $KEY_PATH
    PRIV_KEY=$(ls *_sk)
    cd $CURRENT_DIR
    sed -i "s/C${INDEX}_PRIVATE_KEY/${PRIV_KEY}/g" networks/network_config.json

    # SET PEERPEM
    PEERPEM="../backend/crypto-config/peerOrganizations/${ORG}.metasurance.com/tlsca/tlsca.${ORG}.metasurance.com-cert.pem"
    PP=$(one_line_pem $PEERPEM)
    sed -i -e "s#PEERPEM${INDEX}#$PP#" networks/network_config.json

    # SET CAPEM
    CAPEM="../backend/crypto-config/peerOrganizations/${ORG}.metasurance.com/ca/ca.${ORG}.metasurance.com-cert.pem"
    PP=$(one_line_pem $CAPEM)
    sed -i -e "s#CAPEM${INDEX}#$PP#" networks/network_config.json

    # ITERATE INDEX
    INDEX=$(($INDEX + 1))
done