import NFTStorefront from "../contracts/NFTStorefront.cdc"
import DappyNFT from "../contracts/DappyNFT.cdc"

pub fun main(addr: Address): [UInt64] {

    let account = getAccount(addr)

    let storefrontRef = account
      .getCapability<&{NFTStorefront.StorefrontPublic}>(
        NFTStorefront.StorefrontPublicPath  
      )
      .borrow()
      ?? panic ("Could not borrow StorefrontPublic ref")

  let listings = storefrontRef.getListingIDs()

  let ref = storefrontRef.borrowListing(listingResourceID: listings[0])

  let details = ref!.getDetails()
  
  return listings
  
}
 