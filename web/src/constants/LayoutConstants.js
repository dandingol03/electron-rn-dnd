/**
 * Created by danding on 17/2/5.
 */
import _ from 'lodash'

export const LAYOUT_KEY = 'LAYOUT'

export const LAYOUT_FIELDS = {
    RIGHT_SIDEBAR_WIDTH: 'rightSidebarWidth',
    RIGHT_SIDEBAR_CONTENT: 'rightSidebarContent',
    LEFT_SIDEBAR_WIDTH: 'leftSidebarWidth',
    LEFT_SIDEBAR_BOTTOM_SECTION_HEIGHT: 'leftSidebarBottomSectionHeight',
    LEFT_SIDEBAR_VISIBLE: 'leftSidebarVisible',
    CONSOLE_VISIBLE: 'consoleVisible',
    WINDOW_BOUNDS: 'windowBounds',
    SIMULATOR_MENU_PLATFORM: 'simulatorMenuPlatform',
}

export const RIGHT_SIDEBAR_CONTENT = _.mapKeys([
    'NONE',
    'PROPERTIES',
    'PUBLISHING',
])

export const CONTENT_PANES = _.mapKeys([
    'CENTER',
])
