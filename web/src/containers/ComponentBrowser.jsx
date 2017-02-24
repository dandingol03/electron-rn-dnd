

import React, { Component, PropTypes, } from 'react'
import { connect } from 'react-redux'

import PaneHeader from '../components/headers/PaneHeader.jsx'


import FilterableList from '../components/menu/FilterableList.jsx';
import DraggableComponentMenuItem from '../components/menu/DraggableComponentMenuItem.jsx';


const style = {
    flex: '1 1 auto',
    display: 'flex',
    alignItems: 'stretch',
    backgroundColor: 'rgb(252,251,252)',
    overflow: 'hidden',
}

const innerStyle = {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
}

const PANE_HEADER_HEIGHT = 32
const SEARCHBAR_HEIGHT = 38

class ComponentBrowser extends Component {
    render() {
        return (
            <div className={'project-navigator vbox ' + this.props.className}
                 style={style}>
                <PaneHeader text={'Components'} />
                <div style={innerStyle}>
                    <FilterableList
                        items={this.props.componentList}
                        onItemClick={() => {}}
                        renderItem={(item, i) => {
                            return (
                                <DraggableComponentMenuItem
                                    name={item.name}
                                    author={item.publisher}
                                    description={item.description}
                                    badges={item.tags || []}
                                    image={item.thumbnail}
                                    index={i}
                                    item={item} />
                            )
                        }}
                        autoSelectFirst={false}
                        width={this.props.width}
                        innerStyle={{
                            overflowY: 'auto',
                            maxHeight: this.props.height - PANE_HEADER_HEIGHT - SEARCHBAR_HEIGHT,
                            width: this.props.width,
                        }} />
                </div>
            </div>
        )
    }
}

ComponentBrowser.defaultProps = {
    className: '',
    style: {},
}

const mapStateToProps = (state) => {
    return {
        componentList: state.modules.modules,
    }
}

export default connect(mapStateToProps)(ComponentBrowser)
