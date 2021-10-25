export const LIST_USER_DAPPIES_IDS = `
  import DappyContract from 0xDappy

  pub fun main(addr: Address): [UInt64]? {
    let account = getAccount(addr)
    
    if let ref = account.getCapability<&{DappyContract.CollectionPublic}>(DappyContract.CollectionPublicPath)
                .borrow() {
                  let dappies = ref.getIDs()
                  return dappies
                }
    
    return nil
  }
`