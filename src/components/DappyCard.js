import React from 'react'
import { useHistory } from 'react-router-dom'

import { useUser } from '../providers/UserProvider'
import Dappy from './Dappy'
import "./DappyCard.css"

export default function DappyCard({ dappy, store, designer }) {
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

  const DesignerButton = () => (
    <div
      onClick={() => alert(`${dna} ${name}`)}
      className="btn btn-bordered btn-light btn-dappy">
      <i className="ri-shopping-cart-fill btn-icon"></i> {parseInt(price)} FUSD
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
        {!designer ?
          <p className="dappy-card__info"># {id} {owned && !store && ` / ${serialNumber}`}</p>
          : <input className="dappy-card__info" value={dna} />
        }
        <p className="dappy-card__info">{rarity}</p>
      </div>

      {designer ? <DesignerButton /> :
        <>
          {!owned && type === "Dappy" && <DappyButton />}
          {!owned && type === "Pack" && <PackButton />}
        </>
      }

      {store && owned && !designer && <div className="collected">Collected</div>}
    </div >
  )
}
