export const CREATE_NFT_COLLECTION = `
  import NonFungibleToken from 0xNonFungibleToken
  import DappyNFT from 0xMyDappyNFT
  import NFTStorefront from 0xNFTStorefront
  
  transaction {
    prepare(acct: AuthAccount) {

      let collection <- DappyNFT.createEmptyCollection()
      acct.save<@DappyNFT.Collection>(<-collection, to: DappyNFT.CollectionStoragePath)
  
      acct.link<&{NonFungibleToken.CollectionPublic}>(DappyNFT.CollectionPublicPath, target: DappyNFT.CollectionStoragePath) 
  
      acct.link<&{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(DappyNFT.CollectionPrivatePath, target: DappyNFT.CollectionStoragePath) 

      let storefront <- NFTStorefront.createStorefront()

      acct.save<@NFTStorefront.Storefront>(<- storefront, to: NFTStorefront.StorefrontStoragePath)
  
      acct.link<&{NFTStorefront.StorefrontPublic}>(NFTStorefront.StorefrontPublicPath, target: NFTStorefront.StorefrontStoragePath) 

    }
  }
`