import React, { useState } from 'react'

import { useMarket } from "../providers/MarketProvider"
import { useInput } from '../hooks/use-input.hook'

import './PriceButton.css'

export default function PriceButton({ dappy }) {
  
  const { listDappyForSale } = useMarket();

  const [sell, setSell] = useState(false);

  const defaultPrice = parseFloat(dappy.price).toFixed(8).slice(0, -6)

  const { value: wantPrice, setValue: setPrice, bind: bindPrice, reset: resetPrice } = useInput(defaultPrice);

  const clickShow = () => {
    setSell(!sell);
  }

  const clickSell = (wantPrice) => {
    listDappyForSale(dappy, wantPrice)
  }

  return (
    <>

        <div className={` price-button__wrapper ${sell?"show":""}`}  >
          <div className="dappy-form__item">
            <label>Want Price {">"}</label>
            <input type="number" step=".01" {...bindPrice} />
          </div>
          <div
            onClick={() => clickSell(wantPrice)}
            className="btn btn-bordered btn-light">
            <i className="ri-store-fill btn-icon"></i>List for Sale
          </div>
        </div>

      <div
        onClick={() => clickShow()}
        className="btn btn-bordered btn-light btn-dappy">
        {sell ? <i className="ri-arrow-up-s-fill btn-icon" />
          :
          <i className="ri-arrow-down-s-fill btn-icon" />
        }
        {parseInt(dappy.price)} FUSD
      </div>

    </>
  )
}
 