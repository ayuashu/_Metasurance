#!/bin/bash

function one_line_pem {
    echo "`awk 'NF {sub(/\\n/, ""); printf "%s\\\\\\\n",$0;}' $1`"
}

function json_ccp {
    local PP=$(one_line_pem $5)
    local CP=$(one_line_pem $6)
    sed -e "s/\${ORG}/$1/" \
        -e "s/\${ORGMSP}/$2/" \
        -e "s/\${P0PORT}/$3/" \
        -e "s/\${CAPORT}/$4/" \
        -e "s#\${PEERPEM}#$PP#" \
        -e "s#\${CAPEM}#$CP#" \
        ../../connections/ccp-template.json 
}

ORG=insurer
ORGMSP=Insurer
P0PORT=7051
CAPORT=7054
PEERPEM=../crypto-config/peerOrganizations/insurer.metasurance.com/tlsca/tlsca.insurer.metasurance.com-cert.pem
CAPEM=../crypto-config/peerOrganizations/insurer.metasurance.com/ca/ca.insurer.metasurance.com-cert.pem

echo "$(json_ccp $ORG $ORGMSP $P0PORT $CAPORT $PEERPEM $CAPEM)" >../../connections/connection-insurer.json

ORG=user
ORGMSP=User
P0PORT=8051
CAPORT=8054
PEERPEM=../crypto-config/peerOrganizations/user.metasurance.com/tlsca/tlsca.user.metasurance.com-cert.pem
CAPEM=../crypto-config/peerOrganizations/user.metasurance.com/ca/ca.user.metasurance.com-cert.pem

echo "$(json_ccp $ORG $ORGMSP $P0PORT $CAPORT $PEERPEM $CAPEM)" >../../connections/connection-user.json
ORG=verifier
ORGMSP=Verifier
P0PORT=9051
CAPORT=9054
PEERPEM=../crypto-config/peerOrganizations/verifier.metasurance.com/tlsca/tlsca.verifier.metasurance.com-cert.pem
CAPEM=../crypto-config/peerOrganizations/verifier.metasurance.com/ca/ca.verifier.metasurance.com-cert.pem

echo "$(json_ccp $ORG $ORGMSP $P0PORT $CAPORT $PEERPEM $CAPEM)" >../../connections/connection-verifier.json

ORG=exampleadmin
ORGMSP=MetaAdmin
P0PORT=10051
CAPORT=10054
PEERPEM=../crypto-config/peerOrganizations/exampleadmin.metasurance.com/tlsca/tlsca.exampleadmin.metasurance.com-cert.pem
CAPEM=../crypto-config/peerOrganizations/exampleadmin.metasurance.com/ca/ca.exampleadmin.metasurance.com-cert.pem

echo "$(json_ccp $ORG $ORGMSP $P0PORT $CAPORT $PEERPEM $CAPEM)" >../../connections/connection-exampleadmin.json
