import NFTStorefront from "../contracts/NFTStorefront.cdc"
import DappyNFT from "../contracts/DappyNFT.cdc"
import NonFungibleToken from "../contracts/NonFungibleToken.cdc"
import DappyContract from "../contracts/DappyContract.cdc"

pub fun main(addr: Address): {UInt64: NFTStorefront.ListingDetails} {

  let account = getAccount(addr)

  let storefrontRef = account
    .getCapability<&{NFTStorefront.StorefrontPublic}>(
      NFTStorefront.StorefrontPublicPath  
    )
    .borrow()
    ?? panic ("Could not borrow StorefrontPublic ref")

  let listings = storefrontRef.getListingIDs()
  
  let ret: {UInt64: NFTStorefront.ListingDetails} = {}
  for id in listings {
    
    let listingRef = storefrontRef.borrowListing(listingResourceID: id)
    
    ret[id] = listingRef?.getDetails()
  }

  return ret
  
}
 