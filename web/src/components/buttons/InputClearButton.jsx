

import React, { Component } from 'react'
import _ from 'lodash'

const defaultStyle = {
    width: '12px',
    height: '12px',
    position: 'absolute',
    top: '13px',
    right: '15px',
    fontSize: '12px',
    WebkitAppearance: 'searchfield-cancel-button',
}

const InputClearButton = ({ className, style, onClick }) => (
    <div className={className}
         style={_.extend({}, defaultStyle, _.cloneDeep(style))}
         onClick={onClick} />
)

InputClearButton.defaultProps = {
    className: '',
    style: {},
    onClick: () => {},
}

export default InputClearButton
