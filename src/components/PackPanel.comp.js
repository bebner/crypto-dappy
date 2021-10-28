import React, { useEffect } from 'react'

import { useDrop } from 'react-dnd'
import { useMarket } from '../providers/MarketProvider'
import { useInput } from '../hooks/use-input.hook'

import Dappy from './Dappy'

export default function PackPanel() {

    const { packPrice, userPack, addToPack, listPackForSale } = useMarket()

    const { value: wantPrice, setValue: setPrice, bind: bindPrice } = useInput(packPrice);

    useEffect(() => {
        setPrice(packPrice)
    }, [setPrice, packPrice])

    const [, drop] = useDrop(() => ({
        accept: 'box',
        drop: item => addToPack(item),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        })
    }));

    return (
        <>
            <div className="left-panel__wrapper">
                <div>Drag here</div>
                <div>to pack</div>
                <div>⬇</div>

                <div ref={drop}
                    className="left_panel">
                    {userPack.map((dappy, i) => (

                        <Dappy
                            key={i}
                            dna={dappy.dna}
                        />
                    ))
                    }
                    <div className="dappy-form__item input-bottom ">
                        <label>Want Price</label>
                        <input type="number" step=". 01" {...bindPrice} />
                    </div>
                </div>
                <div
                    onClick={() => listPackForSale(userPack,parseFloat(wantPrice))}
                    className="btn btn-bordered btn-light btn-bottom">
                    <i className="ri-red-packet-fill btn-icon"></i><br />Sell Pack
                </div>
            </div>

        </>


    )
}
