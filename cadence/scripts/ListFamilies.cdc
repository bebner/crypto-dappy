import DappyContract from "../contracts/DappyContract.cdc"

pub fun main(): [DappyContract.FamilyReport] {
  let families = DappyContract.listFamilies()
  return families
}