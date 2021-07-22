import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import useDappyPacks from '../hooks/use-dappy-packs.hook'
import Spinner from '../components/Spinner'
import "./PackDetails.page.css"

export default function PackDetails() {
  const [pack, setPack] = useState(null)
  const [dappies, setDappies] = useState([])
  const { packID } = useParams()
  const { fetchDappiesOfPack, mintFromPack, fetchPackDetails } = useDappyPacks()

  useEffect(() => {
    fetchDappies()
    //eslint-disable-next-line
  }, [])

  const fetchDappies = async () => {
    let dappiesOfPack = await fetchDappiesOfPack(parseInt(packID.replace("Pack", "")))
    setDappies(dappiesOfPack)
    let packDetails = await fetchPackDetails(parseInt(packID.replace("Pack", "")))
    setPack(packDetails)
  }

  if (!pack) return <Spinner />

  return (
    <div className="packdetails__wrapper">
      <img className="pack__img" src={`${process.env.PUBLIC_URL}/assets/${packID}.png`} alt='Pack' />
      <div className="pack__content">
        <h3 className="app__title">{pack?.name}</h3>
        <div
          onClick={() => mintFromPack(packID, dappies, pack?.price)}
          className="btn btn-bordered btn-light"
          style={{ width: "60%", margin: "0 auto", display: "flex", justifyContent: "center" }}>
          <i className="ri-shopping-cart-fill" style={{ fontSize: "1.2rem", marginRight: ".2rem" }}></i> {parseInt(pack?.price)} FUSD
        </div>
        <p>Dappies included:</p>
        <p>
          {dappies.map((d, i) => ` #${d} `)}
        </p>
      </div>
    </div>
  )
}
