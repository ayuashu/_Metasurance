npx caliper launch master \
    --caliper-bind-sut fabric:1.4.1 \
    --caliper-benchconfig benchmarks/benchmark_config.yaml \
    --caliper-networkconfig networks/network_config.json \
    --caliper-workspace ./ \
    --caliper-flow-only-test \
    --caliper-fabric-gateway-usegateway \
    --caliper-fabric-gateway-discovery