
import React, { Component, PropTypes } from 'react'

const style = {
    backgroundColor: 'white',
    height: 32,
    width: '100%',
    lineHeight: '32px',
    textAlign: 'center',
    color: 'rgb(103,103,103)',
    fontSize: 12,
    fontWeight: 500,
    borderBottom: '1px solid rgb(224,224,224)'
}

const PaneHeader = ({text}) => {
    return (
        <div
            className={'helvetica-smooth'}
            style={style}>
            {text}
        </div>
    )
}

export default PaneHeader
