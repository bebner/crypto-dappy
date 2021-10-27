import DappyContract from "../contracts/DappyContract.cdc"
import FUSD from "../contracts/FUSD.cdc"

transaction (maleID: UInt64, femaleID: UInt64) {

  let collectionRef: &DappyContract.Collection
  let dappies: {UInt64: DappyContract.Template}
  let vaultRef: &FUSD.Vault
  var random: UInt64
  let step: UInt64
  
  // Dappy DNA MUST be parsed into array before passing to this transaction
  let maleID: UInt64
  let femaleID: UInt64

  prepare(acct: AuthAccount) {    
    self.maleID = maleID
    self.femaleID = femaleID
    self.random = 52090100 // to test on playground
    self.step  = 77 // to test on playground
    fun reconstructDNA(_ prepDNA: [String]): String {
      pre {
        prepDNA.length > 3: "DNA must have at least 4 sequences"
        prepDNA.length < 7: "DNA must have at most 6 sequences"
      }
      var construct:String = ""
      let n = prepDNA.length
      var i = 0
      while i < n - 1  {
        construct = construct.concat(prepDNA[i]).concat(".")
        i = i + 1
      }
      construct = construct.concat(prepDNA[n-1])
      return construct
    }

    self.collectionRef = acct.borrow<&DappyContract.Collection>(from: DappyContract.CollectionStoragePath)
      ?? panic("Could not borrow collection ref")
    self.dappies =self.collectionRef.listDappies()
    self.dappies[self.maleID]??panic("Male ID does not exist in collection")
    self.dappies[self.femaleID]??panic("Female ID does not exist in collection")    
    self.vaultRef = acct.borrow<&FUSD.Vault>(from: /storage/fusdVault) ?? panic("Could not borrow FUSD vault")    

  }

  execute {
    fun parseDNA(_ dna: String): [String] {
        var i  = 0
        var buffer = ""
        var ret: [String] = []
        while i < dna.length {
            let c = dna.slice(from: i, upTo: i+1)
            if c != "." {
                buffer = buffer.concat( c )
            } else {
                ret.append(buffer)
                buffer = ""
            }
            i = i + 1
        }
        if buffer != "" {
            ret.append(buffer)
        }
        return ret
    }    
    fun luck(_ mod: UInt64): UInt64 {
      let play = false // unsafeRandom will not work in playground 
      let x: UInt64 = play? self.random  : unsafeRandom()
      self.random  = self.random + self.step
      return x - x/mod * mod
    }
    fun max(_ a: UInt64, _ b: UInt64): UInt64 {      
      return a>b ? a:b
    }
    fun min(_ a: UInt64, _ b: UInt64): UInt64 {      
      return a<b ? a:b
    }
    fun combo(_ dnaA:[String], _ dnaB:[String]): [String] {
      var ret: [String] = []
      ret.appendAll(dnaA)
      ret.appendAll(dnaB)
      return ret      
    }
    fun gen(_ a: [String], _ b: [String]): String
    {
      // let eye = [ maleDNA[maleDNA.length - 1 ],  femaleDNA[femaleDNA.length - 1 ] ] [ luck(2) ]
      let eye = [ a.removeLast(),  b.removeLast()] [ luck(2) ]
      var dna: String = ""

      var baseDNA = combo(a, b)

      let stripes = max(3,  min( luck(5) + 1, UInt64(baseDNA.length) ) ) // from 3 to 5 or less
      var i = 0 as UInt64
      while i < stripes {        
        let j = luck( UInt64( baseDNA.length ) )
        dna = dna.concat(baseDNA.remove(at: j))
        dna = dna.concat(".")
        i = i + 1
      }
      dna = dna.concat(eye)
      return dna
    }

    let maleDNA = parseDNA(self.dappies[self.maleID]!.dna)
    let femaleDNA = parseDNA(self.dappies[self.femaleID]!.dna)

    

    let count = luck(4) + 1

    let col <- DappyContract.createEmptyCollection()
    var i = 0 as UInt64
    while i < count {      
      let dna = gen(maleDNA, femaleDNA)
      
      // for demo purposes I won't justify the mint fee
      let name = "Lab Bred"
      
      let template = DappyContract.Template(templateID: 0, dna: dna, name: name)
      let paymentVault <- self.vaultRef.withdraw(amount: template.price)
      let dappy <- DappyContract.mintWithData(data: template, paymentVault: <- paymentVault)
      col.deposit(token: <-dappy)
      i = i + 1
      log(template)
    }
    assert(false, message: count.toString())
    self.collectionRef.batchDeposit(collection: <-col)
    destroy <- self.collectionRef.withdraw(withdrawID: self.maleID)
    destroy <- self.collectionRef.withdraw(withdrawID: self.femaleID)

  }

}

