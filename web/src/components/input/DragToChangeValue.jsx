

import _ from 'lodash'
import React, { Component, } from 'react'

const AXIS = {
    X: 'x',
    Y: 'y',
}

class DragToChangeValue extends Component {

    constructor(props) {
        super(props)

        this.state = {
            initialValue: props.value,
        }

        this._onDragEnd = this._onDragEnd.bind(this)
        this._onDragMove = this._onDragMove.bind(this)
        this._onDragStart = this._onDragStart.bind(this)
        this._detachGlobalListeners = this._detachGlobalListeners.bind(this)
        this._attachGlobalListeners = this._attachGlobalListeners.bind(this)
        this._getValue = this._getValue.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        const dragState = this.state.dragState
        if (dragState !== 'STARTED' && dragState !== 'MOVING') {
            this.setState({
                initialValue: nextProps.value
            })
        }
    }

    _getValue(dragHeadPosition, dragAnchorPosition) {
        const axis = this.props.axis
        const dir = this.props.reverse ? -1 : 1
        const delta = dir * (dragAnchorPosition[axis] - dragHeadPosition[axis])
        return _.clamp(this.state.initialValue + delta, this.props.min, this.props.max)
    }

    _attachGlobalListeners() {
        document.body.style.cursor = this.props.axis === AXIS.X ?
            "col-resize" : "row-resize"
        document.addEventListener('mousemove', this._onDragMove)
        document.addEventListener('mouseup', this._onDragEnd)
    }

    _detachGlobalListeners() {
        document.body.style.cursor = "auto"
        document.removeEventListener('mousemove', this._onDragMove)
        document.removeEventListener('mouseup', this._onDragEnd)
    }

    _onDragStart(e) {
        this._attachGlobalListeners()
        this.setState({
            dragState: 'STARTED',
            dragAnchorPosition: {
                x: e.clientX,
                y: e.clientY
            }
        })
        e.preventDefault()
        e.stopPropagation()
    }

    _onDragMove(e) {
        switch (this.state.dragState) {
            case 'STARTED':
            case 'MOVING':
                const dragHeadPosition = {
                    x: e.clientX,
                    y: e.clientY
                }
                const axis = this.props.axis
                if (this.state.dragHeadPosition && this.state.dragHeadPosition[axis] !== dragHeadPosition[axis]) {
                    const value = this._getValue(dragHeadPosition, this.state.dragAnchorPosition)
                    this.props.onChange(value)
                }
                this.setState({
                    dragState: 'MOVING',
                    dragHeadPosition: dragHeadPosition
                })
        }
    }

    _onDragEnd(e) {
        this._detachGlobalListeners()
        const state = {
            dragState: 'ENDED',
            dragHeadPosition: null
        }
        if (this.state.dragHeadPosition) {
            state.initialValue = this._getValue(this.state.dragHeadPosition, this.state.dragAnchorPosition)
        }
        this.setState(state)
    }

    shouldComponentUpdate() {
        return false
    }

    render() {
        return (
            <div className={this.props.className}
                 style={this.props.style}
                 onChange={this.props.onChange}
                 onMouseDown={this._onDragStart}>
                {this.props.children}
            </div>
        )
    }

}

DragToChangeValue.propTypes = {
    onChange: React.PropTypes.func.isRequired,
    value: React.PropTypes.number.isRequired,
    max: React.PropTypes.number,
    min: React.PropTypes.number,
    axis: React.PropTypes.string,
    reverse: React.PropTypes.bool,
}

DragToChangeValue.defaultProps = {
    className: '',
    style: {},
    min: -Infinity,
    max: Infinity,
    axis: AXIS.Y,
    reverse: false,
}

DragToChangeValue.AXIS = AXIS

export default DragToChangeValue
