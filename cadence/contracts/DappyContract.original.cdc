
import FungibleToken from "./FungibleToken.cdc"

pub contract DappyContract {
  access(self) var templates: {UInt32: Template}
  access(self) var families: @{UInt32: Family}
  
  pub var nextTemplateID: UInt32
  pub var nextFamilyID: UInt32
  pub var totalDappies: UInt64
  
  pub let CollectionStoragePath: StoragePath
  pub let CollectionPublicPath: PublicPath
  pub let AdminStoragePath: StoragePath

  pub struct Template {
    pub let templateID: UInt32
    pub let dna: String
    pub let name: String
    pub let price: UFix64

    init(templateID: UInt32, dna: String, name: String) {
      self.templateID = templateID
      self.dna = dna
      self.name = name
      self.price = self._calculatePrice(dna: dna.length)
    }

    access(self) fun _calculatePrice(dna: Int): UFix64 {
      if dna >= 31 {
        return 21.0
      } else if dna >= 25 {
        return 14.0
      } else {
        return 7.0
      }
    }
  }

  pub resource Dappy {
    pub let id: UInt64
    pub let data: Template

    init(templateID: UInt32) {
      pre {
        DappyContract.templates[templateID] != nil : "Could not create dappy: template does not exist."
      }
      let dappy = DappyContract.templates[templateID]!
      DappyContract.totalDappies = DappyContract.totalDappies + 1
      self.id = DappyContract.totalDappies
      self.data = Template(templateID: templateID, dna: dappy.dna, name: dappy.name)
    }
  }

  pub resource Family {
    pub let name: String
    pub let familyID: UInt32
    pub var templates: [UInt32]
    pub var lazy: {UInt32: Bool}
    pub var price: UFix64
    
    init(name: String, price: UFix64) {
      pre {
        name.length > 0: "Could not create family: name is required."
        price > 0.00 : "Could not create family: price is required to be higher than 0."
      }
      self.name = name
      self.price = price
      self.familyID = DappyContract.nextFamilyID
      self.templates = []
      self.lazy = {}
      DappyContract.nextFamilyID = DappyContract.nextFamilyID + 1
    }

    pub fun addTemplate(templateID: UInt32) {
      pre {
        DappyContract.templates[templateID] != nil : "Could not add dappy to pack: template does not exist."
      }
      self.templates.append(templateID)
      self.lazy[templateID] = false
    }

    pub fun mintDappy(templateID: UInt32): @Dappy {
      pre {
        self.templates.contains(templateID): "Could not mint dappy: template does not exist."
        !self.lazy[templateID]!: "Could not mint Dappy: template has been retired."
      }
      return <- create Dappy(templateID: templateID)
    }
  }

  pub struct FamilyReport {
    pub let name: String
    pub let familyID: UInt32
    pub var templates: [UInt32]
    pub var lazy: {UInt32: Bool}
    pub var price: UFix64
    
    init(name: String, familyID: UInt32, templates: [UInt32], lazy: {UInt32: Bool}, price: UFix64) {
      self.name = name
      self.familyID = familyID
      self.templates = []
      self.lazy = {}
      self.price = price
    }
  }

  pub resource Admin {
    pub fun createTemplate(dna: String, name: String): UInt32 {
      pre {
        dna.length > 0 : "Could not create template: dna is required."
        name.length > 0 : "Could not create template: name is required."
      }
      let newDappyID = DappyContract.nextTemplateID
      DappyContract.templates[newDappyID] = Template(templateID: newDappyID, dna: dna, name: name)
      DappyContract.nextTemplateID = DappyContract.nextTemplateID + 1
      return newDappyID
    }

    pub fun destroyTemplate(dappyID: UInt32) {
      pre {
        DappyContract.templates[dappyID] != nil : "Could not delete template: template does not exist."
      }
      DappyContract.templates.remove(key: dappyID)
    }

    pub fun createFamily(name: String, price: UFix64) {
      let newFamily <- create Family(name: name, price: price)
      DappyContract.families[newFamily.familyID] <-! newFamily
    }

    pub fun borrowFamily(familyID: UInt32): &Family {
      pre {
        DappyContract.families[familyID] != nil : "Could not borrow family: family does not exist."
      }
      return &DappyContract.families[familyID] as &Family
    }

    pub fun destroyFamily(familyID: UInt32) {
      pre {
        DappyContract.families[familyID] != nil : "Could not borrow family: family does not exist."
      }
      let familyToDelete <- DappyContract.families.remove(key: familyID)!
      destroy familyToDelete
    }
  }

  pub resource interface CollectionPublic {
    pub fun deposit(token: @Dappy)
    pub fun getIDs(): [UInt64]
    pub fun listDappies(): {UInt64: Template}
  }

  pub resource interface Provider {
    pub fun withdraw(withdrawID: UInt64): @Dappy
  }

  pub resource interface Receiver{
    pub fun deposit(token: @Dappy)
    pub fun batchDeposit(collection: @Collection)
  }

  pub resource Collection: CollectionPublic, Provider, Receiver {
    pub var ownedDappies: @{UInt64: Dappy}

    pub fun withdraw(withdrawID: UInt64): @Dappy {
      let token <- self.ownedDappies.remove(key: withdrawID) 
        ?? panic("Could not withdraw dappy: dappy does not exist in collection")
      return <-token
    }

    pub fun deposit(token: @Dappy) {
      let oldToken <- self.ownedDappies[token.id] <- token
      destroy oldToken
    }

    pub fun batchDeposit(collection: @Collection) {
      let keys = collection.getIDs()
      for key in keys {
        self.deposit(token: <-collection.withdraw(withdrawID: key))
      }
      destroy collection
    }

    pub fun getIDs(): [UInt64] {
      return self.ownedDappies.keys
    }

    pub fun listDappies(): {UInt64: Template} {
      var dappyTemplates: {UInt64:Template} = {}
      for key in self.ownedDappies.keys {
        let el = &self.ownedDappies[key] as &Dappy
        dappyTemplates.insert(key: el.id, el.data)
      }
      return dappyTemplates
    }

    destroy() {
      destroy self.ownedDappies
    }

    init() {
      self.ownedDappies <- {}
    }
  }

  pub fun createEmptyCollection(): @Collection {
    return <-create self.Collection()
  }

  pub fun mintDappy(templateID: UInt32, paymentVault: @FungibleToken.Vault): @Dappy {
    pre {
      self.templates[templateID] != nil : "Could not mint dappy: dappy with given ID does not exist."
      paymentVault.balance >= self.templates[templateID]!.price : "Could not mint dappy: payment balance insufficient."
    }
    destroy paymentVault
    return <- create Dappy(templateID: templateID)
  }

  pub fun mintDappyFromFamily(familyID: UInt32, templateID: UInt32, paymentVault: @FungibleToken.Vault): @Dappy {
    pre {
      self.families[familyID] != nil : "Could not mint dappy from family: family does not exist."
      self.templates[templateID] != nil : "Could not mint dappy from family: template does not exist."
    }
    let familyRef = &self.families[familyID] as! &Family
    if familyRef.price > paymentVault.balance {
      panic("Could not mint dappy from family: payment balance is not sufficient.")
    }
    destroy paymentVault
    return <- familyRef.mintDappy(templateID: templateID)
  }

  pub fun batchMintDappiesFromFamily(familyID: UInt32, templateIDs: [UInt32], paymentVault: @FungibleToken.Vault): @Collection {
    pre {
      templateIDs.length > 0 : "Could not batch mint dappies from family: at least one templateID is required."
      templateIDs.length <= 5 : "Could not batch mint dappies from family: batch mint limit of 5 dappies exceeded."
      self.families[familyID] != nil : "Could not batch mint dappies from family: family does not exist."
    }

    let familyRef = &self.families[familyID] as! &Family
    if familyRef.price > paymentVault.balance {
      panic("Could not batch mint dappy from family: payment balance is not sufficient.")
    }
    let collection <- create Collection()

    for ID in templateIDs {
      if !self.familyContainsTemplate(familyID: familyID, templateID: ID) {
        continue
      }
      collection.deposit(token: <- create Dappy(templateID: ID))
    }
    destroy paymentVault
    return <-collection
  }

  pub fun listTemplates(): {UInt32: Template} {
    return self.templates
  }

  pub fun listFamilies(): [FamilyReport] {
    var families: [FamilyReport] = []
    for key in self.families.keys {
      let el = &self.families[key] as &Family
      families.append(FamilyReport(
        name: el.name, 
        familyID: el.familyID, 
        templates: el.templates, 
        lazy: el.lazy, 
        price: el.price
      ))
    }
    return families
  }

  pub fun listFamilyTemplates(familyID: UInt32): [UInt32] {
    pre {
      self.families[familyID] != nil : "Could not list family templates: family does not exist."
    }
    var report: [UInt32] = []
    let el = &self.families[familyID] as! &Family
    for temp in el.templates {
      report.append(temp)
    }
    return report
  }

  pub fun getFamily(familyID: UInt32): FamilyReport {
    pre {
      self.families[familyID] != nil : "Could not get family: family does not exist."
    }
    let el = &self.families[familyID] as! &Family
    let report = FamilyReport(
      name: el.name, 
      familyID: el.familyID, 
      templates: el.templates, 
      lazy: el.lazy, 
      price: el.price
    )
    return report
  }

  pub fun familyContainsTemplate(familyID: UInt32, templateID: UInt32): Bool {
    pre {
      self.families[familyID] != nil : "Family does not exist"
    }
    let el = &self.families[familyID] as! &Family
    return el.templates.contains(templateID)
  }

  init() {
    self.templates = {}
    self.totalDappies = 0
    self.nextTemplateID = 1
    self.nextFamilyID = 1
    self.CollectionStoragePath = /storage/DappyCollection
    self.CollectionPublicPath = /public/DappyCollectionPublic
    self.AdminStoragePath = /storage/DappyAdmin
    self.account.save<@Admin>(<- create Admin(), to: self.AdminStoragePath)
    self.families <- {}
  }

}