export const PUT_PACK_STOREFRONT = `
import DappyContract from 0xDappy
import FUSD from 0xFUSD
import FungibleToken from 0xFungibleToken
import NonFungibleToken from 0xNonFungibleToken
import PackNFT from 0xPackNFT
import NFTStorefront from 0xNFTStorefront
import GalleryContract from 0xGalleryContract

transaction(dappyIDs: [UInt64], salePrice: UFix64, adminAddress: Address) {

    let dappyColRef: &DappyContract.Collection
    let nftColRef: &PackNFT.Collection
    let managerRef: &{NFTStorefront.StorefrontManager, NFTStorefront.StorefrontPublic}
    let nftProviderCapability: Capability<&{NonFungibleToken.Provider, NonFungibleToken.CollectionPublic}>
    let saleCuts: [NFTStorefront.SaleCut]
    let sellerAddress: Address
    let galleryRef: &{GalleryContract.GalleryPublic}

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
        .borrow<&PackNFT.Collection>(
          from: PackNFT.CollectionStoragePath
        )
        ?? panic ("Could not borrow NFT Col ref")
      
      self.managerRef = acct
        .borrow<&{NFTStorefront.StorefrontManager, NFTStorefront.StorefrontPublic}>(
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

      let listingPublic = self.managerRef
      .borrowListing(listingResourceID: listingResourceID)!

      self.galleryRef.addListing(
      listingPublic: listingPublic,
      sellerAddress: self.sellerAddress
      )
      
    }
  
  }
`