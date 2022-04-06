import {config} from "@onflow/fcl";

config({
    "accessNode.api": process.env.REACT_APP_ACCESSNODE,
    "discovery.wallet": process.env.REACT_APP_WALLET_DISCOVERY
})