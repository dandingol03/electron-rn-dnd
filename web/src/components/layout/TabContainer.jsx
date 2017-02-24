

import React, { Component, } from 'react'
import TabUtils from '../../utils/TabUtils.js'

const TAB_CONTAINER_REF = 'container'

const innerStyle = {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'stretch',
    display: 'flex',
}

const itemStyle = {
    flex: '0 0 150px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    position: 'relative',
}

class TabContainer extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        const count = React.Children.count(this.props.children) || 1
        const itemMax = this.props.width / count
        const itemWidth = Math.min(itemMax, 200)
        const tabIds = React.Children.map(this.props.children, (child) => child.props.tabId)

        const children = React.Children.map(this.props.children, (child, i) => {
            child = React.cloneElement(child, {
                onFocus: () => {
                    this.props.onFocusTab(tabIds[i])
                },
                onClose: () => {
                    this.props.onCloseTab(tabIds[i])
                },
                focused: tabIds[i] === this.props.focusedTabId,
            })

            const itemStyleSized = Object.assign({}, itemStyle, {
                flex: `0 0 ${itemWidth}px`,
            })

            return (
                <div style={itemStyleSized}
                     key={tabIds[i]}>
                    {child}
                </div>
            )
        })

        return (
            <div style={this.props.style}>
                <div ref={TAB_CONTAINER_REF} style={innerStyle}>
                    {children}
                </div>
            </div>
        )
    }

}

TabContainer.defaultProps = {
    focusedTabId: null,
}

export default TabContainer
