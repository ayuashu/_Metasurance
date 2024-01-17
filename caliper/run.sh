npx caliper launch manager \
    --caliper-bind-sut fabric:2.2 \
    --caliper-benchconfig benchmarks/benchmark_config.yaml \
    --caliper-networkconfig networks/network_config.json \
    --caliper-workspace ./ \
    --caliper-fabric-gateway-enabled \
    --caliper-fabric-gateway-localhost true
