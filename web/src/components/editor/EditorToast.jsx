

import React, { Component, PropTypes } from 'react'

import SimpleButton from '../buttons/SimpleButton.jsx'

const style = {
    width: '100%',
    height: 32,
    backgroundColor: 'rgb(180,58,60)',
    borderRight: '1px solid rgb(16,16,16)',
    position: 'relative',
    color: 'rgba(255,255,255,0.8)',
    cursor: 'default',
}

const textStyle = {
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    padding: '0 10px',
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
}

const closeStyle = {
    width: 30,
    height: 31,
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: 'rgb(180,58,60)',
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
}

const closeTextDefaultStyle = {
    opacity: 0,
    transition: 'opacity 0.2s',
}

const closeTextVisibleStyle = {
    opacity: 1,
}

const closeTextHoverStyle = {
    opacity: 0.5,
}

const closeTextActiveStyle = {
    opacity: 0.75,
}

class EditorToast extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        const closeTextStyle = this.state.hover ?
            {...closeTextDefaultStyle, ...closeTextVisibleStyle} :
            closeTextDefaultStyle
        return (
            <div style={style}
                 onMouseEnter={() => this.setState({hover: true})}
                 onMouseLeave={() => this.setState({hover: false})}>
                <div style={textStyle}>
                    {this.props.message}
                </div>
                <div style={closeStyle}>
                    <SimpleButton
                        onClick={(e) => {
                            e.stopPropagation()
                            this.props.onClose()
                        }}
                        defaultStyle={closeTextStyle}
                        activeStyle={{
                            ...closeTextStyle,
                            ...closeTextActiveStyle,
                        }}
                        hoverStyle={{
                            ...closeTextStyle,
                            ...closeTextHoverStyle,
                        }}
                        innerStyle={{}}>
                        ×
                    </SimpleButton>
                </div>
            </div>
        )
    }
}

export default EditorToast
