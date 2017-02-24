/**
 * Created by danding on 17/2/11.
 */


import { combineReducers, } from 'redux'
import liveValueReducer from './liveValueReducer.js'
import componentReducer from './componentReducer.js'

const metadataReducer = combineReducers({
    liveValues: liveValueReducer,
    components: componentReducer,
})

export default metadataReducer
