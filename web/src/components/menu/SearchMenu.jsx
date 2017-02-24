

import React, { Component, PropTypes } from 'react'

import DropdownMenu from './DropdownMenu.jsx'
import FilterableList from './FilterableList.jsx'

class SearchMenu extends Component {
    constructor(props) {
        super(props)
    }

    render () {
        return (
            <DropdownMenu show={this.props.show}
                          requestClose={this.props.requestClose}
                          anchorPosition={this.props.anchorPosition}
                          style={{padding: 0, overflow: 'hidden'}}
                          hideOnClick={true}>
                <FilterableList
                    items={this.props.items}
                    onItemClick={this.props.onItemClick}
                    renderItem={this.props.renderItem}
                    autoSelectFirst={true}
                    width={this.props.anchorPosition.width}
                    innerStyle={{
                        overflowY: 'auto',
                        maxHeight: 380,
                        width: this.props.anchorPosition.width,
                        borderBottomLeftRadius: 3,
                        borderBottomRightRadius: 3,
                    }} />
            </DropdownMenu>
        )
    }
}

SearchMenu.propTypes = {
    show: PropTypes.bool.isRequired,
    anchorPosition: PropTypes.object.isRequired,
    requestClose: PropTypes.func,
    renderItem: PropTypes.func,
}

SearchMenu.defaultProps = {
    autoSelectFirst: true,
    items: [],
    onItemClick: () => {},
    requestClose: () => {},
}

export default SearchMenu
