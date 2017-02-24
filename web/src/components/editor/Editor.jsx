'use strict'

import React, { Component, } from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'
import CodeMirrorComponent from './CodeMirrorComponent.jsx'

class Editor extends Component {
    constructor(props) {
        super(props)
        this.attachMiddleware(props.middleware, props.decoDoc)
    }

    focus() {
        if (this.props.decoDoc && this.props.decoDoc.cmDoc) {
            this.props.decoDoc.cmDoc.cm.focus()
        } else {
            ReactDOM.findDOMNode(this.refs.codemirror.refs.codemirror).focus()
        }
    }

    componentWillReceiveProps(newProps, newState) {
        this.detachMiddleware(this.props.middleware)
        this.attachMiddleware(newProps.middleware, newProps.decoDoc)
    }

    componentWillUnmount() {
        this.detachMiddleware(this.props.middleware)
    }

    attachMiddleware(middleware, decoDoc) {
        _.invokeMap(middleware, 'attach', decoDoc)
    }

    detachMiddleware(middleware) {
        _.invokeMap(middleware, 'detach')
    }

    //RENDER METHODS
    render() {
        const eventListeners = _.map(this.props.middleware, 'eventListeners')

        return (
            <CodeMirrorComponent
                style={this.props.style}
                ref='codemirror'
                doc={this.props.decoDoc && this.props.decoDoc.cmDoc}
                options={this.props.options}
                eventListeners={eventListeners}
                className={this.props.className}/>
        )
    }
}

Editor.defaultProps = {
    middleware: [],
}

export default Editor
