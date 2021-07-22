import React from 'react'
import { useHistory } from 'react-router-dom'

import { useUser } from '../providers/UserProvider'
import Dappy from './Dappy'
import "./DappyCard.css"

export default function DappyCard({ dappy, store }) {
  const { userDappies, mintDappy } = useUser()
  const history = useHistory()
  const { id, dna, image, name, rarity, price, type, serialNumber } = dappy
  const owned = userDappies.some(d => d?.id === dappy?.id)

  const DappyButton = () => (
    <div
      onClick={() => mintDappy(id, price)}
      className="btn btn-bordered btn-light btn-dappy">
      <i className="ri-shopping-cart-fill btn-icon"></i> {parseInt(price)} FUSD
    </div>
  )

  const PackButton = () => (
    <div
      onClick={() => history.push(`/packs/${id}`)}
      className="btn btn-bordered btn-light btn-dappy">
      More
    </div>
  )

  return (
    <div className="dappy-card__border">
      <div className={`dappy-card__wrapper ${owned && store && "faded"}`} >
        {type === "Dappy" ? <Dappy dna={dna} /> :
          <img className={`dappy-card__image ${type === "Pack" && "img-large"}`} src={image} alt="Pack" />
        }
        <br />
        <h3 className="dappy-card__title">{name}</h3>
        <p className="dappy-card__info"># {id} {owned && !store && ` / ${serialNumber}`}</p>
        <p className="dappy-card__info">{rarity}</p>
      </div>

      {!owned && type === "Dappy" && <DappyButton />}
      {!owned && type === "Pack" && <PackButton />}

      {store && owned && <div className="collected">Collected</div>}
    </div >
  )
}
