import React from 'react'
import { useHistory } from 'react-router-dom'
import useDappyMarket from '../hooks/use-dappy-market.hook'

import { useUser } from '../providers/UserProvider'
import Dappy from './Dappy'
import "./DappyCard.css"

export default function DappyCard({ dappy, store, designer, listed, market}) {
  const { userDappies, mintDappy } = useUser()
  const history = useHistory()
  const {buyDappyOnMarket, removeDappyFromMarket, listDappyOnMarket} = useDappyMarket()
  const { id, dna, image, name, rarity, price, type, serialNumber } = dappy
  const owned = userDappies.some(d => d?.id === dappy?.id)

  const ListOnMarketButton = () => (
    <div
      onClick={() => listDappyOnMarket()}
      className="btn btn-bordered btn-light btn-dappy">
      <i className="ri-list-unordered btn-icon"></i>LIST
    </div>
  )

  const RemoveFromMarketButton = () => (
    <div
      onClick={() => removeDappyFromMarket()}
      className="btn btn-bordered btn-light btn-dappy">
      <i className="ri-close-line btn-icon"></i>REMOVE
    </div>
  )

  const BuyFromMarketButton = () => (
    <div
      onClick={() => buyDappyOnMarket()}
      className="btn btn-bordered btn-light btn-dappy">
      <i className="ri-store-2-line btn-icon"></i>{parseInt(price)} FUSD
    </div>
  )

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
        <>{market && owned && !listed && <ListOnMarketButton/>}
          {market && owned && listed && <RemoveFromMarketButton/>}
          {market && !owned && <BuyFromMarketButton />}
          {!market && !owned && type === "Dappy" && <DappyButton />}
          {!owned && type === "Pack" && <PackButton />}
        </>
      }

      {store && owned && !designer && <div className="collected">Collected</div>}
    </div >
  )
}
