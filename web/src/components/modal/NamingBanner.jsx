

import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'

class NamingBanner extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value: props.initialValue,
        }
    }
    _onInputChange(e) {
        this.setState({
            value: e.target.value
        })
    }
    _onKeyDown(e) {
        // Hide modal on ESC
        if (e.keyCode === 27) {
            e.preventDefault()
            e.stopPropagation()
            this.props.hideModal()
        }
    }
    _onSubmit(e) {
        e.preventDefault()
        if (this.props.onTextDone) {
            this.props.onTextDone(this.state.value)
        }
        this.props.hideModal()
    }
    componentDidMount() {
        const value = this.state.value
        const inputElement = ReactDOM.findDOMNode(this.refs.input)

        inputElement.focus()

        if (value !== '') {
            let end = value.lastIndexOf('.')
            if (end === -1) {
                end = value.length
            }
            inputElement.setSelectionRange(0, end)
        }
    }
    render() {
        return (
            <div style={styles.container}>
                <div
                    className={'hbox flex-fixed'}
                    style={styles.banner}>
                    <div
                        className={'helvetica-smooth'}
                        style={styles.header}>
                        {this.props.bannerText}
                    </div>
                    <form style={{width: '100%'}} onSubmit={this._onSubmit.bind(this)}>
                        <input ref="input"
                               type="text"
                               className={'helvetica-smooth'}
                               style={styles.input}
                               value={this.state.value}
                               onKeyDown={this._onKeyDown.bind(this)}
                               onChange={this._onInputChange.bind(this)} />
                    </form>
                </div>
            </div>
        )
    }
}

const styles = {
    container: {
        height: '200px',
        zIndex: 9000,
        flexDirection: 'column',
    },
    input: {
        width: '100%',
        height: '80px',
        fontSize: '30px',
        padding: '20px',
        outlineWidth: '0px',
        borderWidth: '0px',
        fontWeight: '200',
    },
    header: {
        height: '50px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: '16px',
        fontWeight: '300',
    },
    banner: {
        width: '600px',
        height: '130px',
        marginTop: '71px',
        flexDirection: 'column',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '2px',
        backgroundColor: 'rgba(225,225,225,1)',
    },
}

NamingBanner.propTypes = {
    hideModal: PropTypes.func.isRequired,
    showModal: PropTypes.func.isRequired,
}

NamingBanner.defaultProps = {
    bannerText: '',
    initialValue: '',
}

export default NamingBanner
