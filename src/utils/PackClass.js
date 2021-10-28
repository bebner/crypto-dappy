import { ULTRARARE } from "../config/dappies.config"

export class Pack {
  constructor(id, name, price, sellerAddress) {
    this._id = id
    this.name = name
    this.dappies = []
    this.price = price
    this.sellerAddress = sellerAddress
  }

  get rarity() {
    return `${ULTRARARE.emoji} ${ULTRARARE.name}`
  }

  get type() {
    return "Pack"
  }

  get id() {
    return this.sellerAddress ? 
    `UserPack${this._id}`
    :
    `Pack${this._id}` 

  }

  get size() {
    return this.dappies.length
  }

  get image() {
    return this.sellerAddress ? 
    `${process.env.PUBLIC_URL}/assets/Pack4.png`
      :
    `${process.env.PUBLIC_URL}/assets/${this.id}.png`
  }
}