export const LIST_USER_DAPPIES = `
  import DappyContract from 0xDappy

  pub fun main(addr: Address): {UInt64: DappyContract.Template}? {
    let account = getAccount(addr)
    
    if let ref = account.getCapability<&{DappyContract.CollectionPublic}>(DappyContract.CollectionPublicPath)
                .borrow() {
                  let dappies = ref.listDappies()
                  return dappies
                }
    
    return nil
  }
`