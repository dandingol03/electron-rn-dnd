/**
 * Created by danding on 17/2/5.
 */


import _ from 'lodash'

import request from '../ipc/Request'
import FileConstants from '../constants/ipc/FileConstants.js'
const {
    GET_FILE_METADATA,
    WRITE_FILE_METADATA,
    DELETE_FILE_METADATA,
} = FileConstants

import LiveValueUtils from '../utils/metadata/LiveValueUtils.js'

function _writeFileMetadata(id, rootPath, metadata) {
    return {
        type: WRITE_FILE_METADATA,
        id,
        rootPath,
        metadata,
    }
}

const _deleteFileMetadata = (id, rootPath) => {
    return {
        type: DELETE_FILE_METADATA,
        id,
        rootPath,
    }
}

export const saveMetadata = (fileId) => {
    return (dispatch, getState) => {
        const state = getState()
        const rootPath = state.directory.rootPath
        const metadata = state.metadata
        const decoDoc = state.editor.docCache[fileId]

        const output = {}
        //TODO:现在不扩展LiveValueUtils
        //const liveValues = LiveValueUtils.denormalizeLiveValueMetadataFromDoc(metadata.liveValues, decoDoc)

        if (! _.isEmpty(liveValues)) {
            output.liveValues = liveValues
        }

        // If no metadata, delete the metadata file
        if (_.isEmpty(output)) {
            request(_deleteFileMetadata(fileId, rootPath))
            // Else, write the metadata
        } else {
            request(_writeFileMetadata(fileId, rootPath, JSON.stringify(output, null, '\t')))
        }
    }
}

function _getFileMetadata(path, rootPath) {
    return {
        type: GET_FILE_METADATA,
        path,
        rootPath,
    }
}

/**
 * 加载本地文件的元数据
 * @param fileId,以hex编码
 * @returns {function(*, *)}
 */
export const loadMetadata = (fileId) => {

    return (dispatch, getState) => {
        const rootPath = getState().directory.rootPath
        return request(_getFileMetadata(fileId, rootPath)).then((payload) => {
            //payload.utf8Data是文件数据
            alert('data of file ='+payload.utf8Data);
            const json = JSON.parse(payload.utf8Data)
            const output = {
                liveValues: LiveValueUtils.normalizeLiveValueMetadata(json.liveValues)
            }

            return output
        })
    }
}
