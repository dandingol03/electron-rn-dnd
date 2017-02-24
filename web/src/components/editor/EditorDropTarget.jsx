

import React, { Component, } from 'react'
import ReactDOM from 'react-dom'
import { DropTarget } from 'react-dnd'
import _ from 'lodash'

import Editor from './Editor.jsx'
import TextUtils from '../../utils/editor/TextUtils.js'

const target = {
    drop(props, monitor, component) {
        //单纯的文本换行，和设置缩进和光标
        TextUtils.ensureNewlineWithIndentation(props.decoDoc.cmDoc)
        var item=monitor.getItem();
        for(var field in item)
            console.log(field);
        props.onImportItem(monitor.getItem())
        component.focus()
    },
    hover(props, monitor, component) {
        const {x, y} = monitor.getClientOffset()
        component.setState({
            offset: {
                left: x,
                top: y,
            },
        })
    }
}

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
    }
}

const style = {
    flexDirection: 'column',
    flex: '1 1 auto',
    alignItems: 'stretch',
    display: 'flex',
}

class EditorDropTarget extends Component {
    constructor(props) {
        super(props)
        this.state = {
            offset: null,
        }
    }
    focus() {
        this.refs.editor.focus()
    }
    render() {
        const {isOver, connectDropTarget, decoDoc, middleware} = this.props
        const {offset} = this.state

        // Enhance any middleware that have a setHover method
        _.each(middleware, (m) => {
            if (m.setHover) {
                m.setHover(isOver, offset)
            }
        })

        return connectDropTarget(
            <div style={style}>
                <Editor ref={'editor'} {...this.props} />
            </div>
        )
    }
}

export default DropTarget('COMPONENT', target, collect)(EditorDropTarget)
