import React, { useState } from 'react'

import './PriceButton.css'

export default function PriceButton({ dappy }) {

  const [sell, setSell] = useState(false);

  const clickShow = () => {
    setSell(!sell);
  }

  return (
    <>

        <div className={` price-button__wrapper ${sell?"show":""}`}  >
          <div className="dappy-form__item">
            <label>Want Price {">"}</label>
            <input type="number" step=".01" />
          </div>
          <div className="btn btn-bordered btn-light ">
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
