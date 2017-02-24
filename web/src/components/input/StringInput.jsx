
import React, { Component, } from 'react'
import ReactDOM from 'react-dom'

import { STYLES } from '../../constants/InputConstants.jsx'

const baseStyle = Object.assign({}, STYLES.INPUT, {
    display: 'flex',
    flex: '1 0 0px',
})

class StringInput extends Component {

    constructor(props) {
        super(props)

        this.state = {}

        this._onBlur = this._onBlur.bind(this)
        this._onKeyDown = this._onKeyDown.bind(this)
        this._onInputChange = this._onInputChange.bind(this)
    }

    _onInputChange(e) {
        this.props.onChange(e.target.value)
    }

    _onKeyDown(e) {
        const value = e.target.value

        switch (e.keyCode) {
            case 9: // Tab
                ;
                break
            case 13: // Enter
                this.props.onSubmit(value)
                e.target.blur()

                this.setState({
                    selection: null,
                })

                e.preventDefault()
                e.stopPropagation()

                return
                break
            default:
                return
                break
        }

        this.setState({
            selection: {
                start: 0,
                end: e.target.value.length
            }
        })

        this.props.onChange(value)
    }

    _onBlur() {
        return this.setState({
            selection: null
        })
    }

    componentDidUpdate() {
        if (this.state.selection) {
            const inputElement = ReactDOM.findDOMNode(this.refs.input)
            const {start, end} = this.state.selection
            return inputElement.setSelectionRange(start, end)
        }
    }

    render() {
        let style = baseStyle
        if (this.props.width) {
            style = Object.assign({}, baseStyle, {
                width: this.props.width,
            })
        } else {
            style = Object.assign({}, baseStyle, {
                width: 0,
            })
        }

        return (
            <input ref="input"
                   type="text"
                   style={style}
                   value={this.props.value}
                   placeholder={this.props.placeholder}
                   onChange={this._onInputChange}
                   onKeyDown={this._onKeyDown}
                   onBlur={this._onBlur}/>
        )
    }

}

StringInput.propTypes = {
    onChange: React.PropTypes.func.isRequired,
    onSubmit: React.PropTypes.func,
    value: React.PropTypes.string.isRequired,
    placeholder: React.PropTypes.string,
}

StringInput.defaultProps = {
    className: '',
    style: {},
    onSubmit: () => {},
}

export default StringInput
