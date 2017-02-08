/**
 * Created by danding on 17/2/5.
 */
/**
 * Created by json on 16/5/25.
 * 根reducer
 */
import { combineReducers } from 'redux';

import user from './user.js';
import timer from './timer.js';
import uiReducer from './uiReducer.js';

var rootReducer=combineReducers({
    user,
    timer,
    ui:uiReducer
});

module.exports=rootReducer;
