

import React, { Component, } from 'react'
import { connect } from 'react-redux'

import PaneHeader from '../components/headers/PaneHeader.jsx'
import NoContent from '../components/display/NoContent.jsx'
import {toValue} from '../utils/Parser.js'

const style = {
    display: 'flex',
    flex: '1 0 auto',
    flexDirection: 'column',
    alignItems: 'stretch',
}

const PublishingInspector = ({decoDoc}) => {
    return (
        <div style={style}>
            <PaneHeader text={'Publishing'} />
        </div>
    )
}

export default connect()(PublishingInspector)
