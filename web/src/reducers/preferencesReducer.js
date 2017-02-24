/**
 * Created by danding on 17/2/10.
 */
import _ from 'lodash'

import {
    SET_PREFERENCES,
    SET_PREFERENCE,
} from '../actions/preferencesActions'

const initialState = {}

const preferencesReducer = (state = initialState, action) => {
    switch(action.type) {
        case SET_PREFERENCES:
            return _.cloneDeep(action.payload)
            break
        case SET_PREFERENCE:
            const preferences = _.cloneDeep(state)
            const {categoryKey, key, value} = action.payload

            _.set(preferences, `${categoryKey}.${key}`, value)

            return preferences
            break
        default:
            return state
            break
    }
}

export default preferencesReducer
