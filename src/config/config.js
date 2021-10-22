import { config } from "@onflow/fcl"

config({
  "accessNode.api": process.env.REACT_APP_ACCESS_NODE,
  "discovery.wallet": process.env.REACT_APP_WALLET_DISCOVERY,
  "0xFungibleToken": process.env.REACT_APP_FT_CONTRACT,
  "0xFUSD": process.env.REACT_APP_FUSD_CONTRACT,
  "0xDappy": process.env.REACT_APP_DAPPY_CONTRACT,
  "0xNonFungibleToken": process.env.REACT_APP_NFT_CONTRACT,
  "0xNFTStorefront": process.env.REACT_APP_NFTSTOREFRONT_CONTRACT,
  "0xMyDappyNFT": process.env.REACT_APP_DAPPYNFT_CONTRACT,
  "0xGalleryContract": process.env.REACT_APP_GALLERY_CONTRACT
})