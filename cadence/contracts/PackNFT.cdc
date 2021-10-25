import NonFungibleToken from "./NonFungibleToken.cdc"
import DappyContract from "./DappyContract.cdc"

pub contract PackNFT: NonFungibleToken {

    pub let CollectionStoragePath: StoragePath
    pub let CollectionPublicPath: PublicPath
    pub let CollectionPrivatePath: PrivatePath

    pub var totalSupply: UInt64

    pub event ContractInitialized()

    pub event Withdraw(id: UInt64, from: Address?)

    pub event Deposit(id: UInt64, to: Address?)

    pub resource NFT: NonFungibleToken.INFT  {
      
        pub let id: UInt64
        access(self) var nft: @{UInt64: DappyContract.Dappy}
        access(self) var dappyIDs: [UInt64]
        access(self) var data: {UInt64: DappyContract.Template}
        
        pub init(nft: @{UInt64: DappyContract.Dappy}) {
            
            self.dappyIDs = nft.keys

            let temp: @{UInt64: DappyContract.Dappy} <- {}
            self.data = {}
            for key in nft.keys {
                let x <- nft[key] <- nil
                self.data[key] = x?.data
                let old <- temp[key] <- x
                destroy old
            }
            self.nft <- temp
            destroy nft

            PackNFT.totalSupply = PackNFT.totalSupply + (1 as UInt64)
            self.id = PackNFT.totalSupply

        }

        pub fun withdrawDappies(): @{UInt64: DappyContract.Dappy} {
            let ret: @{UInt64: DappyContract.Dappy} <- {}
            for id in self.dappyIDs {
                let x <- self.nft[id] <- nil
                let old <- ret[id] <- x
                destroy old
            }
            self.dappyIDs = []
            self.data = {}
            return <- ret
           
            // let ret <- self.nft <-nil
            // return <- ret
        }

        pub fun getIDs(): [UInt64] {
            return self.dappyIDs
        }       

        pub fun getData(): {UInt64: DappyContract.Template} {
            return self.data
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

        pub fun borrowNFT(id: UInt64): auth &NonFungibleToken.NFT {

            return &self.ownedNFTs[id] as auth &NonFungibleToken.NFT

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

    pub fun createFromDappies(dappies: @{UInt64:
    DappyContract.Dappy}): @NFT {

        return <- create NFT(
            nft: <- dappies
        )
        
    }

    init() {

        self.CollectionStoragePath = /storage/PackNFTCollection
        self.CollectionPublicPath = /public/PackNFTCollection
        self.CollectionPrivatePath = /private/PackNFTCollection

        self.totalSupply = 0

    }
}
 