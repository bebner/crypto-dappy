#!/bin/bash

flow accounts remove-contract GalleryContract --network testnet --signer MyAdmin

flow accounts remove-contract NonFungibleToken  --network testnet --signer MyAdmin

flow accounts remove-contract DappyNFT  --network testnet --signer MyAdmin

flow accounts remove-contract PackNFT  --network testnet --signer MyAdmin

flow accounts remove-contract NFTStorefront  --network testnet --signer MyAdmin

flow accounts remove-contract DappyContract  --network testnet --signer MyAdmin

flow project deploy --network testnet

flow transactions send cadence/transactions/CreateAdminGallery.cdc --signer MyAdmin --network testnet

flow transactions send cadence/transactions/PrepareDappyContract.cdc --signer MyAdmin --network testnet