

import React, { Component, } from 'react'

const containerStyle = {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    fontSize: 10,
    lineHeight: '18px',
    textAlign: 'center',
    fontFamily: '"Roboto Mono", monospace',
}

const backgroundStyle = {
    border: '1px solid white',
    backgroundColor: 'rgb(35,36,38)',
    paddingLeft: 4,
    paddingRight: 4,
    color: 'white',
    animation: 'progress-bar-flicker 2s linear infinite',
}

export default class ProgressBar extends Component {
    render() {
        const {style, name, progress} = this.props

        const foregroundStyle = {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            border: '1px solid white',
            backgroundColor: 'white',
            paddingLeft: 4,
            paddingRight: 4,
            color: 'black',
            WebkitClipPath: `inset(0 ${100 - progress}% 0 0)`,
            transition: '-webkit-clip-path 0.5s',
        }

        return (
            <div style={style}>
                <div style={containerStyle}>
                    <div style={backgroundStyle}>
                        {name}
                    </div>
                    <div style={foregroundStyle}>
                        {name}
                    </div>
                </div>
            </div>
        )
    }
}
