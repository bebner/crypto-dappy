import React, { useEffect, useState } from 'react'

import { useDrop } from 'react-dnd'
import { useMarket } from '../providers/MarketProvider'
import { useUser } from '../providers/UserProvider'
import Dappy from './Dappy'

export default function BreedPanel() {

    const { mates, addMate, breedDappies } = useMarket()
    const { fetchUserDappies, newDappies } = useUser()
    const [breed, setBreed] = useState(false); //change to false

    const [, drop] = useDrop(() => ({
        accept: 'box',
        drop: item => addMate(item),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        })
    }));

    useEffect(() => {

    }, [newDappies])

    const onBreed = async () => {
        await breedDappies(mates)
        // breading done, fetch the new ones
        await fetchUserDappies()   
        setBreed(true)
            setTimeout(() => {
            setBreed(false)
            fetchUserDappies()
        }, 5000)     
    }

    return (
        <div className="right-panel__wrapper">
            <div>Drop here</div>
            <div>to breed</div>
            <div>⬇</div>
            <div ref={drop} className="right_panel">
                {mates.map((dappy, i) => (

                    <Dappy
                        key={i}
                        dna={dappy.dna}
                    />
                ))
                }
                <div className={` baby_dappies ${breed ? "show" : ""}`}>
                    {newDappies && newDappies.map((dappy, i) => (
                        <Dappy
                            key={i}
                            dna={dappy.dna}
                        />
                    ))
                    }
                </div>

            </div>
            <div
                onClick={onBreed}
                className="btn btn-bordered btn-light btn-bottom">
                <i className="ri-checkbox-multiple-blank-fill btn-icon"></i><br />Make Dappies
            </div>
        </div>

    )
}
