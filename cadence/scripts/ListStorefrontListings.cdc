import NFTStorefront from "../contracts/NFTStorefront.cdc"
import DappyNFT from "../contracts/DappyNFT.cdc"
import NonFungibleToken from "../contracts/NonFungibleToken.cdc"
import DappyContract from "../contracts/DappyContract.cdc"

pub fun main(addr: Address): UInt64 {

  let account = getAccount(addr)

  let storefrontRef = account
    .getCapability<&{NFTStorefront.StorefrontPublic}>(
      NFTStorefront.StorefrontPublicPath  
    )
    .borrow()
    ?? panic ("Could not borrow StorefrontPublic ref")

  let listings = storefrontRef.getListingIDs()

  let listingRef = storefrontRef.borrowListing(listingResourceID: listings[0])

  let nftRef =listingRef!.borrowNFT() as! &DappyNFT.NFT
 
  var ret = nftRef.nft.id

  return ret
  
}
 