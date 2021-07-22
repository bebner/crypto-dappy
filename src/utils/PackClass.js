import { ULTRARARE } from "../config/dappies.config"

export class Pack {
  constructor(id, name, price) {
    this._id = id
    this.name = name
    this.dappies = []
    this.price = price
  }

  get rarity() {
    return `${ULTRARARE.emoji} ${ULTRARARE.name}`
  }

  get type() {
    return "Pack"
  }

  get id() {
    return `Pack${this._id}`;
  }

  get size() {
    return this.dappies.length
  }

  get image() {
    return `${process.env.PUBLIC_URL}/assets/${this.id}.png`
  }
}