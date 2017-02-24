/**
 * Created by danding on 17/2/11.
 */


import {
    CREATE_LIVE_VALUE,
    SET_LIVE_VALUE_IDS,
    SET_LIVE_VALUES,
    IMPORT_LIVE_VALUES,
    SET_LIVE_VALUE_METADATA_FIELD,
} from '../../actions/liveValueActions.js'

const initialState = {
    liveValuesForFile: {},
    liveValuesById: {},
}

const liveValueReducer = (state = initialState, action) => {
    switch(action.type) {
        case CREATE_LIVE_VALUE:
        {
            const {liveValueId, fileId, metadata} = action.payload
            return Object.assign({}, state, {
                liveValuesById: Object.assign({}, state.liveValuesById, {
                    [liveValueId]: metadata
                }),
            })
        }
            break
        case SET_LIVE_VALUE_METADATA_FIELD:
        {
            const {liveValueId, fileId, fieldName, fieldValue} = action.payload
            return Object.assign({}, state, {
                liveValuesById: Object.assign({}, state.liveValuesById, {
                    [liveValueId]: Object.assign({}, state.liveValuesById[liveValueId], {
                        [fieldName]: fieldValue,
                    })
                }),
            })
        }
            break
        case SET_LIVE_VALUE_IDS:
        {
            const {liveValueIds, fileId} = action.payload
            return Object.assign({}, state, {
                liveValuesForFile: Object.assign({}, state.liveValuesForFile, {
                    [fileId]: liveValueIds,
                }),
            })
        }
            break
        case SET_LIVE_VALUES:
        {
            const {liveValuesById, liveValueIds, fileId} = action.payload
            return Object.assign({}, state, {
                liveValuesForFile: Object.assign({}, state.liveValuesForFile, {
                    [fileId]: liveValueIds,
                }),
                liveValuesById: Object.assign({}, state.liveValuesById, liveValuesById),
            })
        }
            break
        case IMPORT_LIVE_VALUES:
        {
            const {liveValuesById, fileId} = action.payload
            return Object.assign({}, state, {
                liveValuesById: Object.assign({}, state.liveValuesById, liveValuesById),
            })
        }
            break
        default:
            return state
            break
    }
}

export default liveValueReducer
