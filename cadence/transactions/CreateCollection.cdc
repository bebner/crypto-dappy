import DappyContract from "../contracts/DappyContract.cdc"
import DappyNFT from "../contracts/DappyNFT.cdc"
import PackNFT from "../contracts/PackNFT.cdc"
import NFTStorefront from "../contracts/NFTStorefront.cdc"
import NonFungibleToken from "../contracts/NonFungibleToken.cdc"

transaction {
  prepare(acct: AuthAccount) {

    let collectionRef <- acct.load<@AnyResource>(from: DappyContract.CollectionStoragePath)
    destroy collectionRef
    acct.unlink(DappyContract.CollectionPublicPath)
    
    // DappyNFT

    let dappyCollectionRef <- acct.load<@DappyNFT.Collection>(from: DappyNFT.CollectionStoragePath)
    destroy dappyCollectionRef
    acct.unlink(DappyNFT.CollectionPublicPath) 
    acct.unlink(DappyNFT.CollectionPrivatePath)

    // PackNFT

    let packCollectionRef <- acct.load<@PackNFT.Collection>(from: PackNFT.CollectionStoragePath)
    destroy packCollectionRef
    acct.unlink(PackNFT.CollectionPublicPath) 
    acct.unlink(PackNFT.CollectionPrivatePath)

    // Storefront

    let storefrontRef <- acct.load<@NFTStorefront.Storefront>(from: NFTStorefront.StorefrontStoragePath)
    destroy storefrontRef
    acct.unlink(NFTStorefront.StorefrontPublicPath) 

    // Creation section
    // 
    //

    let collection <- DappyContract.createEmptyCollection()
    acct.save<@DappyContract.Collection>(<-collection, to: DappyContract.CollectionStoragePath)
    acct.link<&{DappyContract.CollectionPublic}>(DappyContract.CollectionPublicPath, target: DappyContract.CollectionStoragePath)

    // DappyNFT Collection

    let dappyCollection <- DappyNFT.createEmptyCollection()
    acct.save<@DappyNFT.Collection>(<-dappyCollection, to: DappyNFT.CollectionStoragePath)

    acct.link<&{NonFungibleToken.CollectionPublic}>(DappyNFT.CollectionPublicPath, target: DappyNFT.CollectionStoragePath) 

    acct.link<&{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(DappyNFT.CollectionPrivatePath, target: DappyNFT.CollectionStoragePath) 

    // PackNFT Collection

    let packCollection <- PackNFT.createEmptyCollection()
    acct.save<@PackNFT.Collection>(<-packCollection, to: PackNFT.CollectionStoragePath)

    acct.link<&{NonFungibleToken.CollectionPublic}>(PackNFT.CollectionPublicPath, target: PackNFT.CollectionStoragePath) 

    acct.link<&{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(PackNFT.CollectionPrivatePath, target: PackNFT.CollectionStoragePath)
    
    // NFTStorefront

    let storefront <- NFTStorefront.createStorefront()

    acct.save<@NFTStorefront.Storefront>(<- storefront, to: NFTStorefront.StorefrontStoragePath)

    acct.link<&{NFTStorefront.StorefrontPublic}>(NFTStorefront.StorefrontPublicPath, target: NFTStorefront.StorefrontStoragePath) 

  }
}