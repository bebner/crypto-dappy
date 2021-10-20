import DappyContract from "../contracts/DappyContract.cdc"
import FUSD from "../contracts/FUSD.cdc"
import NonFungibleToken from "../contracts/NonFungibleToken.cdc"
import FungibleToken from "../contracts/FungibleToken.cdc"
import DappyNFT from "../contracts/DappyNFT.cdc"
import NFTStorefront from "../contracts/NFTStorefront.cdc"


transaction(dappyID: UInt64, saleCuts: {Address: UFix64}) {

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
    
    self.saleCuts = []

    for key in saleCuts.keys {
      let account = getAccount(key)
      let receiver = account
        .getCapability<&{FungibleToken.Receiver}>(
          /public/fusdReceiver
        )
      self.saleCuts.append(
        NFTStorefront.SaleCut(
          receiver: receiver, 
          amount: saleCuts[key]!)
      )   
    }

  }

  execute {

    let dappy <- self.dappyColRef.withdraw(withdrawID: dappyID)

    let nft <- DappyNFT.createFromDappy(dappy: <- dappy)

    let nftID = nft.id

    let nftType = Type<&AnyResource>()
   
    self.nftColRef.deposit(token: <- nft)


    self.managerRef.createListing(
      nftProviderCapability: self.nftProviderCapability, 
      nftID: nftID, 
      saleCuts: self.saleCuts
    ) 


  }
}