export const LIST_PACKS = `
  import DappyContract from 0xDappy
  
  pub fun main(): [DappyContract.FamilyReport] {
    let families = DappyContract.listFamilies()
    return families
  }
`