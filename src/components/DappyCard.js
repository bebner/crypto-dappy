import React from 'react'
import { useHistory } from 'react-router-dom'

import { useDrag } from 'react-dnd'

import { useUser } from '../providers/UserProvider'
import { useMarket } from '../providers/MarketProvider'

import Dappy from './Dappy'
import "./DappyCard.css"

import PriceButton from './PriceButton'

export default function DappyCard({ dappy, store, designer }) {

  const { userDappies, mintDappy, fetchUserDappies } = useUser()
  const { purchaseDappy } = useMarket()

  const history = useHistory()
  const { id, dna, image, name, rarity, price, type, serialNumber } = dappy
  const owned = userDappies.some(d => d?.id === dappy?.id)

  const [{ opacity }, dragRef] = useDrag(
    () => ({
      type: 'box',
      item: { dappy },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.5 : 1
      })
    }),
    []
  )

  const onPurchase = async() => {
    await purchaseDappy(dappy)
    await fetchUserDappies()  
  }

  const onMint = async() => {
    await mintDappy(id, price)
    await fetchUserDappies()  
  }

  const DappyButton = () => (
      <div
      onClick={onMint}
      className="btn btn-bordered btn-light btn-dappy">
      <i className="ri-shopping-cart-fill btn-icon"></i> {parseInt(price)} FUSD
    </div>
  )
  
  const StorefrontButton = () => (
      <div
      onClick={onPurchase}
      className="btn btn-bordered btn-light btn-storefront">
      <i className="ri-shopping-cart-fill btn-icon"></i> {parseInt(price)} FUSD
    </div>
  )

  const PackButton = () => (

    <div
      onClick={() => history.push(`/packs/${id}`)}      
      className={`btn btn-bordered btn-light btn-dappy ${dappy.sellerAddress && "btn-storefront"}`}>
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
    <div ref={dragRef} style={{ ...opacity }} className="dappy-card__border dappy-card__draggable">
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
          {!owned && type === "Dappy" && !dappy.listingResourceID &&<DappyButton />}
          {!owned && type === "Dappy" && dappy.listingResourceID && <StorefrontButton />}

          {!owned && type === "Dappy" && 
            dappy.listingResourceID &&
            dappy.sellerAddress &&
              <div className="collector"><span>Collector<br/>Sale</span></div>
          }

          {!owned && type === "Pack" && <PackButton />}
          {!owned && type === "Pack" && dappy.sellerAddress &&
            <div className="collector"><span>Collector<br/>Sale</span></div>            
          }
        </>
      }

      {!store && owned && !designer && <PriceButton dappy={dappy}/>}

      {store && owned && !designer && <div className="collected">Collected</div>}
    </div >
  )
}
