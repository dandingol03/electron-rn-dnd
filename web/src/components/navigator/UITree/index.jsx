

import React, { Component, PropTypes, } from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'

import Node from './Node.jsx'

class UITree extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        const {scrollTop, viewport, style, tree, renderNode, onCollapse} = this.props

        return (
            <div
                ref={'root'}
                className="uitree-tree"
                style={style}>
                <Node
                    node={tree}
                    scrollTop={scrollTop}
                    viewport={viewport}
                    renderNode={renderNode}
                    onCollapse={onCollapse}
                />
            </div>
        )
    }
}

UITree.propTypes = {
    tree: PropTypes.object.isRequired,
    renderNode: PropTypes.func.isRequired,
    onCollapse: PropTypes.func,
}

export default UITree
