import NonFungibleToken from "../contracts/NonFungibleToken.cdc"
import NFTStorefront from "../contracts/NFTStorefront.cdc"

transaction {
  
  prepare(acct: AuthAccount) {
    
    let storefront <- NFTStorefront.createStorefront()

    acct.save<@NFTStorefront.Storefront>(<- storefront, to: NFTStorefront.StorefrontStoragePath)

    acct.link<&{NFTStorefront.StorefrontPublic}>(NFTStorefront.StorefrontPublicPath, target: NFTStorefront.StorefrontStoragePath) 

  }

}