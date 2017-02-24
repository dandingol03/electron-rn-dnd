const shell = window.Electron.shell

import _ from 'lodash'
import React, { Component, } from 'react'
import { Link, } from 'react-router'
import { connect} from 'react-redux'
import {
    save,
    runSimulator,
    runPackager,
    hardReloadSimulator,
    getAvailableSimulators,
} from '../actions/applicationActions'


import { CATEGORIES, PREFERENCES } from '../constants/PreferencesConstants'
import { setPreference, savePreferences } from '../actions/preferencesActions'

import {
    setConsoleVisibility,
    setLeftSidebarVisibility,
    setRightSidebarContent,
    setSimulatorMenuPlatform,
} from '../actions/uiActions'
import { RIGHT_SIDEBAR_CONTENT, LAYOUT_FIELDS } from '../constants/LayoutConstants.js'

//import SaveToolbarButton from '../components/buttons/SaveToolbarButton'
import Toolbar from '../components/toolbar/Toolbar.jsx'
import ToolbarButton from '../components/buttons/ToolbarButton.jsx'
import ToolbarButtonGroup from '../components/buttons/ToolbarButtonGroup.jsx'
import DropdownMenuButton from '../components/buttons/DropdownMenuButton.jsx'
import LandingButton from '../components/buttons/LandingButton.jsx'
import { ProcessStatus, } from '../constants/ProcessStatus.js'
import OnboardingUtils from '../utils/OnboardingUtils.js'
import SimulatorUtils from '../utils/SimulatorUtils.js'
import SimulatorMenu from '../components/menu/SimulatorMenu.jsx'

const sectionStyle = {
    WebkitAppRegion: 'drag',
    display: 'flex',
    flexDirection: 'row',
}

const SIZE = {
    SEP_LARGE: 54,
    SEP_SMALL: 18,
    BTN_LARGE: 60,
    BTN_SMALL: 52,
}

const separatorLargeStyle = {
    marginRight: SIZE.SEP_LARGE,
}

const separatorSmallStyle = {
    marginRight: SIZE.SEP_SMALL,
}

const dropdownMenuOffset = {
    x: 0,
    y: -14,
}

const emptySimulatorMenuStyle = {
    width: 300,
    height: 280,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    padding: '15px 10px 0px 10px',
}

class WorkspaceToolbar extends Component {
    constructor(props) {
        super(props)
        this.state = {}

        this.discussMenuOptions = [
            {
                text: 'Open Deco Slack',
                action: this._openDiscuss.bind(this)
            },
            {
                text: 'Create Slack Account',
                action: this._openCreateDiscussAccount.bind(this)
            },
        ]
    }

    _processStatusToButtonState(statusType) {
        switch(statusType) {
            case ProcessStatus.ON:
                return ToolbarButton.BUTTON_STATE.ACTIVE
            default:
                return ToolbarButton.BUTTON_STATE.DEFAULT
        }
    }

    _openDiscuss() {
        shell.openExternal("https://decoslack.slack.com/messages/deco/")
    }

    _openDocs() {
        shell.openExternal("https://www.decosoftware.com/docs")
    }

    _openCreateDiscussAccount() {
        shell.openExternal("https://decoslackin.herokuapp.com/")
    }

    _launchSimulatorOfType(simInfo, platform) {
        if (this.props.packagerIsOff) {
            this.props.dispatch(runPackager())
        }
        this.props.dispatch(runSimulator(simInfo, platform))
        SimulatorUtils.didLaunchSimulator(simInfo, platform)
        if (OnboardingUtils.shouldOpenConsoleForFirstTime()) {
            this.props.dispatch(setConsoleVisibility(true))
            OnboardingUtils.didOpenConsoleForFirstTime()
        }
    }

    _renderSimulatorMenu() {
        return (
            <SimulatorMenu
                setAndroidEmulationOption={(option) => {
                    const value = option == 'AVD' ? false : true
                    this.props.dispatch(setPreference(CATEGORIES.GENERAL, PREFERENCES.GENERAL.USE_GENYMOTION, value))
                    this.props.dispatch(savePreferences())
                    this.props.dispatch(getAvailableSimulators('android'))
                }}
                activeEmulationOption={this.props.useGenymotion ? 'Genymotion' : 'AVD'}
                setActiveList={(platform) => {
                    this.props.dispatch(setSimulatorMenuPlatform(platform))
                }}
                active={this.props.simulatorMenuPlatform}
                checkAvailableSims={() => {
                    // check to see if path changes or config changes open up new simulators
                    this.props.dispatch(getAvailableSimulators('ios'))
                    this.props.dispatch(getAvailableSimulators('android'))
                }}
                ios={this.props.availableSimulatorsIOS}
                android={this.props.availableSimulatorsAndroid}
                onClick={this._launchSimulatorOfType.bind(this)}/>
        )
    }

    _renderDropdownMenu(options) {
        return (
            <div className={'helvetica-smooth'}>
                {_.map(options, ({text, action}, i) => (
                    <div key={i}
                         style={{
                             marginBottom: i === options.length - 1 ? 0 : 6,
                             marginRight: 10,
                             marginLeft: 10,
                         }}>
                        <LandingButton onClick={action}>
                            {text}
                        </LandingButton>
                    </div>
                ))}
            </div>
        )
    }

    // RENDER
    _renderLeftSection() {
        return (
            <div style={sectionStyle}>
                <ToolbarButtonGroup
                    style={separatorLargeStyle}
                    activeIndexes={[
                        this.props.projectNavigatorVisible,
                        this.props.consoleVisible, ]}>
                    <ToolbarButton
                        text={'Project'}
                        icon={'project'}
                        onClick={() => {
                            const visibility = ! this.props.projectNavigatorVisible;
                            this.props.dispatch(setLeftSidebarVisibility(visibility))
                        }}
                        width={SIZE.BTN_LARGE} />

                    <ToolbarButton
                        text={'Console'}
                        icon={'console'}
                        onClick={() => {
                            const visibility = ! this.props.consoleVisible
                            this.props.dispatch(setConsoleVisibility(visibility))
                        }}
                        width={SIZE.BTN_LARGE} />
                </ToolbarButtonGroup>
                <ToolbarButtonGroup
                    style={separatorSmallStyle}>
                    <ToolbarButton
                        text={'Docs'}
                        icon={'docs'}
                        onClick={this._openDocs.bind(this)} />
                </ToolbarButtonGroup>
                <ToolbarButtonGroup
                    style={separatorSmallStyle}>
                    <DropdownMenuButton
                        offset={dropdownMenuOffset}
                        onVisibilityChange={(visible) => this.setState({discussMenuOpen: visible})}
                        renderContent={() => this._renderDropdownMenu(this.discussMenuOptions)}>
                        <ToolbarButton
                            text={'Discuss'}
                            icon={'chat'}
                            pressed={this.state.discussMenuOpen}
                        />
                    </DropdownMenuButton>
                </ToolbarButtonGroup>
            </div>
        )
    }



    _renderCenterSection() {



        const simulatorButtonState = this.props.simulatorProjectActive ?
            ToolbarButton.BUTTON_STATE.ACTIVE :
            ToolbarButton.BUTTON_STATE.DEFAULT

        return (
            <div style={sectionStyle}>
                <ToolbarButtonGroup
                    style={separatorSmallStyle}
                    activeIndexes={[
                        this.props.simulatorProjectActive,
                        false,
                    ]}>
                    <DropdownMenuButton
                        offset={dropdownMenuOffset}
                        onVisibilityChange={(visible) => this.setState({simulatorMenuOpen: visible})}
                        renderContent={() => this._renderSimulatorMenu()}>
                        <ToolbarButton
                            text={'Simulator'}
                            icon={'phone'}
                            buttonState={simulatorButtonState}
                            groupPosition={ToolbarButton.GROUP_POSITION.LEFT}
                            pressed={this.state.simulatorMenuOpen} />
                    </DropdownMenuButton>
                    <ToolbarButton
                        text={'Reload'}
                        icon={'refresh'}
                        onClick={() => {
                            this.props.dispatch(hardReloadSimulator())
                        }} />
                </ToolbarButtonGroup>
            </div>
        )
    }

    _renderRightSection() {
        const handleSidebarToggleClick = (content) => {
            const value = this.props.rightSidebarContent === content ?
                RIGHT_SIDEBAR_CONTENT.NONE : content
            this.props.dispatch(setRightSidebarContent(value))
        }

        // Left & right must have equal width for best flexboxing
        const spacer = SIZE.BTN_LARGE + SIZE.BTN_SMALL * 2 + SIZE.SEP_SMALL + SIZE.SEP_LARGE

        return (
            <div style={sectionStyle}>
                <div style={{width: spacer}}></div>
                <ToolbarButtonGroup
                    activeIndexes={[
                        this.props.rightSidebarContent === RIGHT_SIDEBAR_CONTENT.PROPERTIES,
                    ]}>
                    <ToolbarButton
                        text={'Properties'}
                        icon={'properties'}
                        onClick={handleSidebarToggleClick.bind(this, RIGHT_SIDEBAR_CONTENT.PROPERTIES)}
                        width={SIZE.BTN_LARGE} />
                </ToolbarButtonGroup>
            </div>
        )
    }

    render() {
        const {title, height, isTempProject} = this.props

        const leftContainerStyle = {
            display: 'flex',
            flexDirection: 'row',
            alignSelf: 'flex-end',
            marginLeft: 10,
            WebkitAppRegion: 'drag',
        }

        const rightContainerStyle = {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
            marginRight: 10,
            WebkitAppRegion: 'drag',
        }


        return (
            <Toolbar
                title={title + (isTempProject ? ' (Temporary until saved)' : '')}
                height={height}>
        <span style={leftContainerStyle}>
          {this._renderLeftSection()}
        </span>
                {this._renderCenterSection()}
                <span style={rightContainerStyle}>
          {this._renderRightSection()}
        </span>
            </Toolbar>
        )
    }
}

WorkspaceToolbar.defaultProps = {
    className: '',
    style: {},
    title: 'Untitled',
}

const mapStateToProps = (state) => {

    return {
        consoleVisible: state.ui.consoleVisible,
        projectNavigatorVisible: state.ui[LAYOUT_FIELDS.LEFT_SIDEBAR_VISIBLE],
        rightSidebarContent: state.ui.rightSidebarContent,
        simulatorMenuPlatform: state.ui.simulatorMenuPlatform,
        packagerIsOff: state.application.packagerStatus == ProcessStatus.OFF,
        simulatorProjectActive: state.application.simulatorStatus == ProcessStatus.ON,
        isTempProject: state.routing.location.query && state.routing.location.query.temp,
        availableSimulatorsIOS: state.application.availableSimulatorsIOS,
        availableSimulatorsAndroid: state.application.availableSimulatorsAndroid,

    }
}

export default connect(mapStateToProps)(WorkspaceToolbar)
