/**
 * Created by danding on 17/2/9.
 */

'use strict'

const path = require('path')

import ProjectConstants from '../../../web/src/constants/ipc/ProjectConstants'
const {
    CREATE_NEW_PROJECT,
    SET_PROJECT_DIR,
    SAVE_PROJECT,
    SAVE_AS_PROJECT,
    OPEN_PROJECT_SETTINGS,
    CUSTOM_CONFIG_ERROR,
} = ProjectConstants

const EventTypes = {
    newProject: 'project.create-new-project',
}

const RequestTypes = {}

export const customConfigError = (errorMessage) => {
    return {
        type: CUSTOM_CONFIG_ERROR,
        errorMessage,
    }
}

export const setProject = (projectPath, isTemp) => {
    return {
        type: SET_PROJECT_DIR,
        absolutePath: new Buffer(projectPath).toString('hex'),
        isTemp: isTemp,
    }
}

export const newProject = () => {
    return {
        type: CREATE_NEW_PROJECT,
    }
}

export const save = () => {
    return {
        type: SAVE_PROJECT,
    }
}

export const saveAs = () => {
    return {
        type: SAVE_AS_PROJECT,
    }
}

export const openProjectSettings = (settingsPathInfo) => {
    return {
        type: OPEN_PROJECT_SETTINGS,
        settingsInfo: {
            fileType: 'file',
            id: settingsPathInfo.id,
            module: settingsPathInfo.baseName,
            absolutePath: settingsPathInfo.absolutePathArray,
            isLeaf: true,
        }
    }
}
