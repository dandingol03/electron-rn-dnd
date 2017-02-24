

import React, { Component, PropTypes, } from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'

import PaneHeader from '../components/headers/PaneHeader.jsx'
import TreeView from '../components/navigator/TreeView.jsx'
import FileScaffoldFactory from '../factories/scaffold/FileScaffoldFactory.js'

import {
    createFile,
    createDirectory,
    rename,
    deleteNode,
    showInFinder,
    addSubPath,
    fetchSubPath,
    fileIdChange,
    replaceNode,
    selectFile,
    clearSelections,
    setCollapseOnNode,
} from '../actions/fileActions.js'
import {
    addTab,
    swapTab,
    closeTab,
    makeTabPermanent,
} from '../actions/tabActions.js'
import { openFile } from '../actions/compositeFileActions.js'
import { openDocument, docIdChange } from '../actions/editorActions.js'
import { pushModal } from '../actions/uiActions.js'
import { historyIdChange } from '../actions/historyActions.js'
import { CONTENT_PANES } from '../constants/LayoutConstants.js'
import NamingBanner from '../components/modal/NamingBanner.jsx'

class ProjectNavigator extends Component {
    constructor(props) {
        super(props)
    }

    render() {

        return (
            <div className={'project-navigator vbox ' + this.props.className}
                 style={this.props.style}>
                <PaneHeader text={'Project is to be customizing.....'} />
                <TreeView tree={this.props.tree}
                          rootName={this.props.rootName}
                          scaffolds={FileScaffoldFactory.getScaffolds()}
                          onCollapse={(node, collapsed) => {
                              this.props.dispatch(setCollapseOnNode(node, !collapsed))
                              //we may not have fetched the children yet
                              if (node.children && node.children.length == 0 && collapsed) {
                                  this.props.dispatch(fetchSubPath(node))
                              }
                          }}
                          onCreateSubDir={(node) => {
                              this.props.dispatch(pushModal(
                                  <NamingBanner
                                      bannerText={'Create new directory in ' + node.module}
                                      onTextDone={(text) => {
                                          this.props.dispatch(createDirectory(node, text))
                                          this.props.dispatch(setCollapseOnNode(node, false))
                                      }}
                                  />
                                  , true))
                          }}
                          onCreateSubFile={(node, scaffoldId) => {
                              this.props.dispatch(pushModal(
                                  <NamingBanner
                                      bannerText={'Create new file in ' + node.module}
                                      onTextDone={(filename) => {
                                          let text = ''

                                          if (typeof scaffoldId !== 'undefined') {
                                              filename = FileScaffoldFactory.updateFilename(scaffoldId, filename)
                                              text = FileScaffoldFactory.generateScaffold(scaffoldId, {filename})
                                          }

                                          this.props.dispatch(createFile(node, filename, text)).then((payload) => {
                                              const fileInfo = addSubPath(payload).fileInfo
                                              this.props.dispatch(addSubPath(payload))
                                              this.props.dispatch(openDocument(fileInfo))
                                              this.props.dispatch(addTab(CONTENT_PANES.CENTER, fileInfo.id))
                                              this.props.dispatch(clearSelections())
                                              this.props.dispatch(selectFile(fileInfo.id))
                                              this.props.dispatch(setCollapseOnNode(node, false))
                                          })
                                      }}
                                  />
                                  , true))
                          }}
                          onRename={(node) => {
                              this.props.dispatch(pushModal(
                                  <NamingBanner bannerText={'Rename file ' + node.module}
                                                initialValue={node.module}
                                                onTextDone={(text) => {
                                                    this.props.dispatch(rename(node, text)).then((payload) => {
                                                        const oldId = node.id
                                                        const fileInfo = addSubPath(payload).fileInfo
                                                        fileInfo.fileType = 'file'
                                                        this.props.dispatch(fileIdChange(node.id, fileInfo.id))
                                                        this.props.dispatch(docIdChange(node.id, payload.id))
                                                        this.props.dispatch(historyIdChange(node.id, fileInfo.id))
                                                        this.props.dispatch(replaceNode(node, Object.assign({}, node, fileInfo)))
                                                        this.props.dispatch(swapTab(CONTENT_PANES.CENTER, oldId, fileInfo.id))
                                                    })
                                                }}
                                  />
                                  , true))
                          }}
                          onRenameDir={(node) => {
                              this.props.dispatch(pushModal(
                                  <NamingBanner bannerText={'Rename directory ' + node.module}
                                                initialValue={node.module}
                                                onTextDone={(text) => {
                                                    this.props.dispatch(rename(node, text)).then((payload) => {
                                                        const fileInfo = addSubPath(payload).fileInfo
                                                        fileInfo.fileType = 'dir'
                                                        this.props.dispatch(fileIdChange(node.id, fileInfo.id))
                                                        this.props.dispatch(docIdChange(node.id, fileInfo.id))
                                                        this.props.dispatch(historyIdChange(node.id, fileInfo.id))
                                                        this.props.dispatch(replaceNode(node, Object.assign({}, node, fileInfo)))
                                                    })
                                                }}
                                  />
                                  , true))
                          }}
                          onDelete={(node) => {
                              this.props.dispatch(closeTab(CONTENT_PANES.CENTER, node.id))
                              this.props.dispatch(deleteNode(node))
                          }}
                          onShowInFinder={(node) => {
                              this.props.dispatch(showInFinder(node))
                          }}
                          onClickNode={(node) => {

                              this.props.dispatch(openFile(node))
                          }}
                          onDoubleClickNode={(node) => {
                              this.props.dispatch(makeTabPermanent(CONTENT_PANES.CENTER))
                          }} />
            </div>
        )
    }
}

ProjectNavigator.defaultProps = {
    className: '',
    style: {},
}

export default connect()(ProjectNavigator)
