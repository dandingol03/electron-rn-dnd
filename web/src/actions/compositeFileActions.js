/**
 * Created by danding on 17/2/9.
 */


import {
    selectFile,
    clearSelections
} from '../actions/fileActions'

import {
    addTab,
    closeTab,
    clearFocusedTab
} from '../actions/tabActions'

import {
    clearCurrentDoc,
} from '../actions/editorActions'

import TabUtils from '../utils/TabUtils'

import { openDocument } from '../actions/editorActions'

import { CONTENT_PANES } from '../constants/LayoutConstants'

//打开文件
export const openFile = (file) => (dispatch, getState) => {

    dispatch(openDocument(file)).then(() => {

        dispatch(addTab(CONTENT_PANES.CENTER, file.id))
        dispatch(clearSelections())
        dispatch(selectFile(file.id))
    }).catch(() => {
        dispatch(addTab(CONTENT_PANES.CENTER, file.id))
        dispatch(clearSelections())
        dispatch(selectFile(file.id))
    })
}

export const closeTabWindow = (closeTabId) => (dispatch, getState) => {
    const tabs = getState().ui.tabs
    const tabToFocus = TabUtils.determineTabToFocus(tabs.CENTER.tabIds, closeTabId, tabs.CENTER.focusedTabId)
    dispatch(closeTab(CONTENT_PANES.CENTER, closeTabId))

    // If there's another tab to open, open the file for it
    if (tabToFocus) {
        dispatch(openFile(getState().directory.filesById[tabToFocus]))
    } else {
        dispatch(clearFocusedTab(CONTENT_PANES.CENTER))
        dispatch(clearCurrentDoc())
        dispatch(clearSelections())
    }
}
