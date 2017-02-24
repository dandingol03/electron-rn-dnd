

import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import InputClearButton from '../buttons/InputClearButton.jsx'

const style = {
    position: 'relative',
}

const inputStyle = {
    outline: 'none',
    width: 'calc(100% - 50px)',
    padding: '12px 30px 11px 20px',
    border: 'none',
    fontSize: '12px',
    borderBottom: '1px solid #ddd'
}

class FilterableInputList extends Component {

    handleClick(e) {
        e.stopPropagation()
    }

    handleChange(e) {
        this.props.handleSearchTextChange(e.target.value)
    }

    handleClearClick(e) {
        e.stopPropagation()
        this.props.handleSearchTextChange('')
        ReactDOM.findDOMNode(this.refs.filterInput).focus()
    }

    componentDidMount() {
        ReactDOM.findDOMNode(this.refs.filterInput).focus()
    }

    _renderClearButton() {
        if (this.props.searchText) {
            return (
                <InputClearButton onClick={this.handleClearClick.bind(this)}/>
            )
        }
        return null
    }

    render() {
        return (
            <div className={this.props.className}
                 style={style}>
                <input type='search'
                       ref='filterInput'
                       style={inputStyle}
                       placeholder='Search all components'
                       value={this.props.searchText}
                       onClick={this.handleClick.bind(this)}
                       onChange={this.handleChange.bind(this)}/>
                {this._renderClearButton()}
            </div>
        )
    }

}

FilterableInputList.defaultProps = {
    className: '',
    style: {},
}

export default FilterableInputList
