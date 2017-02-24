

import React, { Component, } from 'react'

class CheckboxInput extends Component {

    constructor(props) {
        super(props)

        this.state = {}
        this._onInputChange = this._onInputChange.bind(this)
    }

    _onInputChange(e) {
        return this.props.onChange(! this.props.value)
    }

    render() {
        return (
            <input className={this.props.className}
                   type={'checkbox'}
                   disabled={this.props.disabled}
                   checked={this.props.value}
                   onChange={this._onInputChange}
                   onContextMenu={this.props.onContextMenu}/>
        )
    }

}

CheckboxInput.propTypes = {
    onChange: React.PropTypes.func.isRequired,
    value: React.PropTypes.bool.isRequired,
    disabled: React.PropTypes.bool,
}

CheckboxInput.defaultProps = {
    className: '',
    style: {},
    disabled: false,
}

export default CheckboxInput
