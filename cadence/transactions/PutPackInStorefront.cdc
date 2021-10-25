import DappyContract from "../contracts/DappyContract.cdc"
import FUSD from "../contracts/FUSD.cdc"
import NonFungibleToken from "../contracts/NonFungibleToken.cdc"
import FungibleToken from "../contracts/FungibleToken.cdc"
import PackNFT from "../contracts/PackNFT.cdc"
import NFTStorefront from "../contracts/NFTStorefront.cdc"
import GalleryContract from "../contracts/GalleryContract.cdc" 

transaction(dappyIDs: [UInt64], salePrice: UFix64, adminAddress: Address) {

  let dappyColRef: &DappyContract.Collection
  let nftColRef: &PackNFT.Collection
  let nftProviderCapability: Capability<&{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>
  let saleCuts: [NFTStorefront.SaleCut]
  let sellerAddress: Address
  let managerRef: &{NFTStorefront.StorefrontManager}
  
  prepare(acct: AuthAccount) { 

    self.sellerAddress = acct.address

    let adminAccount = getAccount(adminAddress)
    
    self.dappyColRef = acct
      .borrow<&DappyContract.Collection>(
        from: DappyContract.CollectionStoragePath
      )
      ?? panic ("Could not borrow Dappy Col ref")
      
    self.nftColRef = acct
      .borrow<&PackNFT.Collection>(
        from: PackNFT.CollectionStoragePath
      )
      ?? panic ("Could not borrow NFT Col ref")
    
    self.managerRef = acct
      .borrow<&{NFTStorefront.StorefrontManager}>(
        from: NFTStorefront.StorefrontStoragePath
      )
      ?? panic ("Could not borrow StorefrontManager ref")

    self.nftProviderCapability = acct
      .getCapability<&{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(
        PackNFT.CollectionPrivatePath
      )

    let receiver = acct
      .getCapability<&{FungibleToken.Receiver}>(
        /public/fusdReceiver
      )

    self.saleCuts = [ 
      NFTStorefront.SaleCut(
        receiver: receiver, 
        amount: salePrice
      )
    ]

  }

  execute {
    
    let dappies: @{UInt64: DappyContract.Dappy} <- {}

    for dappyID in dappyIDs {
        
        let dappy <- self.dappyColRef.withdraw(withdrawID: 
        dappyID)
        let old <- dappies[dappyID] <- dappy
        destroy old        
        
    }

    let nft <- PackNFT.createFromDappies(dappies: <- dappies)
    
    let nftID = nft.id
    let nftType = Type<@PackNFT.NFT>()
    let salePaymentVaultType = Type<@FUSD.Vault>() 
    self.nftColRef.deposit(token: <- nft)

    let listingResourceID = self.managerRef.createListing(
        nftProviderCapability: self.nftProviderCapability, 
        nftType: nftType,
        nftID: nftID,
        salePaymentVaultType: salePaymentVaultType,
        saleCuts: self.saleCuts
    )
    
  }

}
 