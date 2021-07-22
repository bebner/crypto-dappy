import DappyContract from "../contracts/DappyContract.cdc"

pub fun main(): {UInt32: DappyContract.Template} {
  let templates = DappyContract.listTemplates()
  return templates
}