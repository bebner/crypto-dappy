export const PUT_DAPPY_STOREFRONT = `
import DappyContract from 0xDappy
import FungibleToken from 0xFungibleToken
import NonFungibleToken from 0xNonFungibleToken
import FUSD from 0xFUSD
import DappyNFT from 0xMyDappyNFT
import NFTStorefront from 0xNFTStorefront
import GalleryContract from 0xGalleryContract

transaction(dappyID: UInt64, salePrice: UFix64, adminAddress: Address) {

  let dappyColRef: &DappyContract.Collection
  let nftColRef: &DappyNFT.Collection
  let managerRef: &{NFTStorefront.StorefrontManager, NFTStorefront.StorefrontPublic}
  let nftProviderCapability: Capability<&{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>
  let saleCuts: [NFTStorefront.SaleCut]
  let galleryRef: &{GalleryContract.GalleryPublic}
  let sellerAddress: Address

  prepare(acct: AuthAccount) { 

    self.sellerAddress = acct.address

    let adminAccount = getAccount(adminAddress)
    self.galleryRef =adminAccount
      .getCapability<&{GalleryContract.GalleryPublic}>(
        GalleryContract.GalleryPublicPath
      )
      .borrow()
      ?? panic ("Could not borrow GalleryPublic from Admin")

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
    .borrow<&{NFTStorefront.StorefrontManager, NFTStorefront.StorefrontPublic}>(
      from: NFTStorefront.StorefrontStoragePath
      )
      ?? panic ("Could not borrow StorefrontManager ref")

    self.nftProviderCapability = acct
      .getCapability<&{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>(
        DappyNFT.CollectionPrivatePath
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

    let dappy <- self.dappyColRef.withdraw(withdrawID: dappyID)

    let nft <- DappyNFT.createFromDappy(dappy: <- dappy)

    let nftID = nft.id

    let nftType = Type<@DappyNFT.NFT>()
    let salePaymentVaultType = Type<@FUSD.Vault>()
   
    self.nftColRef.deposit(token: <- nft)

    let listingResourceID = self.managerRef.createListing(
      nftProviderCapability: self.nftProviderCapability, 
      nftType: nftType,
      nftID: nftID,
      salePaymentVaultType: salePaymentVaultType,
      saleCuts: self.saleCuts
    ) 

    let listingPublic = self.managerRef
    .borrowListing(listingResourceID: listingResourceID)!

    self.galleryRef.addListing(
      listingPublic: listingPublic,
      sellerAddress: self.sellerAddress
    )

  } 
}
`