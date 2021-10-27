#!/bin/bash

flow accounts remove-contract GalleryContract --network testnet --signer MyWorldAdmin

flow accounts remove-contract NonFungibleToken  --network testnet --signer MyWorldAdmin

flow accounts remove-contract DappyNFT  --network testnet --signer MyWorldAdmin

flow accounts remove-contract PackNFT  --network testnet --signer MyWorldAdmin

flow accounts remove-contract NFTStorefront  --network testnet --signer MyWorldAdmin

flow accounts remove-contract DappyContract  --network testnet --signer MyWorldAdmin

flow project deploy --network testnet

flow transactions send cadence/transactions/CreateAdminGallery.cdc --signer MyWorldAdmin --network testnet

flow transactions send cadence/transactions/PrepareDappyContract.cdc --signer MyWorldAdmin --network testnet