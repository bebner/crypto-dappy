import React, { useEffect, useState } from 'react'

import { calculatePrice, createRandomDappies } from '../utils/dappies.utils'
import DappyClass from '../utils/DappyClass'
import DappyList from '../components/DappyList'
import Header from '../components/Header'
import "./Designer.page.css"

export default function Designer() {
  const [dappies, setDappies] = useState([])
  const [theme, setTheme] = useState(false)
  const [customRarity, setCustomRarity] = useState(false)
  const [fullRandom, setFullRandom] = useState(false)
  const [baseColor, setBaseColor] = useState()

  useEffect(() => {
    createDappies()
    //eslint-disable-next-line
  }, [theme, fullRandom, customRarity, baseColor])

  const createDappies = () => {
    const DAPPIES = createRandomDappies(12, { theme, customRarity, fullRandom, baseColor })
    const mappedDappies = () => {
      return DAPPIES.map(d => new DappyClass(d?.templateID, d?.dna, d?.name, calculatePrice(d?.dna?.length)))
    }
    setDappies(mappedDappies)
  }

  const randomize = (e) => {
    e.preventDefault()
    setTheme(false)
    setCustomRarity(false)
    setFullRandom(false)
    setBaseColor()
  }

  return (
    <div>
      <Header
        title={<><span className="highlight">Dappy</span>Designer</>}
        subtitle={<>Design <span className="highlight">your own</span> Dappies</>}
      />
      <form className="designer__form">
        <div className="designer__form__item">
          <label for="theme">Theme</label>
          <select value={theme} onChange={(e) => setTheme(e.target.value)} name="theme">
            <option value={false}>none</option>
            <option value={"mono"} >mono</option>
            <option value={"complement"} >complement</option>
            <option value={"split"} >split</option>
            <option value={"double"} >double</option>
            <option value={"ana"} >ana</option>
            <option value={"tri"} >tri</option>
          </select>
        </div>
        <div className="designer__form__item">
          <label for="random">Random</label>
          <select value={fullRandom} onChange={(e) => setFullRandom(e.target.value)} name="random">
            <option value={false}>guided</option>
            <option value={true} >random</option>
          </select>
        </div>
        <div className="designer__form__item">
          <label for="rarity">Rarity</label>
          <select value={customRarity} onChange={(e) => setCustomRarity(e.target.value)} name="rarity">
            <option value={3}>3</option>
            <option value={4} >4</option>
            <option value={5} >5</option>
          </select>
        </div>
        <div className="designer__form__item">
          <label for="baseColor">Base Color</label>
          <select value={baseColor} onChange={(e) => setBaseColor(e.target.value)} name="baseColor">
            <option value={""}>None</option>
            <option value={"red"}>Red</option>
            <option value={"orange"} >Orange</option>
            <option value={"yellow"} >Yellow</option>
            <option value={"green"} >Green</option>
            <option value={"blue"} >Blue</option>
            <option value={"pink"} >Pink</option>
          </select>
        </div>
        <button onClick={(e) => randomize(e)}>Full Random</button>
      </form>
      <DappyList dappies={dappies} designer />
    </div>
  )
}
