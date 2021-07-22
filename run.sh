#!/bin/bash
export ACCESS_API=https://access-testnet.onflow.org
export WALLET_DISCOVERY=https://fcl-discovery.onflow.org/testnet/authn
export FT_CONTRACT=0x9a0766d93b6608b7
export FUSD_CONTRACT=0xe223d8a629e49c68
export DAPPY_CONTRACT=0xdb3d539e48a805b7

export REACT_APP_ACCESS_NODE=${ACCESS_API}
export REACT_APP_WALLET_DISCOVERY=${WALLET_DISCOVERY}
export REACT_APP_FT_CONTRACT=${FT_CONTRACT}
export REACT_APP_FUSD_CONTRACT=${FUSD_CONTRACT}
export REACT_APP_DAPPY_CONTRACT=${DAPPY_CONTRACT}

npm run start