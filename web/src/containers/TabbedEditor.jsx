

import _ from 'lodash'
import React, { Component, PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'

import { HotKeys } from 'react-hotkeys'

import EditorDropTarget from '../components/editor/EditorDropTarget.jsx'
import HistoryMiddleware from '../middleware/editor/HistoryMiddleware.js'
import TokenMiddleware from '../middleware/editor/TokenMiddleware.js'
import DecoRangeMiddleware from '../middleware/editor/DecoRangeMiddleware.js'
import ClipboardMiddleware from '../middleware/editor/ClipboardMiddleware.js'
import AutocompleteMiddleware from '../middleware/editor/AutocompleteMiddleware.js'
import IndentGuideMiddleware from '../middleware/editor/IndentGuideMiddleware.js'
import DragAndDropMiddleware from '../middleware/editor/DragAndDropMiddleware.js'
import NoContent from '../components/display/NoContent.jsx'
import ProgressBar from '../components/display/ProgressBar.jsx'
//import Console from '../components/console/Console'
import SearchMenu from '../components/menu/SearchMenu.jsx'
import ComponentMenuItem from '../components/menu/ComponentMenuItem.jsx'
import TabContainer from '../components/layout/TabContainer.jsx'
import Tab from '../components/buttons/Tab.jsx'
import EditorToast from '../components/editor/EditorToast.jsx'

import { setConsoleVisibility, setConsoleScrollHeight } from '../actions/uiActions.js'
import { stopPackager, runPackager, clearConfigError } from '../actions/applicationActions.js'
import { importComponent, loadComponent } from '../actions/componentActions.js'
import { insertComponent, insertTemplate } from '../actions/editorActions.js'
import { closeTabWindow } from '../actions/compositeFileActions.js'
import { fetchTemplateAndImportDependencies } from '../api/ModuleClient.js'
import { openFile } from '../actions/compositeFileActions.js'
import { getRootPath } from '../utils/PathUtils.js'
import { CATEGORIES, METADATA, PREFERENCES } from '../constants/PreferencesConstants.js'
import { CONTENT_PANES } from '../constants/LayoutConstants.js'

const DEFAULT_NPM_REGISTRY = METADATA[CATEGORIES.EDITOR][PREFERENCES[CATEGORIES.EDITOR].NPM_REGISTRY].defaultValue

class TabbedEditor extends Component {
    constructor(props) {
        super(props)
        this.state = {
            showMenu: false,
            menuPosition: {
                x: 0,
                y: 0,
            },
        }
        this.keyMap = {
            openInsertMenu: 'command+i',
        }
        this.keyHandlers = {
            openInsertMenu: (e) => {
                if (!this.state.showMenu) {
                    this.setState({
                        showMenu: true,
                    })
                }
            }
        }
    }

    _calculatePositions() {
        const positionRect = ReactDOM.findDOMNode(this.refs.position).getBoundingClientRect()
        const width = positionRect.width - 144
        return {
            y: positionRect.top + 100,
            x: positionRect.left + (positionRect.width - width) / 2,
            width: width,
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const position = this._calculatePositions()
        if (!_.isEqual(this.state.menuPosition, position)) {
            this.setState({
                menuPosition: position,
            })
        }
    }

    //import component callback
    onImportItem(item) {
        const {options} = this.props
        this.props.dispatch(importComponent(item)).then((payload) => {


            var reportStr='description about component item=======\r\n';
            reportStr+='template url=======\r\n'+item.template.text+'\r\n';
            reportStr+='dependencies=====\r\n';
            if(item.dependency!==undefined&&item.dependency!==null)
            {
                item.dependencies.map(function(dependency,i){
                    reportStr+=dependency.toString();
                });
            }
            if(item.template.metadata!==undefined&&item.template.metadata!==null)
            {
                reportStr+='metadata url=========\r\n';
                reportStr+=item.template.metadata;
            }

            if(item.imports!==undefined&&item.imports!==null)
            {
                reportStr+='\r\nimports==========\r\n';
                reportStr+=item.imports;
            }
            console.log(reportStr);
            //获取模板内容,并引入依赖
            fetchTemplateAndImportDependencies(
                item.dependencies,
                item.template.text,
                item.template.metadata,
                this.props.rootPath,
                this.props.npmRegistry,
            ).then(({text, metadata}) => {
                const {decoDoc} = this.props

                if (! decoDoc) {
                    return
                }
                var metadataStr='metadata=============\r\n';
                for(var field in metadata)
                    metadataStr+=field+'=\r\n'+metadata[field];
                console.log(metadataStr);

                //插入组件template
                this.props.dispatch(insertTemplate(
                    decoDoc,
                    text,
                    metadata,
                    item.imports,
                    _.get(item, 'inspector.group')
                ))
            })
        })
    }

    render() {
        const tabBarHeight = 32

        const editorStyle = {
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            position: 'relative',
            overflow: 'auto',
        }

        const tabBarStyle = {
            height: tabBarHeight,
            backgroundColor: 'rgb(27,28,29)',
            borderBottom: '1px solid rgb(16,16,16)',
            fontSize: 11,
            lineHeight: `${tabBarHeight}px`,
            letterSpacing: 0.3,
            fontFamily: "'Helvetica Neue', Helvetica, sans-serif",
        }

        const progressBarStyle = {
            position: 'absolute',
            top: tabBarHeight + 10,
            left: 10,
            right: 10,
            height: 20,
            zIndex: 1000,
            opacity: 0.8,
        }

        const editorClassName = 'flex-variable editor ' +
            (this.props.highlightLiteralTokens ? 'highlight' : '')

        // Show npm registry only if it's not the default
        const showNpmRegistry = this.props.npmRegistry && this.props.npmRegistry !== DEFAULT_NPM_REGISTRY
        const conditionallyRenderToast = () => {
            if (this.props.configError != '') {
                return (
                    <EditorToast message={this.props.configError} onClose={() => {
                        this.props.dispatch(clearConfigError())
                    }}/>
                )
            } else {
                return null
            }
        }

        return (
            <HotKeys handlers={this.keyHandlers} keyMap={this.keyMap}
                     className={'vbox flex-variable full-size-relative'}
                     style={{outline: 'none'}}>
                <div className={'vbox flex-variable full-size-relative'}
                     ref='position'
                     style={this.props.style}>
                    <TabContainer style={tabBarStyle}
                                  focusedTabId={this.props.focusedTabId}
                                  onFocusTab={(tabId) => {
                                      this.props.dispatch(openFile(this.props.filesByTabId[tabId]))
                                  }}
                                  onCloseTab={(tabId) => {
                                      this.props.dispatch(closeTabWindow(tabId))
                                  }}
                                  width={this.props.width}>
                        {_.map(this.props.tabIds, (tabId) => {
                            const filename = this.props.filesByTabId[tabId].module

                            return (
                                <Tab key={tabId}
                                     title={filename}
                                     tabId={tabId}>{filename}</Tab>
                            )
                        })}
                    </TabContainer>
                    {conditionallyRenderToast()}
                    {
                        this.props.decoDoc ? (
                            <EditorDropTarget className={editorClassName}
                                              ref='editor'
                                              middleware={[
                                                  DragAndDropMiddleware(this.props.dispatch),
                                                  DecoRangeMiddleware(this.props.dispatch),
                                                  HistoryMiddleware(this.props.dispatch),
                                                  TokenMiddleware(this.props.dispatch),
                                                  ClipboardMiddleware(this.props.dispatch, this.props.liveValuesById),
                                                  AutocompleteMiddleware(this.props.dispatch),
                                                  IndentGuideMiddleware(this.props.dispatch),
                                              ]}
                                              onImportItem={this.onImportItem.bind(this)}
                                              options={this.props.options}
                                              decoDoc={this.props.decoDoc}
                                              style={editorStyle} />
                        ) : (
                            <NoContent
                                theme={NoContent.THEME.DARK}>
                                Welcome to Deco
                                <br />
                                <br />
                                Open a file in the Project Browser on the left to get started.
                            </NoContent>
                        )
                    }

                    {
                        this.props.progressBar && (
                            <ProgressBar
                                style={progressBarStyle}
                                name={`npm install ${this.props.progressBar.name}` +
                                (showNpmRegistry ? ` --registry=${this.props.npmRegistry}` : '')}
                                progress={this.props.progressBar.progress} />
                        )
                    }
                    <SearchMenu
                        items={this.props.componentList}
                        renderItem={(item, i) => {
                            return (
                                <ComponentMenuItem
                                    name={item.name}
                                    author={item.publisher}
                                    description={item.description}
                                    badges={item.tags || []}
                                    image={item.thumbnail}
                                    index={i} />
                            )
                        }}
                        onItemClick={this.onImportItem.bind(this)}
                        show={this.state.showMenu}
                        anchorPosition={this.state.menuPosition}
                        requestClose={() => {
                            //delay allows key events to finish first?
                            //TODO: move search menu to top level and take care of this on that refactor
                            setTimeout(() => {
                                this.refs.editor.getDecoratedComponentInstance().focus()
                            }, 200)
                            this.setState({
                                showMenu: false,
                            })
                        }
                        }/>
                </div>
            </HotKeys>
        )
    }
}

TabbedEditor.defaultProps = {
    style: {},
    className: '',
}

TabbedEditor.propTypes = {
    consoleVisible: PropTypes.bool.isRequired,
    packagerOutput: PropTypes.string.isRequired,
    savedScrollHeight: PropTypes.number.isRequired,
    highlightLiteralTokens: PropTypes.bool.isRequired,
}

const mapStateToProps = (state, ownProps) => {
    const tabIds = _.get(state, `ui.tabs.${CONTENT_PANES.CENTER}.tabIds`, [])
    const filesByTabId = {}
    _.each(tabIds, (tabId) => {
        filesByTabId[tabId] = state.directory.filesById[tabId] || {}
    })

    return {
        module: module,
        projectRoot: state.directory.rootPath,
        componentList: state.modules.modules,
        consoleVisible: state.ui.consoleVisible,
        packagerOutput: state.application.packagerOutput,
        packagerStatus: state.application.packagerStatus,
        savedScrollHeight: state.ui.scrollHeight,
        liveValuesById: state.metadata.liveValues.liveValuesById,
        focusedTabId: _.get(state, `ui.tabs.${CONTENT_PANES.CENTER}.focusedTabId`),
        tabIds,
        filesByTabId,
        progressBar: state.ui.progressBar,
        rootPath: getRootPath(state),
        npmRegistry: state.preferences[CATEGORIES.EDITOR][PREFERENCES.EDITOR.NPM_REGISTRY],
        configError: state.application.configError,
        options: {
            keyMap: state.preferences[CATEGORIES.EDITOR][PREFERENCES.EDITOR.VIM_MODE] ? 'vim' : 'sublime',
            showInvisibles: state.preferences[CATEGORIES.EDITOR][PREFERENCES.EDITOR.SHOW_INVISIBLES],
            styleActiveLine: state.preferences[CATEGORIES.EDITOR][PREFERENCES.EDITOR.HIGHLIGHT_ACTIVE_LINE],
            showIndentGuides: state.preferences[CATEGORIES.EDITOR][PREFERENCES.EDITOR.SHOW_INDENT_GUIDES],
        }
    }
}

export default connect(mapStateToProps)(TabbedEditor)
