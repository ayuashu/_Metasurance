npx caliper launch manager \
    --caliper-bind-sut fabric:1.4 \
    --caliper-benchconfig benchmarks/benchmark_config.yaml \
    --caliper-networkconfig networks/network_config.json \
    --caliper-bind-file bind.yaml \
    --caliper-workspace ./ \
    --caliper-flow-only-test \
    --caliper-fabric-gateway-usegateway \
    --caliper-fabric-gateway-discovery