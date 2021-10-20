import React from 'react'

import { useDrop } from 'react-dnd'

export default function BreedPanel() {

    const [, drop] = useDrop(() => ({
        accept: 'box',
        drop: item => { },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop(),
        })
    }));

    return (
        <div className="right-panel__wrapper">
            <div>Drop here</div>
            <div>to breed</div>
            <div>⬇</div>
            <div ref={drop} className="right_panel">
            </div>
            <div className="btn btn-bordered btn-light btn-bottom">
                <i className="ri-checkbox-multiple-blank-fill btn-icon"></i><br />Make Dappies
            </div>
        </div>

    )
}
