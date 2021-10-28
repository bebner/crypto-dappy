import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import Spinner from '../components/Spinner'
import "./PackDetails.page.css"
import { useMarket } from '../providers/MarketProvider'
import { Pack } from '../utils/PackClass'

export default function PackDetails() {
  const [pack, setPack] = useState(null)
  const [dappies, setDappies] = useState([])
  const { packID } = useParams()

  const { fetchDappiesOfPack, mintFromPack, fetchPackDetails, dappyPacks, purchasePackStorefront } = useMarket()

  useEffect(() => {

    if (!packID.startsWith("UserPack"))
      fetchDappies()
    else
      fetchUserPack()

    //eslint-disable-next-line
  }, [])

  const fetchDappies = async () => {
    let dappiesOfPack = await fetchDappiesOfPack(parseInt(packID.replace("Pack", "")))
    setDappies(dappiesOfPack)
    let packDetails = await fetchPackDetails(parseInt(packID.replace("Pack", "")))
    setPack(packDetails)
  }

  const fetchUserPack = async () => {
    console.log(dappyPacks)
    // TODO: Bug: cannot refresh page, the state is gone
    let id = (packID.replace("UserPack", ""))
    let found = dappyPacks.find(ele => ele.familyID === id)
    let packDetails = new Pack(
      found?.familyID,
      found?.name,
      found?.price,
      found?.sellerAddress
    )
    setDappies(found?.templates.map(ele => ele.templateID))
    setPack(packDetails)
  }
  
  const clickPurchase = async () => {
    const listingResourceID = parseInt(packID.replace("UserPack", "") )
    purchasePackStorefront(listingResourceID, pack.sellerAddress)
  }

  if (!pack) return <Spinner />

  return (
    <div className="packdetails__wrapper">
      <img className="pack__img" src={pack?.image} alt='Pack' />
      <div className="pack__content">
        <h3 className="app__title">{pack?.name}</h3>
        {!pack?.sellerAddress ?
          <div
            onClick={() => mintFromPack(packID, dappies, pack?.price)}
            className="btn btn-bordered btn-light"
            style={{ width: "60%", margin: "0 auto", display: "flex", justifyContent: "center" }}>
            <i className="ri-shopping-cart-fill" style={{ fontSize: "1.2rem", marginRight: ".2rem" }}></i> {parseInt(pack?.price)} FUSD
          </div>
          :
          <div
            onClick={() => clickPurchase()}
            className="btn btn-bordered btn-light btn-storefront"
            style={{ width: "60%", margin: "0 auto", display: "flex", justifyContent: "center" }}>
            <i className="ri-shopping-cart-fill" style={{ fontSize: "1.2rem", marginRight: ".2rem" }}></i> {parseInt(pack?.price)} FUSD
          </div>
        }
        <p>Dappies included:</p>
        <p>
          {dappies.map((d, i) => ` #${d} `)}
        </p>
      </div>
    </div>
  )
}
