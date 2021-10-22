import NonFungibleToken from "./NonFungibleToken.cdc"
import DappyContract from "./DappyContract.cdc"

pub contract DappyNFT: NonFungibleToken {

    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath
    pub let CollectionPrivatePath: PrivatePath

    pub var totalSupply: UInt64

    pub event ContractInitialized()

    pub event Withdraw(id: UInt64, from: Address?)

    pub event Deposit(id: UInt64, to: Address?)

    pub resource NFT: NonFungibleToken.INFT  {
      
        pub let id: UInt64
        pub let nft: @DappyContract.Dappy 

        pub init(nft: @DappyContract.Dappy) {

          self.id = nft.id 
          self.nft <- nft
          DappyNFT.totalSupply = DappyNFT.totalSupply + UInt64(1)

        }

        destroy () {
          destroy self.nft
        }
    }

    pub resource Collection: NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic {

        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT} 

        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {

          let token <- self.ownedNFTs.remove(key: withdrawID) 
                ?? panic("Cannot withdraw: NFT does not exist in the collection")
          emit Withdraw(id: token.id, from:self.owner?.address)
          return <-token

        }

        pub fun deposit(token: @NonFungibleToken.NFT) {

            let token <- token
            let id = token.id
            let oldToken <- self.ownedNFTs[id] <- token
            
            if self.owner?.address != nil {
                emit Deposit(id: id, to: self.owner?.address)
            }

            destroy oldToken

        }

        pub fun getIDs(): [UInt64] {

            return self.ownedNFTs.keys

        }

        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {

            return &self.ownedNFTs[id] as &NonFungibleToken.NFT

        }

        init () {

            self.ownedNFTs <- {}

        }

        destroy() {

            destroy self.ownedNFTs

        }

    }

    pub fun createEmptyCollection(): @Collection {

        return <-create Collection()

    }

    pub fun createFromDappy(dappy: @DappyContract.Dappy): @NFT {

        return <- create NFT(
            nft: <- dappy
        )
        
    }

    init() {

        self.CollectionStoragePath = /storage/DappyNFTCollection
        self.CollectionPublicPath = /public/DappyNFTCollection
        self.CollectionPrivatePath = /private/DappyNFTCollection

        self.totalSupply = 0

    }
}
 