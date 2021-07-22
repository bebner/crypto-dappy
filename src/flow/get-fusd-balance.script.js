export const GET_FUSD_BALANCE = `
  import FungibleToken from 0xFungibleToken
  import FUSD from 0xFUSD

  pub fun main(address: Address): UFix64? {
    let account = getAccount(address)
    if let vaultRef = account.getCapability(/public/fusdBalance).borrow<&FUSD.Vault{FungibleToken.Balance}>() {
      return vaultRef.balance
    } 
    return nil
  }
`