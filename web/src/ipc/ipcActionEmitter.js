/**
 * Created by danding on 17/2/9.
 */

import { routeActions, } from 'react-router-redux'

const ipc = Electron.ipcRenderer

import {
    save,
    saveAs,
    appendPackagerOutput,
    createProject,
    openProject,
    setSimulatorStatus,
    setPackagerStatus,
    customConfigError,
} from '../actions/applicationActions.js'



import {
    addSubPath,
    removeSubPath,
    removeSubPathBatch,
    fetchSubPath,
    batchAddSubPaths,
    markSaved,
    clearFileState,
    addHiddenFileId,
} from '../actions/fileActions.js'


import {
    cacheDoc,
    markClean,
    clearEditorState,
    insertComponent,
    insertTemplate,
} from '../actions/editorActions'

import { openFile } from '../actions/compositeFileActions.js'

import {
    setConsoleVisibility,
    startProgressBar,
    updateProgressBar,
    endProgressBar,
    upgradeStatus,
} from '../actions/uiActions.js'

import {
    closeAllTabs,
} from '../actions/tabActions.js'

import AcceleratorConstants from '../constants/ipc/AcceleratorConstants'
const {
    SHOULD_CREATE_NEW_PROJECT,
    SHOULD_OPEN_PROJECT_DIALOG,
    SHOULD_TOGGLE_TERM,
    SHOULD_CLOSE_TAB,
    SHOULD_SAVE_PROJECT,
    SHOULD_SAVE_PROJECT_AS,
    OPEN_INSTALL_MODULE_DIALOG,
    OPEN_IMPORT_TEMPLATE_DIALOG,
    OPEN_FILE,
} = AcceleratorConstants

import ProjectConstants from '../constants/ipc/ProjectConstants'
const {
    SAVE_PROJECT,
    SAVE_AS_PROJECT,
    SET_PROJECT_DIR,
    OPEN_PROJECT_SETTINGS,
    CUSTOM_CONFIG_ERROR,
} = ProjectConstants

import FileConstants from '../constants/ipc/FileConstants'
const {
    ADD_SUB_PATH,
    ADD_SUB_PATH_BATCH,
    ON_FILE_DATA,
    REMOVE_SUB_PATH,
    REMOVE_SUB_PATH_BATCH,
    SAVE_SUCCESSFUL,
} = FileConstants

import ProcessConstants from '../constants/ipc/ProcessConstants'
const {
    PACKAGER_OUTPUT,
    UPDATE_SIMULATOR_STATUS,
    UPDATE_PACKAGER_STATUS,
} = ProcessConstants

import UIConstants from '../constants/ipc/UIConstants'
const {
    PROGRESS_START,
    PROGRESS_UPDATE,
    PROGRESS_END,
    UPGRADE_STATUS,
} = UIConstants

import { ProcessStatus } from '../constants/ProcessStatus'

import { CONTENT_PANES } from '../constants/LayoutConstants'
import { closeTabWindow } from '../actions/compositeFileActions.js'

/**
 * Ties ipc listeners to actions
 *
 */
const ipcActionEmitter = (store) => {
    ipc.on(ADD_SUB_PATH_BATCH, (evt, payload) => {
        store.dispatch(batchAddSubPaths(payload))
    })


    //SET_PROJECT_DIR
    ipc.on(SET_PROJECT_DIR, (evt, payload) => {
        console.log('got set_project_dir msg');
        const rootPath = payload.absolutePath;
        let query = {}
        if (payload.isTemp) {
            query.temp = true
        }
        //TODO:clear this logic
        store.dispatch(clearFileState())
        store.dispatch(clearEditorState())
        store.dispatch(closeAllTabs())
        const state = store.getState();
        console.log('in ipcRender process='+'\r\n'+'rootpath='+rootPath);
        console.log('query in ipcRender process======='+query);


        store.dispatch(routeActions.push({
            pathname: `/workspace/${rootPath}`,
            query: query,
        }))
    })

    ipc.on(CUSTOM_CONFIG_ERROR, (evt, payload) => {
        store.dispatch(customConfigError(payload.errorMessage))
    })





    ipc.on(SHOULD_OPEN_PROJECT_DIALOG, () => {
        store.dispatch(openProject())
    })

    ipc.on(SHOULD_CREATE_NEW_PROJECT, (evt, payload) => {
        store.dispatch(createProject())
    })

    ipc.on(PACKAGER_OUTPUT, (evt, payload) => {
        store.dispatch(appendPackagerOutput(payload))
    })

    ipc.on(UPDATE_SIMULATOR_STATUS, (evt, payload) => {
        store.dispatch(setSimulatorStatus(payload.simulatorIsOpen))
    })

    ipc.on(UPDATE_PACKAGER_STATUS, (evt, payload) => {
        const status = payload.status ? ProcessStatus.ON : ProcessStatus.OFF
        store.dispatch(setPackagerStatus(status))
    })

    ipc.on(REMOVE_SUB_PATH, (evt, payload) => {
        store.dispatch(removeSubPath(payload))
    })

    ipc.on(REMOVE_SUB_PATH_BATCH, (evt, payload) => {
        store.dispatch(removeSubPathBatch(payload))
    })


    ipc.on(ON_FILE_DATA, (evt, payload) => {
        store.dispatch(cacheDoc(payload))
    })

    ipc.on(SAVE_SUCCESSFUL, (evt, payload) => {
        store.dispatch(markClean(payload.id))
        store.dispatch(markSaved(payload.id))
    })

    ipc.on(SHOULD_TOGGLE_TERM, () => {
        const state = store.getState()
        store.dispatch(setConsoleVisibility(!state.ui.consoleVisible))
    })

    ipc.on(SHOULD_CLOSE_TAB, () => {
        const tabs = store.getState().ui.tabs
        store.dispatch(closeTabWindow(tabs.CENTER.focusedTabId))
    })

    ipc.on(SHOULD_SAVE_PROJECT, () => {
        const state = store.getState()
        const location = state.routing.location
        if (location.query && location.query.temp == "true") {
            store.dispatch(saveAs())
        } else {
            store.dispatch(save())
        }
    })

    ipc.on(SHOULD_SAVE_PROJECT_AS, () => {
        store.dispatch(saveAs())
    })
    ipc.on(OPEN_FILE, (evt, obj) => {
        const { fileInfo } = obj
        store.dispatch(openFile(fileInfo))
    })
    ipc.on(OPEN_PROJECT_SETTINGS, (evt, obj) => {
        const { settingsInfo } = obj
        store.dispatch(addHiddenFileId(settingsInfo))
        store.dispatch(openFile(settingsInfo))
    })

    ipc.on(PROGRESS_START, (evt, obj) => {
        const {name, progress} = obj.payload
        store.dispatch(startProgressBar(name, progress))
    })

    ipc.on(PROGRESS_UPDATE, (evt, obj) => {
        const {name, progress} = obj.payload
        store.dispatch(updateProgressBar(name, progress))
    })

    ipc.on(PROGRESS_END, (evt, obj) => {
        const {name, progress} = obj.payload
        store.dispatch(endProgressBar(name, progress))
    })

    ipc.on(UPGRADE_STATUS, (evt, obj) => {
        const {status} = obj.payload
        store.dispatch(upgradeStatus(status))
    })
}

export default ipcActionEmitter
