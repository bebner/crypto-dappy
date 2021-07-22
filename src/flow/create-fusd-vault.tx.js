export const CREATE_FUSD_VAULT = `
  import FungibleToken from 0xFungibleToken
  import FUSD from 0xFUSD

  transaction {
    prepare(signer: AuthAccount) {
      if(signer.borrow<&FUSD.Vault>(from: /storage/fusdVault) != nil) {
        return
      }
    
      signer.save(<-FUSD.createEmptyVault(), to: /storage/fusdVault)

      signer.link<&FUSD.Vault{FungibleToken.Receiver}>(
        /public/fusdReceiver,
        target: /storage/fusdVault
      )

      signer.link<&FUSD.Vault{FungibleToken.Balance}>(
        /public/fusdBalance,
        target: /storage/fusdVault
      )
    }
  }
`