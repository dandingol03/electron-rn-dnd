/**
 * Created by danding on 17/2/11.
 */


import { setTextForDecoRange } from './editorActions.js'
import LiveValueUtils from '../utils/metadata/LiveValueUtils.js'

export const CREATE_LIVE_VALUE = 'CREATE_LIVE_VALUE'
export const createLiveValue = (fileId, liveValueId, text, name, type) => {

    const metadata = LiveValueUtils.guessLiveValueMetadata(name, type, text)
    Object.assign(metadata, {
        type,
        name
    })

    return {
        type: CREATE_LIVE_VALUE,
        payload: {
            fileId,
            liveValueId,
            metadata,
        },
    }
}

export const IMPORT_LIVE_VALUES = 'IMPORT_LIVE_VALUES'
export const importLiveValues = (fileId, liveValuesById) => {
    return {
        type: IMPORT_LIVE_VALUES,
        payload: {
            fileId,
            liveValuesById,
        },
    }
}

export const SET_LIVE_VALUE_IDS = 'SET_LIVE_VALUE_IDS'
export const setLiveValueIds = (fileId, liveValueIds) => {
    return {
        type: SET_LIVE_VALUE_IDS,
        payload: {
            fileId,
            liveValueIds,
        },
    }
}

export const SET_LIVE_VALUES = 'SET_LIVE_VALUES'
export const setLiveValues = (fileId, liveValueIds, liveValuesById) => {
    return {
        type: SET_LIVE_VALUES,
        payload: {
            fileId,
            liveValueIds,
            liveValuesById,
        },
    }
}

export const SET_LIVE_VALUE_METADATA_FIELD = 'SET_LIVE_VALUE_METADATA_FIELD'
export const setLiveValueMetadataField = (fileId, liveValueId, fieldName, fieldValue) => {
    return {
        type: SET_LIVE_VALUE_METADATA_FIELD,
        payload: {
            fileId,
            liveValueId,
            fieldName,
            fieldValue,
        },
    }
}

export const SET_LIVE_VALUE_CODE = 'SET_LIVE_VALUE_CODE'
export const setLiveValueCode = (fileId, liveValueId, code) => {
    return (dispatch, getState) => {
        dispatch(setTextForDecoRange(fileId, liveValueId, code))
    }
}
