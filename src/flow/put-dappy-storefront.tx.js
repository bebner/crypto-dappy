export const PUT_DAPPY_STOREFRONT = `

import DappyContract from 0xDappy
import FungibleToken from 0xFungibleToken
import NonFungibleToken from 0xNonFungibleToken
import FUSD from 0xFUSD
import DappyNFT from 0xMyDappyNFT
import NFTStorefront from 0xNFTStorefront

transaction(dappyID: UInt64, salePrice: UFix64) {

  let dappyColRef: &DappyContract.Collection
  let nftColRef: &DappyNFT.Collection
  let managerRef: &{NFTStorefront.StorefrontManager}
  let nftProviderCapability: Capability<&{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>
  let saleCuts: [NFTStorefront.SaleCut]

  prepare(acct: AuthAccount) { 

    self.dappyColRef = acct
      .borrow<&DappyContract.Collection>(
        from: DappyContract.CollectionStoragePath
      )
      ?? panic ("Could not borrow Dappy Col ref")
      
    self.nftColRef = acct
      .borrow<&DappyNFT.Collection>(
        from: DappyNFT.CollectionStoragePath
      )
      ?? panic ("Could not borrow NFT Col ref")
    
    self.managerRef = acct
      .borrow<&{NFTStorefront.StorefrontManager}>(
        from: NFTStorefront.StorefrontStoragePath
      )
      ?? panic ("Could not borrow StorefrontManager ref")

    self.nftProviderCapability = acct
      .getCapability<&{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(
        DappyNFT.CollectionPrivatePath
      )
    
    let account = getAccount(acct.address)
    let receiver = account
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

    let dappy <- self.dappyColRef.withdraw(withdrawID: dappyID)

    let nft <- DappyNFT.createFromDappy(dappy: <- dappy)

    let nftID = nft.id

    let nftType = Type<@DappyNFT.NFT>()
    let salePaymentVaultType = Type<@FUSD.Vault>()
   
    self.nftColRef.deposit(token: <- nft)

    self.managerRef.createListing(
      nftProviderCapability: self.nftProviderCapability, 
      nftType: nftType,
      nftID: nftID,
      salePaymentVaultType: salePaymentVaultType,
      saleCuts: self.saleCuts
    ) 

  }
  
}

`