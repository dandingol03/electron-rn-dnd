/**
 * Created by danding on 17/2/6.
 */

'use strict'

import Logger from '../logger/gulpLogger'

import FileConstants from '../../../web/src/constants/ipc/FileConstants'
const {
    SAVE_SUCCESSFUL,
    ON_FILE_DATA,
    GET_FILE_DATA,
    GET_FILE_METADATA,
    RENAME,
    CREATE_DIRECTORY,
    CREATE_FILE,
    ADD_SUB_PATH,
    ADD_SUB_PATH_BATCH,
    REMOVE_SUB_PATH,
    REMOVE_SUB_PATH_BATCH,
} = FileConstants


export const confirmSave = (id) => {
    return {
        type: SAVE_SUCCESSFUL,
        id,
    }
}

export const onExternalFileData = (pathObj, utf8Data) => {
    return {
        type: ON_FILE_DATA,
        id: pathObj.id,
        absolutePathArray: pathObj.absolutePathArray,
        utf8Data: utf8Data,
    }
}

export const onFileCreated = (pathObj, utf8Data) => {
    return {
        type: CREATE_FILE,
        id: pathObj.id,
        absolutePathArray: pathObj.absolutePathArray,
        fileType: 'file',
        baseName: pathObj.baseName,
    }
}

export const onRename = (pathObj) => {
    return {
        type: RENAME,
        id: pathObj.id,
        baseName: pathObj.baseName,
        absolutePathArray: pathObj.absolutePathArray,
    }
}

export const onFileData = (pathObj, utf8Data) => {
    return {
        type: GET_FILE_DATA,
        id: pathObj.id,
        absolutePathArray: pathObj.absolutePathArray,
        utf8Data: utf8Data,
    }
}

export const onFileMetadata = (pathObj, utf8Data) => {
    return {
        type: GET_FILE_METADATA,
        id: pathObj.id,
        absolutePathArray: pathObj.absolutePathArray,
        utf8Data: utf8Data,
    }
}

export const addSubPath = (pathObj, fileType) => {
    return {
        type: ADD_SUB_PATH,
        fileType: fileType,
        baseName: pathObj.baseName,
        absolutePathArray: pathObj.absolutePathArray,
        id: pathObj.id
    }
}

export const addSubPathBatch = (queue) => {
    return {
        type: ADD_SUB_PATH_BATCH,
        batch: queue,
    }
}

export const removeSubPath = (pathObj) => {
    return {
        type: REMOVE_SUB_PATH,
        baseName: pathObj.baseName,
        absolutePathArray: pathObj.absolutePathArray,
        id: pathObj.id,
    }
}

export const removeSubPathBatch = (queue) => {
    return {
        type: REMOVE_SUB_PATH_BATCH,
        batch: queue,
    }
}
