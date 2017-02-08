
import React, { Component, PropTypes } from 'react'
import SimpleButton from './SimpleButton.jsx'

const defaultStyle = {
    borderTop: '1px solid rgba(0,0,0,0.05)',
    padding: '14px 12px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    cursor: 'default',
    height: 59,
}

const projectTitleStyle = {
    fontSize: 14,
    lineHeight: '14px',
    fontWeight: 300,
}

const projectPathStyle = {
    fontSize: 12,
    lineHeight: '12px',
    color: '#898989',
    fontWeight: 300,
    paddingTop: 4,
}

const activeStyle = {
    ...defaultStyle,
    backgroundColor: "rgba(0,0,0,0.02)"
}

const hoverStyle = {
    ...defaultStyle,
    backgroundColor: "rgba(120,0,0,0.04)",
}

const innerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
}

const Project = ({title, path, onClick}) => {
    return (
        <SimpleButton
            onClick={onClick}
            defaultStyle={defaultStyle}
            activeStyle={activeStyle}
            hoverStyle={hoverStyle}
            innerStyle={innerStyle}>
            <div style={projectTitleStyle}>{title}</div>
            {path && <div style={projectPathStyle}>{path}</div>}
        </SimpleButton>
    )
}

export default Project
