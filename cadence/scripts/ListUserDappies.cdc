import DappyContract from "../contracts/DappyContract.cdc"

pub fun main(addr: Address): {UInt64: DappyContract.Template} {
  let account = getAccount(addr)
  let ref = account.getCapability<&{DappyContract.CollectionPublic}>(DappyContract.CollectionPublicPath)
              .borrow() ?? panic("Cannot borrow reference")
  let dappies = ref.listDappies()
  return dappies
}