/**
 * Created by danding on 17/2/13.
 */


import _ from 'lodash'
import DecoHistory from '../models/editor/DecoHistory.js'

import {
    CREATE_HISTORY,
    ADD_TO_HISTORY,
    UNDO_FROM_HISTORY,
    REDO_TO_HISTORY,
    HISTORY_ID_CHANGE,
} from '../actions/historyActions.js'

const initialState = {}

const historyReducer = (state = initialState, action) => {
    switch(action.type) {
        case CREATE_HISTORY:
        {
            const {id} = action.payload

            return Object.assign({}, state, {
                [id]: new DecoHistory(),
            })
        }
            break
        case ADD_TO_HISTORY:
        {
            const {id, decoChange} = action.payload
            const history = state[id]
            history.addToHistory(decoChange)

            return Object.assign({}, state, {
                [id]: history
            })
        }
            break
        case UNDO_FROM_HISTORY:
        {
            const {id} = action.payload
            const history = state[id]
            history.undo()

            return Object.assign({}, state, {
                [id]: history
            })
        }
            break
        case REDO_TO_HISTORY:
        {
            const {id} = action.payload
            const history = state[id].clone()
            history.redo()

            return Object.assign({}, state, {
                [id]: history
            })
        }
            break
        case HISTORY_ID_CHANGE:
        {
            const _state = Object.assign({}, state)
            _.each(_.keys(_state), (key) => {
                if (key.includes(action.oldId)) {
                    const updatedId = key.replace(action.oldId, action.newId)
                    _state[updatedId] = _state[key]
                    delete _state[key]
                }
            })
            return _state
        }
            break
        default:
            return state
            break
    }
}

export default historyReducer
