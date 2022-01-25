import DappyContract from "../contracts/DappyContract.cdc"
import MetadataViews from "../contracts/MetadataViews.cdc";

pub struct DappyDetails {
  pub let name: String
  pub let description: String
  pub let thumbnail: String

  pub let id: UInt64
  pub let templateId: UInt64
  pub let dna: DappyContract.Dna
  pub let owner: Address

    init(
        name: String,
        description: String,
        thumbnail: String,
        id: UInt64,
        templateId: UInt64,
        dna: DappyContract.Dna,
        owner: Address,
    ) {
        self.name = name
        self.description = description
        self.thumbnail = thumbnail
        self.id = id
        self.templateId = templateId
        self.dna = dna
        self.owner = owner
    }
}

pub fun dwebURL(_ file: MetadataViews.IPFSFile): String {
    var url = "https://"
        .concat(file.cid)
        .concat(".ipfs.dweb.link/")
    
    if let path = file.path {
        return url.concat(path)
    }
    
    return url
}

pub fun main(addr: Address): [DappyDetails]? {
  var dappies: [DappyDetails] = []
  let account = getAccount(addr)
  if let collection = account.getCapability<&{DappyContract.CollectionPublic}>(DappyContract.CollectionPublicPath).borrow() {
    let dappiesId = collection.getIDs()
    for id in dappiesId {
      if let dappy = collection.borrowDappy(id: id) {
        if let view = dappy.resolveView(Type<MetadataViews.Display>()) {
          let display = view as! MetadataViews.Display
          let ipfsThumbnail = display.thumbnail as! MetadataViews.IPFSFile
          dappies.append(DappyDetails(
            name: display.name,
            description: display.description,
            thumbnail: dwebURL(ipfsThumbnail),
            id: dappy.id,
            templateId: dappy.data.templateID,
            dna: dappy.data.dna, 
            owner: addr,
          ))
        }
      }
    }
    return dappies
  }
  return nil
}